class AppError extends Error {
    constructor(messsage, statusCode) {
        super(messsage);

        this.message = messsage;
        this.statusCode = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
