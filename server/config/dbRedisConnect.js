import mongoose from 'mongoose';
import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

let redisClient = null;
let mongoConnection = null;

const connectMongoDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in .env');
        }

        // Check if already connected
        if (mongoose.connection.readyState === 1) {
            console.log('MongoDB already connected');
            return mongoose.connection;
        }

        // Close existing connection if any
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }

        console.log('Connecting to MongoDB...');
        mongoConnection = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
            setTimeout(connectMongoDB, 5000);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected. Attempting to reconnect...');
            setTimeout(connectMongoDB, 5000);
        });

        console.log('MongoDB connected successfully!');
        return mongoConnection;
    } catch (err) {
        console.error('MongoDB connection error:', err);
        setTimeout(connectMongoDB, 5000);
        throw err;
    }
};

const connectRedis = async () => {
    try {
        if (!process.env.REDIS_URL) {
            throw new Error('REDIS_URL is not defined in .env');
        }

        // Check if already connected
        if (redisClient && redisClient.isOpen) {
            console.log('Redis already connected');
            return redisClient;
        }

        // Close existing connection if any
        if (redisClient) {
            await redisClient.quit();
        }

        console.log('Connecting to Redis...');
        redisClient = createClient({
            url: process.env.REDIS_URL,
            socket: {
                reconnectStrategy: (retries) => {
                    if (retries > 10) {
                        console.error('Redis max retries reached');
                        return new Error('Redis max retries reached');
                    }
                    return Math.min(retries * 100, 3000);
                },
            },
        });

        redisClient.on('error', (err) => {
            console.error('Redis Client Error:', err);
            setTimeout(connectRedis, 5000);
        });

        redisClient.on('reconnecting', () => {
            console.log('Redis reconnecting...');
        });

        redisClient.on('connect', () => {
            console.log('Redis connected successfully!');
        });

        await redisClient.connect();

        // Test connection
        await redisClient.set('test', 'redis-ping');
        const testValue = await redisClient.get('test');
        if (testValue !== 'redis-ping') {
            throw new Error('Redis connection test failed');
        }

        return redisClient;
    } catch (err) {
        console.error('Redis connection error:', err);
        setTimeout(connectRedis, 5000);
        throw err;
    }
};

// Graceful shutdown
const closeConnections = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('MongoDB connection closed');
        }

        if (redisClient && redisClient.isOpen) {
            await redisClient.quit();
            console.log('Redis connection closed');
        }
    } catch (err) {
        console.error('Error closing connections:', err);
    }
};

// Handle process termination
process.on('SIGINT', async () => {
    await closeConnections();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await closeConnections();
    process.exit(0);
});

// Initialize connections
const initializeConnections = async () => {
    try {
        await connectMongoDB();
        await connectRedis();
    } catch (err) {
        console.error('Failed to initialize connections:', err);
        process.exit(1);
    }
};

initializeConnections();

export { connectMongoDB, connectRedis, redisClient, closeConnections };
