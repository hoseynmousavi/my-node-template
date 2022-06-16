import urlConstant from "../constants/urlConstant"
import userController from "../controllers/userController"

function userRouter(app)
{
    app.route(urlConstant.user)
        .patch(userController.updateUser)

    app.route(urlConstant.userAvatar)
        .patch(userController.updateAvatar)
}

export default userRouter