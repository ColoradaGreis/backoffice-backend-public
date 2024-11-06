/* eslint-disable camelcase */
const currentProducts = require('./products.json')
const currentReiteProducts = []

module.exports = {
  load: async (models) => {
    console.log('loading products')

    for (const product of currentProducts) {
      // console.log(product)
      let third_category = null
      if (product.third_category.length > 0) {
        // console.log(product.third_category, product.third_category.length)
        const category = await models.third_category.findOne({
          where: { name: product.third_category.toLowerCase() }
        })
        // console.log(category)
        if (category) {
          third_category = category.id
        }
        // console.log(third_category, 'third_category')
      }
      const second_category = await models.second_category.findOne({
        where: { name: product.second_category.toLowerCase() }
      })
      const first_category = await models.first_category.findOne({
        where: { name: product.first_category.toLowerCase() }
      })

      const productData = {
        ean: product.ean,
        sku_sap: product.sku_sap,
        sku_vtex: product.sku_vtex,
        short_name: product.short_name,
        long_name: product.long_name,
        measure_unit: product.measure_unit || 'un',
        content_detail: product.content_detail || 1,
        brand: product.brand,
        proxy_duration: product.proxy_duration,
        pack: product.pack,
        generated_ean: product.generated_ean,
        autoshoppable_available: product.autoshoppable_available,
        first_category: first_category?.id || 12,
        second_category: second_category?.id || 46,
        third_category
      }
      console.log(productData)

      await models.product.create(productData)
    }
    console.log('Products loaded successfully!')
    console.log('service providers loaded!')
  },
  syncTrained: async (models) => {
    try {
      const productList = await models.product.findAll()

      for (const product of productList) {
        const dbProductName = product.short_name ? product.short_name.toLowerCase() : null
        // console.log(dbProductName, 'dbproductname----------------')

        const matchingProduct = currentReiteProducts.find(
          (currentReiteProduct) => currentReiteProduct.productName && currentReiteProduct.productName.toLowerCase() === dbProductName
        )

        if (matchingProduct !== undefined && matchingProduct.productId !== product.id) {
          await models.service_provider_product.update(
            { product_id: product.id },
            { where: { internal_id: matchingProduct.productId } }
          )
        }
        //  else {
        //   console.log(JSON.parse(JSON.stringify(product)), 'No se encontró un objeto coincidente')
        // }
      }

      console.log('Sincronización completada con éxito')
    } catch (error) {
      console.error('Error durante la sincronización:', error)
    }
  }
}

// async function addTrainedProducts (models, product) {
//   const serviceProviderId = 1
//   await models.service_provider_product.create({ train_status: false, stock: 0, product_id: product.id, service_provider_id: serviceProviderId })
// }
