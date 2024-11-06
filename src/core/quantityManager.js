const models = require('../database')
module.exports = {
  list: async () => {
    const quantities = JSON.parse(JSON.stringify(await models.critical_quantity_threshold.findAll()))
    return quantities
  },
  create: async ({ productId, storeId, stockLevel }) => {
    const product = await models.product.findByPk(productId)

    if (!product) {
      throw new Error(`No se encontró un producto con id ${productId}`)
    }

    const quantity = await models.critical_quantity_threshold.create({
      store_id: storeId,
      minimum_stock_level: stockLevel,
      product_id: productId
    })

    if (quantity === 1) {
      return { successful: true, message: 'Quantity threshold created successfully.' }
    }
  },
  getById: async ({ id }) => {
    const quantity = await models.critical_quantity_threshold.findByPk(id)
    return quantity
  },
  getByProductId: async ({ productId }) => {
    // console.log('getByProductId', productId)
    const quantity = await models.critical_quantity_threshold.findAll({
      where: {
        product_id: productId
      }
    })
    return quantity
  },
  update: async (params, body) => {
    const quantity = await models.critical_quantity_threshold.findByPk(params.id)
    if (!quantity) {
      throw new Error(`No se encontró una cantidad con id ${params.id}`)
    }
    const updatedQuantity = await quantity.update(body)
    return updatedQuantity
  }
}
