module.exports = function (trays) {
  return trays.reduce((result, tray) => {
    tray.columns.forEach((column) => {
      result.push(column)
    })
    return result
  }, [])
}
