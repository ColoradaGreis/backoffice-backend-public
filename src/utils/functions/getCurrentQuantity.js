module.exports = (productId, storeProducts) => {
  // console.log('storeProducts', storeProducts)
  const productStore = storeProducts.find((p) => p.productId === productId)
  return productStore ? productStore.quantity : 0
}
