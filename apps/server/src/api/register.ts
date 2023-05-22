import { FastifyInstance, FastifyPluginCallback } from 'fastify'

import bcrypt from 'bcrypt'

const plugin: FastifyPluginCallback<{}> = async function (instance, options) {
    const isValidEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        return emailRegex.test(email)
    }

    const getEmailFromDB = async (instance: FastifyInstance, email: string) => {
        try {
            const user = await instance.prisma.users.findUnique({
                where: { email }
            })

            if (!user) {
                return null
            }
            console.log(user)
            instance.log.info(`getEmailFromDB: ${email}`)
            return user.email as string
        } catch (err) {
            instance.log.error(`database error: ${err}`)
        }
    }
    const isEmailCooldownActive = (emailData: {
        code: string
        sendTime: number
    }) => {
        const nowMilliseconds = Date.now() - emailData.sendTime
        const waitSeconds =
            nowMilliseconds > 0 ? Math.floor(nowMilliseconds / 1000) : 0

        return {
            cooldownActive: waitSeconds < 120,
            waitSeconds
        }
    }

    const emailAndCodeMessages = new Map<
        string,
        { code: string; sendTime: number }
    >()

    instance.post('/api/send_code', async (request, reply) => {
        try {
            const { email } = request.body as { [key: string]: string }

            if (!email) {
                instance.log.info(
                    'The email is empty, please provide the email'
                )
                return reply
                    .status(400)
                    .send('The email is empty, please provide the email')
            }

            if (!isValidEmail(email)) {
                instance.log.info({ email })
                instance.log.info('The email is illegal')
                return reply
                    .status(400)
                    .send({ message: 'The email is illegal' })
            }

            const rawEmail = await getEmailFromDB(instance, email)
            if (rawEmail) {
                instance.log.info('The email already exists')
                return reply.status(400).send({
                    message: 'The email already exists',
                    status: false
                })
            }

            const emailData = emailAndCodeMessages.get(email)
            if (emailData) {
                const { cooldownActive, waitSeconds } =
                    isEmailCooldownActive(emailData)

                if (cooldownActive) {
                    return reply.status(400).send({
                        status: 'no',
                        msg: `Email has been sent, if you want to resend, please wait ${
                            120 - waitSeconds
                        } seconds`
                    })
                }
            }

            const code = Math.random().toString().substring(2, 8)
            try {
                await new Promise((resolve, reject) => {
                    instance.sendMail(
                        email,
                        code,
                        function (error: Error | null, info: any) {
                            if (error) {
                                instance.log.error(error)

                                instance.log.error('email sending failed')
                                resolve('')
                                return reply
                                    .code(400)
                                    .send('Email sending failed')
                            }

                            emailAndCodeMessages.set(email, {
                                code,
                                sendTime: Date.now()
                            })

                            setTimeout(() => {
                                emailAndCodeMessages.delete(email)
                                instance.log.info('email has expired：', email)
                            }, 120000)

                            instance.log.info('email sending successful')
                            instance.log.info(`the code is ${code}`)
                            resolve('')
                            return reply.code(200).send({
                                status: true,
                                message: 'Email sending successful'
                            })
                        }
                    )
                })
            } catch (error) {
                console.error(error)
                reply.status(500).send('Email sending failed')
            }
        } catch (err) {
            console.error(err)
            reply.status(500).send('Internal server error')
        }
    })

    instance.post('/register', async (request, reply) => {
        try {
            const { email, password, code } = request.body as {
                [key: string]: string
            }

            if (!email || !password || !code) {
                instance.log.error('the verification information is invalid')

                instance.log.info({ email, password, code })
                return reply
                    .code(400)
                    .send('the verification information is invalid')
            }
            let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            if (!emailRegex.test(email)) {
                reply.code(400).send('The email is illegal')
            }

            let passwordRegex =
                /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,20}$/
            if (!passwordRegex.test(password)) {
                reply
                    .code(400)
                    .send('The password does not meet the requirements')
                return
            }

            let codeRegex = /^\d{6}$/
            if (!codeRegex.test(code)) {
                reply
                    .code(400)
                    .send('The verification code should consist of 6 digits')
                return
            }

            if (
                !emailAndCodeMessages.has(email) ||
                emailAndCodeMessages.get(email)?.code != code
            ) {
                instance.log.error('the verification code is invalid')
                instance.log.info({
                    right: emailAndCodeMessages.get(email),
                    error: code
                })
                return reply.code(400).send({
                    status: 'no',
                    msg: 'the verification code is invalid'
                })
            }
            const hashedPassword = await bcrypt
                .hash(password, 5)
                .catch((err) => {
                    return reply
                        .code(500)
                        .send({ msg: 'Internal Server Error' })
                })

            await new Promise(async (resolve, reject) => {
                // create user
                const newUser = await instance.prisma.users.create({
                    data: {
                        email,
                        username: email,
                        password: hashedPassword,
                        avatar_path: '/avatar/default.png'
                    }
                })
                instance.log.info(newUser)

                const token = instance.jwt.sign({
                    payload: newUser.id
                })
                if (!token) {
                    return
                }
                instance.log.info({ token })
                resolve('success')
                reply.setCookie('token', token, {
                    httpOnly: true,
                    path: '/',
                    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
                    sameSite: 'none',
                    secure: true
                })
                return reply.send({
                    message: 'Logged in successfully',
                    user: {
                        email,
                        avatar_path: '/public/avatar/default.png',
                        username: email
                    }
                })
            })
        } catch (err) {
            reply.code(500).send({
                msg: 'Internal Server Error'
            })
        }
    })

    instance.get('/api/check_login', async (request, reply) => {
        const token = request.cookies.token
        if (!token) {
            return reply
                .code(200)
                .send({ msg: 'user is not logged in', login: false })
        }
        interface VerifyPayloadType {
            payload: number
        }

        try {
            const decode = instance.jwt.verify(token) as VerifyPayloadType

            const user = await instance.prisma.users.findUnique({
                where: {
                    id: decode.payload
                }
            })
            if (!user) {
                reply.setCookie('token', '', {
                    httpOnly: true,

                    path: '/',
                    maxAge: 0, // 7 days in seconds
                    sameSite: 'none',
                    secure: true
                })
                return reply.code(200).send({
                    message: 'user is not logged in',
                    login: false
                })
            }

            const { id, username, email, avatar_path } = user
            return reply.send({
                message: 'Logged in',
                login: true,
                user: {
                    email,
                    avatar_path,
                    username,
                    id
                }
            })
        } catch (err) {
            instance.log.error(err)
            reply.setCookie('token', '', {
                httpOnly: true,

                path: '/',
                maxAge: 0, // 7 days in seconds
                sameSite: 'none',
                secure: true
            })
            return reply
                .code(200)
                .send({ message: 'user is not logged in', login: false })
        }
    })
}
export default plugin
