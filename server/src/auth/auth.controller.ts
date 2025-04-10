import { Controller, Get, Post, Query, Body, Res, Req, UseGuards, NotFoundException, BadRequestException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserService } from '../user/user.service'
import { Response, Request } from 'express'
import { LoginDto } from './dto/auth.dto'
import { JwtAuthGuard } from './jwt-auth.guard'
import { User } from '../user/entities/user.entity'
import { ConfigService } from '@nestjs/config'

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private readonly configService: ConfigService
    ) {}

    @Get('login')
    async loginPage(
        @Query('client_id') clientId: string,
        @Query('client_secret') clientSecret: string,
        @Query('redirect_uri') redirectUri: string,
        @Res() res: Response
    ) {
        await this.authService.validateClient(clientId, clientSecret)

        const clientSessionId = await this.authService.storeClientSession(clientId, clientSecret, redirectUri)

        res.send(`
           <form method="POST" action="/auth/login?client_session_id=${clientSessionId}">
        <input type="text" name="identifier" placeholder="Email or username" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    `)
    }

    @Post('login')
    async login(@Query('client_session_id') clientSessionId: string, @Body() loginDto: LoginDto, @Res() res: Response) {
        const clientData = await this.authService.getClientSession(clientSessionId)
        if (!clientData) throw new BadRequestException('Invalid client sessionId')

        const { clientId, clientSecret, redirectUri } = clientData
        const client = await this.authService.validateClient(clientId, clientSecret)
        if (client.redirectUri !== redirectUri) throw new Error('Redirect URI không khớp')

        const user = await this.userService.validateUser(loginDto.identifier, loginDto.password)
        if (!user) throw new BadRequestException('Invalid identifier or password')

        const { redirect_uri, session_id } = await this.authService.login(user, client)

        res.cookie('session_id', session_id, {
            httpOnly: true,
            secure: false,
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.redirect(redirect_uri)
    }

    @Post('refresh')
    async refresh(@Body('session_id') sessionId: string, @Res() res: Response) {
        if (!sessionId) throw new Error('sessionId not found')

        const userId = await this.userService.getUserIdBySessionId(sessionId)
        if (!userId) throw new BadRequestException('Invalid session')

        const refreshToken = await this.userService.getRefreshTokenByUserId(userId)
        if (!refreshToken) throw new NotFoundException('Refresh token not found')

        const tokens = await this.authService.refreshToken(userId, refreshToken)

        res.json({ access_token: tokens.access_token, session_id: tokens.session_id })
    }

    @UseGuards(JwtAuthGuard)
    @Get('userinfo')
    getUserInfo(@Req() req: Request) {
        const user = req.user as User
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name
        }
    }

    @Get('verify')
    async verify(@Query('token') token: string, @Res() res: Response) {
        try {
            const { redirectUri } = await this.userService.verifyEmail(token)

            res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="min-h-screen flex items-center justify-center bg-gray-100">
          <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
            <h2 class="text-2xl font-bold mb-4 text-green-600">Email Verification Successful!</h2>
            <p class="mb-6">Your account has been verified. Please come back to login..</p>
            <a href="${redirectUri}" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Back</a>
          </div>
        </body>
        </html>
      `)
        } catch (error) {
            res.status(400).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="min-h-screen flex items-center justify-center bg-gray-100">
          <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
            <h2 class="text-2xl font-bold mb-4 text-red-600">Email verification failed!</h2>
            <p class="mb-6">${error?.message}</p>
          </div>
        </body>
        </html>
      `)
        }
    }

    @Post('check-session')
    async checkSession(
        @Body('client_id') clientId: string,
        @Body('client_secret') clientSecret: string,
        @Body('session_id') sessionId: string,
        @Res() res: Response
    ) {
        try {
            if (!sessionId) throw new NotFoundException('sessionId not found')

            const tokens = await this.authService.checkSession(clientId, clientSecret, sessionId)

            res.json({ access_token: tokens.access_token, session_id: tokens.session_id })
        } catch (error) {
            res.status(401).json({ message: error })
        }
    }

    @Get('check-session-with-cookie')
    async checkSessionWithCookie(
        @Query('client_id') clientId: string,
        @Query('client_secret') clientSecret: string,
        @Query('redirect_uri') redirectUri: string,
        @Req() req: Request,
        @Res() res: Response
    ) {
        try {
            const sessionId = req.cookies['session_id']
            if (!sessionId) {
                return res.redirect(`/auth/login?client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectUri}`)
            }

            const tokens = await this.authService.checkSessionWithCookie(clientId, clientSecret, String(sessionId))

            const tempToken = this.authService.generateTemporaryToken(tokens.session_id)

            res.redirect(`${redirectUri}?access_token=${tokens.access_token}&temp_token=${tempToken}&session_id=${tokens.session_id}`)
        } catch (_error) {
            res.redirect(`/auth/login?client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectUri}`)
        }
    }

    @Post('logout')
    async logout(@Body('session_id') sessionId: string, @Res() res: Response) {
        if (sessionId) {
            await this.authService.logout(sessionId)
        }

        res.json({ message: 'Logout successfully' })
    }
}
