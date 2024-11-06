const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const thirdCategory = sequelize.define('third_category', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      get () {
        return this.getDataValue('name')
      },
      set (value) {
        this.setDataValue('name', value.toLowerCase().trim())
      },
      validate: {
        len: [0, 255]
      }
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    schema: 'public',
    freezeTableName: true,
    timestamps: true,
    tableName: 'third_category',
    paranoid: true,
    defaultScope: {
      attributes: {
        exclude: ['updatedAt', 'deletedAt']
      }
    }
  })
  thirdCategory.associate = (models) => {
    models.third_category.belongsTo(models.second_category, {
      foreignKey: 'second_category_id'
    })
  }
  return thirdCategory
}
