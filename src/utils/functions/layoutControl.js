const compareLayouts = require('../layout/compareLayouts')
const { getTransitionLayouts } = require('../../core/storeManager')
const reiteLayout = require('../../services/reite/layout')
const { createTransitionLayout } = require('../layout')
const { getPrices, deletePrices } = require('../../core/redisClientManager')
const reiteStore = require('../../services/reite/store')
const { putLayoutStore, putLayoutRecord } = require('../../core/layoutManager')

module.exports = async (storeId, layoutId, layoutData, inventory, products, accessToken) => {
  try {
    const checkTransitionLayout = await getTransitionLayouts({ storeId, layoutId }) // chequeo si el layout actual es un LT``

    if (checkTransitionLayout.inTransition === true) {
      const prices = await getPrices(storeId, checkTransitionLayout.targetLayout)
      const layout2 = await reiteLayout.get(accessToken, checkTransitionLayout.targetLayout)
      if (!layoutData.data || !layout2.data) {
        throw new Error('Los datos del layout no están definidos')
      }

      const difference = await compareLayouts(layoutData.data, layout2.data) // aca tengo que mandar los layoutdata, no los ids
      if (!difference.noChanges) {
        const productsToInclude = difference.productsToRemove.filter(product => {
          const inventoryProduct = inventory.data.products.find(p => p.productId === product.productId)
          return inventoryProduct && inventoryProduct.quantity > 0
        })
        if (productsToInclude.length > 0) {
          const numberOfTransition = checkTransitionLayout.transitionLayouts.length + 2
          const newTransitionLayout = await createTransitionLayout(checkTransitionLayout.targetLayout, productsToInclude, numberOfTransition)
          const checkNewTransitionLayout = {
            trays: newTransitionLayout.layout
          }
          const differenceInTransitions = await compareLayouts(layoutData.data, checkNewTransitionLayout)
          if (!differenceInTransitions.noChanges) {
            const createNewTransitionLayout = await reiteLayout.create(accessToken, newTransitionLayout)

            if (createNewTransitionLayout.successful) {
              const transitionPrices = {}
              createNewTransitionLayout.data.productsIds.forEach(productId => {
                const product = products.data.find(p => p.productId === productId)
                transitionPrices[productId] = product ? product.prices[storeId] : prices[productId]
              })

              const assignNewTransitionLayout = await reiteStore.updateLayout(accessToken, { storeId, layoutId: createNewTransitionLayout.data.id }, { prices: transitionPrices })
              const activeLayout = {
                layoutId: createNewTransitionLayout.data.id,
                productsIds: createNewTransitionLayout.data.productsIds,
                is_transition: true,
                transition_stage: numberOfTransition
              }
              await putLayoutStore(storeId, { oldLayout: layoutId, oldProductsIds: null }, activeLayout)
              if (assignNewTransitionLayout.successful) {
                return createNewTransitionLayout
              }
            }
          } else {
            return {
              successful: false,
              data: {
                message: 'No hay cambios en la transición'
              }
            }
          }
        } else {
          await reiteStore.updateLayout(accessToken, { storeId, layoutId: checkTransitionLayout.targetLayout }, { prices })
          const redisKey = `prices:${storeId}:${checkTransitionLayout.targetLayout}`
          await deletePrices(redisKey)
          await putLayoutRecord(storeId, layoutId)
          return {
            successful: true,
            data: {
              id: checkTransitionLayout.targetLayout
            }
          }
        }
      }
      await reiteStore.updateLayout(accessToken, { storeId, layoutId: checkTransitionLayout.targetLayout }, { prices })
      const redisKey = `prices:${storeId}:${checkTransitionLayout.targetLayout}`
      await deletePrices(redisKey)

      await putLayoutRecord(storeId, layoutId)
      return {
        successful: true,
        data: {
          id: checkTransitionLayout.targetLayout
        }
      }
    } else {
      return {
        successful: false,
        data: {
          message: 'No es un layout en transición'
        }
      }
    }
  } catch (error) {
    console.log('Error al obtener y procesar los datos:', error)
    throw new Error('Error en controlLayout:', error)
  }
}
