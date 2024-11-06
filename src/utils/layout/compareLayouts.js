module.exports = async function (layout1, layout2) {
  if (!layout1.trays || !layout2.trays) {
    console.error('Las propiedades "trays" no existen en uno de los layouts.', { layout1, layout2 })
    throw new Error('Las propiedades "trays" no existen en uno de los layouts.')
  }

  try {
    const differences = {
      traysQuantityDifference: null,
      columnsQuantityDifferences: [],
      productsToRemove: [],
      productsToAdd: [],
      productsPositionChanged: [],
      noChanges: true // Inicialmente asumimos que no hay cambios
    }

    // Comparar cantidad de trays
    if (layout1.trays.length !== layout2.trays.length) {
      differences.traysQuantityDifference = {
        layout1: layout1.trays.length,
        layout2: layout2.trays.length
      }
      differences.noChanges = false
    }

    const productOccurrencesInLayout2 = {}

    // Recorrer los trays de ambos layouts
    layout1.trays.forEach((tray1, trayIndex) => {
      const tray2 = layout2.trays[trayIndex]

      // Verificar que tray2 esté definido
      if (!tray2) {
        tray1.columns.forEach((col1, colIndex) => {
          differences.productsToRemove.push({
            tray: trayIndex,
            column: colIndex,
            productId: col1.productId,
            maxQuantity: col1.maxQuantity
          })
        })
        differences.noChanges = false
        return
      }

      // Comparar cantidad de columnas en cada tray
      if (tray1.columns.length !== tray2.columns.length) {
        differences.columnsQuantityDifferences.push({
          tray: trayIndex,
          layout1: tray1.columns.length,
          layout2: tray2.columns.length
        })
        differences.noChanges = false
      }

      // Recorrer las columnas de cada tray
      tray1.columns.forEach((col1, colIndex) => {
        const productPositionsInLayout2 = []
        layout2.trays.forEach((tray2, tray2Index) => {
          tray2.columns.forEach((col2, col2Index) => {
            if (col2.productId === col1.productId) {
              productPositionsInLayout2.push({ tray: tray2Index, column: col2Index })
              productOccurrencesInLayout2[col2.productId] = (productOccurrencesInLayout2[col2.productId] || 0) + 1
            }
          })
        })

        // Identificar productos únicos en layout1 y no en layout2
        if (productPositionsInLayout2.length === 0) {
          differences.productsToRemove.push({
            tray: trayIndex,
            column: colIndex,
            productId: col1.productId,
            maxQuantity: col1.maxQuantity
          })
          differences.noChanges = false
        } else {
          // Detectar cambios de posición incluyendo cambios de bandeja
          if (!productPositionsInLayout2.some(pos => pos.tray === trayIndex && pos.column === colIndex)) {
            differences.productsPositionChanged.push({
              productId: col1.productId,
              from: {
                tray: trayIndex,
                column: colIndex
              },
              to: productPositionsInLayout2
            })
            differences.noChanges = false
          }
        }
      })

      // Identificar productos únicos en layout2 y no en layout1
      tray2.columns.forEach((col2, col2Index) => {
        const productExistsInLayout1 = layout1.trays.some(tray1 =>
          tray1.columns.some(col1 => col1.productId === col2.productId)
        )
        if (!productExistsInLayout1) {
          differences.productsToAdd.push({
            tray: trayIndex,
            column: col2Index,
            productId: col2.productId,
            maxQuantity: col2.maxQuantity
          })
          differences.noChanges = false
        }
      })
    })

    // Eliminar productos que están en ambas listas de productsToRemove y productsToAdd
    const productsToRemoveSet = new Set(differences.productsToRemove.map(p => p.productId))
    const productsToAddSet = new Set(differences.productsToAdd.map(p => p.productId))

    differences.productsToRemove = differences.productsToRemove.filter(p => !productsToAddSet.has(p.productId))
    differences.productsToAdd = differences.productsToAdd.filter(p => !productsToRemoveSet.has(p.productId))

    differences.productOccurrencesInLayout2 = productOccurrencesInLayout2
    return differences
  } catch (err) {
    console.log(err)
  }
}
