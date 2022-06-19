import mongoose from "mongoose"

const schema = mongoose.Schema

const timerModel = new schema({
    user_id: {
        type: schema.Types.ObjectId,
        required: "enter user_id",
    },
    name: {
        type: String,
        required: "enter name",
    },
    duration_day: {
        type: Number,
        required: "enter duration_day",
    },
    have_notified: {
        type: Boolean,
        default: false,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default timerModel