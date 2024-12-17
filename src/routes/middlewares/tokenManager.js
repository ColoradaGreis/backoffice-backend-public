const expressErrorHandler = require('../../utils/errors/expressErrorHandler')
// const CognitoExpress = require('cognito-express')
// const cognitoExpress = new CognitoExpress({
//   region: 'us-east-1',
//   cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID || 'fake-pool-id',
//   tokenUse: 'access', // Possible Values: access | id
//   tokenExpiration: 120000 // Up to default expiration of 1 hour (3600000 ms)
// })

module.exports = {
  verifyAppToken: async (req, res, next) => {
    try {
      console.log('Cognito validation skipped for demonstration purposes')
      // --- Cognito configuration
      // const accessTokenFromClient = req.headers.authorization
      // if (!accessTokenFromClient) {
      //   return res.status(401).send('Access Token missing from header')
      // }
      // const response = await cognitoExpress.validate(accessTokenFromClient.split(' ')[1])
      // res.locals.user = response
      // ----- Simular un usuario autenticado para las rutas
      res.locals.user = {
        username: 'mockUser',
        email: 'mockuser@example.com',
        role: 'admin' // Puedes cambiar el rol simulado según lo que necesites mostrar
      }
      next()
    } catch (e) {
      next(e) 
    }
  }
}
