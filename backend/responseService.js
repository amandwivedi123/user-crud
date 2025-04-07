export const successResponse = (res, result, message) => {
    return res.status(200).send({ result, message });
}

export const notFound = (res, msg) => {
    return res.status(404).json({ status: false, statusCode: 404, msg });
}

export const unAuthorized = (res, msg) => {
    return res.status(401).json({ status: false, statusCode: 401, msg });
}

export const alreadyExist = (res, rows, msg) => {
    return res.status(409).json({ rows, status: false, statusCode: 409, msg })
}

export const serverError = (res, data, msg) => {
    return res.json(500).json(data, msg)
}
