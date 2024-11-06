/* eslint-disable camelcase */
const productManager = require('../../core/productManager')

module.exports = async function (productMetadata) {
  // console.log('EAN', productMetadata)
  let productEan = productMetadata.metadata.EAN

  if (!productEan) {
    return null
  }

  if (typeof productEan !== 'string') {
    productEan = String(productEan)
  }
  try {
    if (!productMetadata.metadata.EAN) {
      return null
    }
    const mainProduct = await productManager.findByEAN({ ean: productEan })
    if (mainProduct.message) {
      // Manejar el caso donde no se encuentra el registro
      return null
    }
    // console.log(mainProduct, 'mainProduct')
      const { short_name, first_category, second_category, third_category  } = mainProduct.data //eslint-disable-line
    const response = {
      short_name,
      category: `${first_category} > ${second_category} > ${third_category || ''}`
    }
    return response
  } catch (error) {
    // Manejar errores de la base de datos
    console.error('Error al obtener información del producto:', error)
    throw error
  }
}
