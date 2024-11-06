const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const productStockOperation = sequelize.define('product_stock_operation', {
    product_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    external_id: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: false
    },
    name: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: false
    },
    stock_before: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false,
      defaultValue: 0
    },
    stock_after: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false,
      defaultValue: 0
    },
    image_url: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true
    }
  }, {
    schema: 'public',
    freezeTableName: true,
    timestamps: true,
    tableName: 'product_stock_operation'
  })

  productStockOperation.associate = (models) => {
    productStockOperation.belongsTo(models.stock_operation, {
      as: 'stock_operation',
      foreignKey: {
        name: 'transaction_id',
        allowNull: false
      }
    })
  }

  return productStockOperation
}
