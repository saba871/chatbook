const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email');
require('dotenv').config();

// create jwt  =>  json web token

const signToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES || '1d',
    });
};

// create and send cookie
const createSendCookie = (user, statusCode, res) => {
    const token = signToken(user._id, user.role);

    const cookiesOptions = {
        maxAge: Number(process.env.COOKIE_EXPIRES || 7) * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax', // Dev: 'lax' ან 'strict'
        secure: false, // Dev: false, Production: true
    };

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Dev-ში false
        sameSite: 'lax',
    });
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: { user },
    });
};

// registration
const registar = catchAsync(async (req, res, next) => {
    const { fullname, email, password } = req.body;

    const user = await User.create({ fullname, email, password });

    // varification code
    const code = user.createVerificationCode();
    await user.save({ validateBeforeSave: false });

    const url = `${req.protocol}://${req.get('host')}/api/auth/verify/${code}`;
    const html = `
    <div style="
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        padding: 30px;
    ">
        <div style="
            max-width: 500px;
            margin: 0 auto;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        ">
            <div style="
                background-color: #1a73e8;
                color: white;
                text-align: center;
                padding: 20px;
            ">
                <h1>Welcome to Chatbook</h1>
            </div>

            <div style="padding: 20px; text-align: center;">
                <p style="font-size: 16px; color: #333;">
                    Hi <b>${fullname}</b>, thank you for joining Chatbook!
                </p>
                <p style="font-size: 15px; color: #555;">
                    To verify your account, please click the button below:
                </p>
                <a href="${url}" style="
                    display: inline-block;
                    margin-top: 20px;
                    background-color: #1a73e8;
                    color: white;
                    padding: 12px 25px;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: bold;
                ">
                    Verify Account
                </a>
                <p style="margin-top: 25px; font-size: 13px; color: #999;">
                    If the button doesn’t work, copy and paste this link into your browser:
                </p>
                <p style="word-wrap: break-word; color: #1a73e8;">
                    ${url}
                </p>
            </div>
        </div>
    </div>
    `;

    await sendEmail(email, 'Verify your Chatbook account', html);

    res.status(201).json({
        status: 'success',
        message: 'User created! Please verify your email.',
    });
});

// log in
const logIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new AppError('Email or Password is incorrect!', 401));
    }

    if (!user.isVarified) {
        return next(new AppError('Please verify your email first!', 401));
    }

    const isCorrect = await user.comparePassword(password, user.password);

    if (!isCorrect) {
        return next(new AppError('Email or Password is incorrect!', 401));
    }

    createSendCookie(user, 200, res);
});

// auto login
const autoLogin = (req, res) => {
    const user = req.user;

    user.password = undefined;

    return res.status(200).json({
        status: 'success',
        data: { user },
    });
};

// log out

const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'dev' ? false : true,
        sameSite: 'Lax',
    });
    return res.status(200).json({ message: 'Logged out succsessfully' });
};

// varifictaion email
const varifyEmail = catchAsync(async (req, res, next) => {
    const { code } = req.params;

    const user = await User.findOne({ verificationCode: code });

    if (!user) {
        return next(new AppError('Verification code is invalid', 400));
    }

    user.isVarified = true;
    user.verificationCode = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).send('<h1>Email verified successfully!</h1>');
});

module.exports = {
    registar,
    logIn,
    varifyEmail,
    autoLogin,
    logout,
};
