type keypassword = string | number 

export type IUser = {
    username: string
    email: string
    password: keypassword
    createdAt?: Date
}