const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Eleccion = sequelize.define('Eleccion', {
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tipo_representacion: {
    type: DataTypes.ENUM('facultad', 'semestre', 'comite'),
    allowNull: false
  },
  fecha_inicio: {
    type: DataTypes.DATE,
    allowNull: false
  },
  fecha_fin: {
    type: DataTypes.DATE,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('activa', 'finalizada', 'programada'),
    defaultValue: 'programada'
  }
});

module.exports = Eleccion;
