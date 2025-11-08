import express from 'express'
const router = express.Router()
import User from '../models/User.js'
import { authenticateToken } from '../middleware/authenticateToken.js'

// Fetch current user
router.get('', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select(
            "-password" // exclude password field for safety
        )

        res.json({
            id: user.id,
            profile_image: user.profile_image, 
            background_image: user.background_image, 
            username: user.username, 
            phone_number: user.phone_number, 
            first_name: user.first_name, 
            last_name: user.last_name, 
            email: user.email, 
            bio: user.bio
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

// Fetch logged in user info for account page
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select(
            "-password" // exclude password field for safety
        )
        res.json({ user: user })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

router.post('/update-me', authenticateToken, async (req, res) => {
    try {
        const { username, first_name, last_name, email, bio, background_image, profile_image } = req.body
        const updates = { username, first_name, last_name, email, bio, background_image, profile_image }
        const user = await User.findById(req.user.id)

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        
        for (const key in updates) {
            if (updates[key] !== undefined) {
                user[key] = updates[key]
            }
        }

        await user.save()
        return res.status(200).json({ message: 'User updated successfully' })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error updating user account' })
    }
})

router.post('/update-account', async (req, res) => { 
    try {
        const { id, ...updates } = req.body
        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const allowedFields = [
            'username',
            'first_name',
            'last_name',
            'email',
            'bio',
            'background_image',
            'profile_image'
        ]

        for (const field of allowedFields) {
            if (updates[field] && user[field] !== updates[field]) {
                user[field] = updates[field];
            }
        }

        await user.save()
        return res.status(200).json({ message: 'User updated successfully' })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error updating user account' })
    }
})

// Fetch All users
router.get('/all-users', async (req, res) => {
    try {
        const users = await User.find({})
        res.json({ users: users })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error fetching users' })
    }
}) 

// Fetch users Given IDs
router.get('/get-users', async (req, res) => {
    try {
        const { ids } = req.query
        const idArray = ids.split(',')
        //const idArray = ids.split(',').map(id => id.trim()).filter(id => mongoose.Types.ObjectId.isValid(id))
        const users = await User.find({ _id: { $in: idArray } })

        res.json({ users: users })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error fetching users' })
    }
}) 

// Fetch user Given ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id)
        res.json({ user: user })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error fetching user' })
    }
})

// Update user Score Given ID
router.post('/update-score', async (req, res) => {
    try {
        const { id, points } = req.body
        const user = await User.findById(id)

        user.score = user.score + points
        await user.save()

        res.status(200).json({ message: 'Updated score successfully'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error updating score' })
    }
})

// Update user ELO Given ID
router.post('/update-elo', async (req, res) => {
    try {
        const { id, elo } = req.body
        const user = await User.findById(id)

        user.elo = elo
        await user.save()

        res.status(200).json({ message: 'Updated elo successfully'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error updating elo' })
    }
})

// Update user Wins Given ID
router.post('/update-win', async (req, res) => {
    try {
        const { id } = req.body
        const user = await User.findById(id)

        user.wins += 1
        await user.save()

        res.status(200).json({ message: 'Updated wins successfully'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error updating wins' })
    }
})

// Update user Losses Given ID
router.post('/update-loss', async (req, res) => {
    try {
        const { id } = req.body
        const user = await User.findById(id)
    
        user.losses += 1
        await user.save()

        res.status(200).json({ message: 'Updated losses successfully'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error updating losses' })
    }
})

// Update user Competitions Given ID
router.post('/update-competitions', async (req, res) => {
    try {
        const { id } = req.body
        const user = await User.findById(id)
    
        user.competitions += 1
        await user.save()

        res.status(200).json({ message: 'Updated competitions successfully'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error updating competitions' })
    }
})

// Update users Avg Pos Given ID 
router.post('/update-avg-pos', async (req, res) => {
    try {
        const { id, placement } = req.body
        const user = await User.findById(id)

        user.placements.push(placement + 1)
        await user.save()
        
        res.status(200).json({ message: 'Updated placements successfully'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error updating placements' })
    }
})

// Update users Best Streak Given ID
router.post('/update-streak', async (req, res) => {
    try {
        const { id } = req.body
        const user = await User.findById(id)
        const requiredPlacement = 4
        let currStreak = 0
        let highestStreak = 0
        let end = user.placements.length

        for(let i = 0; i < end; i++) {
            if (user.placements[i] <= requiredPlacement) {
                currStreak += 1
            }
            else {
                if(currStreak > highestStreak) {
                    highestStreak = currStreak
                }
                currStreak = 0
            }
        }

        if(currStreak > highestStreak) {
            highestStreak = currStreak
        }

        user.streak = highestStreak
        await user.save()
        
        res.status(200).json({ message: 'Updated streak successfully'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error updating streak' })
    }
})

// Update user Number of Podium Finishes
router.post('/update-podium-count', async (req, res) => {
    try {
        const { id } = req.body
        const user = await User.findById(id)
        const requiredPlacement = 4

        let podiumCount = 0
        let end = user.placements.length

        for(let i = 0; i < end; i++) {
            if(user.placements[i] <= requiredPlacement){
                podiumCount++
            }
        }

        user.podium_count = podiumCount
        await user.save()
        
        res.status(200).json({ message: 'Updated podium count successfully'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error updating podium count' })
    }
})

//Update user Rivals 
router.post('/update-rivals', async (req, res) => {
    try {
        const { id, standing, standings } = req.body
        const user = await User.findById(id)
        let placementSum = 0

        // Calc user overall avg placement
        user.placements.forEach(placement => {
            placementSum += placement
        })

        const avgPlacement = (placementSum / user.placements?.length).toFixed(2)

        // If standing is greater that means user placed outside of avg, ex user was upset
        if(standing > avgPlacement){
            // Save every user that outplaced the current users
            const rivalsArr = standings.slice(0, standing - 1)
            const rivals = await User.find({ '_id': { $in: rivalsArr } })

            rivals.forEach(rival => {
                user.rivals.push(rival.username)
            })

            let rivalCount = new Map()

            user.rivals.forEach(rival => {
                rivalCount.set(rival, (rivalCount.get(rival) || 0) + 1)
            })

            // Step 2: Sort by frequency in descending order
            let sortedRivals = Array.from(rivalCount.entries()).sort((a, b) => b[1] - a[1]);

            // Step 3: Extract the top N words
            let topRivals

            if(sortedRivals.length >= 3){
                topRivals = sortedRivals.slice(0, 3).map(([rival, count]) => ({ rival, count }))
                user.top_rivals = topRivals
            } else {
                topRivals = sortedRivals.map(([rival, count]) => ({ rival, count }))
                user.top_rivals = topRivals
            }
        }
        await user.save()
        
        res.status(200).json({ message: 'Updated rivals successfully'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error updating rivals' })
    }
})

//Update user Tracks
router.post('/update-tracks', async (req, res) => {
    try {
        const { id, track, standing } = req.body

        if(standing > 3){
            return res.status(200).json({ message: 'user placed out of top 3, no top tracks to be updated'})
        }

        const user = await User.findById(id)
        user.tracks.push(track)

        //await user.save()

        const trackCount = new Map()

        user.tracks.forEach(track => {
            trackCount.set(track, (trackCount.get(track) || 0) + 1)
        })

        // Step 2: Sort by frequency in descending order
        const sortedTracks = Array.from(trackCount.entries()).sort((a, b) => b[1] - a[1]);

        // Step 3: Extract the top N words
        const topTracks = sortedTracks.slice(0, 3).map(([track, count]) => ({ track, count }))
        user.top_tracks = topTracks

        await user.save()
        
        res.status(200).json({ message: 'Updated top tracks successfully'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error updating top tracks' })
    }
})

// Reset all users 
router.post('/reset-users', async (req, res) => {
    try{
        const users = await User.find({})
        users.forEach(async user => {
            user.wins = 0;
            user.losses = 0;
            user.competitions = 0;
            user.score = 0;
            user.elo = 1000;
            user.placements = [];
            user.streak = 0;
            user.podium_count = 0;
            user.rivals = [];
            user.top_rivals = [];
            user.tracks = [];
            user.top_tracks = [];
            await user.save()
        })
        res.status(200).json({ message: 'users reset successfully'})
    } catch(error){
        console.log(error)
        return res.status(500).json({ message: 'Error reseting users' })
    }
})

// Delete all users 
router.post('/delete-users', async (req, res) => {
    try{
        await User.deleteMany({})
        res.status(200).json({ message: 'users deleted successfully'})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting all users' })
    }
})

export default router;