const reiteToken = require('../../../services/reite/token')
const reiteRestock = require('../../../services/reite/restock')
// const reiteLayout = require('../../../services/reite/layout')
// const reiteProduct = require('../../../services/reite/product')
// const reiteStore = require('../../../services/reite/store')
// const models = require('../../../database')

module.exports = {
  list: async (payload) => {
    const { accessToken } = await reiteToken.auth()
    return reiteRestock.list(accessToken, payload)
  }
  // sheet: async (payload) => {
  //   console.log('called')
  //   const result = []
  //   let listedProducts = []
  //   const { accessToken } = await reiteToken.auth()
  //   const storeList = await reiteStore.list(accessToken)
  //   const { data: productList } = await reiteProduct.list(accessToken)
  //   for (const store of storeList.data) {
  //     if (store.active) {
  //       const { data: layout } = await reiteLayout.get(accessToken, store.layoutId)
  //       const productStatus = getProductStatus(store, layout, productList)
  //       listedProducts = listProducts(result, productStatus)
  //     }
  //   }

  //   // console.log(listedProducts)

  //   for (const store of storeList.data) {
  //     if (store.active) {
  //       console.log('====================================')
  //       console.log(store.storeId)
  //       const { data: layout } = await reiteLayout.get(accessToken, store.layoutId)
  //       const productStatus = getProductStatus(store, layout, productList)
  //       countProducts(store, listedProducts, productStatus)
  //     }
  //   }
  //   return listedProducts
  // }
}

// function listProducts (result, productStatus) {
//   for (const product of productStatus) {
//     const header = {}
//     header.producto = product.productName
//     header.categoria = ''
//     result.push(header)
//   }
//   return result.filter((obj, index, self) => {
//     const foundIndex = self.findIndex(item => item.producto === obj.producto)
//     return foundIndex === index
//   })
// }

// function countProducts (store, listedProducts, productStatus) {
//   for (const listed of listedProducts) {
//     listed['layout ' + store.name] = 0
//     listed['stock ' + store.name] = 0
//     listed['solictado ' + store.name] = 0
//     if (!listed.total) {
//       listed.total = 0
//     }
//     getCount(store, listed, productStatus)
//     const temp = listed.total
//     delete listed.total
//     listed.total = temp
//   }
// }

// function getCount (store, listed, productStatus) {
//   for (const product of productStatus) {
//     if (listed.producto === product.productName) {
//     // console.log('match')
//       listed['layout ' + store.name] = product.maxQuantity
//       listed['stock ' + store.name] = product.quantity
//       listed['solictado ' + store.name] = product.maxQuantity - product.quantity
//       listed.total = listed.total + (product.maxQuantity - product.quantity)
//     }
//   }
// }

// function getProductStatus (currentStore, currentLayout, productList) {
//   const productResult = []
//   for (const product of currentStore.products) {
//     productResult.push({ ...product, ...findProduct(product.productId, productList), ...findTrays(product.productId, currentLayout) })
//   }
//   return productResult
// }

// function findProduct (productId, productList) {
//   for (const product of productList) {
//     if (product.productId === productId) {
//       return product
//     }
//   }
// }

// function findTrays (productId, layout) {
//   const productCount = { maxQuantity: 0 }
//   for (const tray of layout.trays) {
//     for (const column of tray.columns) {
//       if (productId === column.productId) {
//         productCount.maxQuantity += column.maxQuantity
//       }
//     }
//   }
//   return productCount
// }
