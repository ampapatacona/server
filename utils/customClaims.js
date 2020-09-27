const admin = require('firebase-admin')

const updateClaims = (uid, isAdmin) => {
  const defaultRole = isAdmin ? 'admin' : 'user'
  const roles = isAdmin ? ['user', 'admin'] : ['user']
  return admin.auth().setCustomUserClaims(uid, {
    'https://hasura.io/jwt/claims': {
      'x-hasura-default-role': defaultRole,
      'x-hasura-allowed-roles': roles,
      'x-hasura-user-id': uid
    }
  })
}
module.exports = updateClaims
