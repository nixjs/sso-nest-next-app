import { Module, ValidationPipe } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { RedisModule } from '@nestjs-modules/ioredis'
import { APP_PIPE } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AppConfigModule } from './config/config.module'
import { DatabaseModule } from './database/database.module'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { JwtModule } from '@nestjs/jwt'
import { ClientModule } from './client/client.module'

@Module({
    imports: [
        AppConfigModule,
        RedisModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                type: 'single',
                options: {
                    host: configService.get('redis.host'),
                    port: configService.get('redis.port'),
                    password: configService.get('redis.password')
                }
            }),
            inject: [ConfigService]
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('jwt.access_token'),
                signOptions: {
                    expiresIn: configService.get('jwt.access_token_expires_in')
                }
            }),
            inject: [ConfigService],
            global: true // Đặt JwtModule là global để các module khác không cần import lại
        }),
        DatabaseModule,
        ScheduleModule.forRoot(),
        AuthModule,
        UserModule,
        ClientModule
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_PIPE,
            useClass: ValidationPipe
        }
    ]
})
export class AppModule {}
