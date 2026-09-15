const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Eleccion = require('./Eleccion');

const Candidatura = sequelize.define('Candidatura', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  propuesta: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['userId', 'eleccionId']
    }
  ]
});

// Relaciones
User.hasMany(Candidatura, { foreignKey: 'userId', onDelete: 'CASCADE' });
Candidatura.belongsTo(User, { foreignKey: 'userId' });

Eleccion.hasMany(Candidatura, { foreignKey: 'eleccionId', onDelete: 'CASCADE' });
Candidatura.belongsTo(Eleccion, { foreignKey: 'eleccionId' });

module.exports = Candidatura;
