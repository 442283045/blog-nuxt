import type { FastifyPluginAsync } from 'fastify'

const plugin: FastifyPluginAsync = async function (instance) {
  try {
    instance.get('/api/logout', (request, reply) => {
      instance.log.info('logout')
      reply.setCookie('token', '', {
        httpOnly: true,

        path: '/',
        maxAge: 0, // 7 days in seconds

      })
      reply.send({
        message: 'logout successfully',
        status: true,
      })
    })
  }
  catch (err) {
    console.error(err)
  }
}
export default plugin
