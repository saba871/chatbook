const express = require('express');
const {
    getPosts,
    addPost,
    getPost,
    deletePost,
    updatePost,
} = require('../controllers/post.controller');
const { protect, allowedto } = require('../middleware/auth.middleware');
const postRouter = express.Router();

// get all posts
postRouter.get('/', getPosts);
// get post by ID
postRouter.get('/:id', getPost);
// create post
postRouter.post('/', addPost); //
// delete post
postRouter.delete('/:id', deletePost);
// update post
postRouter.patch('/:id', updatePost);

module.exports = postRouter;
