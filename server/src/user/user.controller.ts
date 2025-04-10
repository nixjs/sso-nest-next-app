import { Controller, Post, Body, Get, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { RegisterDto } from '../auth/dto/auth.dto'

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    async register(@Body() registerDto: RegisterDto, @Query('client_id') clientId?: string) {
        return this.userService.register(registerDto, clientId)
    }

    @Get('verify')
    async verify(@Query('token') verifyToken: string) {
        return this.userService.verifyEmail(verifyToken)
    }
}
