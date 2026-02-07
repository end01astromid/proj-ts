import { Schema, model } from 'mongoose';
const UserShema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: { type: Date, default: Date.now }
});
export const User = model('User', UserShema);
