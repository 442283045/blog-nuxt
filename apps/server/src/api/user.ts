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
                let userInfo
                for await (const part of parts) {
                    if (part.type === 'file') {
                        // instance.logger.info(part.filename)
                        const oldData = await instance.prisma.users.findUnique({
                            where: {
                                user_id: request.routeConfig.userId
                            },
                            select: {
                                avatar_path: true
                            }
                        })
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
                        if (oldData?.avatar_path) {
                            fs.promises
                                .rm(
                                    path.join(
                                        process.cwd(),
                                        'public',
                                        oldData?.avatar_path
                                    )
                                )
                                .then(() => {
                                    instance.logger.info('file removed')
                                })
                                .catch((err) => {
                                    instance.logger.error(err.message)
                                })
                        }
                        userInfo = await instance.prisma.users.update({
                            where: {
                                user_id: request.routeConfig.userId
                            },
                            data: {
                                avatar_path: path.join('/avatar', filename)
                            }
                        })
                    } else {
                        // part.type === 'field'
                        instance.logger.info(part.fieldname, {
                            value: part.value
                        })
                        let updateData = {}
                        if (part.fieldname === 'username') {
                            updateData = {
                                username: part.value
                            }
                        } else if (part.fieldname === 'bio') {
                            updateData = {
                                user_bio: part.value
                            }
                        }
                        userInfo = await instance.prisma.users.update({
                            where: {
                                user_id: request.routeConfig.userId
                            },
                            data: updateData
                        })
                        console.log({ part: part.fieldname })
                    }
                }

                reply.send({
                    status: true,
                    message: 'Update profile successfully',
                    user: {
                        username: userInfo?.username,
                        bio: userInfo?.user_bio,
                        avatar_path: userInfo?.avatar_path
                    }
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
