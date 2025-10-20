import express from 'express'
const router = express.Router()
import Users from '../models/User.js'

router.get('/', async (req, res) => {
    const users = await Users.find({})
    res.json({users: users})
})

export default router;