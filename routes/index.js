import express from 'express'
const router = express.Router()
import Users from '../models/User.js'

router.get('/', async (req, res) => {
    try {
        const users = await Users.find({})
        res.json({users: users})
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error'})
    }
})

export default router;