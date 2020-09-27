const admin = require('firebase-admin')
const { gql } = require('graphql-request')
const graphqlClient = require('../../utils/graphql')

const serviceAccount = {
  type: process.env.FB_TYPE,
  project_id: process.env.FB_PROJECT_ID,
  private_key_id: process.env.FB_KEY_ID,
  private_key: process.env.FB_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FB_CLIENT_EMAIL,
  client_id: process.env.FB_CLIENT_ID,
  auth_uri: process.env.FB_AUTH_URI,
  token_uri: process.env.FB_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FB_AUTH_PROVIDER_X59_CERT_URL,
  client_x509_cert_url: process.env.FB_CLIENT_X509_CERTURL
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://ampa-ceip-patacona.firebaseio.com'
})

module.exports = function (app) {
  const updateClaims = (uid, admin) => {
    const defaultRole = admin ? 'admin' : 'user'
    const roles = admin ? ['user', 'admin'] : ['user']
    admin.auth().setCustomUserClaims(uid, {
      'https://hasura.io/jwt/claims': {
        'x-hasura-default-role': defaultRole,
        'x-hasura-allowed-roles': roles,
        'x-hasura-user-id': uid
      }
    })
  }
  app.post('/refresh-token', (req, res) => {
    const user = req.body
    console.log(user)
    console.log('TOKEN REFRESH', user.uid)
    return updateClaims(user.uid).then(() => {
      return true
    })
      .then(() => {
        const mutation = gql`
          mutation insertUser($email: String!, $id: String!) {
            insert_members_one(object: {email: $email, id: $id}, on_conflict: {constraint: members_pkey, update_columns: email}) {
              id
            }
          }
          `
        const variables = {
          id: user.uid,
          email: user.email
        }
        return graphqlClient(mutation, variables).catch((error) => console.error(error))
      })
      .then((newuser) => {
        console.log('newuser', newuser)
        return res.status(200).send('success')
      }).catch((error) => {
        console.error('REFRESH ERROR', error)
        return res.status(400).send(error)
      })
  })
}
