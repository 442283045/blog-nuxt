import type { FastifyPluginAsync } from 'fastify'
import jwt from '@fastify/jwt'
import fp from 'fastify-plugin'

const jwtPlugin: FastifyPluginAsync = fp(async (server) => {
  server.register(jwt, {
    secret: server.config.JWT_SECRET,
  })

  server.get('/verify', (request, reply) => {
    request.jwtVerify((err, decoded) => {
      return reply.send(err || decoded)
    })
  })
})

export default jwtPlugin
