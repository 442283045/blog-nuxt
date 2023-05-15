import { FastifyInstance, FastifyRequest } from 'fastify'

import logger from '../log/index.js'
import { MySQLPromisePool } from '@fastify/mysql'

declare module 'fastify' {
    interface FastifyInstance {
        mysql: MySQLPromisePool
    }
}

export default function (
    instance: FastifyInstance,
    options: unknown,
    done: Function
) {
    instance.get('/health_check', () => {
        logger.info('health_check')
        return 'ok'
    })
    instance.get('/api/logout', (request, reply) => {
        logger.info('logout')
        reply.setCookie('token', '', {
            httpOnly: true,
            // secure: true, // Set to true if using HTTPS
            // domain: 'your-domain.com', // Uncomment and set to your domain if needed
            // sameSite: 'strict', // Uncomment and set to 'strict' or 'lax' if needed
            path: '/',
            expires: new Date(0), // 7 days in seconds
            sameSite: 'none',
            secure: true
        })

        reply.send({
            msg: 'logout successfully'
        })
    })
    done()
}
