const reiteToken = require('../../../services/reite/token')
const reiteStore = require('../../../services/reite/store')
const reiteLayout = require('../../../services/reite/layout')
const reiteProduct = require('../../../services/reite/product')

module.exports = {
  list: async (payload) => {
    const { accessToken } = await reiteToken.auth()
    return reiteStore.list(accessToken)
  },
  getInventory: async (payload) => {
    const { accessToken } = await reiteToken.auth()
    return reiteStore.getInventory(accessToken, payload.storeId)
  },
  getStock: async (payload) => {
    let result = {}
    const { accessToken } = await reiteToken.auth()
    const storeId = payload.storeId
    const limit = payload.limit
    const { data: layoutList } = await reiteLayout.list(accessToken)
    const { data: productList } = await reiteProduct.list(accessToken)
    const { data: storeList } = await reiteStore.list(accessToken)
    const currentStore = findStore(storeId, storeList)
    const currentLayout = findLayout(currentStore.layoutId, layoutList)
    const productStatusList = getProductStatus(currentStore, currentLayout, productList)
    result = { storeId: currentStore.storeId, name: currentStore.name, stock: formatList(productStatusList, limit) }
    return result
  },
  getProducts: async (payload) => {
    const { accessToken } = await reiteToken.auth()
    return reiteStore.getProducts(accessToken, payload)
  },
  open: async (id, userClientId, openStoreType) => {
    const { accessToken } = await reiteToken.auth()
    return reiteStore.open(accessToken, id, userClientId, openStoreType)
  },
  putInventory: async (id, added, removed) => {
    const { accessToken } = await reiteToken.auth()
    return reiteStore.putInventory(accessToken, id, added, removed)
  },
  download: async (payload) => {
    const { accessToken } = await reiteToken.auth()
    const productList = await reiteStore.getProducts(accessToken, payload.storeId)
    // console.log(productList, 'productList')
    const inventory = await reiteStore.getInventory(accessToken, payload.storeId)
    const result = []
    productList.data.map((product) => {
      const quantityProd = inventory.data.products.find((prod) => prod.productId === product.productId)
      return result.push({
        productId: product.productId,
        name: product.productName,
        quantity: quantityProd.quantity,
        price: '$' + product.prices[payload.storeId]
      })
    })
    return result
  },
  getById: async (payload) => {
    const { accessToken } = await reiteToken.auth()
    return reiteStore.get(accessToken, payload.storeId)
  },
  updateLayout: async (params, body) => {
    const { accessToken } = await reiteToken.auth()
    // me conviene que cuando le pegan a esta ruta, me manden el layout viejo
    // me traigo la tienda y reviso el layout actual, reviso en mi db si la ultima entrada parta esa store es ese layoutID, si no es, lo agrego y agrego el layout nuevo, sino solo agrego el layout nuevo
    return reiteStore.updateLayout(accessToken, params, body)
  }
}

function findStore (storeId, storeList) {
  for (const store of storeList) {
    if (store.storeId === storeId) {
      return store
    }
  }
}

function findLayout (layoutId, layoutList) {
  for (const layout of layoutList) {
    if (layoutId === layout.id) {
      return layout
    }
  }
}

function findProduct (productId, productList) {
  for (const product of productList) {
    if (product.productId === productId) {
      return product
    }
  }
}

function findTrays (productId, layout) {
  const productCount = { maxQuantity: 0 }
  for (const tray of layout.trays) {
    for (const column of tray.columns) {
      if (productId === column.productId) {
        productCount.maxQuantity += column.maxQuantity
      }
    }
  }
  return productCount
}

function formatList (productStatusList, limit) {
  const formattedResult = []
  for (const product of productStatusList) {
    if (limit) {
      if (Number(product.quantity) <= limit) {
        formattedResult.push({ productName: product.productName, stock: product.quantity + '/' + product.maxQuantity })
      }
    } else {
      formattedResult.push({ productName: product.productName, stock: product.quantity + '/' + product.maxQuantity })
    }
  }
  return formattedResult
}

function getProductStatus (currentStore, currentLayout, productList) {
  const productResult = []
  for (const product of currentStore.products) {
    productResult.push({ ...product, ...findProduct(product.productId, productList), ...findTrays(product.productId, currentLayout) })
  }
  return productResult
}
