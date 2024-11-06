const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const product = sequelize.define('product', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    ean: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true,
      validate: {
        len: [0, 255]
      }
    },
    sku_sap: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      unique: false,
      allowNull: true

    },
    sku_vtex: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      unique: false,
      allowNull: true

    },
    short_name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: false,
      set (value) {
        const formattedLongName = value.toLowerCase().trim()
        this.setDataValue('short_name', formattedLongName)
      },
      validate: {
        len: [0, 255]
      }
    },
    long_name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: false,
      set (value) {
        const formattedLongName = value.toLowerCase().trim()
        this.setDataValue('long_name', formattedLongName)
      },
      validate: {
        len: [0, 255]
      }
    },
    measure_unit: {
      type: DataTypes.TEXT,
      allowNull: false,
      isIn: {
        args: [['gr', 'ml', 'un', 'kg', 'lt']]
      }
    },
    content_detail: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    content: {
      type: DataTypes.VIRTUAL,
      get () {
        return this.content_detail + this.measure_unit
      },
      set (value) {
        throw new Error('Do not try to set the `content` value!')
      }
    },
    brand: {
      type: DataTypes.TEXT,
      allowNull: true,
      set (value) {
        this.setDataValue('brand', value.toLowerCase().trim())
      },
      validate: {
        len: [0, 255]
      }
    },
    proxy_duration: {
      type: DataTypes.TEXT,
      allowNull: true,
      isIn: {
        args: [['corta', 'media', 'no perecible']]
      },
      validate: {
        len: [0, 255]
      }
    },
    pack: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true
    },
    generated_ean: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    autoshoppable_available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    schema: 'public',
    freezeTableName: true,
    timestamps: true,
    tableName: 'product',
    paranoid: true,
    defaultScope: {
      attributes: {
        exclude: ['updatedAt', 'deletedAt']
      }
    },
    hooks: {
      beforeCreate: function (instance) {
        if (typeof instance.brand === 'string') {
          instance.brand = instance.brand.toLowerCase().trim()
        }
      },
      beforeFind: (options) => {
        if (options.where && options.where.ean) {
          // Convert ean to string before querying
          options.where.ean = String(options.where.ean)
        }
      }

    }
  })

  product.associate = (models) => {
    // console.log(models)
    models.product.belongsTo(models.first_category, {
      foreignKey: 'first_category',
      as: 'firstCategory',
      allowNull: true
    })

    models.product.belongsTo(models.second_category, {
      foreignKey: 'second_category',
      as: 'secondCategory',
      allowNull: true
    })

    models.product.belongsTo(models.third_category, {
      foreignKey: 'third_category',
      as: 'thirdCategory',
      allowNull: true
    })
  }

  return product
}
