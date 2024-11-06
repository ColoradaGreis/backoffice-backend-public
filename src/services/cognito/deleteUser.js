const { CognitoIdentityProviderClient, AdminDeleteUserCommand } = require('@aws-sdk/client-cognito-identity-provider') // ES Modules import
// const { CognitoIdentityProviderClient, AdminDeleteUserCommand } = require("@aws-sdk/client-cognito-identity-provider"); // CommonJS import
const config = require(global.__basepath + '/config/aws-production.json')

const deleteUser = async (email) => {
  console.log(config.accessKeyId)
  const client = new CognitoIdentityProviderClient({
    credentials: config,
    region: 'us-east-1'
  })
  const command = new AdminDeleteUserCommand({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: email
  })
  const response = await client.send(command)
  return response
}

module.exports = { deleteUser }
