import otpModel from "../models/otpModel"
import mongoose from "mongoose"
import createErrorText from "../helpers/createErrorText"
import respondTextConstant from "../constants/respondTextConstant"
import createSuccessRespond from "../helpers/createSuccessRespond"
import sendSMS from "../helpers/sendSMS"
import data from "../data"
import userController from "./userController"

const otpTb = mongoose.model("otp", otpModel)

function getOtp(req, res)
{
    const {phone} = req.body
    otpTb.findOne({phone})
        .then((preOtp, err) =>
        {
            if (err) createErrorText({res, status: 500, message: respondTextConstant.error.createOtp, detail: err})
            else if (!preOtp) _sendOtp({phone, res})
            else
            {
                const diffInMinutes = Math.floor((new Date() - preOtp.created_date) / 1000 / 60)
                if (diffInMinutes >= 2)
                {
                    otpTb.deleteOne({phone})
                        .then((_, err) =>
                        {
                            if (err) createErrorText({res, status: 500, message: respondTextConstant.error.createOtp, detail: err})
                            else _sendOtp({phone, res})
                        })
                }
                else createSuccessRespond({res, message: respondTextConstant.success.otpSentBefore})
            }
        })
}

function _sendOtp({phone, res})
{
    const newOtp = new otpTb({code: Math.floor(Math.random() * 8999) + 1000, phone})
    newOtp.save((err, created) =>
    {
        if (err) createErrorText({res, status: 400, message: respondTextConstant.error.createOtp, detail: err})
        else
        {
            const {code, phone} = created
            sendSMS({token: code, template: data.kavenegarOtpTemplate, receptor: phone})
                .then(() => createSuccessRespond({res, message: respondTextConstant.success.otpSent}))
                .catch(err => createErrorText({res, status: 500, message: respondTextConstant.error.kavenegarSendOtp, detail: err?.response?.data}))
        }
    })
}

function verifyOtp(req, res)
{
    const {phone, code} = req.body
    otpTb.findOne({phone, code})
        .then((founded, err) =>
        {
            if (err) createErrorText({res, status: 500, message: respondTextConstant.error.verifyOtp, detail: err})
            else if (!founded) createErrorText({res, status: 400, message: respondTextConstant.error.verifyOtpNotFound})
            else
            {
                otpTb.deleteOne({phone})
                    .then((_, err) =>
                    {
                        if (err) createErrorText({res, status: 500, message: respondTextConstant.error.createOtp, detail: err})
                        else userController.createOrGetUser(req, res)
                    })
            }
        })
}

const otpController = {
    getOtp,
    verifyOtp,
}

export default otpController