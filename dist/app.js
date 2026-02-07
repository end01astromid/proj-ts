import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRouter from './routes/auth.js';
const app = express();
app.use(express.json());
app.use(cors());
app.use('/auth', authRouter);
function MongoConnect() {
    const uri = process.env.MONGO_CONNECT || 'mongodb://localhost:27017/express-and-ts';
    mongoose.connect(uri)
        .then(() => {
        console.log('Mongo connect', uri);
    })
        .catch((err) => {
        console.error('Ошибка подключения к MongoDB:', err.message);
    });
}
MongoConnect();
const PORT = (process.env.PORT) || 5000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
