const ExcelJS = require('exceljs')
const stockManager = require('../../core/stockManager')
const { validationResult } = require('express-validator')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)

  if (!reqErrors.isEmpty()) {
    // console.log(reqErrors)
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const idParam = req.query.id

  // Separa los IDs en un array
  const ids = idParam.split('&')
  // console.log('ids', ids)
  const result = await stockManager.shoppingList(ids)
  // console.log('result', result)

  if (result) {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Lista de compras')
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
      { header: 'Producto', key: 'productName', width: 43 },
      { header: 'Solicitado', key: 'requested', width: 16 },
      { header: 'Categoría', key: 'aisle', width: 11 }
    ]

    // worksheet.addRow(['Producto', 'Solicitado', 'Categoría'])

    // Aplicar estilos al encabezado
    worksheet.getRow(1).eachCell((cell) => {
      cell.style = headerStyle
    })

    result.forEach((product, index) => {
      const row = worksheet.addRow([product.productName, product.requested, product.aisle || ''])

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

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename=ListaDeCompras${fullDate}.xlsx`)
    res.setHeader('Content-Length', buffer.length)
    return res.send({ buffer, filename: `ListaDeCompras${fullDate}.xlsx` })
    // return res.send(buffer)
  }
}

/**
 * @openapi
 * /stores/shopping-list/download:
 *   get:
 *     tags: [Stock]
 *     description: Descargar un archivo Excel con la lista de compras.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         style: form
 *         explode: true
 *         description: IDs de productos para la lista de compras.
 *         required: true
 *     responses:
 *       200:
 *         description: Archivo Excel generado con la lista de compras.
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             example: // Contenido del archivo Excel
 *       400:
 *         description: No se pudo generar el archivo Excel de la lista de compras.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No se pudo generar el archivo Excel de la lista de compras.'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
