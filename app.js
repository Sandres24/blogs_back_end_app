const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

// Routers
const { usersRouter } = require('./routes/users.routes');
const { postsRouter } = require('./routes/posts.routes');
const { commentRouter } = require('./routes/comments.routes');
const { viewsRouter } = require('./routes/views.routes');

// Global err controller
const { globalErrorHandler } = require('./controllers/error.controller');

// Utils
const { AppError } = require('./utils/appError.util');

// Init express app
const app = express();

// middlewares
// Enable incoming JSON
app.use(express.json());

// Set template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files G:\Academlo\Material de clase\3 - Desarrollo backend con Node y Express\Semana 3 (17) - Postgresql\Proyectos\27junio\app.js\public
app.use(express.static(path.join(__dirname, 'public')));

// Limit the number of requests that can be accepted to our sever
const limiter = rateLimit({
  max: 10000, // Máximo acepta 5 peticioines
  windowMs: 1 * 60 * 1000, // El tiempo durante el cual no aceptara peticiones (1 minuto en este caso)
  message: 'Number of requests have been exceeded',
});

app.use(limiter);

// Add security headers
app.use(helmet());

// Compress responses
app.use(compression());

// Log incoming requests
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Define endpoints
app.use('/', viewsRouter);
// http://localhost:4000/api/v1/users
app.use('/api/v1/users', usersRouter); // next(error)
// http://localhost:4000/api/v1/posts
app.use('/api/v1/posts', postsRouter);

// 1. Create comments router
// 2. Create comments controller
// 2.1 Create CRUD functions in controller
// 2.2 Use catchAsync
// 2.3 Create middleware to check if comment exist by id, if not, send error with AppError
// http://localhost:4000/api/v1/comments
app.use('/api/v1/comments', commentRouter);

// Handle incoming unknown routes to the server
// En caso de que ninguno de los Routers pudiese manejar el error, por ejemplo, que la ruta no existe
// (http://localhost:4000/dashboard)
app.all('*', (req, res, next) => {
  next(new AppError(`${req.method} ${req.originalUrl} not found in this server`, 404));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = { app };
