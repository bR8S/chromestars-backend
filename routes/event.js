import express from 'express'
const router = express.Router()
import Event from '../models/Event.js'
import Race from '../models/Race.js'
import User from '../models/User.js'

router.get('/', async (req, res) => {
    try {
        const events = await Event.find({})
            .populate('race', 'title')
            .populate('participants', 'username')
            
        res.json({ events: events })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error'})
    }
})


router.get('/:id/history', async (req, res) => {
    try {
        const { id } = req.params
        const event = await Event.findById(id)
        const races = await Race.find({ event: event.id })

        res.json({ event: event, races: races })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error'})
    }
})

router.get('/:id', async (req, res) => {
    try {
        // calculate stats related to event id 
        const { id } = req.params
        const event = await Event.findById(id)
        const races = await Race.find({ event: event.id })

        // iterate through races and add users to eventuser arr if they arent already existing
        // this user instance should be an object that holds score

        let eventusers = new Map();

        races.forEach(race => {
            race.participants.forEach((user, index) => {
                const userId = user._id.toString()

                if (!eventusers.has(userId)) {
                    const score = race.participants.length - (index + 1)
                    const win = index <= 3 ? 1 : 0
                    const loss = index <= 3 ? 0 : 1
                    const competitions = 1
                    const placements = [index + 1]

                    eventusers.set(userId, { 
                        user: user,
                        stats: { score: score, wins: win, losses: loss, competitions: competitions, placements: placements } 
                    });
                }
                else {
                    let eventuser = eventusers.get(userId)

                    // Update score based on user position
                    eventuser.stats.score += race.participants.length - (index + 1)

                    // Update user wins/losses based on user position
                    index <= 3 ? eventuser.stats.wins++ : eventuser.stats.losses++
                    eventuser.stats.competitions++
                    eventuser.stats.placements.push(index + 1)

                    eventusers.set(userId, eventuser);
                }   
            })
        })

        // 2. Convert Map to array
        const participantsArr = Array.from(eventusers.values());
        event.participants = participantsArr

        await event.save()
        res.json({ event: event })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error'})
    }
})

router.post('/', async (req, res) => {
    try {
        const event = new Event({
            name: req.body.title,
            details: req.body.details,
            races: [],
            participants: new Map()
        })

        await event.save()
        res.status(200).json({ message: 'Created event successfully'})
    } catch {
        return res.status(500).json({ errorMessage: 'Error creating event' })
    }
})

export default router;