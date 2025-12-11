const express = require('express');
const {
    getPosts,
    addPost,
    getPost,
    deletePost,
    updatePost,
} = require('../controllers/post.controller');
const { protect, allowedto } = require('../middleware/auth.middleware');
const upload = require('../utils/uploadImage');
const postRouter = express.Router();

// get all posts
postRouter.get('/', getPosts);
// get post by ID
postRouter.get('/:id', getPost);
// create post
postRouter.post('/', protect, upload.single('postImg'), addPost); //
// delete post
postRouter.delete('/:id', protect, deletePost);
// update post
postRouter.patch('/:id', protect, updatePost);

module.exports = postRouter;
