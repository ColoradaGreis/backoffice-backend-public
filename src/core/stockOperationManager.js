const models = require('../database')
const reiteStore = require('../services/reite/store')
const reiteToken = require('../services/reite/token')
const s3 = require('../services/s3')
const reiteTransaction = require('../services/reite/transaction')
const dayjs = require('dayjs')

// const reiteProduct = require('../services/reite/product')

module.exports = {
  create: async (payload, file) => {
    const { accessToken } = await reiteToken.auth()

    const openStore = await reiteStore.open(accessToken, payload.store_id, payload.userClientId, payload.openStoreType)

    if (openStore.response.successful) {
      const newStockOperation = await models.stock_operation.create({
        external_transaction_id: openStore.transactionId,
        store_id: payload.store_id,
        start_timestamp: new Date(),
        comments: payload.comments
      })
      if (file) {
        const checkResult = checkLimits(file)
        if (checkResult) {
          const uploadResult = await s3.uploadImage('backoffice-public-files', file.originalname, file.buffer, 'images')
          newStockOperation.start_image_url = s3.getObjectUrl('backoffice-public-files', uploadResult.key)
          await newStockOperation.save()
        }
      }

      return newStockOperation
    } else {
      console.error('Error al abrir la tienda:', openStore.error)
      return null // O manejar el error de otra manera
    }
  },
  postInventory: async (id, transactionId, added, removed) => {
    try {
      const { accessToken } = await reiteToken.auth()
      const response = await reiteStore.putInventory(accessToken, id, added, removed)
      console.log(response, 'response del postInventory')

      if (response.data) {
        const { data } = response
        const promises = data.previousInventory.map(element => {
          const foundInventory = data.inventory.find(inventory => inventory.productId === element.productId)

          if (!foundInventory) {
            console.warn(`No matching inventory found for product ID ${element.productId}`)
            return Promise.resolve() // Resolve to avoid blocking Promise.all
          }

          return models.product_stock_operation.create({
            transaction_id: transactionId,
            external_id: element.productId,
            stock_before: element.quantity,
            name: element.productId,
            stock_after: foundInventory.quantity
          })
        })

        // Wait for all promises to resolve
        await Promise.all(promises)
        console.log('All operations completed successfully.')
        // After all promises are resolved, return the original response from putInventory
        return response // Here you return the response from reiteStore.putInventory
      } else {
        console.error('Error al actualizar el inventario:', response.error)
        throw new Error(response.error)
      }
    } catch (error) {
      console.error('Error in postInventory function:', error)
      throw error // Rethrow after logging
    }
  },
  close: async (id, body) => {
    // console.log(id, 'id')
    // console.log(body, 'body')
    try {
      const { accessToken } = await reiteToken.auth()
      const response = await reiteTransaction.update(accessToken, id.id, body.purchased, body.restocked)
      if (response) {
        const stockOperation = await models.stock_operation.findOne({
          where: {
            transaction_id: body.transaction_id
          }
        })

        if (stockOperation) {
          stockOperation.end_timestamp = new Date()
          stockOperation.comments = body.comments
          await stockOperation.save()
        }
      }
      return response
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  getAll: async (payload, page = 1, pageSize = 10) => {
    const { accessToken } = await reiteToken.auth()
    console.log(payload, 'payload')
    const dateStart = dayjs.utc(payload?.startTimestamp).valueOf() / 1000
    const endDate = dayjs.utc(payload?.endTimestamp).endOf('day').valueOf() / 1000
    const dateEnd = Math.floor(endDate)
    const finalDay = dayjs.utc(payload?.endTimestamp).endOf('day').toISOString()
    // Ejecutar las operaciones de forma concurrente usando Promise.all

    // console.log(dateStart, dateEnd, 'dateStart, dateEnd')
    // console.log(finalDay, 'finalDay')
    const [transactions, stockOperations] = await Promise.all([
      reiteTransaction.getList(accessToken, payload.limit, dateStart, dateEnd),
      models.stock_operation.findAll({
        where: {
          start_timestamp: {
            [models.Sequelize.Op.between]: [payload.startTimestamp, finalDay]
          }
        },
        order: [['start_timestamp', 'DESC']],
        raw: true
      })
    ])
    console.log(transactions, 'transactions')

    const result = await Promise.all(
      stockOperations.map(async (stockOperation) => {
        const products = await reiteStore.getProducts(accessToken, stockOperation.store_id)
        const foundProductStockOperation = await getProductStockOperations(stockOperation.transaction_id)
        const productStockOp = await productsStockOperation(foundProductStockOperation, products)
        const foundTransaction = transactions.data.find(
          (transaction) => transaction.transactionId === stockOperation.external_transaction_id
        )
        // console.log(foundTransaction, 'foundTransaction')

        return {
          id: stockOperation.transaction_id,
          external_transaction_id: stockOperation.external_transaction_id,
          store_id: stockOperation.store_id,
          start_timestamp: stockOperation.start_timestamp,
          end_timestamp: stockOperation.end_timestamp,
          comments: stockOperation.comments,
          start_image_url: stockOperation.start_image_url || null,
          end_image_url: stockOperation.end_image_url || null,
          products: productStockOp,
          results: foundTransaction?.results
        }
      })
    )

    return result
  },
  getById: async (externalTransactionId, transactionId) => {
    const { accessToken } = await reiteToken.auth()
    const transaction = await reiteTransaction.get(accessToken, externalTransactionId)
    // console.log(transaction, 'transaction')
    const stockOperation = await models.stock_operation.findOne({
      where: {
        transaction_id: transactionId
      }
    })
    const response = []

    if (stockOperation) {
      const products = await reiteStore.getProducts(accessToken, stockOperation.store_id)

      const foundProductStockOperation = await getProductStockOperations(stockOperation.transaction_id)

      const productStockOp = await productsStockOperation(foundProductStockOperation, products)

      response.push({
        id: stockOperation.transaction_id,
        external_transaction_id: stockOperation.external_transaction_id,
        store_id: stockOperation.store_id,
        start_timestamp: stockOperation.start_timestamp,
        end_timestamp: stockOperation.end_timestamp,
        comments: stockOperation.comments,
        start_image_url: stockOperation.start_image_url || null,
        end_image_url: stockOperation.end_image_url || null,
        products: productStockOp,
        results: transaction?.data.results
      })
    }

    return response
  },
  update: async (transactionId, comments, file) => {
    if (file) {
      const checkResult = checkLimits(file)
      if (checkResult) {
        const uploadResult = await s3.uploadImage('backoffice-public-files', file.originalname, file.buffer, 'images')
        const imageUrl = s3.getObjectUrl('backoffice-public-files', uploadResult.key)

        return models.stock_operation.update({ end_image_url: imageUrl, comments },
          {
            where: { transaction_id: transactionId }
          }
        )
      }
    }
    return false
  }
}
function checkLimits (file) {
  if (file !== undefined && file.size < (global.FILE_SIZE_LIMIT * 1000000)) {
    return true
  }
  return false
}
async function getProductStockOperations (transactionId) {
  // console.log(transactionId, 'transactionId')
  return await models.product_stock_operation.findAll({
    where: {
      transaction_id: transactionId
    },
    raw: true
  })
}

async function productsStockOperation (foundProductStockOperation, products) {
  const result = []

  for (const productStockOperation of foundProductStockOperation) {
    // console.log(productStockOperation, '-------productStockOperation-----')
    const productId = productStockOperation.external_id
    // console.log(productId, '-------productId-----')

    const matchingProduct = products.data.find(product => product.productId === productId)
    // console.log(matchingProduct, '-------matchingProduct-----')

    if (matchingProduct) {
      const resultObject = {
        productId,
        productName: matchingProduct.productName,
        img: matchingProduct.metadata.imageUrl,
        stockBefore: productStockOperation.stock_before,
        stockAfter: productStockOperation.stock_after
      }
      result.push(resultObject)
    }
  }
  // console.log(result, '-----------------result')

  return result
}
