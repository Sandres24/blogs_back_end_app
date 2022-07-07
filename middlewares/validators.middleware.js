const { body, validationResult } = require('express-validator');

const { AppError } = require('../utils/appError.util');

const checkResult = (req, res, next) => {
  const errors = validationResult(req);

  // console.log(errors);

  if (!errors.isEmpty()) {
    // Array has errors
    // errors.array(); // Retorna el arreglo de errores [{ value, msg, param, location}, { value, msg, param, location}, ...]
    // Step 1: Loop through array of errors
    // Step 2: Get all error msg's [msg, msg, msg]
    // Step 3: Combine (join), all strings in the array
    // Step 4: Send the combined msg in the response

    const message = errors
      .array()
      .map((error) => error.msg)
      .join(', ');

    // console.log(message);

    // Pregunta por el siguiente middleware que pueda procesar el error que se envía, en este caso sería el
    // global error handler
    return next(new AppError(message, 400));
  }

  next();
};

const createUserValidators = [
  body('name').notEmpty().withMessage('Name cannot be empty'),
  body('age').isNumeric().withMessage('Age must be a number'),
  body('email').isEmail().withMessage('Must provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .isAlphanumeric()
    /* .matches(/\d/) */
    .withMessage('Password must contain letters and numbers'),
  checkResult,
];

module.exports = { createUserValidators };
