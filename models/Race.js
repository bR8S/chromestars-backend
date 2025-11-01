import mongoose from 'mongoose'

const raceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    track: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Track'
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Event'
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }],
})

export default mongoose.model('Race', raceSchema)