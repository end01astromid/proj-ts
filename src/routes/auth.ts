import {Request, Response, Router} from 'express'
import mongoose from 'mongoose'
import { User } from '../model/user.js'
// import { middle_token } from '../middle-token/token.js'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
const router = Router()

router.post('/register',async(req:Request, res: Response)=>{
    try{
        const {username, email, password} = req.body
        if(!username || !email ||!password){
            return res.status(400).json({message: "заполните поле"})
        }
        const lookUser = await User.findOne({email})
        if(lookUser){
            return res.status(400).json({ message: "Пользователь уже существует" });
        }
        const hashedPassword = await bcrypt.hash(password,10)
         // Создаём нового пользователя
         const newUser = new User({username,email, password: hashedPassword})
         await newUser.save()               
         res.json(newUser)
    }catch(err){
        console.error("Ошибка регистрации:", err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
})


router.post('/come-in',async (req: Request, res: Response)=>{
  try{
     const {email, password} = req.body
     if(!email || !password){
         return res.status(400).json({ message: "заполните поле" })
     }
     const user = await User.findOne({email})
     if(!user){
     return res.status(400).json({ message: "Пользователь уже существует" });
 }   
 const isMatch = await bcrypt.compare(password,user.password)
   if(!isMatch){
    return res.status(400).json({ message: 'Неверный email или пароль'});
}
    const token = jwt.sign(
        {id: user._id},
        process.env.JWT_SECRET as string,
        {expiresIn: '24h'}
)
   return res.status(200).json({token, user: {id: user._id, email: user.email}})
}catch(error){
     console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
})




 
// //код на промисах
// //заменить лучшее async/await
// router.post('/come-in', (req:Request, res:Response)=>{
//     const {email, password} = req.body
//     if (!email || !password) {
//         return res.status(400).json({ message: "заполните поле" })
//     }

//     User.findOne({email})
//     .then((user)=>{
//          if (!user) {
//          throw { status: 400, message: "Пользователь не найден" }
//       }
//       return Promise.all([user,bcrypt.compare(password, user.password)])
//       .then(([user, isPasswordValid])=>{
//         if(!isPasswordValid){
//          throw { status: 401, message: "Неверный пароль" }
//         }

//         const token1 = jwt.sign(
//             {userId: user._id, email: user.email},
//             process.env.JWT_SECRET || "JWT_SECRET",
//             {expiresIn: "24h"}
//         )       
//          res.json({ message: "Успешный вход", token1 })
//       })
//     })
//     .catch((err)=>{
//      const status = err.status || 500
//      res.status(status).json({ message: err.message || "Ошибка сервера" }
//     )})
// })



export default router