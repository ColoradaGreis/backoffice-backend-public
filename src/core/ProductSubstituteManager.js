const models = require('../database')

module.exports = {
  list: async () => {
    const result = await models.product_substitute.findAll()
    return result
  },
  getByProductId: async (productId) => {
    const result = await models.product_substitute.findAll({
      where: {
        original_product_id: productId
      }
    })
    return result
  },
  create: async (body) => {
    // console.log(models, 'models')
    const repeated = await models.product_substitute.findOne({
      where: {
        original_product_id: body.original_product_id,
        replacement_product_id: body.replacement_product_id
      }
    })
    if (repeated) {
      throw new Error('Ya existe un producto sustituto con los mismos datos')
    }
    const result = await models.product_substitute.create(body)
    return result
  }
}
