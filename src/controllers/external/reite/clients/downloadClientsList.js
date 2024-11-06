const { validationResult } = require('express-validator')
const clientManager = require('../../../../core/external/reite/clientManager')
const { formatTimestampToDate } = require('../../../../utils/functions/index')
const ExcelJS = require('exceljs')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  // console.log(req.query)

  const result = await clientManager.list({
    ...req.query,
    searchTerm: req.query.searchTerm
  })

  if (result) {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Clientes')

    // worksheet.addRow(['Nombre', 'Correo electrónico', 'Teléfono', 'Fecha Creación'])

    const headerStyle = {
      font: { bold: true, color: { argb: 'FFFFFF' } },
      alignment: { horizontal: 'center' },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ff4f81bd' } },
      border: { bottom: { style: 'thick', color: { argb: 'fffafbfd' } } },
      width: 20
    }

    const evenRowStyle = {
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ffb8cce4' } },
      alignment: { horizontal: 'center' },
      width: 20,
      border: { bottom: { style: 'thin', color: { argb: 'fffafbfd' } } }
    }

    const oddRowStyle = {
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ffdce6f1' } },
      alignment: { horizontal: 'center' },
      border: { bottom: { style: 'thin', color: { argb: 'fffafbfd' } } },
      width: 20
    }

    worksheet.columns = [
      { header: 'Nombre', key: 'user.name', width: 43 },
      { header: 'Correo electrónico', key: 'user.email', width: 34 },
      { header: 'Teléfono', key: 'user.phone', width: 22 },
      { header: 'Fecha Creación', key: 'user.creation.timestamp', width: 20 }

    ]

    // Aplicar estilos al encabezado
    worksheet.getRow(1).eachCell((cell) => {
      cell.style = headerStyle
    })

    result.forEach((user, index) => {
      const formattedCreationDate = formatTimestampToDate(user.creation.timestamp)
      const row = worksheet.addRow([user.name, user.email, `${user.phone.areaCode}${user.phone.number}`, formattedCreationDate])

      // Aplicar estilos a las filas alternas
      row.eachCell((cell, cellNumber) => {
        if (index % 2 === 0) {
          // Fila par
          cell.style = evenRowStyle
        } else {
          // Fila impar
          cell.style = oddRowStyle
        }
      })
    })

    const buffer = await workbook.xlsx.writeBuffer()
    const day = new Date().getDate()
    const month = new Date().getMonth() + 1
    const year = new Date().getFullYear()

    const fullDate = `${day}-${month}-${year}`

    res.setHeader('Content-Disposition', `attachment; filename=Clientes${fullDate}.xlsx`)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Length', buffer.length)

    res.send({ buffer, filename: `Clientes${fullDate}.xlsx` })
  }
}

/**
 * @openapi
 * /reite/clients/list/download:
 *   get:
 *     tags: [Reite Clients]
 *     description: Descargar lista de clientes de Reite con detalles.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startTimestamp
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio para filtrar la lista de clientes (opcional).
 *       - in: query
 *         name: endTimestamp
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin para filtrar la lista de clientes (opcional).
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Término de búsqueda para filtrar la lista de clientes (opcional).
 *     responses:
 *       200:
 *         description: Lista de clientes descargada con éxito.
 *         content:
 *           application/json:
 *             example:
 *               - user:
 *                   name: 'Cliente A'
 *                   email: 'cliente.a@example.com'
 *                   phone: { areaCode: '123', number: '4567890' }
 *                 creation:
 *                   timestamp: '2023-01-01T12:00:00Z'
 *               - user:
 *                   name: 'Cliente B'
 *                   email: 'cliente.b@example.com'
 *                   phone: { areaCode: '987', number: '6543210' }
 *                 creation:
 *                   timestamp: '2023-01-02T14:30:00Z'
 *       400:
 *         description: No se encontraron clientes.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No hay clientes disponibles en este momento.'
 *       422:
 *         description: Errores de validación en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               errors: [{ param: 'searchTerm', msg: 'El campo de búsqueda es inválido' }]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
