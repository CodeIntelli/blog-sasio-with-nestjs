require('dotenv').config({ path: `./config.dev.env` })


// [ + ] all config variable from .env
export default () => ({
    DB_URL: process.env.DB_URL,
    DEBUG_MODE: process.env.DEBUG_MODE,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE: process.env.JWT_EXPIRE,
    COOKIE_EXPIRE: process.env.COOKIE_EXPIRE,
    SMTP_MAIL: process.env.SMTP_MAIL,
    SMTP_SERVICE: process.env.SMTP_SERVICE,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_PASS: process.env.SMTP_PASS,
    FRONTEND_URL: process.env.FRONTEND_URL,
    AWS_BUCKET: process.env.AWS_BUCKET,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    BUCKET_NAME: process.env.BUCKET_NAME,
    AWS_SDK_LOAD_CONFIG: 1,
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_API_KEY: process.env.CLOUD_API_KEY,
    CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,
    CLOUDINARY_URL: process.env.CLOUDINARY_URL,
    ENC_DEC_KEY: process.env.ENC_DEC_KEY,
    IV1: process.env.IV1,
})
