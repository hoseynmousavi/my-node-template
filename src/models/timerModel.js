import mongoose from "mongoose"

const schema = mongoose.Schema

const timerModel = new schema({
    user_id: {
        type: schema.Types.ObjectId,
        required: "enter user_id",
    },
    egg_id: {
        type: Number,
        required: "enter egg_id",
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default timerModel