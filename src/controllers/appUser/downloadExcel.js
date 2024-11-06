const appUserManager = require('../../core/appUserManager')

module.exports = async function (req, res) {
  // console.log('entre al downloadExcel')
  const buffer = await appUserManager.downloadExcel()
  const day = new Date().getDate()
  const month = new Date().getMonth() + 1
  const year = new Date().getFullYear()

  const fullDate = `${day}-${month}-${year}`

  // Configurar las cabeceras de la respuesta para la descarga del archivo
  res.setHeader('Content-Disposition', `attachment; filename=usuarios${fullDate}.xlsx`)
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Length', buffer.length)

  // Enviar el archivo Excel como respuesta al cliente
  res.send({ buffer, filename: `Usuarios${fullDate}.xlsx` })
}

/**
 * @openapi
 * /app-user/download/excel:
 *   get:
 *     tags: [User]
 *     description: Descargar un archivo Excel.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Archivo Excel descargado con éxito.
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             example:
 *               // Contenido del archivo Excel
 *       400:
 *         description: No se pudo descargar el archivo Excel.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No se pudo descargar el archivo Excel.'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
