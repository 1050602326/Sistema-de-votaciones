const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Eleccion = require('./Eleccion');
const Candidatura = require('./Candidatura');

const Voto = sequelize.define('Voto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
User.hasMany(Voto, { foreignKey: 'userId', onDelete: 'CASCADE' });
Voto.belongsTo(User, { foreignKey: 'userId' });

Eleccion.hasMany(Voto, { foreignKey: 'eleccionId', onDelete: 'CASCADE' });
Voto.belongsTo(Eleccion, { foreignKey: 'eleccionId' });

Candidatura.hasMany(Voto, { foreignKey: 'candidaturaId', onDelete: 'CASCADE' });
Voto.belongsTo(Candidatura, { foreignKey: 'candidaturaId' });

module.exports = Voto;
