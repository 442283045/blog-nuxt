import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import cors from '@fastify/cors'

const corsPlugin: FastifyPluginAsync = fp(async (server, options) => {
    server.register(cors, {
        origin: server.config.CLIENT_URL, // The origins that are allowed access
        credentials: true
    })
    server.log.info(server.config.CLIENT_URL)
    console.log(server.config.CLIENT_URL)
})

export default corsPlugin
