const { app } = require('./app');

// Models
const { User } = require('./models/user.model');
const { Post } = require('./models/post.model');
const { Comment } = require('./models/comment.model');

// Utils
const { db } = require('./utils/database.util');

db.authenticate()
  .then(() => console.log('Db authenticated'))
  .catch((err) => console.log(err));

// Establish model's relations
// Se debe establecer las relaciones antes de sincronizar la base de datos
// Un usuario puede tener muchos post 1 User <----> M Post
User.hasMany(Post, { foreignKey: 'userId' });
// Un post pertenece a un usuario
Post.belongsTo(User);
// 1 User <----> M Comment
User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User);

// 1 Post <----> M Comment
Post.hasMany(Comment, { foreignKey: 'postId' });
Comment.belongsTo(Post);

// sync() sincroniza los modelos, es decir, sync buscará todos los modelos definidos y si
// el modelo no ha sido creado en la base de datos, es decir, si la tabla no ha sido creada en
// la base de datos, entonces creará la tabla
db.sync()
  .then(() => console.log('Db sync'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log('Express app running!!');
});
