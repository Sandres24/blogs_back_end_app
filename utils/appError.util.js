// No controla los errores de terceros, como por ejemplo, errores de Sequelize
// AppError lo usaremos para controlar errores que sabemos, ocurriran en nuestra aplicación
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.message = message;
    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith('5') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { AppError };
