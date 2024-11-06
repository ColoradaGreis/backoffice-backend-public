const ExcelJS = require('exceljs')
const storeReiteManager = require('../../core/external/reite/storeManager')
const { validationResult } = require('express-validator')

module.exports = async function (req, res) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const result = await storeReiteManager.download(req.query)
  if (result) {
    //   console.log(result, 'resultado')
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Ajuste de stock')

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
      { header: 'ID', key: 'productId', width: 8 },
      { header: 'Nombre', key: 'name', width: 28 },
      { header: 'Cantidad', key: 'quantity', width: 15 },
      { header: 'precio', key: 'price', width: 10 }
    ]

    // Aplicar estilos al encabezado
    worksheet.getRow(1).eachCell((cell) => {
      cell.style = headerStyle
    })

    // Agregar datos de los usuarios al archivo Excel
    result.forEach((product, index) => {
      const row = worksheet.addRow([product.productId, product.name, product.quantity, product.price])

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
    // Escribir el archivo Excel en un buffer
    const buffer = await workbook.xlsx.writeBuffer()

    const day = new Date().getDate()
    const month = new Date().getMonth() + 1
    const year = new Date().getFullYear()

    const fullDate = `${day}-${month}-${year}`

    // Configurar las cabeceras de la respuesta para la descarga del archivo
    res.setHeader('Content-Disposition', `attachment; Inventario${fullDate}.xlsx`)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Length', buffer.length)
    return res.send({ buffer, filename: `Inventario${fullDate}.xlsx` })
    // return res.send(buffer)
  }
}

/**
 * @openapi
 * /store/download-adjustment:
 *   get:
 *     tags: [Stores]
 *     description: Descargar ajuste de stock para una tienda específica.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: storeId
 *         schema:
 *           type: string
 *           minLength: 5
 *         description: ID de la tienda para la cual se desea realizar la descarga.
 *         required: true
 *     responses:
 *       200:
 *         description: Ajuste de stock descargado con éxito.
 *         content:
 *           application/json:
 *             example:
 *               // Resultado de la descarga del ajuste de stock
 *       422:
 *         description: Errores de validación en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               errors: [
 *                 { param: 'storeId', msg: 'ID de tienda requerido y debe tener al menos 5 caracteres.' }
 *               ]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
