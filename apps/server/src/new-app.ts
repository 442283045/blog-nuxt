import fastify from 'fastify'

import env from './plugins/env.js'
import logger from './plugins/logger.js'
import prismaPlugin from './plugins/prisma.js'
import authPlugin from './plugins/auth.js'
import jwtPlugin from './plugins/jwt.js'
import mailerPlugin from './plugins/mailer.js'
import cookiePlugin from './plugins/cookie.js'
import corsPlugin from './plugins/cors.js'
import staticPlugin from './plugins/static.js'

import api from './api/index.js'

const server = fastify({
    logger: logger,
    disableRequestLogging: true
})

await server.register(env)
await server.register(jwtPlugin)
await server.register(cookiePlugin)
server.register(corsPlugin)
server.register(prismaPlugin)
server.register(authPlugin)
server.register(mailerPlugin)

server.register(staticPlugin)

server.addHook('onRequest', async (req, reply) => {
    server.log.info({
        message: 'request received',
        address: req.routerPath
    })
})
server.addHook('onResponse', async (req, reply) => {
    server.log.info({
        message: 'response sended',
        address: req.routerPath,
        status: reply.statusCode,
        headers: reply.getHeaders()
    })
    server.log.info({ message: '------------------------------------' })
})

server.register(api)
export default server
