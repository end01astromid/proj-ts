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
        res.json(newUser);
    }
    catch (err) {
        console.error("Ошибка регистрации:", err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});
//код на промисах
//заменить лучшее async/await
router.post('/come-in', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "заполните поле" });
    }
    User.findOne({ email })
        .then((user) => {
        if (!user) {
            throw { status: 400, message: "Пользователь не найден" };
        }
        return Promise.all([user, bcrypt.compare(password, user.password)])
            .then(([user, isPasswordValid]) => {
            if (!isPasswordValid) {
                throw { status: 401, message: "Неверный пароль" };
            }
            const token1 = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || "JWT_SECRET", { expiresIn: "24h" });
            res.json({ message: "Успешный вход", token1 });
        });
    })
        .catch((err) => {
        const status = err.status || 500;
        res.status(status).json({ message: err.message || "Ошибка сервера" });
    });
});
export default router;
