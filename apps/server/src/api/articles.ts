import { FastifyInstance, FastifyRequest } from 'fastify'

export default function (
    instance: FastifyInstance,
    options: unknown,
    done: Function
) {
    instance.get('/articles', async (request, reply) => {
        try {
            const articles = await instance.prisma.articles.findMany()

            return reply.code(200).send(articles)
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
                    message: 'Please provide the article id',
                    status: false
                })
            }
            await instance.prisma.user_favorites.create({
                data: {
                    user_id,
                    article_id
                }
            })

            reply.code(200).send({
                message: 'add it to favorites successfully',
                status: true
            })
        } catch (err) {
            instance.log.error({ address: '/add_favorite', err })
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
                    message: 'Please provide the article id',
                    status: false
                })
            }
            const [articles] = await Promise.all([
                instance.prisma.comments.findMany({
                    where: {
                        article_id
                    }
                }),
                instance.prisma.articles.update({
                    where: {
                        id: article_id
                    },
                    data: {
                        view_count: {
                            increment: 1
                        }
                    }
                })
            ])

            for (let article of articles) {
                const user = await instance.prisma.users.findUnique({
                    where: {
                        id: article.author_id
                    }
                })

                Object.assign(article, {
                    ...user
                })
            }
            return reply.code(200).send({
                message: 'get comments successfully',
                status: true,
                data: articles
            })
        } catch (err) {
            return reply.code(500).send({ msg: 'Internal server error' })
        }
    })

    interface CommentRequest {
        author_id: number
        article_id: number
        content: string
    }
    instance.post(
        '/add_comment',
        async (request: FastifyRequest<{ Body: CommentRequest }>, reply) => {
            try {
                const { author_id, article_id, content } = request.body
                if (author_id && article_id && content) {
                    instance.log.info(
                        JSON.stringify({ author_id, article_id, content })
                    )

                    await instance.prisma.comments.create({
                        data: {
                            author_id,
                            article_id,
                            content
                        }
                    })

                    return reply.code(201).send({
                        status: true,
                        message: 'Add a comment successfully'
                    })
                }
                reply.code(400).send({
                    status: false,
                    message: 'Add a comment unsuccessfully'
                })
            } catch (err) {
                instance.log.error({ address: '/articles', err })
                return reply
                    .code(500)
                    .send({ status: false, message: 'Internal server error' })
            }
        }
    )

    done()
}
