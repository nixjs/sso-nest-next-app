import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import { ConfigService } from '@nestjs/config'
import { InjectRedis } from '@nestjs-modules/ioredis'
import Redis from 'ioredis'
import { createNonce, verifyMessage } from './utils'

@Injectable()
export class AuthWalletService {
    constructor(
        private userService: UserService,
        @InjectRedis() private readonly redis: Redis,
        private readonly configService: ConfigService
    ) {}

    async generateNonce(userId: string): Promise<string> {
        const nonce = createNonce()
        const user = await this.userService.findById(userId)
        if (!user) throw new NotFoundException('User not found')
        if (user.walletAddress) throw new ConflictException('Wallet address already exists')

        await this.redis.set(`nonce:${userId}`, nonce, 'EX', 60 * 5)
        return nonce
    }

    async verifyWallet(userId: string, signature: string, walletAddress: string): Promise<string> {
        const user = await this.userService.findById(userId)
        const nonce = (await this.redis.get(`nonce:${userId}`)) || ''
        if (!user || nonce.length === 0) throw new BadRequestException('Invalid user or nonce')
        if (user.walletAddress) throw new ConflictException('Wallet address already exists')

        const env = this.configService.get<string>('env') as 'dev' | 'prod'
        const valid = await verifyMessage({ nonce, address: walletAddress, signature, env })
        if (!valid) throw new BadRequestException('Invalid signature')

        await this.userService.update(user.id, {
            walletAddress
        })
        return walletAddress
    }
}
