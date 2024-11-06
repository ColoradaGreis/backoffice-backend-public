module.exports = (productId, productsData) => {
  const product = productsData.find((p) => p.productId === productId)
  return product?.productName || ''
}
