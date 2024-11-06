const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const criticalQuantityThreshold = sequelize.define('critical_quantity_threshold', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    store_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    minimum_stock_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false
    }
  }, {
    schema: 'public',
    freezeTableName: true,
    timestamps: true,
    tableName: 'critical_quantity_threshold',
    paranoid: true,
    defaultScope: {
      attributes: {
        exclude: ['updatedAt', 'deletedAt']
      }
    }
    // indexes: [
    //   {
    //     unique: true,
    //     fields: ['store_id', 'product_id'], // Define una restricción única para ambas columnas
    //     name: 'store_product_unique'
    //   }
    // ]

  })

  return criticalQuantityThreshold
}
