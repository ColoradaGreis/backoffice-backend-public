const { DataTypes } = require('sequelize')
module.exports = (sequelize) => {
  const notification = sequelize.define('notification', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    raw: {
      type: DataTypes.JSONB,
      allowNull: true,
      unique: false,
      set (value) {
        try {
          this.setDataValue('raw', JSON.parse(value))
        } catch (e) {
          this.setDataValue('raw', value)
        }
      }
    },
    source: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
      validate: {
        len: [0, 255]
      }
    },
    type: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 255]
      }
    }
  }, {
    schema: 'public',
    freezeTableName: true,
    timestamps: true,
    tableName: 'notification',
    defaultScope: {
      attributes: {
        exclude: ['updatedAt', 'deletedAt']
      }
    }
  })
  return notification
}
