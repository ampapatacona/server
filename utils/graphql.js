const { GraphQLClient } = require('graphql-request')
const fetch = require('node-fetch')
global.Headers = fetch.Headers

async function graphqlClient (query, variables) {
  const endpoint = process.env.GRAPH_HTTP_ENDPOINT

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET
    }
  })

  const data = await graphQLClient.request(query, variables)
  console.log('data from server', data)
  return data
}

module.exports = graphqlClient
