const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    const read_notifications = sequelize.define('read_notifications', {  //eslint-disable-line
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    app_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true
      }
    },
    external_notification_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true
      }
    }
  },
  {
    schema: 'public',
    freezeTableName: true,
    timestamps: true,
    tableName: 'read_notifications'
  })
    read_notifications.associate = (models) => { //eslint-disable-line
    read_notifications.belongsTo(models.external_notification, { //eslint-disable-line
      foreignKey: 'external_notification_id'
    })
    read_notifications.belongsTo(models.app_user, { //eslint-disable-line
      foreignKey: 'app_user_id'
    })
  }
    return read_notifications //eslint-disable-line
}
