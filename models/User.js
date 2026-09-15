const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  identificacion: {
    type: DataTypes.STRING,
    allowNull: false
  },

  correo:{
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true // Validación para asegurar que el correo es un email válido
    }
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  edad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 18 // Validación para asegurar que la edad es al menos 18
    }
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'administrativo', 'candidato', 'votante'),
    allowNull: false
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['identificacion', 'role']
    }
  ]
});

module.exports = User;
