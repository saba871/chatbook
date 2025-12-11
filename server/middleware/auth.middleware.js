const User = require('../models/user.model');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');

const allowedto = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission'), 401);
        }

        next();
    };
};

const protect = catchAsync(async (req, res, next) => {
    let token;

    // Cookie or Header
    if (req.cookies?.token) token = req.cookies.token;
    else if (req.headers.authorization?.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1];

    if (!token) return next(new AppError('You are not logged in', 401));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return next(new AppError('Invalid token', 401));

    const user = await User.findById(decoded.id);
    if (!user) return next(new AppError('User not found', 404));

    req.user = user; // attach user
    next();
});

module.exports = { protect, allowedto };
