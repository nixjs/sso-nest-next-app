import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    type: 'postgres',
                    host: configService.get<string>('db.host'),
                    port: configService.get<number>('db.port'),
                    username: configService.get<string>('db.username'),
                    password: configService.get<string>('db.password'),
                    database: configService.get<string>('db.database'),
                    entities: ['dist/**/*.entity{.ts,.js}'],
                    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
                    seeds: [__dirname + '/seeds/**/*{.ts,.js}'],
                    factories: [__dirname + '/factories/**/*{.ts,.js}'],
                    cli: {
                        migrationsDir: __dirname + '/migrations/'
                    },
                    autoLoadEntities: true,
                    synchronize: false,
                    logging: true,
                    dropSchema: false
                }
            }
        })
    ]
})
export class DatabaseModule {}
