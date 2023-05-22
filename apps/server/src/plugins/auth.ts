import fp from 'fastify-plugin'
import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'

import auth from '@fastify/auth'

const authPlugin: FastifyPluginAsync = fp(async (server, options) => {
    server.decorate(
        'verifyJWT',
        async function (request: FastifyRequest, reply: FastifyReply) {
            try {
                await request.jwtVerify()
            } catch (err) {
                reply.send(err)
            }
        }
    )

    server.register(auth)
})

export default authPlugin
