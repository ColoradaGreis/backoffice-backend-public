const models = require('../database')
const reiteStore = require('../services/reite/store')
const reiteLayout = require('../services/reite/layout')
const reiteToken = require('../services/reite/token')
const { putLayoutStore } = require('./layoutManager')
const { createTransitionLayout } = require('../utils/layout/index')
const { compareLayouts } = require('../utils/layout/index')
const { savePrices } = require('./redisClientManager')

module.exports = {
  list: async (payload) => {
    const result = {}
    const order = payload.order ? payload.order : 'DESC'
    const search = payload.search
    const limit = payload.limit ? payload.limit : 10
    const page = payload.page ? payload.page : 1
    const total = await models.store.count({
      where: {
        enabled: true,
        ...(search && {
          [models.Sequelize.Op.or]: [
            {
              name: {
                [models.Sequelize.Op.iLike]: '%' + search + '%'
              }
            }, {
              external_id: {
                [models.Sequelize.Op.iLike]: '%' + search + '%'
              }
            }
          ]
        })
      }
    })
    const storeList = JSON.parse(JSON.stringify(await models.store.findAll({
      limit,
      offset: (page - 1) * limit,
      order: [
        ['createdAt', order]
      ],
      where: {
        enabled: true,
        ...(search && {
          [models.Sequelize.Op.or]: [
            {
              name: {
                [models.Sequelize.Op.iLike]: '%' + search + '%'
              }
            }, {
              external_id: {
                [models.Sequelize.Op.iLike]: '%' + search + '%'
              }
            }
          ]
        })
      }
    })))
    const { accessToken } = await reiteToken.auth()
    for (const store of storeList) {
      const { data: settings } = await reiteStore.get(accessToken, store.external_id)
      store.layout_id = settings.layoutId
      store.location = settings.location
    }
    result.data = storeList
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
  getTransitionLayouts: async (payload) => {
    const { storeId, layoutId } = payload

    const currentLayout = await models.store_layouts.findOne({
      where: {
        layout_id: layoutId,
        store_id: storeId
      }
    })
    // console.log(currentLayout, 'currentLayout')
    // verifico si el layout actual es una transición o no
    if (currentLayout?.is_transition) {
      // Obtener el layout anterior (el último layout no transicional antes de la transición)
      const oldLayout = await models.store_layouts.findOne({
        where: {
          store_id: storeId,
          is_transition: false,
          end_date: { [models.Sequelize.Op.lte]: currentLayout.start_date } // Op.lte: Less than or equal to
        },
        order: [['end_date', 'DESC']]
      })
      if (!oldLayout) {
        return 'No old layout found'
      }
      // Obtener el layout objetivo (el próximo layout no transicional)
      const targetLayout = await models.store_layouts.findOne({
        where: {
          store_id: storeId,
          is_transition: false,
          start_date: { [models.Sequelize.Op.gte]: oldLayout.end_date } // Greater than or equal to the end_date of oldLayout
        },
        order: [['start_date', 'ASC']]
      })

      if (!targetLayout) {
        return 'No target layout found'
      }

      // Obtener todas las transiciones entre el layout antiguo y el objetivo
      const transitionLayouts = await models.store_layouts.findAll({
        where: {
          store_id: storeId,
          is_transition: true,
          start_date: { [models.Sequelize.Op.gte]: oldLayout.end_date },
          end_date: { [models.Sequelize.Op.lte]: new Date() }
        },
        order: [['start_date', 'ASC']]
      })
      const response = {

        oldLayout: oldLayout.layout_id,
        targetLayout: targetLayout.layout_id,
        transitionLayouts: transitionLayouts.map(transition => transition.layout_id),
        inTransition: true
      }
      return response
    } else {
      return {
        message: 'The specified layout is not in transition',
        inTransition: false
      }
    }
  },
  updateLayoutStore: async (params, body) => {
    // Step 1: Authenticate and get required tokens and IDs
    const { accessToken } = await reiteToken.auth()
    const { storeId, layoutId } = params
    const { oldLayout, prices } = body

    // Verificar que storeId no sea undefined
    if (!storeId) {
      throw new Error('storeId is undefined')
    }

    // Step 2: Fetch inventory, products, and layouts concurrently
    const [inventory, products, oldLayoutData, newLayoutData] = await Promise.all([
      reiteStore.getInventory(accessToken, storeId),
      reiteStore.getProducts(accessToken, storeId),
      reiteLayout.get(accessToken, oldLayout),
      reiteLayout.get(accessToken, layoutId)
    ])

    if (!inventory.successful || !products.successful) {
      throw new Error('Error fetching inventory or products from Reite API')
    }

    // Step 3: Compare layouts to identify products to remove
    const difference = await compareLayouts(oldLayoutData.data, newLayoutData.data)
    const changePosition = difference.productsPositionChanged.length > 0
    // Step 4: Prepare the active layout for database update
    const activeLayout = {
      layoutId,
      is_transition: false,
      transition_stage: null,
      changePosition
    }
    if (difference.productsToRemove.length > 0) {
      const productsToInclude = difference.productsToRemove.filter(product => {
        const inventoryProduct = inventory.data.products.find(p => p.productId === product.productId)
        return inventoryProduct && inventoryProduct.quantity > 0
      })

      // Step 5: If products to include, create transition layout
      if (productsToInclude.length > 0) {
        await savePrices(storeId, layoutId, prices)

        const transitionLayout = await createTransitionLayout(layoutId, productsToInclude, 1) // ya viene con los productos cambiados de lugar xq está hecho en base a L2

        const createTransitionLayoutResponse = await reiteLayout.create(accessToken, transitionLayout)

        if (createTransitionLayoutResponse) {
          const transitionPrices = {}
          createTransitionLayoutResponse.data.productsIds.forEach(productId => {
            const product = products.data.find(p => p.productId === productId)
            transitionPrices[productId] = product ? product.prices[storeId] : prices[productId]
          })

          const assignLayout = await reiteStore.updateLayout(accessToken, { storeId, layoutId: createTransitionLayoutResponse.data.id }, { prices: transitionPrices })

          await putLayoutStore(storeId, { oldLayout, oldProductsIds: oldLayoutData.data.productsIds }, activeLayout)
          await putLayoutStore(storeId, { oldLayout: null, oldProductsIds: null }, { layoutId: createTransitionLayoutResponse.data.id, is_transition: true, transition_stage: 1, productsIds: null, changePosition })
          if (assignLayout.successful) {
            return {
              successful: true,
              data: {
                newLayoutId: createTransitionLayoutResponse.data.id
              }
            }
          }
        } else {
          const assignLayout = await reiteStore.updateLayout(accessToken, { storeId, layoutId }, { prices })

          await putLayoutStore(storeId, { oldLayout, productsIds: null }, activeLayout)

          return {
            successful: assignLayout.successful,
            data: {
              newLayoutId: layoutId
            }
          }
        }
      }
    } else {
      const assignLayout = await reiteStore.updateLayout(accessToken, { storeId, layoutId }, { prices })

      await putLayoutStore(storeId, { oldLayout, productsIds: null }, activeLayout)

      return {
        successful: assignLayout.successful,
        data: {
          newLayoutId: layoutId
        }
      }
    }
  },
  saveLayoutStore: async function (params, body) {
    // Step 1: Authenticate and get required tokens and IDs
    const { accessToken } = await reiteToken.auth()
    const { storeId, layoutId } = params
    const { oldLayout, prices } = body

    // Verificar que storeId no sea undefined
    if (!storeId) {
      throw new Error('storeId is undefined')
    }

    // Step 2: Fetch inventory, products, and layouts concurrently
    const [inventory, products, oldLayoutData, newLayoutData] = await Promise.all([
      reiteStore.getInventory(accessToken, storeId),
      reiteStore.getProducts(accessToken, storeId),
      reiteLayout.get(accessToken, oldLayout),
      reiteLayout.get(accessToken, layoutId)
    ])
    console.log(oldLayoutData, 'oldLayoutData')

    if (!inventory.successful || !products.successful) {
      throw new Error('Error fetching inventory or products from Reite API')
    }

    // Step 3: Prepare the active layout for database update
    const activeLayout = {
      layoutId,
      is_transition: false,
      transition_stage: null,
      productsIds: newLayoutData.data.productsIds
    }

    const assignLayout = await reiteStore.updateLayout(accessToken, { storeId, layoutId }, { prices })

    await putLayoutStore(storeId, { oldLayout, oldProductsIds: oldLayoutData.data.productsIds }, activeLayout)

    return assignLayout
  }

}
