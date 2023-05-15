import { FastifyInstance, FastifyRequest } from 'fastify'

import logger from '../log/index.js'
import { MySQLPromisePool } from '@fastify/mysql'
import logout from './logout.js'
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
    instance.register(logout, {})
    done()
}
