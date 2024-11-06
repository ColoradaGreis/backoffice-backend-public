const reiteStore = require('../services/reite/store')
const reiteLayout = require('../services/reite/layout')
const productManager = require('../services/reite/product')
const reiteToken = require('../services/reite/token')
const crossReferenceDataStores = require('../utils/crossReferenceDataStores')
const crossReferenceData = require('../utils/crossReferenceData')
const { layoutControl } = require('../utils/functions')

module.exports = {
  list: async (payload) => {
    try {
      const { accessToken } = await reiteToken.auth()

      const storeData = await reiteStore.get(accessToken, payload)
      const inventoryData = await reiteStore.getInventory(accessToken, payload)

      const layoutData = await reiteLayout.get(accessToken, storeData.data.layoutId)
      const productsData = await productManager.list(accessToken)
      const result = crossReferenceData(layoutData, inventoryData, productsData)

      return result
    } catch (error) {
      console.error('Error al obtener y procesar los datos:', error)
      throw error
    }
  },
  listAll: async (payload) => {
    try {
      const { accessToken } = await reiteToken.auth()
      const result = []
      const storeRequest = payload.map(async (storeId) => {
        const storeData = await reiteStore.get(accessToken, storeId)
        // console.log('storeData', storeData)

        if (storeData.data.layoutId !== null) {
          let [inventoryData, layoutData, productsData] = await Promise.all([
            reiteStore.getInventory(accessToken, storeId),
            reiteLayout.get(accessToken, storeData.data.layoutId),
            reiteStore.getProducts(accessToken, storeId)
          ])
          // console.log('ya está el promise.all')
          // acá hago el control
          const layoutCheck = await layoutControl(storeId, storeData.data.layoutId, layoutData, inventoryData, productsData, accessToken)
          // console.log('layoutCheck', layoutCheck)
          if (layoutCheck && layoutCheck.successful) {
            // Volver a obtener inventoryData y actualizar layoutData
            inventoryData = await reiteStore.getInventory(accessToken, storeId)
            layoutData = await reiteLayout.get(accessToken, layoutCheck.data.id)
            productsData = await reiteStore.getProducts(accessToken, storeId)
          }

          const resultStore = await crossReferenceDataStores(layoutData, inventoryData, productsData)
          // console.log('resultStore', resultStore)

          return {
            storeId,
            storeName: storeData.data.name,
            products: resultStore
          }
        } else {
          return {
            storeId,
            storeName: storeData.data.name,
            layoutId: storeData.layoutId
          }
        }
      })
      const storeResults = await Promise.all(storeRequest)
      result.push(...storeResults)
      return result
    } catch (error) {
      console.error('Error al obtener y procesar los datos:', error)
      throw error
    }
  },
  shoppingList: async (payload) => { // fuera de uso
    const result = []
    const { accessToken } = await reiteToken.auth()
    try {
      const storeRequests = payload.map(async (storeId) => {
        const storeData = await reiteStore.get(accessToken, storeId)

        if (storeData.data.layoutId !== null) {
          const [inventoryData, layoutData, productsData] = await Promise.all([
            reiteStore.getInventory(accessToken, storeId),
            reiteLayout.get(accessToken, storeData.data.layoutId),
            reiteStore.getProducts(accessToken, storeId)
          ])

          // acá hago el cruce de datos y armo la lista de compras
          const resultStore = await crossReferenceDataStores(layoutData, inventoryData, productsData)

          return {
            storeId,
            products: resultStore
          }
        } else {
          return {
            storeId,
            layoutId: storeData.layoutId
          }
        }
      })

      // Esperar a que todas las solicitudes se resuelvan
      const storeResults = await Promise.all(storeRequests)

      // Agregar los resultados al array result
      result.push(...storeResults)
      const combinedProducts = {}

      result.forEach((store) => {
        store.products.forEach((product) => {
          const { productId, short_name, aisle, productName, requested } = product //eslint-disable-line
          if (requested > 0) {
            if (!combinedProducts[productId]) {
              combinedProducts[productId] = {
                productId,
              short_name, //eslint-disable-line
                aisle,
                productName,
                requested: 0
              }
            }

            // Añadir la condición para evitar que requested sea negativo

            combinedProducts[productId].requested += requested
          }
        })
      })
      const combinedProductsArray = Object.values(combinedProducts)

      return combinedProductsArray
    } catch (error) {
      console.error('Error al obtener y procesar los datos:', error)
      throw error
    }
  }
}
