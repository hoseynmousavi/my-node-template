import urlConstant from "../constants/urlConstant"
import timerController from "../controllers/timerController"

function timerRouter(app)
{
    app.route(urlConstant.timer)
        .get(timerController.getTimer)
        .post(timerController.addTimer)
        .delete(timerController.deleteTimer)
}

export default timerRouter