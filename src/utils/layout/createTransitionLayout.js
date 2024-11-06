const { getLayout } = require('../../core/external/reite/layoutManager')

module.exports = async function (layoutId, productsToInclude, number) {
  const layout2 = await getLayout(layoutId)
  const transitionLayout = {
    name: 'transition ' + number + ' to ' + layout2.data.name,
    layout: layout2.data.trays
  }

  productsToInclude.forEach(product => {
    if (product.tray >= 0 && product.tray < transitionLayout.layout.length) {
      const tray = transitionLayout.layout[product.tray]
      if (product.column >= 0 && product.column < tray.columns.length) {
        tray.columns[product.column].productId = product.productId
        tray.columns[product.column].maxQuantity = 1
      } else {
        console.warn(`Índice de columna fuera de rango: ${product.column} en bandeja ${product.tray}`)
      }
    } else {
      console.warn(`Índice de bandeja fuera de rango: ${product.tray}`)
    }
  })
  return transitionLayout
}
