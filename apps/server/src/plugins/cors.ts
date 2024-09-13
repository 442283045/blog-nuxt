import type { FastifyPluginAsync } from 'fastify'
import cors from '@fastify/cors'
import fp from 'fastify-plugin'

const corsPlugin: FastifyPluginAsync = fp(async (server) => {
  server.register(cors, {
    origin: server.config.CLIENT_URL, // The origins that are allowed access
    credentials: true,
  })
  server.log.info(server.config.CLIENT_URL)
})

export default corsPlugin
