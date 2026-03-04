export const sendResponse = (res, {
    statusCode = 200, message = "Success", data = null, meta = null
}) => {
    const response = {
        success: true,
        message,
        data,
    }

    if (meta) {
        response.meta = meta;
    }

    res.status(statusCode).json(response);
};