import { FastifyPluginAsync } from 'fastify'

const plugin: FastifyPluginAsync = async function (instance, options) {
    instance.get('/test', (request, reply) => {
        reply.send('test')
    })
}
export default plugin
