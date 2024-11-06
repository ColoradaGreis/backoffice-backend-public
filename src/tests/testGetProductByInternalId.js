const { getProductInfoByInternalId } = require('../utils/functions/index')
const productMetadata = {
  metadata: {
    EAN: '8179967988V00'
  }
};
(async () => {
  try {
    const result = await getProductInfoByInternalId(productMetadata)
    console.log(result)
  } catch (error) {
    console.error('Error al obtener y procesar los datos:', error)
  }
})()
