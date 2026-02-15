import { Router } from 'express';
import { User } from '../model/user.js';
// import { middle_token } from '../middle-token/token.js'
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
const router = Router();
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "заполните поле" });
        }
        const lookUser = await User.findOne({ email });
        if (lookUser) {
            return res.status(400).json({ message: "Пользователь уже существует" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // Создаём нового пользователя
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.json({ message: "добро пожаловать" });
    }
    catch (err) {
        console.error("Ошибка регистрации:", err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});
router.post('/come-in', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "заполните поле" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Неверный email или пароль" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Неверный email или пароль' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        return res.status(200).json({ token, user: { id: user._id, email: user.email } });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});
export default router;
