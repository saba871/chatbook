const sendErrorDev = (err, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        err: err.err,
    });
};

const sendErrorProd = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status, // fail / error
        message: 'Something went wrong', // ან უფრო დეტალური შეტყობინება
    });
};

// global error handler
const globalErrorHandle = (err, req, res, next) => {
    // უნდა დარწმუნდე, რომ statusCode ყოველთვის integer არის
    err.statusCode = Number(err.statusCode) || 500; // 500 - default
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        return sendErrorDev(err, res);
    } else {
        return sendErrorProd(err, res);
    }
};

module.exports = globalErrorHandle;
