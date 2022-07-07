const express = require('express');

// Controllers
const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  login,
} = require('../controllers/users.controller');

// Middlewares
const { createUserValidators } = require('../middlewares/validators.middleware');
const { userExists } = require('../middlewares/Users.middleware');
const { protectSession, protectUserAccount } = require('../middlewares/auth.middleware');

const usersRouter = express.Router();

usersRouter.post('/', createUserValidators, createUser);

usersRouter.post('/login', login);

// Aplica el middleware en todos los endpoints que estén debajo del Router
usersRouter.use(protectSession);

usersRouter.get('/', getAllUsers);

// route permite agrupar endpoints que comparten la misma ruta
// Se tiene acceso a .use() antes de route(), no después, y ese middleware se aplica para todas las rutas
usersRouter
  .use('/:id', userExists)
  .route('/:id')
  .get(getUserById)
  .patch(protectUserAccount, updateUser)
  .delete(protectUserAccount, deleteUser);

// Se le indica al middleware userExists que espere recibir un parametro
/* usersRouter.use('/:id', userExists);

usersRouter.get('/:id', getUserById);

usersRouter.patch('/:id', updateUser);

usersRouter.delete('/:id', deleteUser); */

module.exports = { usersRouter };
