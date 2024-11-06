const { flattenLayoutData, calculateMaxQuantities, getCurrentQuantity, getProductName, findProductLocation } = require('./functions/index')
module.exports = function (layoutData, storeData, productsData) {
  const flatData = flattenLayoutData(layoutData.data.trays)

  const maxQuantities = calculateMaxQuantities(flatData)

  const productInfoMap = {}

  flatData.forEach((product) => {
    const { productId } = product
    const currentQuantity = getCurrentQuantity(productId, storeData.data.products)
    const productName = getProductName(productId, productsData.data)
    const location = findProductLocation(productId, layoutData.data.trays)
    if (!productInfoMap[productId]) {
      // Si es la primera vez que encontramos este producto, creamos un objeto con la información
      productInfoMap[productId] = {
        productId,
        productName,
        requested: 0,
        location: []
      }
    }
    productInfoMap[productId].requested = maxQuantities[productId] - currentQuantity
    const existingLocation = productInfoMap[productId].location.find(
      (existing) =>
        existing.tray === location.tray && existing.column === location.column
    )

    // Si la ubicación no existe, la agregamos
    if (!existingLocation) {
      productInfoMap[productId].location = location
    }
  })
  const result = Object.values(productInfoMap)
  const sortedData = result.sort(customSort)
  return sortedData
}

function customSort (a, b) {
  const trayA = a.location[0].tray
  const trayB = b.location[0].tray
  const columnA = a.location[0].column
  const columnB = b.location[0].column

  if (trayA === trayB) {
    // Si las "trays" son iguales, ordena por "columns"
    return columnA - columnB
  } else {
    // Si las "trays" son diferentes, ordena por "trays"
    return trayA - trayB
  }
}
