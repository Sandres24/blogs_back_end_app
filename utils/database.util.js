const { Sequelize, DataTypes } = require('sequelize');

require('dotenv').config({ path: './config.env' });

// Connect to database
const db = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST, // El servidor se encuentra en nuestra maquina por lo que sera localhost
  username: process.env.DB_USERNAME, // El usuario administrador por defecto de postgres es 'postgres'
  password: process.env.DB_PASSWORD, // La contraseña que se uso durante la instalación de postgres
  port: process.env.DB_PORT, // El puerto en donde se está ejecutando el servidor, por defecto es el 5432
  database: process.env.DB_DATABASE, // La base de datos a la cual se va a conectar
  logging: false, // Ya no imprimerá las consultas u otra información en la consola
  dialectOptions:
    process.env.NODE_ENV === 'production'
      ? {
          // Permite conexión al protocolo https (SSL connection)
          ssl: {
            required: true,
            rejectUnauthorized: false,
          },
        }
      : {},
});

module.exports = { db, DataTypes };
