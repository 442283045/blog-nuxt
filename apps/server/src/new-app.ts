import fastify from 'fastify'

import env from './plugins/env.js'
import winstonPlugin from './plugins/winston.js'
import logger from './plugins/logger.js'
import prismaPlugin from './plugins/prisma.js'
import authPlugin from './plugins/auth.js'
import jwtPlugin from './plugins/jwt.js'
import mailerPlugin from './plugins/mailer.js'
import cookiePlugin from './plugins/cookie.js'
// import corsPlugin from './plugins/cors.js'
import staticPlugin from './plugins/static.js'
import multipartPlugin from './plugins/multipart.js'

import api from './api/index.js'

const server = fastify({
    logger: logger,
    disableRequestLogging: true
})
// const server = fastify({
//     logger: false
// })
await server.register(env)
await server.register(jwtPlugin)
await server.register(cookiePlugin)
server.register(winstonPlugin)
// server.register(corsPlugin)
server.register(prismaPlugin)
server.register(authPlugin)
server.register(mailerPlugin)
server.register(multipartPlugin)
server.register(staticPlugin)

server.addHook('onRequest', async (req, reply) => {
    server.logger.info('request received', {
        address: req.routerPath ?? '404',
        method: req.routerMethod
    })
})
server.addHook('onResponse', async (req, reply) => {
    server.logger.info('response sended', {
        status: reply.statusCode,
        path: req.routerPath ?? '404'
    })
})

server.register(api, {
    prefix: '/fastify'
})
export default server
