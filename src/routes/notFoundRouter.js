import createErrorText from "../helpers/createErrorText"
import respondTextConstant from "../constants/respondTextConstant"

function notFoundRouter(app)
{
    app.route("*")
        .all((req, res) =>
        {
            createErrorText({res, text: respondTextConstant.error.routeNotFound, status: 404})
        })
}

export default notFoundRouter