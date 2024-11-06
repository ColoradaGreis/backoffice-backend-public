const models = require('../src/database')
const reiteStore = require('./store/reite')
const serviceProvider = require('./provider')
const Product = require('./product/index')

const Category = require('./categories/index')

module.exports = {
  load: async () => {
    // await reiteStore.load(models);
    // await serviceProvider.load(models)
    // await serviceProvider.loadProducts(models)
    await Product.load(models)
    // await Product.syncTrained(models)
    // await Category.load(models)
  //   const productList = await models.service_provider_product.findAll({
  //     include: [
  //       {
  //         model: models.product,
  //         as: 'product',
  //         required: false
  //       }
  //     ]
  //   })
  //   for (const product of productList) {
  //     console.log(JSON.parse(JSON.stringify(product)), 'prodcut')
  //   }
  }
}
