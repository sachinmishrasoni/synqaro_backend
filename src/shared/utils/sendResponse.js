export const sendResponse = (res, {
    statusCode = 200, message = "Success", data = null, meta = null, ...extra
}) => {
    const response = {
        success: true,
        message,
        data,
        ...extra
    }

    if (meta) {
        response.meta = meta;
    }

    res.status(statusCode).json(response);
};