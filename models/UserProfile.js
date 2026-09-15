const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const UserProfile = sequelize.define('UserProfile', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_identificacion: {
    type: DataTypes.STRING,
    allowNull: false
  },

  birthdate: {
    type: DataTypes.DATE,
    allowNull: true
  },

  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true
  },
 
  phone: {
    type: DataTypes.STRING(15),
    allowNull: true
  },

  address: {
    type: DataTypes.STRING,
    allowNull: true
  },

  gender: {
    type: DataTypes.ENUM('masculino', 'femenino', 'otro'),
    allowNull: true
  },
  profile_picture: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  language_preference: {
    type: DataTypes.STRING,
    defaultValue: 'es'
  },
  notifications_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

User.hasOne(UserProfile, {
  foreignKey: 'user_identificacion',
  sourceKey: 'identificacion',
  onDelete: 'CASCADE'
});

UserProfile.belongsTo(User, {
  foreignKey: 'user_identificacion',
  targetKey: 'identificacion'
});

module.exports = UserProfile;