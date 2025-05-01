import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { connectMongoDB, connectRedis } from './config/dbRedisConnect.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import testRoutes from './routes/testRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use('/', (req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    next();
})


// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3001',
    credentials: true
}));
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Node.js/Express Server!' });
}
);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});