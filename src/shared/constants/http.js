export const HTTP = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,

    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,

    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
};

export const HTTP_META = {
    [HTTP.OK]: {
        status: "OK",
        message: "Request successful",
    },

    [HTTP.CREATED]: {
        status: "CREATED",
        message: "Resource created successfully",
    },

    [HTTP.NO_CONTENT]: {
        status: "NO_CONTENT",
        message: "No content",
    },

    [HTTP.BAD_REQUEST]: {
        status: "BAD_REQUEST",
        message: "Bad request",
    },

    [HTTP.UNAUTHORIZED]: {
        status: "UNAUTHORIZED",
        message: "Unauthorized",
    },

    [HTTP.FORBIDDEN]: {
        status: "FORBIDDEN",
        message: "Forbidden",
    },

    [HTTP.NOT_FOUND]: {
        status: "NOT_FOUND",
        message: "Resource not found",
    },

    [HTTP.CONFLICT]: {
        status: "CONFLICT",
        message: "Conflict",
    },

    [HTTP.UNPROCESSABLE_ENTITY]: {
        status: "UNPROCESSABLE_ENTITY",
        message: "Unprocessable entity",
    },

    [HTTP.INTERNAL_SERVER_ERROR]: {
        status: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
    },

    [HTTP.SERVICE_UNAVAILABLE]: {
        status: "SERVICE_UNAVAILABLE",
        message: "Service unavailable",
    },
};

export const getHttpMeta = (statusCode) => {
    return (
        HTTP_META[statusCode] ||
        HTTP_META[HTTP.INTERNAL_SERVER_ERROR]
    );
};
