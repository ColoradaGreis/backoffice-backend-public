module.exports = function (productId, trays) {
  const location = []

  trays.forEach((tray, trayIndex) => {
    tray.columns.forEach((column, columnIndex) => {
      if (column.productId === productId) {
        location.push({
          tray: trayIndex + 1,
          column: columnIndex + 1
        })
      }
    })
  })

  return location
}
