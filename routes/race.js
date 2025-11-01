import express from 'express'
const router = express.Router()
import Race from '../models/Race.js'
import User from '../models/User.js'
import Track from '../models/Track.js'
import Event from '../models/Event.js'

// All Races Route
router.get('/', async (req, res) => {
    try {
        /*
        if(!req.session.user) {
            return res.status(401).json({ message: 'Please sign in' })
        }

        const id = req.session.user.id
        const user = await User.findById(id)

        if(!user.admin) {
            return res.status(403).json({ message: 'Unauthorized: Admins only' })
        }
        */

        const races = await Race.find({})
            .populate('event', 'name')
            .populate('participants', 'username')

        res.json({ races: races })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error fetching all races' })
    }
})

// New Race Route
router.get('/new', async (req, res) => {
    try {
        if(!req.session.user) {
            return res.status(401).json({ message: 'Please sign in' })
        }

        const id = req.session.user.id
        const user = await User.findById(id)

        if(!user.admin) {
            return res.status(403).json({ message: 'Unauthorized: Admins only' })
        }

        const users = await User.find({})
        const tracks = await Track.find({})
        const events = await Event.find({})

        res.json({ race: new Race(), users: users, tracks: tracks, events: events })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error creating new race' })
    }
})

// Create Race Route
router.post('/', async (req, res) => {
    try {
        let participants = req.body.participants

        if (typeof participants === 'string') {
            participants = participants.split(',').map(id => id.trim()); // Trim spaces
        }

        const users = await User.find({ _id: { $in: participants } })
        
        const sortedusers = participants.map(id => 
            users.find(user => user._id.toString() === id.toString())
        ).filter(Boolean) // Remove undefined values

        if (req.body.event === ''){
            req.body.event = null
        }

        const event = await Event.findById(req.body.event)

        const race = new Race({
            name: req.body.title,
            time: req.body.time,
            track: req.body.track,
            participants: sortedusers,
            event: event || null
        })
        
        // participants are in order of placements so we can update user scores accordingly here
        await race.save()
        
        return res.status(201).json({
            message: 'Race created successfully',
            race,
        })
    
    } catch (error){
        console.log(error)
        return res.status(500).json({ message: 'Error creating race' })
    }
})


// All Races Route
router.post('/api/delete-race', async (req, res) => {
    try {
        await Race.deleteOne({ _id: req.body.id })
        return res.status(201).json({ message: 'Race deleted successfully' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error deleting race'})
    }
})

export default router;
