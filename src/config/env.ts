import dotenv from 'dotenv';

dotenv.config();

export const env={
    PORT:process.env.PORT||'3000',
    DB_URL:process.env.DB_URL!,
    REDIS_URL:process.env.REDIS_URL!,
    JWT_SECRET:process.env.JWT_SECRET!,
    REFRESH_SECRET:process.env.REFRESH_SECRET!,
    OLLAMA_BASE_URL:process.env.OLLAMA_BASE_URL,
    FRONTEND_URL:process.env.FRONTEND_URL,
};