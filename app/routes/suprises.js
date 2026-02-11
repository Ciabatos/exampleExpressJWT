import { Router } from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { authenticateToken } from '../middlewares/auth.js'

const router = Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

router.get('/suprise1', authenticateToken, (req, res) => {
	res.sendFile(path.join(__dirname, '../pages/suprise1.html'))
})
router.get('/suprise2', authenticateToken, (req, res) => {
	res.sendFile(path.join(__dirname, '../pages/suprise2.html'))
})
router.get('/suprise3', authenticateToken, (req, res) => {
	res.sendFile(path.join(__dirname, '../pages/suprise3.html'))
})
router.get('/suprise4', authenticateToken, (req, res) => {
	res.sendFile(path.join(__dirname, '../pages/suprise4.html'))
})
router.get('/suprise5', authenticateToken, (req, res) => {
	res.sendFile(path.join(__dirname, '../pages/suprise5.html'))
})

export default router