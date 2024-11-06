// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_cognito-identity-provider_code_examples.html#w10aac22c13c17c13
const {
  AdminGetUserCommand,
  CognitoIdentityProviderClient
} = require('@aws-sdk/client-cognito-identity-provider')

const adminGetUser = async (username) => {
  const client = new CognitoIdentityProviderClient({ region: 'us-east-1' })
  const command = new AdminGetUserCommand({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: username
  })
  return client.send(command)
}

module.exports = { adminGetUser }
