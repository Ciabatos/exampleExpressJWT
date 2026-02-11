import jwt from 'jsonwebtoken'
import { expiresInToMs } from "./expiresInToMs.js"

export const generateAccessToken = (user) => {
    return  {
        token: jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        ),
        expiresAt: new Date(Date.now() + expiresInToMs(process.env.JWT_EXPIRES_IN)),
        maxAge: expiresInToMs(process.env.JWT_EXPIRES_IN)
    }
}

export const generateRefreshToken = (user) => {
    return {
        token: jwt.sign(
            { id: user.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN } 
        ),
        expiresAt: new Date(Date.now() + expiresInToMs(process.env.JWT_REFRESH_EXPIRES_IN)),
        maxAge: expiresInToMs(process.env.JWT_REFRESH_EXPIRES_IN)
    }
    

}