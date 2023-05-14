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

    interface CommentRequest {
        author_id: string
        article_id: string
        content: string
    }
    instance.post(
        '/add_comment',
        async (request: FastifyRequest<{ Body: CommentRequest }>, reply) => {
            try {
                const { author_id, article_id, content } = request.body
                if (author_id && article_id && content) {
                    logger.info({ author_id, article_id, content })
                    // todo: prevent the sql injection
                    const [rows] = await instance.mysql.query(`
                    INSERT INTO comments (author_id, article_id, content) 
                    VALUES (${author_id}, ${article_id}, '${content}');
                    `)
                    console.log(rows)
                    return reply.code(201).send({ msg: 'ok' })
                }
                reply.code(400).send({ msg: 'no' })
            } catch (err) {
                logger.error({ address: '/articles', err })
                return reply.code(500).send({ msg: 'Internal server error' })
            }
        }
    )
    instance.get('/health_check', () => {
        logger.info('health_check')
        return 'ok'
    })
    done()
}
