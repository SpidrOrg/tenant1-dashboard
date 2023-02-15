import 'regenerator-runtime';
import {Amplify, Auth} from "aws-amplify";
// import {fromCognitoIdentityPool} from "@aws-sdk/credential-provider-cognito-identity";
// import {CognitoIdentityClient} from "@aws-sdk/client-cognito-identity";
// import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

let idpData;
export function setIdpData(data){
  idpData = data;
  configureAuth({...data})
}

export function getIndentityPoolId(){
  return idpData.identityPoolId;
}

const configureAuth = ({region, userPoolId, userPoolWebClientId, oauthDomain, redirectSignIn, redirectSignOut, clientId})=> {
  Amplify.configure({
    "aws_project_region": region,
    "aws_cognito_region": region,
    "aws_user_pools_id": userPoolId,
    "aws_user_pools_web_client_id": userPoolWebClientId,
    Auth: {
      oauth: {
        domain: oauthDomain,
        scope: [
          "email",
          "openid",
          "profile",
          `tenant/${clientId}`
        ],
        "redirectSignIn": redirectSignIn,
        "redirectSignOut": redirectSignOut,
        "responseType": 'code'
      }
    }
  })
}

export async function getAuthDetails(){
  const {token, userPoolId, accessToken} = await authenticate() || {};
  return {token, userPoolId, accessToken}
}

async function authenticate(){
  let authSession;
  try {
    authSession = await Auth.currentSession();
  } catch (e){}

  if (authSession){
    const session = await authSession;
    const idToken = await session.getIdToken()
    const accessToken = await session.getAccessToken()
    return {
      token: idToken.jwtToken, userPoolId: idpData.userPoolId, accessToken: accessToken
    }
  } else {
    return {}
  }
}

export async function doFederatedSignIn(){
  await Auth.federatedSignIn()
}

export async function logout(){
  try {
    await Auth.signOut();
    return true;
  } catch (error) {
    console.log('Error signing out: ', error);
  }
}

// export async function invokeLambda(lambdaName) {
//   const region = idpData.region;
//   const identityPoolId = idpData.identityPoolId;
//   const {token, userPoolId} = await getAuthDetails();
//   const lambdaClient = new LambdaClient({
//     region,
//     credentials: fromCognitoIdentityPool({
//       client: new CognitoIdentityClient({ region }),
//       identityPoolId,
//       logins: {
//         [`cognito-idp.${region}.amazonaws.com/${userPoolId}`]: token
//       }
//     }),
//   });
//   const data = await lambdaClient.send(new InvokeCommand({
//     FunctionName: lambdaName
//   }));
//   let responseResult = null;
//   if (data){
//     responseResult = JSON.parse(new TextDecoder('ascii').decode(data.Payload)).body
//   }
//   return responseResult;
// }


export async function invokeApi(apiName){
  const {token, accessToken} = await getAuthDetails();
  const data = await fetch(`https://${idpData.apiPrefix}/${idpData.stage}/${apiName}`, {
    headers: {
      Authorization: token,
      scope: accessToken.payload.scope
    },

  }).then(d => d.json())
  console.log(data);
  return data.body;
}
