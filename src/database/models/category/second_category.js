const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const secondCategory = sequelize.define('second_category', {
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
    tableName: 'second_category',
    paranoid: true,
    defaultScope: {
      attributes: {
        exclude: ['updatedAt', 'deletedAt']
      }
    }
  })
  secondCategory.associate = (models) => {
    models.second_category.belongsTo(models.first_category, {
      foreignKey: 'first_category_id'
    })
    models.second_category.hasMany(models.third_category, {
      foreignKey: 'second_category_id'
    })
  }
  return secondCategory
}
