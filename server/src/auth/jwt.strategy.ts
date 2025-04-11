import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { UserService } from '../user/user.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private userService: UserService
    ) {
        const options: StrategyOptions = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('jwt.access_token') || ''
        }
        super(options)
    }

    async validate(payload: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const user = await this.userService.findById(payload?.sub)
        if (!user) {
            throw new UnauthorizedException('User does not exist')
        }
        return user
    }
}
