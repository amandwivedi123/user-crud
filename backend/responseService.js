const successResponse = (res, data, msg) => {
    return res.status(200).send({ data, msg });
}

function notFound(res) {
    return res.status(404).json({ message: "User not found" });
}

module.exports = {
    successResponse, notFound
}
// export default successResponse;