const { CognitoIdentityProviderClient, AdminSetUserPasswordCommand } = require('@aws-sdk/client-cognito-identity-provider') // ES Modules import
// const { CognitoIdentityProviderClient, AdminResetUserPasswordCommand } = require("@aws-sdk/client-cognito-identity-provider"); // CommonJS import
const config = require(global.__basepath + '/config/aws-production.json')

const setUserPassword = async (email, proposedPassword) => {
  const client = new CognitoIdentityProviderClient({
    credentials: config,
    region: 'us-east-1'
  })
  try {
    const command = new AdminSetUserPasswordCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: email,
      Password: proposedPassword,
      Permanent: true

    })
    const response = await client.send(command)
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}
module.exports = { setUserPassword }
