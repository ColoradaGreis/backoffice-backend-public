const { CognitoIdentityProviderClient, AdminUpdateUserAttributesCommand } = require('@aws-sdk/client-cognito-identity-provider') // ES Modules import
// const { CognitoIdentityProviderClient, AdminUpdateUserAttributesCommand } = require("@aws-sdk/client-cognito-identity-provider"); // CommonJS import
const config = require(global.__basepath + '/config/aws-production.json')

const setUsername = async (oldEmail, newEmail) => {
  const client = new CognitoIdentityProviderClient({
    credentials: config,
    region: 'us-east-1'
  })
  const command = new AdminUpdateUserAttributesCommand({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: oldEmail,
    UserAttributes: [
      {
        Name: 'email',
        Value: newEmail
      }, {
        Name: 'email_verified',
        Value: 'true'
      }
    ]
  })
  const response = await client.send(command)
  return response
}

module.exports = { setUsername }
