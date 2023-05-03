import fastify from 'fastify'

import jwt from '@fastify/jwt'
import auth from '@fastify/auth'
import router from './router.js'
import dbConnector from './database.js'
const server = fastify({
    logger: true
})

server.register(jwt, { secret: 'supersecret' })
server.register(auth)
server.register(dbConnector)
server.register(router)

// type Server = typeof server & {
//     mysql: {
//         query: (
//             sql: string
//         ) => Promise<Array<Array<{ [key: string]: string | number }>>>
//     }
// }

// Run the server!
server.listen({ port: 3001 }, function (err, address) {
    if (err) {
        server.log.error(err)
        process.exit(1)
    }
    // Server is now listening on ${address}
})
