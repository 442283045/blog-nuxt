import { FastifyPluginAsync } from 'fastify'

const plugin: FastifyPluginAsync = async function (instance, options) {
    instance.get('/favorites', async (request, reply) => {
        try {
            const { token } = request.cookies
            instance.log.info(token)
            if (!token) {
                return reply.code(400).send({
                    message: 'Please provide the token',
                    status: false
                })
            }
            let user_id: number = 0
            try {
                const data = instance.jwt.verify(token) as { payload: number }

                user_id = data.payload
            } catch (err) {
                instance.log.error({ message: 'the token is invalid', err })
            }
            const favorites = await instance.prisma.favorite_articles.findMany({
                where: {
                    favorite_user_id: user_id
                },
                orderBy: {
                    favorite_date: 'desc'
                },
                include: {
                    articles: true
                }
            })
            reply.send(favorites)
        } catch (err) {
            instance.log.error({ address: '/favorites', err })
            return reply
                .code(500)
                .send({ message: 'Internal server error', status: false })
        }
    })
}
export default plugin
