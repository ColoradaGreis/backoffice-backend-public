const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const redis = sequelize.define('redis', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    redisKey: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    prices: {
      type: DataTypes.JSON,
      allowNull: false
    }
  },
  {
    schema: 'public',
    freezeTableName: true,
    timestamps: true,
    tableName: 'redis',
    paranoid: true,
    defaultScope: {
      attributes: {
        exclude: ['updatedAt', 'deletedAt']
      }
    }
  })
  return redis
}
