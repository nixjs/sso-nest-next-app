import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.enableCors({
        origin: ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type, Accept, Authorization, Referer, User-Agent, sec-ch-ua, sec-ch-ua-platform, sec-ch-ua-mobile',
        credentials: true,
        maxAge: 3600
    })
    await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
