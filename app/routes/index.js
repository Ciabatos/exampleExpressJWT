import { Router } from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

//------------ Importing Controllers ------------//

const router = Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

//------------ Login ------------//
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/index.html'))
})

export default router