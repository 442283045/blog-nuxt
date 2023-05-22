import jwt from '@fastify/jwt'
import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'

const jwtPlugin: FastifyPluginAsync = fp(async (server, options) => {
    server.register(jwt, {
        secret: server.config.JWT_SECRET
    })

    server.get('/verify', function (request, reply) {
        request.jwtVerify(function (err, decoded) {
            return reply.send(err || decoded)
        })
    })
})

export default jwtPlugin
