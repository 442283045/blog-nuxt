import cookie from '@fastify/cookie'

import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import type { FastifyCookieOptions } from '@fastify/cookie'

const cookiePlugin: FastifyPluginAsync = fp(async (server, options) => {
    server.register(cookie, {
        secret: server.config.COOKIE_SECRET, // for cookies signature
        parseOptions: {} // options for parsing cookies
    } as FastifyCookieOptions)
})

export default cookiePlugin
