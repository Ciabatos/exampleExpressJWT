import { Router } from 'express'
import { authenticateToken } from '../middlewares/auth.js'
import path from 'path'
import { fileURLToPath } from 'url'

const router = Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

router.get('/user', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/user.html'))
})

router.get('/api/loggedUser', authenticateToken, (req, res) => {
    res.json(req.user)
})

export default router