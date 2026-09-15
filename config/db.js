const { Sequelize } = require('sequelize'); // Importar Sequelize

const sequelize = new Sequelize('login_db', 'root', '', { // Crear una nueva instancia de Sequelize
  host: 'localhost', // Host de la base de datos
  port: 3308, // Puerto de la base de datos, por defecto es 3306 para MySQL
  dialect: 'mysql', // Dialecto de la base de datos, es decir, el tipo de base de datos que se está utilizando
  logging: false, //  Esto desactiva los logs para evitar que se muestren en la consola los queries SQL
  
});

module.exports = sequelize; // Exportar la instancia de Sequelize para que pueda ser utilizada en otros archivos
