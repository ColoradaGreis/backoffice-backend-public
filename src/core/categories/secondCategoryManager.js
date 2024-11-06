/* eslint-disable camelcase */
const models = require('../../database')

module.exports = {
  list: async (payload) => {
    const result = {}
    const order = payload.order ? payload.order : 'ASC'
    const search = payload.search
    const limit = payload.limit ? payload.limit : 10
    const page = payload.page ? payload.page : 1

    // Contar todas las categorías
    const total = await models.first_category.count({
      where: {
        ...(search && {
          [models.Sequelize.Op.or]: [
            { name: { [models.Sequelize.Op.iLike]: `%${search}%` } }
          ]
        })
      }
    })

    // Obtener las first_category junto con sus second_category asociadas
    const categories = await models.first_category.findAll({
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
          model: models.second_category, // Incluimos las second_category
          attributes: ['id', 'name', 'active'],
          order: [['name', order]] // Ordenamos las second_category también
        }
      ]
    })

    // Estructura de resultado jerárquica
    const hierarchy = categories.map(firstCategory => {
      return {
        id: firstCategory.id, // ID de la primera categoría
        name: firstCategory.name, // Nombre de la primera categoría
        second_categories: firstCategory.second_categories.map(secondCategory => ({
          id: secondCategory.id, // ID de la segunda categoría
          name: secondCategory.name, // Nombre de la segunda categoría
          active: secondCategory.active // Estado de la segunda categoría
        }))
      }
    })

    result.data = hierarchy
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
    const categoryExists = await models.first_category.findOne({
      where: {
        id: category.first_category_id
      }
    })

    if (!categoryExists) {
      return 'La categoría padre no existe!'
    }

    const result = await models.second_category.create({
      name: category.name,
      active: category.active !== undefined ? category.active : true,
      first_category_id: category.first_category_id // Linking to first_category
    })
    return result
  },

  delete: async (id) => {
    const category = await models.second_category.findOne({
      where: { id }
    })

    if (!category) {
      return { message: 'Registro no encontrado', successful: false }
    }

    const result = await models.second_category.destroy({
      where: { id }
    })

    if (result === 1) {
      return { message: 'Registro eliminado correctamente', successful: true }
    }
    return { message: 'Error al eliminar el registro', successful: false }
  },

  update: async (id, updateFields) => {
    const [rowsUpdated, [updatedCategory]] = await models.second_category.update(
      updateFields,
      {
        where: { id },
        returning: true // Return the updated record
      }
    )
    if (Object.prototype.hasOwnProperty.call(updateFields, 'active') && updateFields.active === false) {
      // Buscar las third_category asociadas a la second_category desactivada
      await models.third_category.update(
        { active: false }, // Desactivar todas las third_category
        {
          where: { second_category_id: id } // Filtrar por el ID de la second_category
        }
      )
    }
    return { updatedCategory, rowsUpdated }
  },

  getById: async (id) => {
    const result = await models.second_category.findOne({
      where: {
        id
      },
      include: [
        {
          model: models.first_category, // Include the related first_category
          attributes: ['id', 'name']
        }
      ]
    })

    if (!result) {
      return 'Esta categoria no existe!'
    }

    return result
  },
  getSubcategories: async (id) => {
    const result = await models.second_category.findOne({
      where: {
        id
      }
    })
    const subcategories = await models.third_category.findAll({
      where: {
        second_category_id: id
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
