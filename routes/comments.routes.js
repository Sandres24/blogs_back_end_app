const express = require('express');

// Controllers
const {
  getAllComments,
  createComment,
  getCommentById,
  updateComment,
  deleteComment,
} = require('../controllers/comments.controller');

// Middlewares
const { commentExists } = require('../middlewares/Comments.middleware');
const { protectSession } = require('../middlewares/auth.middleware');

const commentRouter = express.Router();

commentRouter.use(protectSession);

commentRouter.get('/', getAllComments);

commentRouter.post('/', createComment);

commentRouter.get('/:id', commentExists, getCommentById);

commentRouter.patch('/:id', commentExists, updateComment);

commentRouter.delete('/:id', commentExists, deleteComment);

module.exports = { commentRouter };
