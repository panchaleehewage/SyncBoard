import dotenv from 'dotenv';

dotenv.config();

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
    throw new Error("FATAL: JWT_SECRET environment variable is missing.");
}

export const config = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret_dev_only",
};