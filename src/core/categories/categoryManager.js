const models = require('../../database')

module.exports = {
  getAssign: async (thirdCategoryId) => {
    const thirdCategory = await models.third_category.findOne({
      where: { id: thirdCategoryId },
      include: [
        {
          model: models.second_category,
          attributes: ['id', 'name'], // Datos de la second_category
          include: [
            {
              model: models.first_category, // Relacionar también con la first_category
              attributes: ['id', 'name'] // Datos de la first_category
            }
          ]
        }
      ]
    })

    if (!thirdCategory) {
      return { message: 'Esta tercera categoría no existe!', successful: false }
    }

    // Formatear la respuesta para mostrar toda la jerarquía
    const result = {
      firstCategory: {
        id: thirdCategory.second_category.first_category.id,
        name: thirdCategory.second_category.first_category.name,
        secondCategory: {
          id: thirdCategory.second_category.id,
          name: thirdCategory.second_category.name,
          thirdCategory: {
            id: thirdCategory.id,
            name: thirdCategory.name
          }
        }
      }

    }

    return { data: result, successful: true }
  },
  getCategoriesTree: async (payload) => {
    const order = payload.order ? payload.order : 'ASC'
    const limit = payload.limit ? payload.limit : 10
    const page = payload.page ? payload.page : 1

    // Contar todas las first_category
    const total = await models.first_category.count()

    // Obtener todas las first_category con paginación
    const firstCategories = await models.first_category.findAll({
      limit,
      offset: (page - 1) * limit,
      order: [['name', order]],
      include: [
        {
          model: models.second_category,
          attributes: ['id', 'name', 'active'], // Datos de second_category
          include: [
            {
              model: models.third_category, // Datos de third_category
              attributes: ['id', 'name', 'active']
            }
          ]
        }
      ]
    })

    // Estructurar el resultado en forma jerárquica
    const hierarchy = firstCategories.map(firstCategory => ({
      id: firstCategory.id,
      name: firstCategory.name,
      active: firstCategory.active,
      second_categories: firstCategory.second_categories.map(secondCategory => ({
        id: secondCategory.id,
        name: secondCategory.name,
        active: secondCategory.active,
        third_categories: secondCategory.third_categories.map(thirdCategory => ({
          id: thirdCategory.id,
          name: thirdCategory.name,
          active: thirdCategory.active
        }))
      }))
    }))

    // Meta información para la paginación
    const result = {
      data: hierarchy,
      meta: {
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          page,
          limit
        }
      }
    }

    return { data: result, successful: true }
  }

}
