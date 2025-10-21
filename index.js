import express, { json } from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import User from './models/User.js'

import userRoutes from './routes/user.js'
import raceRoutes from './routes/race.js'
import eventRoutes from './routes/event.js'
import trackRoutes from './routes/track.js'
import indexRoutes from './routes/index.js'
import racerRoutes from './routes/racer.js'

dotenv.config()

const app = express()
app.use(express.json())

// mount the routes we set up
app.use('/', indexRoutes)
app.use('/users', userRoutes)
app.use('/race', raceRoutes)
app.use('/event', eventRoutes)
app.use('/track', trackRoutes)
app.use('/racer', racerRoutes)


const mongoURI = process.env.MONGODB_URI

const startServer = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(3000, () => {
            console.log('Server running on http://localhost:3000')
        })  
        console.log('Successfully connected to db.')

    } catch (error) {
        console.log(error, 'Error connecting to db.')
        process.exit(1)
    }
}

startServer()

app.get('/all-racers', async (req, res) => {
    const allRacers = await User.find({})
    console.log(allRacers)
    res.send(JSON.stringify(allRacers))
}) 