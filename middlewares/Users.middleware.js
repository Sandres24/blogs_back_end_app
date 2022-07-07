// Models
const { User } = require('../models/user.model');

// Utils
const { AppError } = require('../utils/appError.util');
const { catchAsync } = require('../utils/catchAsync.util');

const userExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({ where: { id } });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Creando/adjuntando una nueva propiedad a la request, para poder tener acceso a esta información
  // en middlewares o funciones posteriores a este middleware(userExists)
  req.user = user;

  next();
});

module.exports = { userExists };
