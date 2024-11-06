const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const external_notification = sequelize.define('external_notification', {  //eslint-disable-line
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 255]
      }
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 255]
      }
    }

  },
  {
    schema: 'public',
    freezeTableName: true,
    timestamps: true,
    tableName: 'external_notification'
  })
  external_notification.associate = (models) => { //eslint-disable-line
    external_notification.belongsToMany(models.app_user, { //eslint-disable-line
      through: models.read_notifications,
      foreignKey: 'external_notification_id'
    })
  }
  return external_notification //eslint-disable-line
}
