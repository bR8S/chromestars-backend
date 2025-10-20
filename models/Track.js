import mongoose from 'mongoose'

const trackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    laps: {
        type: Number,
        required: true
    }
})

export default mongoose.model('Track', trackSchema)