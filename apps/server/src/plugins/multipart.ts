import type { FastifyPluginAsync } from 'fastify'
import multipart from '@fastify/multipart'
import fp from 'fastify-plugin'

const multipartPlugin: FastifyPluginAsync = fp(async (server) => {
  server.register(multipart)
})

export default multipartPlugin
