import fastify, { FastifyInstance } from 'fastify'
import { RowDataPacket } from 'mysql2'

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
    instance.get('/articles', async (request, reply) => {
        try {
            const [rows] = await instance.mysql.query(`select id,
            author_id,
            published_date,
            thumbs_up,
            favorites,
            updated_date,
            comments,
            view_count from articles`)
            return reply.code(200).send(rows)
        } catch (err) {
            request.log.error({ address: '/articles', err })
            return reply.code(500).send({ msg: 'Internal server error' })
        }
    })
    done()
}
