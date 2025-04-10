import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Client } from '../client/entities/client.entity';
import { UserModule } from '../user/user.module';
import { User } from '../user/entities/user.entity';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        TypeOrmModule.forFeature([Client, User]),
        UserModule,
        PassportModule.register({ defaultStrategy: 'jwt' }) // Đăng ký Passport với chiến lược mặc định là JWT
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
