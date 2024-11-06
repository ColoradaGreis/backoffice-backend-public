module.exports = function (timestamp) {
  const milliseconds = timestamp * 1000
  const date = new Date(milliseconds)

  const formatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }

  const dateFormatter = new Intl.DateTimeFormat('es-ES', formatOptions)
  const formattedDate = dateFormatter.format(date)

  return formattedDate
}
