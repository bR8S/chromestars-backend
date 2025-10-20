import express from 'express'
const router = express.Router()
import User from '../models/User.js'

// Given Racers Route
router.get('/:username', async (req, res) => {
    try {
        const username = req.params.username
        const racer = await User.findOne({ username: username })

        res.render('racer/index', {
            username: racer.username, 
            profile_image: racer.profile_image, 
            background_image: racer.background_image, 
            competitions: racer.competitions,
            wins: racer.wins, 
            losses: racer.losses,
            elo: racer.elo,
            streak: racer.streak,
            bio: racer.bio,
            placements: racer.placements,
            podium_count: racer.podium_count,
            top_rivals: racer.top_rivals,
            top_tracks: racer.top_tracks
        })
    } catch {
        res.redirect('/')
    }
})

export default router;