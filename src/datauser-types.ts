import {IUser} from './usertypes.js'

export interface RegisterUserDt{
    username: string,
    email: string,
    password: IUser['password']
}