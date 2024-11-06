const models = require('../../database')
const moment = require('moment-timezone')

module.exports = {
  list: async (payload) => {
    const result = {}
    const order = payload.order ? payload.order : 'DESC'
    const limit = payload.limit ? payload.limit : 10
    const page = payload.page ? payload.page : 1
    const start_date = payload.start_date //eslint-disable-line
    const end_date = payload.end_date //eslint-disable-line
    const total = await models.replenishment_order.count({
      where: {
        ...(start_date && end_date && { //eslint-disable-line
          [models.Sequelize.Op.and]: [
            { start_date: { [models.Sequelize.Op.gte]: new Date(start_date) } },
            { end_date: { [models.Sequelize.Op.lte]: new Date(end_date) } }
          ]
        }),
        ...(start_date && { //eslint-disable-line
          [models.Sequelize.Op.and]: [
            { start_date: { [models.Sequelize.Op.gte]: new Date(start_date) } }
          ]
        })
      }
    })
    const replenishOrderList = JSON.parse(JSON.stringify(await models.replenishment_order.findAll({
      limit,
      offset: (page - 1) * limit,
      order: [
        ['createdAt', order]
      ],
      where: {
        ...(start_date && end_date && { //eslint-disable-line
          [models.Sequelize.Op.and]: [
            { start_date: { [models.Sequelize.Op.gte]: new Date(start_date) } },
            { end_date: { [models.Sequelize.Op.lte]: new Date(end_date) } }
          ]
        }),
        ...(start_date && {   //eslint-disable-line
          [models.Sequelize.Op.and]: [
            { start_date: { [models.Sequelize.Op.gte]: new Date(start_date) } }
          ]
        })
      },
      include: [
        {
          model: models.store,
          as: 'destination_store',
          required: false
        },
        {
          model: models.picking_operation,
          as: 'picking_operation',
          required: false
        }
      ]
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
    return models.replenishment_order.findOne({
      where: { id: params.id },
      include: [
        {
          model: models.picking_operation,
          as: 'picking_operation',
          required: false,
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
        }
      ]
    })
  },
  create: async (payload) => {
    if (!payload.name) {
      payload.name = 'Orden - ' + moment().format('DD/MM/YYYY')
    }
    payload.status = 'initialized'
    return models.replenishment_order.create(payload)
  },
  update: async (payload, params) => {
    return models.replenishment_order.update(payload, { where: { id: params.id } })
  },
  delete: async (params) => {
    return models.replenishment_order.destroy({ where: { id: params.id } })
  }
}
