const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const stockOperation = sequelize.define('stock_operation', {
    transaction_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    external_transaction_id: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false
    },
    store_id: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: false
    },
    start_timestamp: {
      type: DataTypes.DATE,
      unique: false,
      allowNull: false
    },
    end_timestamp: {
      type: DataTypes.DATE,
      unique: false,
      allowNull: true
    },
    start_image_url: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
      validate: {
        len: [0, 255]
      }
    },
    end_image_url: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
      validate: {
        len: [0, 255]
      }
    },
    comments: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
      validate: {
        len: [0, 255]
      }
    }
  }, {
    schema: 'public',
    freezeTableName: true,
    timestamps: true,
    tableName: 'stock_operation'
  })

  stockOperation.associate = (models) => {
    stockOperation.hasMany(models.product_stock_operation, {
      as: 'product_stock_operation',
      foreignKey: {
        name: 'transaction_id',
        allowNull: false
      }
    })
  }

  return stockOperation
}
