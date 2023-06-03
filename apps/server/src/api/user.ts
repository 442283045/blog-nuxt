import { FastifyPluginAsync } from 'fastify'
import { pipeline } from 'node:stream/promises'
import path from 'node:path'
import generateUniqueFileName from '../utils/generateUniqueFileName.js'
import fs from 'node:fs'
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
    instance.post(
        '/update_profile',
        { onRequest: instance.auth([instance.verifyJWT]) },
        async (request, reply) => {
            try {
                const parts = request.parts()

                for await (const part of parts) {
                    if (part.type === 'file') {
                        // instance.logger.info(part.filename)
                        const filename = generateUniqueFileName(
                            path.extname(part.filename)
                        )
                        const fileAddress = path.join(
                            process.cwd(),
                            'public',
                            'avatar',
                            filename
                        )
                        await pipeline(
                            part.file,
                            fs.createWriteStream(fileAddress)
                        )
                        await instance.prisma.users.update({
                            where: {
                                user_id: request.routeConfig.userId
                            },
                            data: {
                                avatar_path: path.join('/avatar', filename)
                            }
                        })
                    } else {
                        // part.type === 'field
                        console.log({ part: part.value })
                    }
                }

                reply.send({
                    status: true,
                    message: 'Update profile successfully'
                })
            } catch (err) {
                instance.log.error({
                    address: '/update_profile',
                    message: 'fail to update profile ',
                    err
                })
            }
        }
    )
}
export default plugin
