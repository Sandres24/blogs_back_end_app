const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Model
const { User } = require('../models/user.model');
const { Post } = require('../models/post.model');
const { Comment } = require('../models/comment.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');
const { Email } = require('../utils/email.util');

// Gen secrets for JWT, require('crypto').randomBytes(64).toString('hex')

dotenv.config({ path: './config.env' });

// Include the comments made in the user's post
// Include the author (user) of each comment
const getAllUsers = catchAsync(async (req, res, next) => {
  // Process the request (return the list the users)

  // User.findAll().then(users => {}).catch(err => {});

  const users = await User.findAll({
    // Cuando traiga los usuarios, anexa los post que le pertenecen a cada usuario
    // Lo que sería el equivalente del JOIN
    include: [
      {
        model: Post,
        attributes: ['id', 'title', 'content'],
        include: { model: Comment, attributes: ['id', 'comment'] },
      },
      {
        model: Comment,
        attributes: ['id', 'comment'],
        include: { model: User, attributes: ['id', 'name', 'email'] },
      },
    ],
  });

  res.status(200).json({ status: 'success', users });
});

const createUser = catchAsync(async (req, res, next) => {
  const { name, age, email, password } = req.body;

  // Hash password
  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    age,
    email,
    password: hashPassword,
  });

  // Remove password from response
  // delete newUser.password;
  newUser.password = undefined;

  // Send wellcome email
  await new Email(email).sendWellcome(name);

  res.status(201).json({
    status: 'success',
    newUser,
  });
});

const getUserById = catchAsync(async (req, res, next) => {
  const { user } = req;

  res.status(200).json({
    status: 'success',
    user,
  });
});

// catchAsync retorna una función, por lo que express, le pasa req, res, next como parámetros a esa
// función retornada, en este caso, esa la función que se encarga de actualizar el usuario
const updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { name } = req.body;

  await user.update({ name }); // update() se aplica sobre el objeto que previamente se halló

  res.status(204).json({
    status: 'success',
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  // await user.destroy(); destroy() se aplica sobre el objeto que previamente se halló, sin embargo, eliminar como tal
  // la infomación de la base de datos, en su lugar, lo ideal es hacer un "soft delete"

  await user.update({ status: 'deleted' });

  res.status(204).json({
    status: 'success',
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate credentials (email)
  const user = await User.findOne({
    where: {
      email,
      status: 'active',
    },
  });

  if (!user) {
    return next(new AppError('Credentials invalid', 400));
  }

  // Validate password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return next(new AppError('Credentials invalid', 400));
  }

  // Generate JWT (JsonWebToken)
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

  // Send resonse
  res.status(200).json({
    status: 'success',
    token,
  });
});

module.exports = { getAllUsers, createUser, getUserById, updateUser, deleteUser, login };
