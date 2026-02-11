import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import express from 'express'
import authRouter from './app/routes/auth.js'
import index from './app/routes/index.js'
import suprisesRouter from './app/routes/suprises.js'
import userRouter from './app/routes/user.js'


dotenv.config()
// dotenv.config({ path: '.env.development' })

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

app.use('/', index)
app.use('/', authRouter)
app.use('/', userRouter)
app.use('/', suprisesRouter)

console.log('http://localhost:3000')
console.log('http://localhost:3000/login')
app.listen(3000, () => console.log('Server running on port 3000'))