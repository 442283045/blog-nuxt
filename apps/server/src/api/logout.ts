import { FastifyPluginAsync } from 'fastify'

const plugin: FastifyPluginAsync = async function (instance, options) {
    try {
        instance.get('/api/logout', (request, reply) => {
            instance.log.info('logout')
            reply.setCookie('token', '', {
                httpOnly: true,
                secure: true, // Set to true if using HTTPS
                path: '/',
                maxAge: 0, // 7 days in seconds
                sameSite: 'none'
            })
            reply.send({
                message: 'logout successfully',
                status: true
            })
        })
    } catch (err) {
        console.log(err)
    }
}
export default plugin
