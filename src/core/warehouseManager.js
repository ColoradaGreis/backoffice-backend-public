const models = require('../database')

module.exports = {
  list: async (payload) => {
    const result = {}
    const order = payload.order ? payload.order : 'DESC'
    const search = payload.search
    const limit = payload.limit ? payload.limit : 10
    const page = payload.page ? payload.page : 1
    const total = await models.warehouse.count({
      where: {
        ...(search && {
          [models.Sequelize.Op.or]: [
            {
              name: {
                [models.Sequelize.Op.iLike]: '%' + search + '%'
              }
            }, {
              description: {
                [models.Sequelize.Op.iLike]: '%' + search + '%'
              }
            }
          ]
        })
      }
    })
    const warehouseList = JSON.parse(JSON.stringify(await models.warehouse.findAll({
      limit,
      offset: (page - 1) * limit,
      order: [
        ['createdAt', order]
      ],
      where: {
        ...(search && {
          [models.Sequelize.Op.or]: [
            {
              name: {
                [models.Sequelize.Op.iLike]: '%' + search + '%'
              }
            }, {
              description: {
                [models.Sequelize.Op.iLike]: '%' + search + '%'
              }
            }
          ]
        })
      }
    })))
    result.data = warehouseList
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
  get: async (payload) => {
    return models.warehouse.findOne({
      where: { id: payload.id }
    })
  },
  getProducts: async (payload) => {
    return models.warehouse.findOne({
      where: { id: payload.warehouse_id },
      include: [
        {
          model: models.warehouse_product,
          as: 'warehouse_product',
          required: false,
          include: [
            {
              model: models.product,
              as: 'product',
              required: true
            }
          ]
        }
      ]
    })
  }
}
