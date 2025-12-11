const Post = require('../models/post.model');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

//
const formatMongoQuery = (query) => {
    const mongoQuery = {};

    for (const [key, value] of Object.entries(query)) {
        const match = key.match(/^(.+)\[(gte|gt|lte|lt)\]$/);
        if (match) {
            const [, field, op] = match;
            mongoQuery[field] = {
                ...mongoQuery[field],
                [`$${op}`]: isNaN(value) ? value : Number(value),
            };
        } else {
            mongoQuery[key] = isNaN(value) ? value : Number(value);
        }
    }

    return mongoQuery;
};

// get all posts
const getPosts = async (req, res) => {
    const { sort, tags, ...filters } = req.query;
    const mongoQuery = formatMongoQuery(filters);

    if (tags) {
        mongoQuery.tags = { $all: tags.split(',') };
    }

    const posts = await Post.find(mongoQuery).sort(sort);

    res.status(200).json({
        status: 'success',
        size: posts.length,
        data: { posts },
    });
};

// Get By id
const getPost = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const findPost = await Post.findById(id);

    if (!findPost) {
        return next(new AppError('Post Not Found', 404));
    }
    // return post
    return res.json(findPost);
});

// add Post
const addPost = catchAsync(async (req, res) => {
    const user = req.user;

    const {
        title,
        author,
        content,
        likesCount,
        tags,
        profileImage,
        discription,
    } = req.body;
    const { file } = req;

    const newPost = await Post.create({
        title,
        author,
        content,
        discription,
        likesCount,
        profileImage,
        fullname: user.fullname,
        userId: user._id,
        tags,
        postImg: file ? file.filename : null,
    });

    res.status(201).json({ status: 'success', data: { post: newPost } });
});

// delete post
const deletePost = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const post = await Post.findByIdAndDelete(id);

    if (!post) {
        return next(new AppError('Post not found', 404));
    }

    if (req.user._id.toString() != post.userId) {
        return next(new AppError('you do not have persmisson'));
    }

    return res.status(204).send('Deleted Sucsesfully');
});

// change post info
const updatePost = catchAsync(async (req, res, next) => {
    const { title, content } = req.body;
    const id = req.params.id;
    const post = await Post.findById(id);

    if (!post) {
        return next(new AppError('Cannot change post info', 404));
    }

    if (title) post.title = title;
    if (content) post.content = content;

    await post.save();

    res.status(200).json({
        status: 'success',
        data: {
            post,
        },
    });
});

module.exports = {
    getPosts,
    getPost,
    addPost,
    deletePost,
    updatePost,
};
