const {
  SignUpCommand,
  CognitoIdentityProviderClient
} = require('@aws-sdk/client-cognito-identity-provider')

const signUp = async (email, password, name) => {
  const client = new CognitoIdentityProviderClient({ region: 'us-east-1' })
  const command = new SignUpCommand({
    ClientId: process.env.COGNITO_CLIENT_APP_ID,
    Username: email,
    Password: password
    // UserAttributes: [{ Name: "name", Value: name }],
  })
  return client.send(command)
}

module.exports = { signUp }
