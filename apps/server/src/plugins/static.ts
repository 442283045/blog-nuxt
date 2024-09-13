import type { FastifyPluginAsync } from 'fastify'
import path from 'node:path'

import staticFile from '@fastify/static'
import fp from 'fastify-plugin'

const staticPlugin: FastifyPluginAsync = fp(async (server) => {
  server.register(staticFile, {
    root: path.join(path.resolve(), 'public'), // Replace 'public' with your directory containing static files
    // Optional: Prefix all routes with '/public/'
    prefix: '/fastify/',
  })
})
export default staticPlugin
