// Models
const { Comment } = require('../models/comment.model');
const { User } = require('../models/user.model');
const { Post } = require('../models/post.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');

const getAllComments = catchAsync(async (req, res, next) => {
  const comments = await Comment.findAll({
    attributes: ['id', 'comment'],
    include: [
      { model: User, attributes: ['id', 'name', 'email'] },
      {
        model: Post,
        attributes: ['id', 'title', 'content'],
        include: { model: User, attributes: ['id', 'name', 'email'] },
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    comments,
  });
});

const createComment = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { postId, comment } = req.body;

  const newComment = await Comment.create({
    postId,
    userId: sessionUser.id,
    comment,
  });

  res.status(201).json({
    status: 'success',
    newComment,
  });
});

const getCommentById = catchAsync(async (req, res, next) => {
  const comment = req.comment;

  res.status(200).json({
    status: 'success',
    comment,
  });
});

const updateComment = catchAsync(async (req, res, next) => {
  const reqComment = req.comment;
  const { comment } = req.body;

  await reqComment.update({
    comment,
  });

  res.status(204).json({
    status: 'success',
  });
});

const deleteComment = catchAsync(async (req, res, next) => {
  const reqComment = req.comment;

  await reqComment.update({
    status: 'deleted',
  });

  res.status(204).json({
    status: 'success',
  });
});

module.exports = { getAllComments, createComment, getCommentById, updateComment, deleteComment };
