const models = require('../database')
const s3 = require('../services/s3')

module.exports = {
  list: async (payload) => {
    const result = {}
    const order = payload.order ? payload.order : 'ASC'
    const search = payload.search
    const limit = payload.limit ? payload.limit : 10
    const page = payload.page ? payload.page : 1
    const total = await models.product.count({
      where: {
        ...(search && {
          [models.Sequelize.Op.or]: [
            { short_name: { [models.Sequelize.Op.iLike]: `%${search}%` } },
            { ean: { [models.Sequelize.Op.iLike]: `%${search}%` } }
          ]
        })
      }
    })
    const productList = JSON.parse(JSON.stringify(await models.product.findAll({
      include: [{
        model: models.first_category,
        as: 'firstCategory',
        attributes: ['name'] // Selecciona las columnas que deseas mostrar de la categoría
      },
      {
        model: models.second_category,
        as: 'secondCategory',
        attributes: ['name']
      },
      {
        model: models.third_category,
        as: 'thirdCategory',
        attributes: ['name']
      }
      ],
      limit,
      offset: (page - 1) * limit,
      order: [['short_name', order]],
      where: {
        ...(search && {
          [models.Sequelize.Op.or]: [
            { short_name: { [models.Sequelize.Op.iLike]: `%${search}%` } },
            { ean: { [models.Sequelize.Op.iLike]: `%${search}%` } }
          ]
        })
      }
    })))
    // console.log(productList, 'productList')
    result.data = productList.map(product => {
      const { firstCategory, secondCategory, thirdCategory, ...rest } = product
      return {
        ...rest,
        first_category: firstCategory ? firstCategory.name : null,
        second_category: secondCategory ? secondCategory.name : null,
        third_category: thirdCategory ? thirdCategory.name : null
      }
    })
    result.meta = {
      pagination: {
        total,
        limit,
        page,
        pages: Math.ceil(total / limit)
      }
    }
    return result
  },
  create: async (payload) => {
    // console.log(payload, 'payload')
    if (typeof payload.pack === 'string') {
      const packArray = payload.pack.split(',').map(item => parseInt(item.trim(), 10))
      payload.pack = packArray
    }

    return models.product.create(payload, { exclude: ['content'] })
  },
  update: async (payload) => {
    // Verifica que los arrays lleguen correctamente
    if (typeof payload.sku_sap === 'string') {
      payload.sku_sap = JSON.parse(payload.sku_sap)
    }
    if (typeof payload.sku_vtex === 'string') {
      payload.sku_vtex = JSON.parse(payload.sku_vtex)
    }
    if (typeof payload.pack === 'string') {
      payload.pack = JSON.parse(payload.pack)
    }

    const updatedProduct = await models.product.update(payload, {
      where: { id: payload.id },
      returning: true // Devuelve el producto actualizado
    })

    // Verifica el producto actualizado
    return updatedProduct
  },
  updateImage: async (payload, file) => {
    if (file) {
      const checkResult = checkLimits(file)
      if (checkResult) {
        const uploadResult = await s3.uploadImage('backoffice-public-files', file.originalname, file.buffer, 'images')
        payload.primary_image = s3.getObjectUrl('backoffice-public-files', uploadResult.key)
        return models.product.update({ primary_image: payload.primary_image },
          {
            where: { id: payload.id }
          }
        )
      }
    }
    return false
  },
  get: async (payload) => {
    const product = await models.product.findOne({
      where: { id: payload.id },
      include: [{
        model: models.first_category,
        as: 'firstCategory',
        attributes: ['name'] // Selecciona las columnas que deseas mostrar de la categoría
      },
      {
        model: models.second_category,
        as: 'secondCategory',
        attributes: ['name']
      },
      {
        model: models.third_category,
        as: 'thirdCategory',
        attributes: ['name']
      }
      ]
    })
    const { firstCategory, secondCategory, thirdCategory, ...rest } = product.toJSON()
    const formattedProduct = {
      ...rest,
      first_category: firstCategory ? firstCategory.name : null,
      second_category: secondCategory ? secondCategory.name : null,
      third_category: thirdCategory ? thirdCategory.name : null
    }
    return formattedProduct
  },
  findByEAN: async (payload) => {
    const result = {}
    const findResult = JSON.parse(JSON.stringify(await models.product.findOne({
      where: { ean: payload.ean },
      include: [{
        model: models.first_category,
        as: 'firstCategory',
        attributes: ['name'] // Selecciona las columnas que deseas mostrar de la categoría
      },
      {
        model: models.second_category,
        as: 'secondCategory',
        attributes: ['name']
      },
      {
        model: models.third_category,
        as: 'thirdCategory',
        attributes: ['name']
      }
      ]
    })))
    if (!findResult) {
      result.message = 'No se encontró el producto'
      return result
    }
    const { firstCategory, secondCategory, thirdCategory, ...rest } = findResult
    result.data = {
      ...rest,
      first_category: firstCategory ? firstCategory.name : null,
      second_category: secondCategory ? secondCategory.name : null,
      third_category: thirdCategory ? thirdCategory.name : null
    }

    return result
  },
  delete: async (payload) => {
    return models.product.destroy(
      {
        where: { id: payload.id }, force: false
      }
    )
  }

}

function checkLimits (file) {
  if (file !== undefined && file.size < (global.FILE_SIZE_LIMIT * 1000000)) {
    return true
  }
  return false
}
