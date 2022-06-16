import tokenHelper from "./tokenHelper"
import userController from "../controllers/userController"
import createErrorText from "./createErrorText"
import respondTextConstant from "../constants/respondTextConstant"

function checkPermission({req, res, minRole = "user"})
{
    return new Promise(resolve =>
    {
        tokenHelper.decodeToken(req?.headers?.authorization)
            .then(({_id}) =>
            {
                userController._getUserById({_id})
                    .then((user, err) =>
                    {
                        if (err) createErrorText({res, status: 500, text: respondTextConstant.error.getUserByTokenErr, detail: err})
                        else if (!user) createErrorText({res, status: 403, text: respondTextConstant.error.getPermissionErr, detail: err})
                        else
                        {
                            const {role} = user
                            if (minRole === "user" || role === "admin") resolve(user)
                            else createErrorText({res, status: 403, text: respondTextConstant.error.getPermissionErr, detail: err})
                        }
                    })

            })
            .catch(e => createErrorText({res, status: 403, text: respondTextConstant.error.getPermissionErr, detail: e?.message}))
    })
}

export default checkPermission