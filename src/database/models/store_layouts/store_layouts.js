const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const storeLayouts = sequelize.define('store_layouts', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    store_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    layout_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    change_position: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_transition: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    transition_stage: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    products_id: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    schema: 'public',
    freezeTableName: true,
    timestamps: true,
    tableName: 'store_layouts',
    paranoid: true,
    defaultScope: {
      attributes: {
        exclude: ['updatedAt', 'deletedAt']
      }
    }
  })

  return storeLayouts
}
