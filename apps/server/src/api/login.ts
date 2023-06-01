import { FastifyPluginAsync } from 'fastify'

import bcrypt from 'bcrypt'
import { promisify } from 'node:util'

const plugin: FastifyPluginAsync = async function (instance, options) {
    try {
        instance.post('/login', async (request, reply) => {
            instance.log.info('login')

            const { password, email } = request.body as {
                password: string
                email: string
            }
            instance.log.info(JSON.stringify({ password, email }))
            if (!password || !email) {
                return reply
                    .code(400)
                    .send({ status: false, message: 'Invalid request' })
            }

            const hashedPassword = await bcrypt
                .hash(password, 5)
                .catch((err) => {
                    console.log(err)
                    return reply.code(500).send({
                        status: false,
                        message: 'Internal Server Error'
                    })
                })
            instance.log.info(hashedPassword)
            let user: Awaited<
                ReturnType<typeof instance.prisma.users.findUnique>
            >
            try {
                user = await instance.prisma.users.findUnique({
                    where: {
                        email: email
                    }
                })
            } catch (err) {
                console.log('database insertion error')
                console.log(err)
                reply
                    .code(500)
                    .send({ status: false, message: 'Internal Server Error' })
                return // This is important to prevent further execution in case of an error
            }

            instance.log.info(JSON.stringify(user))

            if (!user || user.email !== email) {
                return reply.code(400).send({
                    status: false,
                    message: 'email or password is incorrect'
                })
            }
            const promisifyCompare = promisify(bcrypt.compare)

            const isSame = await promisifyCompare(
                password,
                user.password
            ).catch((err) => {
                instance.log.info(err)
            })
            if (!isSame) {
                instance.log.info({
                    message: 'The password is incorrect, refuse to login',
                    address: '/login'
                })
                return reply.code(400).send({
                    message: 'Email or password is incorrect',
                    status: false
                })
            }

            const token = instance.jwt.sign({
                payload: user.user_id
            })

            instance.log.info({ token })

            reply.setCookie('token', token, {
                httpOnly: true,
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
                sameSite: 'none',
                secure: true
            })
            return reply.send({
                status: true,
                message: 'Logged in successfully',
                user: {
                    email: user.email,
                    avatar_path: user.avatar_path,
                    username: user.username,
                    userId: user.user_id
                }
            })
        })
    } catch (err) {
        console.log(err)
    }
}
export default plugin
