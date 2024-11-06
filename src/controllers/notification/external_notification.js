const { validationResult } = require('express-validator')
const notificationManager = require('../../core/notificationManager')

let clients = []
module.exports = {
  subscribe: async (req, res) => {
    const reqErrors = validationResult(req)
    if (!reqErrors.isEmpty()) {
      return res.status(422).json({ errors: reqErrors.array() })
    }
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    })
    // console.log('nueva conexión en subscribe/', req.params.id)

    const result = await notificationManager.subscribe(req.params.id)
    if (result) {
      // modificar para enviar todo junto como en events

      res.write(`data: ${JSON.stringify(result)}\n\n`)

      const clientId = Date.now()
      // console.log(`${clientId} Connection opened`)

      const newClient = {
        id: clientId,
        res
      }

      clients.push(newClient)

      res.on('close', () => {
        // console.log(`${clientId} Connection closed`)
        clients = clients.filter(client => client.id !== clientId)
      })
    } else {
      return res.status(400).json({ error: 'No se pudo suscribir' })
    }
  },
  notify: async (req, res) => {
    // console.log('nueva notificación')
    const newNotification = await notificationManager.notify(req.body)
    if (newNotification) {
      clients.forEach(client => client.res.write(`data: ${JSON.stringify([newNotification])}\n\n`))
      return res.json([newNotification])
    } else {
      res.status(400).json({ error: 'No se pudo notificar' })
    }
  },
  clientNotify: async (req, res) => {
    // console.log('nueva notificación de clientes')
    const newNotification = await notificationManager.clientNotify(req.body)
    if (newNotification) {
      clients.forEach(client => client.res.write(`data: ${JSON.stringify([newNotification])}\n\n`))
      return res.json([newNotification])
    } else {
      res.status(400).json({ error: 'No se pudo notificar' })
    }
  },
  transactionNotify: async (req, res) => {
    // console.log('nueva notificación de transacción')
    const newNotification = await notificationManager.transactionNotify(req.body)
    if (newNotification) {
      clients.forEach(client => client.res.write(`data: ${JSON.stringify([newNotification])}\n\n`))
      return res.json([newNotification])
    } else {
      res.status(400).json({ error: 'No se pudo notificar' })
    }
  }
}
