import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { connectMongoDB, connectRedis } from './config/dbRedisConnect.js';
import cors from 'cors';
import testRoutes from './routes/testRoutes.js';

const app = express();
const PORT = process.env.PORT || 8080;

// Restrict CORS to client origin
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/test', testRoutes);

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Node.js/Express Server!' });
}
);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});