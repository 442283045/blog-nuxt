import mysql from '@fastify/mysql'
import { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import { MySQLPromisePool } from '@fastify/mysql'
async function dbConnector(
    fastify: FastifyInstance,
    options: unknown,
    done: Function
) {
    fastify.register(mysql, {
        promise: true,
        host: 'localhost',
        user: 'myuser',
        password: 'mypassword',
        database: 'blog_data'
    })
    done()
}
export default fastifyPlugin(dbConnector)
declare module 'fastify' {
    interface FastifyInstance {
        mysql: MySQLPromisePool
    }
}
