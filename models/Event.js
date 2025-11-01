import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    race: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Race'
    }],
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }],
})

export default mongoose.model('Event', eventSchema)