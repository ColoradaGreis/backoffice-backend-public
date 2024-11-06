module.exports = (fn) => {
  return function (req, res, next) {
    fn(req, res).catch((err) => {
      next(err) // decimos que debe continuar al manejador de errores
    })
  }
}
