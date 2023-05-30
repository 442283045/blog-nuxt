import fastify, { FastifyInstance, FastifyRequest } from 'fastify'

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
    instance.get(
        '/is_favorite',
        { onRequest: instance.auth([instance.verifyJWT]) },
        async (request, reply) => {
            try {
                if (!request.context.userId) {
                    return reply.code(200).send({
                        status: false,
                        message: 'user is not login'
                    })
                }
                const { article_id } = request.query as {
                    article_id: string
                }
                if (!article_id) {
                    return reply.code(400).send({
                        message: 'Please provide the article id',
                        status: false
                    })
                }
                const count = await instance.prisma.favorite_articles.count({
                    where: {
                        favorite_article_id: Number(article_id),
                        favorite_user_id: request.context.userId
                    }
                })
                if (count) {
                    reply.send({
                        status: true
                    })
                } else {
                    return reply.code(200).send({
                        status: false,
                        message: 'user is not favorite'
                    })
                }
            } catch (err) {
                instance.log.error({ address: '/is_favorite', err })
            }
        }
    )
    instance.get('/add_favorite', async (request, reply) => {
        try {
            const { article_id, user_id } = request.query as {
                article_id: string
                user_id: string
            }
            if (!article_id) {
                return reply.code(400).send({
                    message: 'Please provide the article id',
                    status: false
                })
            }
            await instance.prisma.favorite_articles.create({
                data: {
                    favorite_user_id: Number(user_id),
                    favorite_article_id: Number(article_id)
                }
            })
            const number = await instance.prisma.favorite_articles.count({
                where: {
                    favorite_article_id: Number(article_id)
                }
            })
            await instance.prisma.articles.update({
                where: {
                    article_id: Number(article_id)
                },
                data: {
                    article_favorites_count: number
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
            const { article_id } = request.query as { article_id: string }
            if (!article_id) {
                return reply.code(400).send({
                    message: 'Please provide the article id',
                    status: false
                })
            }
            const [comments] = await Promise.all([
                instance.prisma.comments.findMany({
                    where: {
                        comment_article_id: Number(article_id)
                    },
                    orderBy: {
                        comment_published_date: 'desc'
                    }
                }),
                instance.prisma.articles.update({
                    where: {
                        article_id: Number(article_id)
                    },
                    data: {
                        article_view_count: {
                            increment: 1
                        }
                    }
                })
            ])
            let commentWithUser = []

            for (let comment of comments) {
                const user = await instance.prisma.users.findUnique({
                    where: {
                        user_id: comment.comment_author_user_id
                    },
                    select: {
                        username: true,
                        avatar_path: true
                    }
                })
                commentWithUser.push({ ...comment, ...user })
            }
            return reply.code(200).send({
                message: 'Get comments successfully',
                status: true,
                data: commentWithUser
            })
        } catch (err) {
            instance.log.error({ address: '/comments', err })
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
                    instance.log.info(
                        JSON.stringify({ author_id, article_id, content })
                    )

                    await instance.prisma.comments.create({
                        data: {
                            comment_author_user_id: Number(author_id),
                            comment_article_id: Number(article_id),
                            comment_content: content
                        }
                    })
                    const number = await instance.prisma.comments.count({
                        where: {
                            comment_article_id: Number(article_id)
                        }
                    })
                    await instance.prisma.articles.update({
                        where: {
                            article_id: Number(article_id)
                        },
                        data: {
                            article_comments_count: number
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
