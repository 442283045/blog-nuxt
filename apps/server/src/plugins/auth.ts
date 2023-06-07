import fp from 'fastify-plugin'
import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'

import auth from '@fastify/auth'

const authPlugin: FastifyPluginAsync = fp(async (server, options) => {
    server.decorate(
        'verifyJWT',
        async function (request: FastifyRequest, reply: FastifyReply) {
            try {
                server.log.info({ token: request.cookies.token })
                if (request.cookies.token) {
                    try {
                        const { payload: userId } = server.jwt.verify(
                            request.cookies.token
                        ) as { payload: number }

                        request.routeConfig.userId = userId
                    } catch (err) {
                        request.log.info('jwt verify error')
                    }
                }
            } catch (err) {
                server.log.info({ message: 'the token is invalid', err })
                reply.setCookie('token', '', {
                    httpOnly: true,
                    path: '/',
                    maxAge: 0, // 7 days in seconds
                
                })
                server.log.warn(err)
            }
        }
    )

    server.register(auth)
})

export default authPlugin
