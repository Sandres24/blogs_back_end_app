const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { User } = require('../models/user.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

dotenv.config({ path: './config.env' });

const protectSession = catchAsync(async (req, res, next) => {
  // req.headers contiene los headers que vienen en la petición
  //console.log(req.headers);

  let token = null;

  // Extract the token from headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // 1. Bearer token
    // 2. [Bearer, token]
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    // 403, no se permite el acceso por no tener un token
    return next(new AppError('Invalid token', 403));
  }

  // Ask JWT (library), if the token is still valid
  // 1. Verifica si la firma del token coincide
  // 2. Verifica si el token aún es valido, es decir, si no ha expirado el token
  // decoded sera el payload (objeto que se le indica al método jwt.sign({ payload }, signature, expiresIn))
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // Check in db that user still exists
  const user = await User.findOne({
    where: { id: decoded.id, status: 'active' },
  });

  if (!user) {
    return next(new AppError('The owner of this token does not exist anymore', 403));
  }

  // Grant access
  req.sessionUser = user;
  next();
});

// Create a middleware that:
// 1. Get the session user's id
// 2. Validate tha the user that is being updated/deleted is the same as the session user
// 3. If the id's do not match, return error (403)
// 4. Apply middleware only in PATCH and DELETE endpoints
const protectUserAccount = (req, res, next) => {
  const { sessionUser, user } = req;

  if (sessionUser.id !== user.id) {
    return next(new AppError('You do not own this account.', 403));
  }

  next();
};

module.exports = { protectSession, protectUserAccount };
