// Model
const { Post } = require('../models/post.model');
const { Comment } = require('../models/comment.model');
const { User } = require('../models/user.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');

// Include user (post's author)
// Include comment
// Include user (comment's author)
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: ['id', 'title', 'content'],
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        {
          model: Comment,
          attributes: ['id', 'comment'],
          include: { model: User, attributes: ['id', 'name', 'email'] },
        },
      ],
    });

    res.status(200).json({
      status: 'success',
      posts,
    });
  } catch (err) {
    console.log(err);
  }
};

const createPost = catchAsync(async (req, res) => {
  const { sessionUser } = req;
  const { title, content } = req.body;

  const newPost = await Post.create({
    title,
    content,
    userId: sessionUser.id,
  });

  res.status(201).json({ status: 'success', newPost });
});

const getPostById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const post = await Post.findOne({ where: { id } });

  if (!post) {
    return res.status(404).json({
      status: 'error',
      message: 'Post not found',
    });
  }

  res.status(200).json({
    status: 'success',
    post,
  });
});

const updatePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { title, content, userId } = req.body;

  const post = await Post.findOne({ where: { id } });

  if (!post) {
    return res.status(404).json({
      status: 'error',
      message: 'Post not found',
    });
  }

  await post.update({ title, content, userId });

  res.status(204).json({ status: 'success' });
});

const deletePost = catchAsync(async (req, res) => {
  const { id } = req.params;

  const post = await Post.findOne({ where: { id } });

  if (!post) {
    return res.status(404).json({
      status: 'error',
      message: 'Post not found',
    });
  }

  await post.update({ status: 'deleted' });

  res.status(204).json({ status: 'success' });
});

module.exports = { getAllPosts, createPost, getPostById, updatePost, deletePost };
