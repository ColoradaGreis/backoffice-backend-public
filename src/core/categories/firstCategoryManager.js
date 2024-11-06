const models = require('../../database')

module.exports = {
  list: async (payload) => {
    const result = {}
    const order = payload.order ? payload.order : 'ASC'
    const search = payload.search
    const limit = payload.limit ? payload.limit : 10
    const page = payload.page ? payload.page : 1
    const total = await models.first_category.count({
      where: {
        ...(search && {
          [models.Sequelize.Op.or]: [
            { name: { [models.Sequelize.Op.iLike]: `%${search}%` } }
          ]
        })
      }
    })
    const categories = JSON.parse(JSON.stringify(await models.first_category.findAll({
      limit,
      offset: (page - 1) * limit,
      order: [['name', order]],
      where: {
        ...(search && {
          [models.Sequelize.Op.or]: [
            { name: { [models.Sequelize.Op.iLike]: `%${search}%` } }
          ]
        })
      }
    })))
    result.data = categories
    result.meta = {
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    }

    return result
  },
  create: async (category) => {
    const result = await models.first_category.create(
      {
        name: category.name,
        active: category.active !== undefined ? category.active : true
      }
    )
    return result
  },
  delete: async (id) => {
    const category = await models.first_category.findOne({
      where: { id }
    })
    // Si no se encuentra el registro, retornamos un mensaje
    if (!category) {
      return { message: 'Registro no encontrado', successful: false }
    }

    const result = await models.first_category.destroy({
      where: { id }
    })

    if (result === 1) {
      return { message: 'Registro eliminado correctamente', successful: true }
    }
    return { message: 'Error al eliminar el registro', successful: false }
  },
  update: async (id, updateFields) => {
    const [rowsUpdated, [updatedCategory]] = await models.first_category.update(
      updateFields,
      {
        where: { id },
        returning: true // Devuelve el registro actualizado
      }
    )
    return { updatedCategory, rowsUpdated }
  },
  getById: async (id) => {
    const result = await models.first_category.findOne({
      where: {
        id
      }
    })
    if (!result) {
      return 'Esta categoria no existe!'
    }
    return result
  },
  getSubcategories: async (id) => {
    const result = await models.first_category.findOne({
      where: {
        id
      }
    })
    const subcategories = await models.second_category.findAll({
      where: {
        first_category_id: id
      }
    })

    if (!result) {
      return 'Esa subcategoría no existe!'
    }
    if (subcategories.length === 0) {
      return 'No hay subcategorías para esta categoría'
    }
    const response = {
      id: result.id,
      name: result.name,
      subcategories
    }

    return response
  }
}
