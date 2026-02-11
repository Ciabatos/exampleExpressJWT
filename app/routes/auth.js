import { Router } from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

//------------ Importing Controllers ------------//
import * as authController from '../controllers/authController.js'

const router = Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

//------------ Login ------------//
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/login.html'))
})

router.post('/login', authController.loginHandle)

//------------ Register ------------//
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/register.html'))
})

router.post('/register', authController.registerHandle)

//------------ Logout ------------//
router.get('/logout', authController.logoutHandle)


export default router