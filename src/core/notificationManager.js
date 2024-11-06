const models = require('../database')
const slack = require('../services/slack')
const slackTransactions = require('../services/slack/rejectedTransactions/index.js')
// const slackTransactions = require('../services/slack/rejectedTransactions/testing.js')

module.exports = {
  auth: async (payload) => {
  },
  create: async (payload) => {
    // console.log(payload)
    const notification = { raw: payload, type: 'webhook', source: 'reite' }
    const notificationResult = await models.notification.create(notification)
    const slackResult = await slack.sendTemplate(notificationResult.source, notificationResult.raw)
    // console.log(slackResult)
    return slackResult
  },
  subscribe: async (userId) => {
    // Busca las notificaciones no leídas para el usuario
    const readNotifications = await models.read_notifications.findAll({ where: { app_user_id: userId } })
    const allNotifications = await models.external_notification.findAll()
    const unreadNotifications = allNotifications.map(notification => notification.dataValues).filter(notification => {
      // Comprueba si la notificación actual no está en la lista de notificaciones leídas
      return !readNotifications.some(readNotification => readNotification.external_notification_id === notification.id)
    })
    return unreadNotifications
  },
  notify: async (body) => {
    // console.log('nueva notificación')

    const { name, status, storeId } = body
    const message = `La tienda ${name} (${storeId}) ha cambiado su estado a ${status}`
    const newNotification = await models.external_notification.create({ title: 'cambio de estado de tienda', body: message })

    return newNotification
  },
  read: async (notificationId, userId) => {
    // console.log('marcar como leída')
    const notification = await models.external_notification.findOne({ where: { id: notificationId } })
    if (!notification) {
      return false
    }

    const response = await models.read_notifications.create({ app_user_id: userId, external_notification_id: notificationId })

    return response
  },
  clientNotify: async (body) => {
    // console.log('nueva notificación de clientes')
    const { email, name, storeName, storeId, phone } = body
    const message = `Nuevo cliente ${name || 'desconocido'} (${email || phone.areaCode + phone.number}) en la tienda ${storeName} (${storeId})`
    const newNotification = await models.external_notification.create({ title: 'nuevo cliente', body: message })
    return newNotification
  },
  delete: async (notificationId) => {
    // console.log('eliminar notificación')
    const readNotification = await models.read_notifications.destroy({ where: { external_notification_id: notificationId } })
    if (readNotification) {
      const response = await models.external_notification.destroy({ where: { id: notificationId } })
      return response
    }
  },
  noRead: async (notificationId, userId) => {
    // console.log('marcar como no leída', notificationId, userId)
    const response = await models.read_notifications.destroy({ where: { external_notification_id: notificationId, app_user_id: userId } })
    return response
  },
  transactionNotify: async (body) => {
    // console.log('nueva notificación de transacción')
    // req.body = { name, email, phone, timesTamp, storeId, transactionAmount, rejectedReason }
    const { storeId, amount, transactionId, rejectedReason, user, paymentHistory } = body
    console.log('rejectedReason', rejectedReason)
    console.log('paymentHistory', paymentHistory)
    if (paymentHistory.length > 1) {
      const message = `Nueva transacción por $${amount} en la tienda ${storeId} (${transactionId}) ${rejectedReason ? 'rechazada por ' + rejectedReason : ''}`
      const newNotification = await models.external_notification.create({ title: 'nueva transacción', body: message })
      if (rejectedReason === 'cc_rejected_blacklist' || rejectedReason === 'cc_rejected_high_risk' || rejectedReason === 'cc_rejected_other_reason') {
        const cliente = {
          id: user.id,
          nombre: user.name,
          email: user.email,
          contacto: user.phone.areaCode + user.phone.number
        }
        const notificationMessage = {
          detalle: rejectedReason === 'cc_rejected_blacklist' ? 'Tarjeta en lista negra' : rejectedReason === 'cc_rejected_high_risk' ? 'Alto riesgo' : 'Otra razón',
          tienda: storeId,
          monto: '$' + amount,
          transaction_ID: transactionId,
          cliente,
          codigoMP: rejectedReason,
          historial_de_rechazo: paymentHistory
        }
        await slackTransactions.sendTemplate('Alerta: Posible Fraude', notificationMessage)
        return newNotification
      }
      return newNotification
    }
  }
}

// cc_rejected_blacklist
// cc_rejected_high_risk
// cc_rejected_other_reason
