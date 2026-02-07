import {Schema, model} from 'mongoose'
import {IUser} from '../usertypes.js'

const UserShema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password:{
        type: String,
        required: true,
        
    },
    createdAt: { type: Date, default: Date.now }
})

export const User = model<IUser>('User',UserShema)