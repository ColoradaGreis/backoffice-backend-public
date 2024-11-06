module.exports = function (flatData) {
  const maxQuantities = {} // Copia los valores existentes

  flatData.forEach((tray) => {
    const productId = tray.productId
    const maxQuantity = tray.maxQuantity
    if (maxQuantities[productId]) {
      // Si el producto ya existe en maxQuantities, sumamos el valor nuevo
      maxQuantities[productId] += maxQuantity
      // console.log('productId', productId)
      // console.log('maxQuantities', maxQuantities[productId])
    } else {
      // Si el producto no existe en maxQuantities, lo inicializamos con el valor nuevo
      maxQuantities[productId] = maxQuantity
    }
  })
  // console.log('maxQuantities', maxQuantities)
  return maxQuantities
}
