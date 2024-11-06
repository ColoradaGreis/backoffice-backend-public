const reiteLayout = require('../services/reite/layout')
const { compareLayouts } = require('../utils/layout/index')
const reiteToken = require('../services/reite/token')
const moment = require('moment')
const models = require('../database')
module.exports = {
  compare: async function (payload) {
    console.log(payload, 'payload')
    const { actualLayoutId, oldLayoutId } = payload
    console.log(actualLayoutId, oldLayoutId, 'ids')
    const { accessToken } = await reiteToken.auth()
    const actualLayout = await reiteLayout.get(accessToken, actualLayoutId)
    const oldLayout = await reiteLayout.get(accessToken, oldLayoutId)

    if (!actualLayout || !oldLayout) {
      return null
    }
    const difference = compareLayouts(oldLayout.data, actualLayout.data)

    return difference
  },
  putLayoutStore: async function (storeId, oldLayoutData, activeLayout) { // actualizo el layout de la tienda y agrego nuevo registro en la tabla store_layouts
    if (!activeLayout || !oldLayoutData) {
      throw new Error('Invalid layout data: activeLayout or oldLayoutData is missing')
    }
    const { layoutId, is_transition, transition_stage, productsIds, changePosition } = activeLayout //eslint-disable-line
    const { oldLayout, oldProductsIds } = oldLayoutData
    if (oldLayout) {
      // Buscar el oldLayout en la tabla store_layouts
      const existingLayout = await models.store_layouts.findOne({
        where: {
          store_id: storeId,
          layout_id: oldLayout,
          end_date: null
        },
        order: [['start_date', 'DESC']]
      })

      if (existingLayout) {
      // Si el oldLayout existe, actualizar el end_date
        await existingLayout.update({ end_date: moment().format('YYYY-MM-DD') })
      } else {
      // Si no existe, agregarlo con el mismo start_date y end_date para marcarlo como antiguo
        await models.store_layouts.create({
          store_id: storeId,
          layout_id: oldLayout,
          start_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
          end_date: moment().format('YYYY-MM-DD'),
          is_transition: false,
          transition_stage: null,
          products_id: oldProductsIds || null,
          change_position: false
        })
      }
    }

    // Agregar la nueva fila con el activeLayout
    await models.store_layouts.create({
      store_id: storeId,
      layout_id: layoutId,
      start_date: moment().format('YYYY-MM-DD'),
      end_date: null,
      is_transition, //eslint-disable-line
      transition_stage, //eslint-disable-line
      products_id: productsIds || null,
      change_position: changePosition || false
    })

    return { message: 'Layout updated successfully' }
  },
  getLayoutRecord: async function (storeId, page = 1, limit = 1000, startDate, endDate) { // obtengo el historial de layouts de la tienda
    const query = {
      store_id: storeId
    }

    if (startDate && endDate) {
      query.start_date = {
        [models.Sequelize.Op.between]: [startDate, endDate]
      }
    }

    const result = await models.store_layouts.findAndCountAll({
      where: query,
      order: [['start_date', 'DESC']],
      limit,
      offset: (page - 1) * limit
    })

    return result
  },
  putLayoutRecord: async function (storeId, layoutId) { // agrego un nuevo registro de layout a la tabla store_layouts
    const existingLayout = await models.store_layouts.findOne({
      where: {
        store_id: storeId,
        layout_id: layoutId,
        end_date: null
      }
    })

    if (existingLayout) {
      await existingLayout.update({ end_date: moment().format('YYYY-MM-DD') })
    } else {
      await models.store_layouts.create({
        store_id: storeId,
        layout_id: layoutId,
        start_date: moment().format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD')
      })
    }

    return { message: 'Layout record added successfully' }
  },
  getLayoutRecordById: async function (payload) {
    console.log(payload, 'payload')
    const { storeId, layoutId } = payload
    let previousLayout = null
    const actualLayout = await models.store_layouts.findOne({
      where: {
        store_id: storeId,
        layout_id: layoutId,
        end_date: null
      }
    })
    if (actualLayout) {
      previousLayout = await models.store_layouts.findOne({
        where: {
          store_id: storeId,
          end_date: actualLayout.start_date,
          is_transition: false

        }
      })
    }
    return { actualLayout, previousLayout }
  },
  updateLayoutRecord: async function (params, body) {
    const { storeId, layoutId } = params
    const { change_position } = body

    const existingLayout = await models.store_layouts.findOne({
      where: {
        store_id: storeId,
        layout_id: layoutId,
        end_date: null
      }
    })
    console.log(existingLayout, 'existingLayout')

    if (existingLayout) {
      await existingLayout.update({ change_position })
      return { message: 'Layout record updated successfully' }
    } else {
      return { message: 'Layout record not found' }
    }
  }
}
