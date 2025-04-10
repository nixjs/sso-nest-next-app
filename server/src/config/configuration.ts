export default () => ({
    port: parseInt(process.env.PORT ?? '3000', 10),
    redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined
    },
    db: {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT ?? '5432', 10) || 5432,
        username: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE
    },
    jwt: {
        access_token: process.env.JWT_ACCESS_TOKEN,
        access_token_expires_in: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,

        refresh_token: process.env.JWT_REFRESH_TOKEN,
        refresh_token_expires_in: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,

        verification_token: process.env.JWT_VERIFICATION_TOKEN,
        verification_token_expires_in: process.env.JWT_VERIFICATION_TOKEN_EXPIRES_IN
    },
    smtp: {
        email: process.env.SMTP_EMAIL,
        password: process.env.SMTP_PASSWORD
    },
    session_encryption_key: process.env.SESSION_ENCRYPTION_KEY,
    env: process.env.ENV,
    endpoint_api: process.env.ENDPOINT_API
})
