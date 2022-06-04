function createErrorText({res, text, status})
{
    return res.status(status).send({message: text})
}

export default createErrorText