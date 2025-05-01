import mongoose from 'mongoose';
import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

let redisClient = null;

const connectMongoDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI is not defined in .env');
            return;
        }

        if ([1, 2].includes(mongoose.connection.readyState)) {
            console.log('MongoDB already connected or connecting.');
            return;
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected!');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        setTimeout(connectMongoDB, 5000); // Retry
    }
};

const connectRedis = async () => {
    try {
        if (redisClient && redisClient.isOpen) {
            console.log('Redis already connected.');
            return redisClient;
        }

        if (!process.env.REDIS_URL) {
            console.error('REDIS_URL is not defined in .env');
            return null;
        }

        redisClient = createClient({ url: process.env.REDIS_URL });
        redisClient.on('error', (err) => console.error('Redis Client Error:', err));

        await redisClient.connect();
        console.log('Redis connected!');
        await redisClient.set("test", "redis-ping");
        return redisClient;
    } catch (err) {
        console.error('Redis connection error:', err);
        setTimeout(connectRedis, 5000); // Retry
    }
};
connectMongoDB()
connectRedis()
export { connectMongoDB, connectRedis, redisClient };
