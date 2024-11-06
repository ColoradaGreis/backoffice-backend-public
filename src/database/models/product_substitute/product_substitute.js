const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const substitute = sequelize.define('product_substitute', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    original_product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'product',
        key: 'id'
      }
    },
    replacement_product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'product',
        key: 'id'
      }
    },
    assignment_order: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'public',
    freezeTableName: true,
    timestamps: true,
    tableName: 'product_substitute',
    paranoid: true,
    defaultScope: {
      attributes: {
        exclude: ['updatedAt', 'deletedAt']
      }
    },
    indexes: [
      {
        unique: true,
        fields: ['original_product_id', 'replacement_product_id'], // Define una restricción única para ambas columnas
        name: 'replacement_product_unique'
      }
    ]
  })

  substitute.associate = (models) => {
    // console.log(models, 'models')
    models.product_substitute.belongsTo(models.product, { foreignKey: 'original_product_id', as: 'originalProduct' })
    models.product_substitute.belongsTo(models.product, { foreignKey: 'replacement_product_id', as: 'replacementProduct' })
  }

  return substitute
}
