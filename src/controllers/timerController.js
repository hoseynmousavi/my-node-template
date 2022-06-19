import mongoose from "mongoose"
import timerModel from "../models/timerModel"
import createErrorText from "../helpers/createErrorText"
import respondTextConstant from "../constants/respondTextConstant"
import checkPermission from "../helpers/checkPermission"
import createSuccessRespond from "../helpers/createSuccessRespond"

const timerTb = mongoose.model("timer", timerModel)

function getTimer(req, res)
{
    checkPermission({req, res})
        .then(user =>
        {
            const {_id: user_id} = user
            timerTb.find({user_id})
                .then((timers, err) =>
                {
                    if (err) createErrorText({res, status: 400, message: respondTextConstant.error.getTimers, detail: err})
                    else createSuccessRespond({res, data: timers})
                })
        })
}

function addTimer(req, res)
{
    checkPermission({req, res})
        .then(user =>
        {
            const {_id: user_id} = user
            const {duration_day, name} = req.body
            const newTimer = new timerTb({user_id, duration_day, name})
            newTimer.save((err, timer) =>
            {
                if (err) createErrorText({res, status: 400, message: respondTextConstant.error.createTimer, detail: err})
                else createSuccessRespond({res, data: timer, message: respondTextConstant.success.timerAdded})
            })
        })
}

function deleteTimer(req, res)
{
    checkPermission({req, res})
        .then(user =>
        {
            const {_id: user_id} = user
            const {timer_id} = req.body
            timerTb.deleteOne({user_id, _id: timer_id}, err =>
            {
                if (err) createErrorText({res, status: 400, message: respondTextConstant.error.deleteTimer, detail: err})
                else createSuccessRespond({res, message: respondTextConstant.success.timerRemoved})
            })
        })
}

const timerController = {
    getTimer,
    addTimer,
    deleteTimer,
}

export default timerController