const slackNotifier = require('./index')
module.exports =
    async function sendSlackNotification (products, added, removed, step, text) {
      // console.log(products, 'products')
      const notification = {
        agregados: [],
        removidos: []
      }

      // Iterar sobre 'added'
      added.forEach(item => {
        const product = products.data.find(product => product.productId === item.productId)
        const productObject = {
          producto: product.productName,
          cantidad: item.quantity
        }
        notification.agregados.push(productObject)
      })

      // Iterar sobre 'removed'
      removed.forEach(item => {
        const product = products.data.find(product => product.productId === item.productId)
        const productObject = {
          producto: product.productName,
          cantidad: item.quantity
        }
        notification.removidos.push(productObject)
      })
      //   const mensajeCompleto = `Step ${step}: Updated :file_folder:\nStep: ${step}\nText: ${text}\nAgregados: ${JSON.stringify(
      //       notification.agregados,
      //       null,
      //       2
      //     )}\nRemovidos: ${JSON.stringify(notification.removidos, null, 2)}`

      //   const encoder = new TextEncoder()
      //   const mensajeBytes = encoder.encode(mensajeCompleto)
      //   const longitudEnBytes = mensajeBytes.length

      //   console.log('Longitud del mensaje en bytes:', longitudEnBytes)

      return await slackNotifier.sendTemplate(`'Step ${step}: Update`, {
        step,
        text,
        agregados: notification.agregados,
        removidos: notification.removidos
      })
    }
