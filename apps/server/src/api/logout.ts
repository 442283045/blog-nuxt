import { FastifyPluginAsync } from 'fastify'

import logger from '../log/index.js'

const plugin: FastifyPluginAsync = async function (instance, options) {
    try {
        instance.get('/health_check', () => {
            logger.info('health_check')
            return 'ok'
        })
        instance.get('/logout', (request, reply) => {
            logger.info('logout')
            reply.setCookie('token', '', {
                httpOnly: true,
                secure: true, // Set to true if using HTTPS

                path: '/',
                maxAge: 0, // 7 days in seconds
                sameSite: 'none'
            })
            reply.send({
                msg: 'logout successfully'
            })
        })
    } catch (err) {
        console.log(err)
    }
}
export default plugin
