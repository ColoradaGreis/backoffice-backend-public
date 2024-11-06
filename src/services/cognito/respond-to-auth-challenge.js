/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
const {
  ChallengeNameType,
  CognitoIdentityProviderClient,
  RespondToAuthChallengeCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

/** snippet-start:[javascript.v3.cognito-idp.actions.RespondToAuthChallenge] */
const respondToAuthChallenge = async (username, session, code) => {
  const client = new CognitoIdentityProviderClient({ region: "us-east-1" });
  const command = new RespondToAuthChallengeCommand({
    ChallengeName: ChallengeNameType.CUSTOM_CHALLENGE,
    ChallengeResponses: {
      ANSWER: code,
      USERNAME: username,
    },
    ClientId: process.env.COGNITO_CLIENT_APP_ID,
    Session: session,
  });

  return client.send(command);
};
/** snippet-end:[javascript.v3.cognito-idp.actions.RespondToAuthChallenge] */

module.exports = { respondToAuthChallenge };
