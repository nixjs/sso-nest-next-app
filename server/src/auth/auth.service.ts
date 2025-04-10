import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/user/user.service'
import { Client } from '../client/entities/client.entity'
import { ConfigService } from '@nestjs/config'
import { InjectRedis } from '@nestjs-modules/ioredis'
import Redis from 'ioredis'
import * as crypto from 'crypto'
import { User } from '../user/entities/user.entity'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Client)
        private clientRepository: Repository<Client>,
        private usersService: UserService,
        @InjectRedis() private readonly redis: Redis,
        private jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    async validateClient(clientId: string, clientSecret: string): Promise<Client> {
        const client = await this.clientRepository.findOne({
            where: { clientId, clientSecret }
        })
        if (!client) throw new Error('Invalid client')
        return client
    }

    async storeClientSession(clientId: string, clientSecret: string, redirectUri: string): Promise<string> {
        const sessionId = crypto.randomBytes(16).toString('hex')
        const clientData = { clientId, clientSecret, redirectUri }
        await this.redis.set(`client_session:${sessionId}`, JSON.stringify(clientData), 'EX', 60 * 5) // Hết hạn sau 5 phút
        return sessionId
    }

    async getClientSession(sessionId: string): Promise<{ clientId: string; clientSecret: string; redirectUri: string } | null> {
        const clientData = await this.redis.get(`client_session:${sessionId}`)
        return clientData ? (JSON.parse(clientData) as { clientId: string; clientSecret: string; redirectUri: string }) : null
    }

    async login(user: User, client: Client) {
        const payload = { sub: user.id, email: user.email, iss: this.configService.get<string>('endpoint_api') }
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('jwt.access_token'),
            expiresIn: this.configService.get<string>('jwt.access_token_expires_in')
        })
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: this.configService.get<string>('jwt.refresh_token_expires_in')
        })

        const sessionId = await this.usersService.saveRefreshToken(user.id, refreshToken)
        const encryptedSessionId = this.createSessionToken(sessionId)

        return {
            access_token: accessToken,
            session_id: encryptedSessionId,
            redirect_uri: `${client.redirectUri}?access_token=${accessToken}&session_id=${encryptedSessionId}`
        }
    }

    async refreshToken(userId: string, refreshToken: string) {
        const isValid = await this.usersService.validateRefreshToken(userId, refreshToken)
        if (!isValid) throw new BadRequestException('Invalid refresh token')

        const user = await this.usersService.findById(userId)
        if (!user) throw new NotFoundException('User not found')

        const payload = { sub: user.id, email: user.email, iss: this.configService.get<string>('endpoint_api') }
        const newAccessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('jwt.access_token'),
            expiresIn: this.configService.get<string>('jwt.access_token_expires_in')
        })
        const newRefreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('jwt.refresh_token'),
            expiresIn: this.configService.get<string>('jwt.refresh_token_expires_in')
        })

        const sessionId = await this.usersService.saveRefreshToken(user.id, newRefreshToken)
        const encryptedSessionId = this.createSessionToken(sessionId)

        return {
            access_token: newAccessToken,
            session_id: encryptedSessionId
        }
    }

    async checkSession(clientId: string, clientSecret: string, sessionId: string) {
        const client = await this.validateClient(clientId, clientSecret)

        const sessionDecoded = this.verifySessionToken(sessionId)
        const userId = await this.usersService.getUserIdBySessionId(sessionDecoded)
        if (!userId) throw new BadRequestException('Invalid session')

        const refreshToken = await this.usersService.getRefreshTokenByUserId(userId)
        if (!refreshToken) throw new NotFoundException('Refresh token not found')

        const isValid = await this.usersService.validateRefreshToken(userId, refreshToken)
        if (!isValid) throw new BadRequestException('Invalid refresh token')

        const user = await this.usersService.findById(userId)
        if (!user) throw new NotFoundException('User not found')

        const payload = { sub: user.id, email: user.email, iss: this.configService.get<string>('endpoint_api') }
        const newAccessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('jwt.access_token'),
            expiresIn: this.configService.get<string>('jwt.access_token_expires_in')
        })
        const newRefreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('jwt.refresh_token'),
            expiresIn: this.configService.get<string>('jwt.refresh_token_expires_in')
        })

        const newSessionId = await this.usersService.saveRefreshToken(user.id, newRefreshToken)
        const encryptedSessionId = this.createSessionToken(newSessionId)

        return {
            access_token: newAccessToken,
            session_id: encryptedSessionId,
            redirect_uri: client.redirectUri
        }
    }

    async logout(sessionId: string) {
        const decryptedSessionId = this.verifySessionToken(sessionId)
        const userId = await this.usersService.getUserIdBySessionId(decryptedSessionId)
        if (userId) {
            await this.redis.del(`refresh_token:${userId}`)
            await this.redis.del(`session:${sessionId}`)
        }
    }

    // Thêm phương thức để tạo token tạm thời
    /**
     * @deprecated
     */
    generateTemporaryToken(sessionId: string): string {
        const payload = { sessionId }
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>('session_encryption_key'),
            expiresIn: '5m' // Token tạm thời hết hạn sau 5 phút
        })
    }

    // Thêm phương thức để kiểm tra phiên và tạo token mới
    /**
     * @deprecated
     */
    async checkSessionWithCookie(clientId: string, clientSecret: string, sessionId: string) {
        const decryptedSessionId = this.verifySessionToken(sessionId)
        const userId = await this.usersService.getUserIdBySessionId(decryptedSessionId)
        if (!userId) throw new BadRequestException('Invalid session')

        const refreshToken = await this.usersService.getRefreshTokenByUserId(userId)
        if (!refreshToken) throw new NotFoundException('Refresh token not found')

        const isValid = await this.usersService.validateRefreshToken(userId, refreshToken)
        if (!isValid) throw new BadRequestException('Invalid refresh token')

        const user = await this.usersService.findById(userId)
        if (!user) throw new NotFoundException('User not found')

        const payload = { sub: user.id, email: user.email, iss: this.configService.get<string>('endpoint_api') }
        const newAccessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('jwt.access_token'),
            expiresIn: this.configService.get<string>('jwt.access_token_expires_in')
        })
        const newRefreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('jwt.refresh_token'),
            expiresIn: this.configService.get<string>('jwt.refresh_token_expires_in')
        })

        const newSessionId = await this.usersService.saveRefreshToken(user.id, newRefreshToken)
        const encryptedSessionId = this.createSessionToken(newSessionId)

        return {
            access_token: newAccessToken,
            session_id: encryptedSessionId
        }
    }

    private createSessionToken(sessionId: string): string {
        const payload = { sessionId }
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>('session_encryption_key'),
            expiresIn: this.configService.get<string>('refresh_token_expires_in') // Đồng bộ với thời gian sống của refresh_token
        })
    }

    private verifySessionToken(sessionToken: string): string {
        try {
            const decoded = this.jwtService.verify<{ sessionId: string }>(sessionToken, {
                secret: this.configService.get<string>('session_encryption_key')
            })
            return decoded.sessionId
        } catch (error) {
            throw new Error('Invalid session token')
        }
    }
}
