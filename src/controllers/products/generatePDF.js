const { validationResult } = require('express-validator')
const storeManager = require('../../core/external/reite/storeManager')

module.exports = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  const storeId = req.params.id // Obtener el ID de la tienda de la URL
  const result = await storeManager.getProducts(req.params.id)
  const store = await storeManager.getById({ storeId })
  // console.log(store, 'store')

  if (result) {
    // Determinar el estilo del PDF basado en el parámetro de la solicitud
    const style = req.query.style === 'dark' ? 'dark' : 'light'
    const data = []

    result.data.forEach(product =>
      data.push({
        storeId,
        productName: product.productName,
        price: '$' + product.prices[req.params.id]
      }))

    const PDFDocument = require('pdfkit')
    const fs = require('fs')

    const buildPDF = (data, style, dataCallback, endCallback) => {
      try {
        const doc = new PDFDocument({
          size: 'letter' // Establecer el tamaño de página a carta
        })

        doc.on('data', dataCallback)
        doc.on('end', endCallback)
        // Función para dibujar el texto en la esquina superior derecha
        const drawText = () => {
          const marginTop = 10 // Ajusta esto según sea necesario
          const pageWidth = doc.page.width // Ancho total de la página
          const textWidth = 550 // Ancho dentro del cual el texto será centrado
          const textX = (pageWidth - textWidth) / 2 // Calcular la posición inicial X para centrar el texto

          doc.fontSize(6)
            .text(store.data.name, textX, marginTop, {
              width: textWidth, // Usar el ancho calculado
              align: 'center'
            })
        }

        // Agregar el texto al inicio del documento
        drawText()

        // Manejar el evento 'pageAdded' para agregar el texto a nuevas páginas
        doc.on('pageAdded', () => {
          // Reiniciar el flujo del documento para que las nuevas páginas se agreguen correctamente
          doc.font('src/utils/fonts/Barlow-Medium.ttf')
          doc.fontSize(6)

          drawText()
        })

        // Tamaño de tarjeta
        const cardWidth = 141.5 // Ancho de tarjeta en puntos
        const cardHeight = 84.9 // Alto de tarjeta en puntos
        const margin = 20 // Margen alrededor de la tarjeta
        const gap = 6 // Espacio entre tarjetas
        const cardsPerPage = 32 // Número máximo de tarjetas por página
        let cardsDrawn = 0 // Tarjetas dibujadas

        let currentX = margin // Inicializar la posición horizontal
        let currentY = margin // Inicializar la posición vertical

        // Colores
        const backgroundColor = (style === 'dark' ? 'black' : 'white')
        const textColor = (style === 'dark' ? 'white' : 'black')

        // Iterar sobre los datos para crear las tarjetas de productos
        data.forEach(product => {
          if (cardsDrawn === cardsPerPage) {
            doc.addPage()
            currentX = margin
            currentY = margin
            cardsDrawn = 0
          }

          if (style === 'dark') {
            doc.fillColor(backgroundColor).rect(currentX, currentY, cardWidth, cardHeight).fill()
          } else {
            doc.fillColor(backgroundColor).rect(currentX, currentY, cardWidth, cardHeight).stroke()
          }

          // Dibujar tarjeta de producto con el estilo seleccionado
          doc.fillColor(textColor)

          // Establecer la posición y tamaño inicial del texto
          const textX = currentX + margin
          const textY = currentY + margin
          const fontSize = 12
          const productName = product.productName

          // doc.fillColor('black')
          doc.font('src/utils/fonts/Barlow-Medium.ttf')
          doc.fontSize(fontSize)
          doc.text(productName.toUpperCase(), textX, textY, {
            width: cardWidth - (2 * margin),
            height: (cardHeight - 2 * margin) / 2,
            align: 'center',
            characterSpacing: -0.1
          })
          doc.font('src/utils/fonts/Barlow-Bold.ttf')
          doc.fontSize(fontSize + 12)
          doc.text(`${product.price}`, textX, textY + (cardHeight - 2 * margin) / 2, {
            width: cardWidth - (2 * margin),
            height: (cardHeight - 2 * margin) / 2,
            align: 'center'
          })

          cardsDrawn++

          // Restaurar el tamaño de fuente original
          doc.fontSize(fontSize)

          // Mover la posición horizontal para la siguiente tarjeta, incluyendo el gap
          currentX += cardWidth + gap
          // Si no hay más espacio en la fila actual, pasar a la siguiente fila
          if (currentX + cardWidth + gap > doc.page.width) {
            currentX = margin
            currentY += cardHeight + gap
          }
        })

        doc.pipe(fs.createWriteStream('output.pdf'))
        doc.end()
      } catch (error) {
        console.error(error)
      }
    }
    const day = new Date().getDate()
    const month = new Date().getMonth() + 1
    const year = new Date().getFullYear()

    const fullDate = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`

    // Añade este encabezado para exponer Content-Disposition
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition')

    const stream = res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${fullDate}_${store.data.name}_${style}.pdf`
    })
    buildPDF(
      data,
      style,
      (data) => stream.write(data),
      () => stream.end()
    )
  }
}

/**
 * @openapi
 * /products/{id}/generate-pdf:
 *   get:
 *     tags: [Products]
 *     description: Genera un PDF con los precios de los productos de una tienda determinada.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Token de autenticación (Bearer).
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer your-access-token
 *       - in: path
 *         name: id
 *         description: ID del producto.
 *         required: true
 *         schema:
 *           type: string
 *           example: 12345
 *     responses:
 *       200:
 *         description: PDF generado exitosamente.
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Error en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error en la solicitud.'
 *       422:
 *         description: Errores de validación.
 *         content:
 *           application/json:
 *             example:
 *               errors: [{ param: 'id', msg: 'ID del producto requerido' }]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
