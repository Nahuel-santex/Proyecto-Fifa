const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Player = sequelize.define('Player', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  long_name: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  club_name: { 
    type: DataTypes.STRING 
  },
  player_positions: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  overall: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nationality_name: { 
    type: DataTypes.STRING 
  },

  pace: { type: DataTypes.INTEGER },
  shooting: { type: DataTypes.INTEGER },
  passing: { type: DataTypes.INTEGER },
  dribbling: { type: DataTypes.INTEGER },
  defending: { type: DataTypes.INTEGER },
  physic: { type: DataTypes.INTEGER }

}, {
  tableName: 'players', 
  timestamps: false 
});

module.exports = Player;