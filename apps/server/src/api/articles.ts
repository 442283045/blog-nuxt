import { FastifyInstance, FastifyRequest } from 'fastify'
import { RowDataPacket } from 'mysql2'
import logger from '../log/index.js'

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
    instance.get('/add_favorite', async (request, reply) => {
        try {
            const { article_id, user_id } = request.query as {
                article_id: number
                user_id: number
            }
            if (!article_id) {
                return reply.code(400).send({
                    message: 'please provide the article id',
                    status: false
                })
            }
            await instance.mysql.query(
                `insert into user_favorites (user_id, article_id) values (${user_id}, ${article_id})`
            )
            reply.code(200).send({
                message: 'add it to favorites successfully',
                status: true
            })
        } catch (err) {
            logger.error(JSON.stringify({ address: '/add_favorite', err }))
            return reply
                .code(500)
                .send({ message: 'Internal server error', status: false })
        }
    })
    instance.get('/comments', async (request, reply) => {
        try {
            const { article_id } = request.query as { article_id: number }
            if (!article_id) {
                return reply.code(400).send({
                    message: 'please provide the article id',
                    status: false
                })
            }
            const [[rows], [rows2]] = await Promise.all([
                instance.mysql.query<RowDataPacket[]>(
                    `select * from comments where article_id = ${article_id}`
                ),
                instance.mysql.query<RowDataPacket[]>(
                    `select * from articles where id = ${article_id}`
                )
            ])

            const newViewCount = ++rows2[0].view_count
            instance.mysql.query(
                `update articles set view_count = ${newViewCount} where id = ${article_id}`
            )
            for (let row of rows) {
                const [[user]] = await instance.mysql.query<RowDataPacket[]>(
                    `select username, email, avatar_path from users where id = ${row.author_id}`
                )
                Object.assign(row, {
                    ...user
                })
                console.log(row)
            }
            return reply.code(200).send({
                message: 'get comments successfully',
                status: true,
                data: rows
            })
        } catch (err) {
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
                    logger.info(
                        JSON.stringify({ author_id, article_id, content })
                    )
                    // todo: prevent the sql injection
                    const [rows] = await instance.mysql.query(`
                    INSERT INTO comments (author_id, article_id, content) 
                    VALUES (${author_id}, ${article_id}, '${content}');
                    `)
                    console.log(rows)
                    return reply.code(201).send({
                        status: true,
                        message: 'add a comment successfully'
                    })
                }
                reply.code(400).send({
                    status: false,
                    message: 'add a comment unsuccessfully'
                })
            } catch (err) {
                logger.error({ address: '/articles', err })
                return reply
                    .code(500)
                    .send({ status: false, message: 'Internal server error' })
            }
        }
    )

    done()
}
