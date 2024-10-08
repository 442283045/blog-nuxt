import type { FastifyPluginAsync } from 'fastify'

const plugin: FastifyPluginAsync = async function (instance) {
  instance.get('/test', (request, reply) => {
    reply.send('test')
  })
}
export default plugin
