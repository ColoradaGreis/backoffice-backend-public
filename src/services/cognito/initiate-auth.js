const {
  AuthFlowType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand
} = require('@aws-sdk/client-cognito-identity-provider')

/** snippet-start:[javascript.v3.cognito-idp.actions.InitiateAuth] */
const initiateAuth = async (username, password) => {
  const client = new CognitoIdentityProviderClient({ region: 'us-east-1' })

  const command = new InitiateAuthCommand({
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password
    },
    ClientId: process.env.COGNITO_CLIENT_APP_ID
  })

  return client.send(command)
}
/** snippet-end:[javascript.v3.cognito-idp.actions.InitiateAuth] */

module.exports = { initiateAuth }
