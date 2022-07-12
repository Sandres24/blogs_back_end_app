const path = require('path');

// Models
const { Post } = require('../models/post.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');

const renderIndex = catchAsync(async (req, res, next) => {
  // sendFile envía un archivo
  // Absolute path = G:\Academlo\Material de clase\3 - Desarrollo backend con Node y Express\Semana 3 (17) - Postgresql\Proyectos\27junio\public\index.html
  // Relative path '../public/index.html'

  const posts = await Post.findAll();

  res.status(200).render('index', {
    title: 'Rendered with pug',
    posts: [],
  });

  // Serve html
  // const indexPath = path.join(__dirname, '../public/index.html');

  // res.status(200).sendFile(indexPath);
});

module.exports = { renderIndex };
