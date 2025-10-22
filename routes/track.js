import express from 'express'
const router = express.Router()
import Track from '../models/Track.js'
import User from '../models/User.js'

// All Races Route
router.get('/', async (req, res) => {
    try {
        if(!req.session.user) {
            return res.status(401).json({ message: 'Please sign in' })
        }

        const id = req.session.user.id
        const user = await User.findById(id)

        if(!user.admin){
            return res.status(403).json({ message: 'Unauthorized: Admins only' })
        }
        
        const tracks = await Track.find({})
        res.json({ tracks: tracks })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error fetching tracks' })
    }
})

// Create Race Route
router.post('/', async (req, res) => {
    try {
        const { title, laps } = req.body
        const track = new Track({
            name: title,
            laps: laps
        })
        await track.save()
        res.json({ message: 'Track created successfully'})
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error creating track' })
    }
})

// Fetch All Races 
router.get('/all-tracks', async (req, res) => {
    try {
        const tracks = await Track.find({})
        res.json({ tracks: tracks })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error fetching tracks' })
    }
})

// All Races Route
router.post('/delete-track', async (req, res) => {
    try {
        const { id } = req.body
        await Track.deleteOne({ _id: id })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error deleting track' })
    }
})

export default router;
