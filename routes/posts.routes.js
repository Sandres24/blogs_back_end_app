const express = require('express');

// Controllers
const {
  getAllPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
} = require('../controllers/posts.controller');

// Middlewares
const { protectSession } = require('../middlewares/auth.middleware');

const postsRouter = express.Router();

postsRouter.use(protectSession);

postsRouter.get('/', getAllPosts);

postsRouter.post('/', createPost);

postsRouter.get('/:id', getPostById);

postsRouter.patch('/:id', updatePost);

postsRouter.delete('/:id', deletePost);

module.exports = { postsRouter };
