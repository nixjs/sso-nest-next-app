import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import * as nodemailer from 'nodemailer'
import { InjectRedis } from '@nestjs-modules/ioredis'
import { Redis } from 'ioredis'
import { RegisterDto } from '../auth/dto/auth.dto'
import { User } from './entities/user.entity'
import { ConfigService } from '@nestjs/config'
import { getVerificationEmailTemplate } from './helper'
import { ClientService } from '../client/client.service'
import * as crypto from 'crypto'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
        @InjectRedis() private readonly redis: Redis,
        private readonly configService: ConfigService,
        private readonly clientService: ClientService
    ) {}

    async register(registerDto: RegisterDto, clientId?: string) {
        const { email, username, password, name } = registerDto
        const hashedPassword = await bcrypt.hash(password, 10)
        const verificationToken = this.jwtService.sign(
            { email, iss: this.configService.get<string>('endpoint_api') },
            {
                secret: this.configService.get<string>('jwt.verification_token'),
                expiresIn: this.configService.get<string>('jwt.verification_token_expires_in')
            }
        )

        const client = await this.clientService.findOne(clientId || '')

        if (!client) throw new BadRequestException('invalid clientId')

        const user = this.userRepository.create({
            email,
            username,
            password: hashedPassword,
            name,
            verificationToken,
            clientId,
            client
        })

        await this.userRepository.save(user)
        await this.sendVerificationEmail(email, verificationToken)
        return { message: 'Registration successful, please check your email.' }
    }

    async sendVerificationEmail(email: string, token: string) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.configService.get<string>('smtp.email'),
                pass: this.configService.get<string>('smtp.password')
            }
        })

        const verificationLink = `${this.configService.get<string>('endpoint_api')}/auth/verify?token=${token}`
        const htmlTemplate = getVerificationEmailTemplate(verificationLink)

        const mailOptions = {
            from: this.configService.get<string>('smtp.email'),
            to: email,
            subject: 'Account Verification',
            html: htmlTemplate
        }

        await transporter.sendMail(mailOptions)
    }

    async verifyEmail(token: string) {
        const decoded = this.jwtService.verify(token, { secret: this.configService.get<string>('jwt.verification_token') })
        const user = await this.userRepository.findOne({
            where: { verificationToken: token, email: decoded.email },
            relations: ['client']
        })
        if (!user) throw new BadRequestException('Invalid token')
        user.isVerified = true
        await this.userRepository.save(user)
        return { message: 'Email verified.', clientId: user.clientId, redirectUri: user.client.redirectUri }
    }

    async validateUser(identifier: string, password: string): Promise<User | null> {
        const user = await this.userRepository.findOne({
            where: [{ email: identifier }, { username: identifier }]
        })
        if (user && user.isVerified && (await bcrypt.compare(password, user.password))) {
            return user
        }
        return null
    }

    async findById(id: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } })
    }

    async saveRefreshToken(userId: string, refreshToken: string) {
        const sessionId = crypto.randomBytes(16).toString('hex')
        const time = parseInt(this.configService.get<string>('jwt.refresh_token_expires_in') || '7', 10)
        await this.redis.set(`refresh_token:${userId}`, refreshToken, 'EX', time * 24 * 60 * 60)
        const result = await this.redis.set(`session:${sessionId}`, userId, 'EX', time * 24 * 60 * 60)
        return sessionId
    }

    async validateRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
        const storedToken = await this.redis.get(`refresh_token:${userId}`)
        return storedToken === refreshToken
    }

    async getUserIdBySessionId(sessionId: string): Promise<string | null> {
        const userId = await this.redis.get(`session:${sessionId}`)
        return userId
    }

    async getRefreshTokenByUserId(userId: string): Promise<string | null> {
        return this.redis.get(`refresh_token:${userId}`)
    }
}
