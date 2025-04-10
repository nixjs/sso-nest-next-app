import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { User } from './entities/user.entity'
import { Client } from '../client/entities/client.entity'
import { ClientModule } from '../client/client.module'

@Module({
    imports: [TypeOrmModule.forFeature([User, Client]), ClientModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}
