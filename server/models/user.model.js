const mongoose = require('mongoose');
const bcrybt = require('bcrypt');
const crypto = require('crypto');

// user model in database
const userSchema = new mongoose.Schema({
    userId: {
        type: String,
    },

    fullname: {
        type: String,
        required: [true],
    },

    email: {
        type: String,
        required: [true, 'email is required'],
        unique: [true, 'email must be unique'],
    },

    password: {
        type: String,
        required: [true],
    },

    photo: String,

    isVarified: {
        type: Boolean,
        default: false,
    },

    verificationCode: String,

    role: {
        type: String,
        enum: ['admin', 'user', 'moderator'],
        default: 'user',
    },
});

// password hashing
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrybt.hash(this.password, 12);
    next();
});

// password cheking
userSchema.methods.comparePassword = async (candidate, password) => {
    return await bcrybt.compare(candidate, password);
};

userSchema.methods.createVerificationCode = function () {
    const code = crypto.randomBytes(12).toString('hex');
    this.verificationCode = code;
    return code;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
