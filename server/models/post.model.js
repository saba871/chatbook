const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    userId: {
        type: String,
    },

    fullname: {
        type: String,
    },

    profileImage: {
        type: String,
    },

    title: {
        type: String,
    },

    content: {
        type: String,
    },

    author: {
        type: String,
    },

    discription: {
        type: String,
    },

    likesCount: {
        type: Number,
        default: 0,
    },

    tags: [String],
});
postSchema.index({ author: 1, likesCount: -1 });
module.exports = mongoose.model('posts', postSchema);
