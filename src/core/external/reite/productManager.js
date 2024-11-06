const reiteToken = require('../../../services/reite/token')
const reiteProduct = require('../../../services/reite/product')
const { currentReiteProducts } = require('../../../../custom_scripts/provider/index')

module.exports = {
  list: async (payload) => {
    const { eans } = payload
    const { accessToken } = await reiteToken.auth()
    return reiteProduct.list(accessToken, eans)
  },
  getProduct: async (payload) => {
    const { accessToken } = await reiteToken.auth()
    return reiteProduct.getProduct(accessToken, payload)
  },
  noMatch: async (payload) => {
    const { accessToken } = await reiteToken.auth()
    const { data: products } = await reiteProduct.list(accessToken)

    const noMatchProducts = []
    const matchedProducts = []
    for (const product of products) {
      const productDB = currentReiteProducts.find(p => p.productId === product.productId)
      if (productDB === undefined) {
        noMatchProducts.push(product)
      } else {
        matchedProducts.push(productDB)
      }
    }

    return { noMatchProducts, matchedProducts }
  },
  updatePrice: async (productId, body) => {
    const { accessToken } = await reiteToken.auth()

    const data = {
      brand: body.brand,
      name: body.name,
      prices: {
        [body.storeId]: body.price
      }
    }
    return reiteProduct.updatePrice(accessToken, productId, data)
  }
}
