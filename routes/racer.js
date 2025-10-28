import express from 'express'
const router = express.Router()
import User from '../models/User.js'

// Given users Route
router.get('/:username', async (req, res) => {
    try {
        const { username } = req.params
        const user = await User.findOne({ username: username })

        res.json({
            user: {
                username: user.username, 
                profile_image: user.profile_image, 
                background_image: user.background_image, 
                competitions: user.competitions,
                wins: user.wins, 
                losses: user.losses,
                elo: user.elo,
                streak: user.streak,
                bio: user.bio,
                placements: user.placements,
                podium_count: user.podium_count,
                top_rivals: user.top_rivals,
                top_tracks: user.top_tracks
            }
        })
    } catch {
        res.status(500).json({ message: 'Error fetching user' })
    }
})

export default router;