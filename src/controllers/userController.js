import mongoose from "mongoose"
import userModel from "../models/userModel"
import createErrorText from "../helpers/createErrorText"
import respondTextConstant from "../constants/respondTextConstant"
import createSuccessRespond from "../helpers/createSuccessRespond"
import tokenHelper from "../helpers/tokenHelper"
import data from "../data"
import checkPermission from "../helpers/checkPermission"

const userTb = mongoose.model("user", userModel)

function _getUserById({_id})
{
    return userTb.findOne({_id})
}

function createOrGetUser(req, res)
{
    const {phone} = req.body
    userTb.findOne({phone})
        .then((founded, err) =>
        {
            if (err) createErrorText({res, status: 500, text: respondTextConstant.error.verifyOtpErr, detail: err})
            else if (!founded)
            {
                const newUser = new userTb({phone})
                newUser.save((err, user) =>
                {
                    if (err) createErrorText({res, status: 400, text: respondTextConstant.error.createUserErr, detail: err})
                    else _sendUser({res, user, is_sign_up: true})
                })
            }
            else _sendUser({res, user: founded, is_sign_up: false})
        })
}

function _sendUser({res, user, is_sign_up})
{
    const {_id} = user
    const token = tokenHelper.encodeToken({_id})
    // TODO refreshToken is bullshit
    createSuccessRespond({res, data: {user, is_sign_up, token, refresh_token: data.tokenSign}, text: respondTextConstant.success[is_sign_up ? "createdUser" : "loginUser"]})
}

function updateUser(req, res)
{
    checkPermission({req, res})
        .then(user =>
        {
            const {first_name, last_name, email, gender, birth_date} = req.body
            const {_id} = user
            userTb.findOneAndUpdate(
                {_id},
                {first_name, last_name, email, gender, birth_date},
                {new: true, useFindAndModify: false, runValidators: true},
                (err, updatedUser) =>
                {
                    if (err) createErrorText({res, status: 400, text: respondTextConstant.error.updateUserErr, detail: err})
                    else createSuccessRespond({res, data: updatedUser, text: respondTextConstant.success.updateUser})
                })
        })
}

function updateAvatar(req, res)
{
    checkPermission({req, res})
        .then(user =>
        {
            const avatar = req?.files?.avatar
            if (avatar)
            {
                const {_id} = user
                const avatarName = new Date().toISOString() + avatar.name
                const avatarUrl = `media/pictures/${avatarName}`
                avatar.mv(avatarUrl, (err) =>
                {
                    if (err) createErrorText({res, status: 400, text: respondTextConstant.error.updateUserErr, detail: err})
                    else
                    {
                        userTb.findOneAndUpdate(
                            {_id},
                            {avatar: avatarUrl},
                            {new: true, useFindAndModify: false, runValidators: true},
                            (err, updatedUser) =>
                            {
                                if (err) createErrorText({res, status: 400, text: respondTextConstant.error.updateUserErr, detail: err})
                                else createSuccessRespond({res, data: updatedUser, text: respondTextConstant.success.updateUser})
                            })
                    }
                })
            }
            else createErrorText({res, status: 400, text: respondTextConstant.error.updateUserNoField})
        })
}

const userController = {
    _getUserById,
    createOrGetUser,
    updateUser,
    updateAvatar,
}

export default userController