import type { FastifyCookieOptions } from '@fastify/cookie'

import type { FastifyPluginAsync } from 'fastify'
import cookie from '@fastify/cookie'
import fp from 'fastify-plugin'

const cookiePlugin: FastifyPluginAsync = fp(async (server) => {
  server.register(cookie, {
    secret: server.config.COOKIE_SECRET, // for cookies signature
    parseOptions: {}, // options for parsing cookies
  } as FastifyCookieOptions)
})

export default cookiePlugin
