const express = require('express')
const colors = require('colors')
const morganMiddleware = require('../services/logger/morganConfig')

const cors = require('cors')
const app = express()
colors.enable()
app.use(cors())
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Define un formato personalizado para Morga

app.use(morganMiddleware)

app.get('/api', function (req, res) {
  res.status(200).send('API works.')
})

// High-Level ===========================================================================
const AppUserController = require('./appUser')
app.use('/api/app-user', AppUserController)

const ProductController = require('./product')
app.use('/api/product', ProductController)

// const ProductSubstituteController = require('./product_substitute')
// app.use('/api/productSubstitute', ProductSubstituteController)

const CategoryController = require('./categories.js')
app.use('/api/categories', CategoryController)

const FirstCategoriesController = require('./firstCategories')
app.use('/api/first-categories', FirstCategoriesController)

const SecondCategoriesController = require('./secondCategories')
app.use('/api/second-categories', SecondCategoriesController)

const ThirdCategoriesController = require('./thirdCategories')
app.use('/api/third-categories', ThirdCategoriesController)

const NotificationController = require('./notification')
app.use('/api/notification', NotificationController)

// const quantityThresholdController = require('./quantity_threshold')
// app.use('/api/quantity-threshold', quantityThresholdController)

const StoreController = require('./store')
app.use('/api/store', StoreController)

const DocumentationController = require('./documentation/api')
app.use('/api/docs', DocumentationController)

const StockController = require('./stock')
app.use('/api/stock', StockController)

const StockOperationController = require('./stockOperation')
app.use('/api/stock-operation', StockOperationController)

const LayoutController = require('./layout')
app.use('/api/layout', LayoutController)

// Reite=================================================================================
const ReiteProductController = require('./external/reite/product')
app.use('/api/reite/product', ReiteProductController)

const ReiteStoresController = require('./external/reite/stores')
app.use('/api/reite/stores', ReiteStoresController)

const ReiteTransactionController = require('./external/reite/transaction')
app.use('/api/reite/transactions', ReiteTransactionController)

const ReiteLayoutController = require('./external/reite/layout')
app.use('/api/reite/layout', ReiteLayoutController)

const ReiteRestockController = require('./external/reite/restock')
app.use('/api/reite/restock', ReiteRestockController)

const ReiteClientController = require('./external/reite/client')
app.use('/api/reite/clients', ReiteClientController)

const expressErrorHandler = require('../utils/errors/expressErrorHandler.js')
app.use(expressErrorHandler)

module.exports = app
