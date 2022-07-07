// La idea es que catchAsync solo capture errores asincronos
// catchAsync debe retornar una función que es la que usará el Router como callback
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

module.exports = { catchAsync };
