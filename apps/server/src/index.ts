import fastify from 'fastify'

import jwt from '@fastify/jwt'
// import auth from '@fastify/auth'
import type { FastifyCookieOptions } from '@fastify/cookie'
import cookie from '@fastify/cookie'
import router from './router.js'
import dbConnector from './database.js'
import cors from '@fastify/cors'
import fileServer from '@fastify/static'
import path from 'node:path'
const server = fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname'
            }
        }
    }
})
server.register(cors, {
    origin: ['http://localhost:3000'], // The origins that are allowed access
    credentials: true
})
server.register(fileServer, {
    root: path.join(path.resolve(), 'public'), // Replace 'public' with your directory containing static files
    prefix: '/public/' // Optional: Prefix all routes with '/public/'
})
server.register(cookie, {
    secret: 'my-secret', // for cookies signature
    parseOptions: {} // options for parsing cookies
} as FastifyCookieOptions)
server.register(jwt, { secret: 'supersecret' })
// server.register(auth)
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
    console.log(`Server is now listening on ${address}`)
})
