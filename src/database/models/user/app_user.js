// app_user.js
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const AppUser = sequelize.define('app_user', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    sub: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      validate: {
        len: [0, 255]
      }
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: true,
      unique: false,
      validate: {
        isEmail: true,
        len: [0, 255]
      }
    },
    first_name: {
      type: DataTypes.TEXT,
      validate: {
        len: [0, 255]
      }
    },
    middle_name: {
      type: DataTypes.TEXT,
      validate: {
        len: [0, 255]
      }
    },
    first_lastname: {
      type: DataTypes.TEXT,
      validate: {
        len: [0, 255]
      }
    },
    second_lastname: {
      type: DataTypes.TEXT,
      validate: {
        len: [0, 255]
      }
    },
    fullname: {
      type: DataTypes.VIRTUAL,
      get () {
        return [this.first_name, this.middle_name, this.first_lastname, this.second_lastname]
          .filter(Boolean)
          .map((elem) => elem.replace(/\s+/g, ' ').trim())
          .join(' ')
      },
      set (value) {
        throw new Error('Do not try to set the `fullName` value!')
      }
    },
    last_login: {
      type: DataTypes.DATE,
      validate: {
        isDate: true
      }
    },
    account_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'read',
      validate: {
        isIn: [['admin', 'restock', 'read']] // Esto asegura que solo se puedan usar estas opciones
      }
    },
    api_access: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    schema: 'public',
    freezeTableName: true,
    timestamps: true,
    tableName: 'app_user',
    defaultScope: {
      attributes: {
        exclude: ['updatedAt', 'deletedAt', 'sub']
      },
      scopes: {
        full: {}
      }
    }
  })

  AppUser.associate = (models) => {
    // Aquí puedes agregar asociaciones según sea necesario
    AppUser.belongsToMany(models.external_notification, {
      through: models.read_notifications,
      foreignKey: 'app_user_id'
    })
  }

  return AppUser
}
