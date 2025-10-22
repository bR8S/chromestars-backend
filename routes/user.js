import express from 'express'
const router = express.Router()
import User from '../models/User.js'

router.get('', async (req, res) => {
    try {
        if(!req.session.user){
            return res.status(401).json({ message: 'Please sign in' })
        }

        const username = req.session.user.username
        const users = await User.find({})
        const user = users.find( user => user.username === username )

        res.json({
            id: user.id,
            profile_image: user.profile_image, 
            background_image: user.background_image, 
            username: user.username, 
            phone_number: user.phone_number, 
            first_name: user.first_name, 
            last_name: user.last_name, 
            email: user.email, 
            bio: user.bio, 
            password: user.password
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

// Check if user is logged in
router.get('/logged-in', async (req, res) => {
    try {
        let userAuth = false

        if(!req.session.user) {
            return res.status(401).json({ userAuth: userAuth, message: 'Please sign in' })
        }

        const username = req.session.user.username
        const users = await User.find({})
        const user = users.find( user => user.username === username )

        if(!user) {
            userAuth = true
            return res.status(403).json({ userAuth: userAuth, message: 'Unauthorized user' })
        }

        res.json({ userAuth: userAuth })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
})

// Check if user has correct perms
router.get('/admin-perms', async (req, res) => {
    try {
        let userAdmin = false

        if(!req.session.user) {
            return res.status(401).json({ userAdmin: userAdmin, message: 'Please sign in' })
        }

        const username = req.session.user.username
        const users = await User.find({})
        const user = users.find( user => user.username === username )

        if(!user) {
            userAdmin = true
            return res.status(403).json({ userAdmin: userAdmin, message: 'Unauthorized user' })
        }

        res.json({ userAdmin: userAdmin })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error authorizing admin perms' })
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

// Fetch All Racers
router.get('/all-racers', async (req, res) => {
    try {
        const racers = await User.find({})
        res.json({ racers: racers })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error fetching racers' })
    }
}) 

// Fetch Racers Given IDs
router.get('/get-racers', async (req, res) => {
    try {
        const { ids } = req.query
        const idArray = ids.split(',')
        //const idArray = ids.split(',').map(id => id.trim()).filter(id => mongoose.Types.ObjectId.isValid(id))
        const racers = await User.find({ _id: { $in: idArray } })

        res.json({ racers: racers })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error fetching racers' })
    }
}) 

// Fetch Racer Given ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const racer = await User.findById(id)
        res.json({ racer: racer })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error fetching racer' })
    }
})

// Update Racer Score Given ID
router.post('/update-score', async (req, res) => {
    try {
        const { id, points } = req.body
        const racer = await User.findById(id)

        racer.score = racer.score + points
        await racer.save()

        res.status(200).json({ message: 'Updated score successfully'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error updating score' })
    }
})

// Update Racer ELO Given ID
router.post('/update-elo', async (req, res) => {
    try {
        const { id, elo } = req.body
        const racer = await User.findById(id)

        racer.elo = elo
        await racer.save()

        res.status(200).json({ message: 'Updated elo successfully'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error updating elo' })
    }
})

// Update Racer Wins Given ID
router.post('/update-win', async (req, res) => {
    try {
        const { id } = req.body
        const racer = await User.findById(id)

        racer.wins += 1
        await racer.save()

        res.status(200).json({ message: 'Updated wins successfully'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error updating wins' })
    }
})

// Update Racer Losses Given ID
router.post('/update-loss', async (req, res) => {
    try {
        const { id } = req.body
        const racer = await User.findById(id)
    
        racer.losses += 1
        await racer.save()

        res.status(200).json({ message: 'Updated losses successfully'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error updating losses' })
    }
})

// Update Racer Competitions Given ID
router.post('/update-competitions', async (req, res) => {
    try {
        const { id } = req.body
        const racer = await User.findById(id)
    
        racer.competitions += 1
        await racer.save()

        res.status(200).json({ message: 'Updated competitions successfully'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error updating competitions' })
    }
})

// Update Racers Avg Pos Given ID 
router.post('/update-avg-pos', async (req, res) => {
    try {
        const { id, placement } = req.body
        const racer = await User.findById(id)

        racer.placements.push(placement + 1)
        await racer.save()
        
        res.status(200).json({ message: 'Updated placements successfully'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error updating placements' })
    }
})

// Update Racers Best Streak Given ID
router.post('/update-streak', async (req, res) => {
    try {
        const { id } = req.body
        const racer = await User.findById(id)
        const requiredPlacement = 4
        let currStreak = 0
        let highestStreak = 0
        let end = racer.placements.length

        for(let i = 0; i < end; i++) {
            if (racer.placements[i] <= requiredPlacement) {
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

        racer.streak = highestStreak
        await racer.save()
        
        res.status(200).json({ message: 'Updated streak successfully'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error updating streak' })
    }
})

// Update Racer Number of Podium Finishes
router.post('/update-podium-count', async (req, res) => {
    try {
        const { id } = req.body
        const racer = await User.findById(id)
        const requiredPlacement = 4

        let podiumCount = 0
        let end = racer.placements.length

        for(let i = 0; i < end; i++) {
            if(racer.placements[i] <= requiredPlacement){
                podiumCount++
            }
        }

        racer.podium_count = podiumCount
        await racer.save()
        
        res.status(200).json({ message: 'Updated podium count successfully'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error updating podium count' })
    }
})

//Update Racer Rivals 
router.post('/update-rivals', async (req, res) => {
    try {
        const { id, standing, standings } = req.body
        const racer = await User.findById(id)
        let placementSum = 0

        // Calc racer overall avg placement
        racer.placements.forEach(placement => {
            placementSum += placement
        })

        const avgPlacement = (placementSum / racer.placements?.length).toFixed(2)

        // If standing is greater that means racer placed outside of avg, ex racer was upset
        if(standing > avgPlacement){
            // Save every racer that outplaced the current racers
            const rivalsArr = standings.slice(0, standing - 1)
            const rivals = await User.find({ '_id': { $in: rivalsArr } })

            rivals.forEach(rival => {
                racer.rivals.push(rival.username)
            })

            let rivalCount = new Map()

            racer.rivals.forEach(rival => {
                rivalCount.set(rival, (rivalCount.get(rival) || 0) + 1)
            })

            // Step 2: Sort by frequency in descending order
            let sortedRivals = Array.from(rivalCount.entries()).sort((a, b) => b[1] - a[1]);

            // Step 3: Extract the top N words
            let topRivals

            if(sortedRivals.length >= 3){
                topRivals = sortedRivals.slice(0, 3).map(([rival, count]) => ({ rival, count }))
                racer.top_rivals = topRivals
            } else {
                topRivals = sortedRivals.map(([rival, count]) => ({ rival, count }))
                racer.top_rivals = topRivals
            }
        }
        await racer.save()
        
        res.status(200).json({ message: 'Updated rivals successfully'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error updating rivals' })
    }
})

//Update Racer Tracks
router.post('/update-tracks', async (req, res) => {
    try {
        const { id, track, standing } = req.body

        if(standing > 3){
            return res.status(200).json({ message: 'Racer placed out of top 3, no top tracks to be updated'})
        }

        const racer = await User.findById(id)
        racer.tracks.push(track)

        //await racer.save()

        const trackCount = new Map()

        racer.tracks.forEach(track => {
            trackCount.set(track, (trackCount.get(track) || 0) + 1)
        })

        // Step 2: Sort by frequency in descending order
        const sortedTracks = Array.from(trackCount.entries()).sort((a, b) => b[1] - a[1]);

        // Step 3: Extract the top N words
        const topTracks = sortedTracks.slice(0, 3).map(([track, count]) => ({ track, count }))
        racer.top_tracks = topTracks

        await racer.save()
        
        res.status(200).json({ message: 'Updated top tracks successfully'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error updating top tracks' })
    }
})

// Reset all racers 
router.post('/reset-racers', async (req, res) => {
    try{
        const racers = await User.find({})
        racers.forEach(async racer => {
            racer.wins = 0;
            racer.losses = 0;
            racer.competitions = 0;
            racer.score = 0;
            racer.elo = 1000;
            racer.placements = [];
            racer.streak = 0;
            racer.podium_count = 0;
            racer.rivals = [];
            racer.top_rivals = [];
            racer.tracks = [];
            racer.top_tracks = [];
            await racer.save()
        })
        res.status(200).json({ message: 'Racers reset successfully'})
    } catch(error){
        console.log(error)
        return res.status(500).json({ message: 'Error reseting racers' })
    }
})

// Delete all racers 
router.post('/delete-racers', async (req, res) => {
    try{
        await User.deleteMany({})
        res.status(200).json({ message: 'Racers deleted successfully'})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting all racers' })
    }
})

export default router;