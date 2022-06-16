function createErrorText({res, text, detail, status})
{
    return res.status(status).send({message: text, ...(detail ? {detail} : {})})
}

export default createErrorText