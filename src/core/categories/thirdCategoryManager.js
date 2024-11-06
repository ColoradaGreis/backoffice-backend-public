const models = require('../../database')

module.exports = {
  list: async (payload) => {
    const result = {}
    const order = payload.order ? payload.order : 'ASC'
    const search = payload.search
    const limit = payload.limit ? payload.limit : 10
    const page = payload.page ? payload.page : 1

    // Contar todas las second_category
    const total = await models.second_category.count({
      where: {
        ...(search && {
          [models.Sequelize.Op.or]: [
            { name: { [models.Sequelize.Op.iLike]: `%${search}%` } }
          ]
        })
      }
    })

    // Obtener todas las second_category junto con sus third_category asociadas
    const categories = await models.second_category.findAll({
      limit,
      offset: (page - 1) * limit,
      order: [['name', order]],
      where: {
        ...(search && {
          [models.Sequelize.Op.or]: [
            { name: { [models.Sequelize.Op.iLike]: `%${search}%` } }
          ]
        })
      },
      include: [
        {
          model: models.third_category, // Incluir las third_category (subcategorías)
          attributes: ['id', 'name', 'active'], // Atributos que queremos traer
          order: [['name', order]] // Ordenar las subcategorías por nombre
        }
      ]
    })

    // Estructurar el resultado para mostrar las second_category y sus third_category asociadas
    result.data = categories.map(secondCategory => ({
      id: secondCategory.id,
      name: secondCategory.name,
      subcategories: secondCategory.third_categories.map(thirdCategory => ({
        id: thirdCategory.id,
        name: thirdCategory.name,
        active: thirdCategory.active
      }))
    }))

    // Meta información para la paginación
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
    const categoryExists = await models.second_category.findOne({
      where: {
        id: category.second_category_id
      }
    })

    if (!categoryExists) {
      return 'La categoría padre no existe!'
    }
    const result = await models.third_category.create({
      name: category.name,
      active: category.active !== undefined ? category.active : true,
      second_category_id: category.second_category_id // Enlazando con second_category
    })
    return result
  },

  delete: async (id) => {
    const category = await models.third_category.findOne({
      where: { id }
    })

    if (!category) {
      return { message: 'Registro no encontrado', successful: false }
    }

    const result = await models.third_category.destroy({
      where: { id }
    })

    if (result === 1) {
      return { message: 'Registro eliminado correctamente', successful: true }
    }
    return { message: 'Error al eliminar el registro', successful: false }
  },

  update: async (id, updateFields) => {
    const [rowsUpdated, [updatedCategory]] = await models.third_category.update(
      updateFields,
      {
        where: { id },
        returning: true // Devolver el registro actualizado
      }
    )
    return { updatedCategory, rowsUpdated }
  },

  getById: async (id) => {
    const result = await models.third_category.findOne({
      where: {
        id
      },
      include: [
        {
          model: models.second_category, // Incluir la second_category relacionada
          attributes: ['id', 'name']
        }
      ]
    })

    if (!result) {
      return 'Esta subcategoría no existe!'
    }

    return result
  }
}
