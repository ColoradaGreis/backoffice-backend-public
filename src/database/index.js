const fs = require('fs')
const path = require('path')
const { Sequelize } = require('sequelize')
const basename = path.basename(__filename)
const baseModelsFolder = path.join(__dirname, 'models')
const models = [
  'product',
  'external',
  'user',
  'stock_operation',
  'category',
  'critical_quantity_threshold',
  'product_substitute',
  'store_layouts',
  'redis'
]
const excludedFiles = ['hooks.js']
const env = process.env.NODE_ENV || 'development'
const config = require(__dirname + '/config/config.js')[env] // eslint-disable-line
const db = {}
const files = []

// TODO: check required fields in models
if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable], config) // eslint-disable-line

} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config) // eslint-disable-line
}

sequelize.authenticate().then(async () => {
  console.log('Connection has been established successfully to: ' + config.database)

  // TODO: wait connection and move
  /*
  const exampleUser = require('./seeds/exampleUser');
  exampleUser.base();
  */
}).catch(err => {
  console.error('Unable to connect to the database:', err)
})

models.forEach(modelPath => {
  const folderPath = path.join(baseModelsFolder, modelPath)
  const dirContent = fs.readdirSync(folderPath)
  dirContent.filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js') && (excludedFiles.indexOf(file) === -1)).forEach((filename) => {
    const filepath = path.join(folderPath, filename)
    files.push(filepath)
  })
})

files.forEach(file => {
  try {
    const model = require(file)(sequelize, Sequelize.DataTypes)
    db[model.name] = model
  } catch (error) {
    console.error(`Error loading model from file: ${file}`, error)
  }
})

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

// sequelize.sync({ force: true }).then(() => {
//   console.log('Database synchronized')
// })
// db.category.sync({ force: true })
// db.task.sync({ force: true })
// db.stock_operation.sync({ force: true })
// db.product_stock_operation.sync({ force: true })
// db.product_substitute.sync({ force: true })
// db.store_layouts.sync({ force: true }).then(() => {
//   console.log('Database synchronized')
// })
// db.redis.sync({ force: true }).then(() => {
//   console.log('Database synchronized')
// })

// db.sequelize.sync({ force: true })
// db.notification.sync({force: true});
// db.external_notification.sync({ force: true })
// db.read_notifications.sync({ force: true })
// db.app_user.sync({ force: true })
// db.first_category.sync({ force: true })
// db.second_category.sync({ force: true })
// db.third_category.sync({ force: true })
// db.product.sync({ force: true })
// db.warehouse.sync({force: true});
// db.provider.sync({force: true});
// db.service_provider_product.sync({ force: true })
// db.service_provider.create({name: "reite"});
// db.warehouse.create({name: "bodega 01", description: "casilleros Easy"});
/*
db.product.create({
  ean: "41789001918", category: "snack", name: "Maruchan Pollo 64g", brand: "Maruchan", image_url: "https://i5.walmartimages.com/seo/Maruchan-Instant-Lunch-Chicken-Flavor-Instant-Lunch-2-25-oz_d093b57e-954b-4949-a0ad-238f36e45372_1.eed6933c9dd5319cb8c5cb70238374dc.jpeg",
  perishable: true, season: "verano", expiration_date: Date.now()
});
*/

// db.warehouse_product.create({warehouse_id: 1, product_id: 2, stock: 17});
// db.service_provider_product.create({internal_id: 'CNV10', trained_product: true, stock: 10, service_provider_id: 1, product_id: 3});

// db.store.sync({ force: true })
// db.replenishment_order.sync({force: true});
// db.picking_operation.sync({force: true});
// db.picking_operation_product.sync({force: true});

module.exports = db
