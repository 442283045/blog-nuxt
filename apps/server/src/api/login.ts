import { FastifyPluginAsync } from 'fastify'
import { RowDataPacket } from 'mysql2'
import logger from '../log/index.js'
import bcrypt from 'bcrypt'
import { promisify } from 'node:util'

const plugin: FastifyPluginAsync = async function (instance, options) {
    try {
        instance.post('/login', async (request, reply) => {
            logger.info('login')

            const { password, email } = request.body as {
                password: string
                email: string
            }
            logger.info(JSON.stringify({ password, email }))
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
            logger.info(hashedPassword)
            let rows: RowDataPacket[]
            try {
                const result = await instance.mysql.query<RowDataPacket[]>(
                    `select * from users where email = "${email}"`
                )
                rows = result[0]
            } catch (err) {
                console.log('database insertion error')
                console.log(err)
                reply
                    .code(500)
                    .send({ status: false, message: 'Internal Server Error' })
                return // This is important to prevent further execution in case of an error
            }

            logger.info(JSON.stringify(rows[0]))

            if (rows[0].email !== email) {
                return reply.code(400).send({
                    status: false,
                    message: 'email or password is incorrect'
                })
            }
            const promisifyCompare = promisify(bcrypt.compare)
            // bcrypt.compare(password, rows[0].password, function (err, result) {
            //     console.log(result)
            //     // result == true
            // })

            const isSame = await promisifyCompare(
                password,
                rows[0].password
            ).catch((err) => {
                logger.info(err)
            })
            if (!isSame) {
                logger.info({
                    message: 'the password is incorrect, refuse to login'
                })
                return reply.code(400).send({
                    message: 'email or password is incorrect',
                    status: false
                })
            }
            let userId: number = rows[0].id

            const token = instance.jwt.sign({
                payload: userId
            })
            if (!token) {
                return
            }
            logger.info({ token })

            reply.setCookie('token', token, {
                httpOnly: true,
                // secure: true, // Set to true if using HTTPS
                // domain: 'your-domain.com', // Uncomment and set to your domain if needed
                // sameSite: 'strict', // Uncomment and set to 'strict' or 'lax' if needed
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
                sameSite: 'none',
                secure: true
            })
            return reply.send({
                status: true,
                message: 'Logged in successfully',
                user: {
                    email,
                    avatar_path: '/public/avatar/default.png',
                    username: email
                }
            })
        })
    } catch (err) {
        console.log(err)
    }
}
export default plugin
