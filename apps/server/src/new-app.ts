import fastify from 'fastify'

import api from './api/index.js'
import authPlugin from './plugins/auth.js'
import cookiePlugin from './plugins/cookie.js'
import env from './plugins/env.js'
import jwtPlugin from './plugins/jwt.js'
import mailerPlugin from './plugins/mailer.js'
import multipartPlugin from './plugins/multipart.js'
import prismaPlugin from './plugins/prisma.js'
import staticPlugin from './plugins/static.js'

import winstonPlugin from './plugins/winston.js'

const server = fastify()

await server.register(env)
await server.register(jwtPlugin)
await server.register(cookiePlugin)
server.register(winstonPlugin)
server.register(prismaPlugin)
server.register(authPlugin)
server.register(mailerPlugin)
server.register(multipartPlugin)
server.register(staticPlugin)

server.addHook('onRequest', async (req) => {
  server.logger.info('request received', {
    path: req.routerPath ?? '404',
    method: req.routerMethod,
  })
})
server.addHook('onResponse', async (req, reply) => {
  server.logger.info('response sended', {
    status: reply.statusCode,
    path: req.routerPath ?? '404',
  })
})

server.register(api, {
  prefix: '/fastify',
})

export default server
