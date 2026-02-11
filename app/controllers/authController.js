
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUser, insertRefreshToken, registerNewUser, revokeRefreshToken } from "../config/schemas/auth/auth.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";

export const loginHandle = async (req, res) => {
    try {
        

        const userAgent = req.get('User-Agent')
        const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide email and password' 
            })
        }

         const user = await getUser(email)
        
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' })
        }
        
        const actualRefreshToken = req.cookies?.refreshToken
        
        if (actualRefreshToken) {
            const decoded = jwt.verify(
                actualRefreshToken,
                process.env.JWT_REFRESH_SECRET
              )

            await revokeRefreshToken(decoded.id, req.ip, req.get('User-Agent'))
        }

        const refreshToken = generateRefreshToken(user)
        const accessToken = generateAccessToken(user)

        const hashedRefreshToken = await bcrypt.hash(refreshToken.token, 10);
        await revokeRefreshToken(user.id, req.ip, req.get('User-Agent'))
        await insertRefreshToken(user.id, hashedRefreshToken, refreshToken.expiresAt, ip, userAgent);

        res.cookie('refreshToken', refreshToken.token, {
            httpOnly: true,
            secure: true,
            maxAge: refreshToken.maxAge, 
            sameSite: 'strict'
        })

        res.cookie('accessToken', accessToken.token, {
            httpOnly: true,
            secure: true,
            maxAge: accessToken.maxAge, 
            sameSite: 'strict'
        })

        res.redirect('/')

    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred during login' 
        })
    }
}

export const registerHandle =async(req, res) => {
    try {
        const { name, email, password, password2 } = req.body
        console.log('Received registration data:', { name, email, password, password2 })
        if (!name || !email || !password || !password2) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please fill in all fields' 
            })
        }

        if (password !== password2) {
            return res.status(400).json({ 
                success: false, 
                message: 'Passwords do not match' 
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const result = await registerNewUser(name, email, hashedPassword)

        if (!result || !result.status) {
            return res.status(400).json({ 
                success: false, 
                message: result.message || 'Registration failed'
            })
        }

        res.redirect('/login')

    } catch (error) {
        console.error('Registration error:', error)
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred during registration' 
        })
    }
}

export const logoutHandle = async (req, res) => {
    try {
    const refreshToken = req.cookies?.refreshToken

        if (refreshToken) {
              const decoded = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET
              )
                
               await revokeRefreshToken(decoded.id, req.ip, req.get('User-Agent'))
        }


        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        })
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        })
        
        res.redirect('/')
        
    } catch (error) {
        console.error('Logout error:', error)
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred during logout' 
        })
    }
}