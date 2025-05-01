import express from 'express';
import mongoose from 'mongoose';
import { createClient } from 'redis';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
const PORT = 8080;
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
}
);
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Node.js/Express Server!' });
});

app.get('/api/test/pingAll', (req, res) => {
    res.json({ message: 'Ping from Node.js/Express Server!' });
}
);

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://mongo:27017/mydatabase'); // Use 'mongo'
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
};

const connectRedis = async () => {
    try {
        const redisClient = createClient({
            url: 'redis://redis:6379' // Use service name 'redis'
        });
        redisClient.on('error', err => console.log('Redis Client Error', err));
        await redisClient.connect();
        await redisClient.set('mykey', 'Hello Redis!');
        const value = await redisClient.get('mykey');
        console.log("Redis Value", value);
    } catch (error) {
        console.error('Redis Connection Error:', error);
        process.exit(1);
    }
}

// Connect to MongoDB and Redis
Promise.all([connectDB(), connectRedis()])
    .then(() => {
        // Start the server after successful database and Redis connection
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("Failed to connect to database or redis", err);
        process.exit(1);
    });