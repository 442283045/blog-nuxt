import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import multipart from '@fastify/multipart'
const multipartPlugin: FastifyPluginAsync = fp(async (server, options) => {
    server.register(multipart)
})

export default multipartPlugin
