function createSuccessRespond({res, text, data})
{
    return res.send({
        ...(text ? {message: text} : {}),
        ...(data ? {data} : {}),
    })
}

export default createSuccessRespond