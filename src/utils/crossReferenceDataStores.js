const { flattenLayoutData, getCurrentQuantity, getProductName, getProductInfoByInternalId } = require('./functions/index')
module.exports = async function (layoutData, storeData, productsData) {
  const flatData = flattenLayoutData(layoutData.data.trays) // btener un array de productos aplanado
  // const maxQuantities = calculateMaxQuantities(flatData) // obtener un objeto que mapea cada productId a su cantidad máxima
  const maxQuantities = layoutData.data.maxQuantities // obtener un objeto que mapea cada productId a su cantidad máxima
  // console.log('maxQuantities', maxQuantities)
  const productInfoMap = {} //  para almacenar información sobre cada producto

  for (const product of flatData) { // Iterar sobre cada producto en el layout
    const { productId } = product // obtengo el productId
    const currentQuantity = getCurrentQuantity(productId, storeData.data.products) // obtengo la cantidad actual
    const productName = getProductName(productId, productsData.data) // obtengo el nombre del producto
    const productMetadata = await productsData.data.find((p) => p.productId === productId) // obtengo la metadata del producto
    const productInfo = await getProductInfoByInternalId(productMetadata) // obtengo el shot_name y categories del producto, lo busco en la DB nuestra

    if (!productInfoMap[productId]) { // compruebo si el producto ya existe en productInfoMap
      productInfoMap[productId] = {
        productId,
        category: productInfo?.category ? productInfo.category.charAt(0).toUpperCase() + productInfo.category.slice(1) : null,
        short_name: productInfo?.short_name || null,
        productName,
        requested: 0
      }
    }
    if (currentQuantity >= 0) { // Si la cantidad actual es mayor o igual a 0, me aseguro que haya faltante de stock
      const requested = maxQuantities[productId] - currentQuantity // calculo la cantidad faltante
      productInfoMap[productId].requested = Math.max(requested, 0) // si requested es negativo, lo cambio a 0
    } else {
      productInfoMap[productId].requested = maxQuantities[productId]
    }
    // console.log('productInfoMap', productInfoMap[productId].requested)
  }
  const result = Object.values(productInfoMap).filter(product => {
    // Filtrar productos donde el faltante es superior al 30% de la cantidad máxima
    const percentageMissing = (product.requested / maxQuantities[product.productId]) * 100
    return percentageMissing > 30
  })

  return result
}
