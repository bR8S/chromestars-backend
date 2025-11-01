import express, { json } from 'express'
import mongoose from 'mongoose'
import { GridFSBucket } from 'mongodb'
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
let bucket

const startServer = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        const db = mongoose.connection.db
        bucket = new GridFSBucket(db, { bucketName: 'uploads' })
    
        app.listen(4000, () => {
            console.log('Server running on http://localhost:4000')
        })  
        console.log('Successfully connected to db.')

    } catch (error) {
        console.log(error, 'Error connecting to db.')
        process.exit(1)
    }
}

startServer()

// Retrieve image by filename
app.get('/file/:filename', async (req, res) => {
    const { filename } = req.params

    // Access the native files collection
    const file = await mongoose.connection.db.collection('uploads.files').findOne({ filename })
    if (!file) return res.status(404).send('File not found')

    res.set('Content-Type', file.contentType)
    const readStream = bucket.openDownloadStream(file._id)
    readStream.pipe(res)
});
