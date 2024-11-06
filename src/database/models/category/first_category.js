const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const firstCategory = sequelize.define('first_category', {
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
    tableName: 'first_category',
    paranoid: true,
    defaultScope: {
      attributes: {
        exclude: ['updatedAt', 'deletedAt']
      }
    }
  })
  firstCategory.associate = (models) => {
    models.first_category.hasMany(models.second_category, {
      foreignKey: 'first_category_id'
    })
  }

  return firstCategory
}
