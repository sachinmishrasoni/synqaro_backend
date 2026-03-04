class AppSuccess {
    constructor(message, statusCode = 200) {
        this.message = message;
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "success";
        this.isOperational = true;
    }
}