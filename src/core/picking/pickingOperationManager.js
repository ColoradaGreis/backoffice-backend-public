const models = require('../../database')

module.exports = {
  list: async (payload, params) => {
    const result = {}
    const order = payload.order ? payload.order : 'DESC'
    const limit = payload.limit ? payload.limit : 10
    const page = payload.page ? payload.page : 1
    const total = await models.picking_operation.count({
      where: {
        replenishment_order_id: params.orderId
      }
    })
    const replenishOrderList = JSON.parse(JSON.stringify(await models.picking_operation.findAll({
      limit,
      offset: (page - 1) * limit,
      order: [
        ['createdAt', order]
      ],
      where: {
        replenishment_order_id: params.orderId
      }
    })))
    result.data = replenishOrderList
    result.meta = {
      pagination: {
        total,
        per_page: limit,
        current_page: page,
        total_pages: Math.ceil(total / limit)
      }
    }
    return result
  },
  get: async (params) => {
    return models.picking_operation.findOne({
      where: { id: params.pickingId, replenishment_order_id: params.orderId },
      include: [
        {
          model: models.picking_operation_product,
          separate: true,
          as: 'picking_operation_product',
          required: false,
          include: [
            {
              model: models.warehouse_product,
              as: 'warehouse_product',
              required: false,
              include: [
                {
                  model: models.product,
                  as: 'product',
                  required: false

                }
              ]
            }
          ]
        }
      ]
    })
  },
  create: async (payload, params) => {
    payload.status = 'initialized'
    payload.replenishment_order_id = params.orderId
    return models.picking_operation.create(payload)
  },
  update: async (payload, params) => {
    // console.log(payload)
    if (payload.products) {
      const productBulk = []
      for (const product of payload.products) {
        // search for warehouse_product_id to limit max request
        productBulk.push({ requested_stock: product.requested_stock, warehouse_product_id: product.id, picking_operation_id: params.pickingId })
      }
      //   console.log(productBulk)
      await models.picking_operation_product.destroy({ where: { picking_operation_id: params.pickingId } })
      await models.picking_operation_product.bulkCreate(productBulk)
    }
    return models.picking_operation.update(payload, { where: { id: params.pickingId, replenishment_order_id: params.orderId } })
  },
  delete: async (params) => {
    return models.picking_operation.destroy({ where: { id: params.pickingId, replenishment_order_id: params.orderId } })
  }
}
