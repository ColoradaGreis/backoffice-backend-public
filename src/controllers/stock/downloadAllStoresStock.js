const ExcelJS = require('exceljs')
const stockManager = require('../../core/stockManager')
const { validationResult } = require('express-validator')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)

  if (!reqErrors.isEmpty()) {
    // console.log(reqErrors)
    return res.status(422).json({ errors: reqErrors.array() })
  }
  // /api/stock/stores/download?id=DEV_CNV_001&DEV_CNV_005
  const idParam = req.query.id
  const ids = idParam.split('&')
  // id = []
  const result = await stockManager.listAll(ids)
  // console.log(result, 'result')

  if (result) {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Reposición por tienda')

    // Obtener todos los encabezados únicos
    const allHeaders = new Set()
    result.forEach((store) => {
      allHeaders.add(store.storeName)
    })

    // Crear la matriz de encabezados a partir de los encabezados únicos
    const headers = ['Categoría', 'ProductName', 'Total', ...Array.from(allHeaders)]
    worksheet.addRow(headers)

    const productData = []
    result.forEach((store) => {
      if (store.products) {
        store.products.forEach((product) => {
          const categoryName = product.category
          const productName = product.productName

          let existingRow = productData.find(row => row[1] === productName) // Busca la fila existente para este producto

          if (!existingRow) {
            // Si el producto aún no está en la matriz, añadir una nueva fila
            const newRow = Array(headers.length).fill(0)
            newRow[0] = categoryName
            newRow[1] = productName
            existingRow = newRow
            productData.push(existingRow)
          }

          // Incrementa el total para esta tienda
          const storeIndex = headers.indexOf(store.storeName)
          existingRow[storeIndex] += product.requested
        })
      }
    })
    // console.log(productData, 'productData')
    // Eliminar filas con valores iguales a 0 en todas las columnas excepto la primera y la segunda (Categoría y ProductName)
    const filteredProductData = productData.filter(row => row.slice(2).some(value => value !== 0))
    // console.log(filteredProductData, 'filteredProductData')
    // Reemplazar productData con filteredProductData
    productData.length = 0 // Vaciar el array
    Array.prototype.push.apply(productData, filteredProductData) // Agregar los elementos filtrados de nuevo a productData

    // Agrega las fórmulas de suma a la columna "Total"
    productData.forEach((row, rowIndex) => {
      const totalFormula = `SUM(${String.fromCharCode(65 + 3)}${rowIndex + 2}:${String.fromCharCode(65 + headers.length - 1)}${rowIndex + 2})`
      row[2] = { formula: totalFormula } // Establece la fórmula de suma en la columna "Total"
      worksheet.addRow(row) // Agrega la fila a la hoja de Excel
    })
    worksheet.addTable({
      displayName: 'ReposicionPorTiendaTable',
      ref: `A1:${String.fromCharCode(65 + headers.length - 1)}${productData.length + 1}`, // Rango de celdas que abarca la tabla
      headerRow: true, // La primera fila contiene encabezados
      totalsRow: false, // Puedes cambiarlo según tus necesidades
      columns: [
        { name: 'Categoría', width: 240 }, // Ancho de la primera columna
        { name: 'ProductName', width: 246 }, // Ancho de la primera columna
        // Ancho de la primera columna
        { name: 'Total', width: 80 }, // Ancho de la primera columna

        ...headers.slice(3).map(header => ({ name: header, width: 95 })) // Resto de las columnas
      ],
      rows: productData,
      style: {
        showRowStripes: true
      }
    })

    // // Ajusta el ancho de las columnas
    worksheet.columns.forEach((column, i) => {
      let maxLength = 0
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10
        if (columnLength > maxLength) {
          maxLength = columnLength
        }
      })
      column.width = maxLength < 10 ? 10 : maxLength // Establecer un ancho mínimo
    })

    const buffer = await workbook.xlsx.writeBuffer()

    const day = new Date().getDate()
    const month = new Date().getMonth() + 1
    const year = new Date().getFullYear()

    const fullDate = `${day}-${month}-${year}`

    // Configurar la respuesta HTTP para la descarga del archivo Excel
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename=ReposicionPorTienda${fullDate}.xlsx`)
    res.setHeader('Content-Length', buffer.length)
    // Enviar el archivo Excel como respuesta
    return res.send({ buffer, filename: `ReposicionPorTienda${fullDate}.xlsx` })
    // return res.send(buffer)
  }
}

/**
 * @openapi
 * /stores/download:
 *   get:
 *     tags: [Stock]
 *     description: Descargar un archivo Excel con la información de reposición por tienda.
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
 *         description: IDs de productos para la reposición por tienda.
 *         required: true
 *     responses:
 *       200:
 *         description: Archivo Excel generado con la información de reposición por tienda.
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             example: // Contenido del archivo Excel
 *       400:
 *         description: No se pudo generar el archivo Excel de reposición por tienda.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No se pudo generar el archivo Excel de reposición por tienda.'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
