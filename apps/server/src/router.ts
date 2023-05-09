import fastify, { FastifyInstance } from 'fastify'
import { RowDataPacket } from 'mysql2'
import sendMail from './nodemailer.mjs'
import { MySQLPromisePool } from '@fastify/mysql'
import bcrypt from 'bcrypt'
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
    const isValidEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        return emailRegex.test(email)
    }

    const getEmailFromDB = async (instance: FastifyInstance, email: string) => {
        const [rawEmail] = await instance.mysql
            .query(`SELECT email FROM users WHERE email=?`, [email])
            .catch((err) => {
                console.log(err)
                instance.log.error(`database error: ${err}`)
                return [[]] // Return an empty array
            })
        // console.log(rawEmail)
        instance.log.info(`getEmailFromDB: ${email}`)
        return rawEmail
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
    instance.get('/plugin', (request, reply) => {
        reply.send({ hello: 'world' })
    })
    const emailAndCodeMessages = new Map<
        string,
        { code: string; sendTime: number }
    >()

    instance.post('/sendEmail', async (request, reply) => {
        try {
            const { email } = request.body as { [key: string]: string }

            if (!email) {
                request.log.info('The email is empty, please provide the email')
                return reply
                    .status(400)
                    .send('The email is empty, please provide the email')
            }

            if (!isValidEmail(email)) {
                request.log.info(`email`)
                request.log.info('The email is illegal')
                return reply.status(400).send('The email is illegal')
            }

            const rawEmail = await getEmailFromDB(instance, email)
            if (rawEmail && Array.isArray(rawEmail) && rawEmail.length === 1) {
                request.log.info('The email already exists')
                return reply.status(400).send('The email already exists')
            }

            const emailData = emailAndCodeMessages.get(email)
            if (emailData) {
                const { cooldownActive, waitSeconds } =
                    isEmailCooldownActive(emailData)

                if (cooldownActive) {
                    return reply.status(400).send({
                        status: 'no',
                        msg: `Email has been sent, if you want to resend, please wait ${waitSeconds} seconds`
                    })
                }
            }

            const code = Math.random().toString().substring(2, 8)
            try {
                await new Promise((resolve, reject) => {
                    sendMail(email, code, function (error: any, info: any) {
                        if (error) {
                            request.log.error(error)

                            request.log.error('email sending failed')
                            resolve('')
                            return reply.code(400).send('Email sending failed')
                        }
                        console.log('email:', email, code)
                        emailAndCodeMessages.set(email, {
                            code,
                            sendTime: Date.now()
                        })
                        console.log('add it to emailMessage')
                        console.log(emailAndCodeMessages)
                        setTimeout(() => {
                            emailAndCodeMessages.delete(email)
                            request.log.info('email has expired：', email)
                        }, 120000)
                        console.log('mail sent:', info.response)
                        request.log.info('email sending successful')
                        request.log.info(`the code is ${code}`)
                        resolve('')
                        return reply.code(200).send({
                            status: 'ok',
                            msg: 'Email sending successful'
                        })
                    })
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
            // console.log(request.body)
            const { email, password, code } = request.body as {
                [key: string]: string
            }
            if (!email || !password || !code) {
                request.log.error('the verification information is invalid')
                request.log.info({ email, password, code })
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
                request.log.error('the verification code is invalid')
                request.log.info({
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
                    console.log(err)
                    return reply
                        .code(500)
                        .send({ msg: 'Internal Server Error' })
                })

            await new Promise(async (resolve, reject) => {
                await instance.mysql
                    .query(
                        `INSERT INTO users (username, email, password, avatar_path) VALUES ("${email}", "${email}", "${hashedPassword}",'/default_path'); `
                    )

                    .catch((err) => {
                        console.log('database insertion error')
                        console.log(err)
                        reply.code(500).send({ msg: 'Internal Server Error' })
                    })
                interface QueryResult {
                    id: number
                }
                let rows: RowDataPacket[]
                try {
                    const result = await instance.mysql.query<RowDataPacket[]>(
                        `select id from users where email = "${email}"`
                    )
                    rows = result[0]
                } catch (err) {
                    console.log('database insertion error')
                    console.log(err)
                    reply.code(500).send({ msg: 'Internal Server Error' })
                    return // This is important to prevent further execution in case of an error
                }
                request.log.info(rows)
                console.log(rows)

                request.log.info({ userId: rows[0].id })
                let userId: number = rows[0].id

                const token = instance.jwt.sign({
                    payload: userId
                })
                if (!token) {
                    return
                }
                request.log.info({ token })
                resolve('success')
                return reply.send({ token })
            })

            // return { ok: 'yes' }
        } catch (err) {
            reply.code(500).send({
                msg: 'Internal Server Error'
            })
        }
        // console.log(userEmail)
    })

    instance.get('/', async (request, reply) => {
        return { hello: 'world' }
    })

    instance.get('/users', async (request, reply) => {
        const users = await instance.mysql.query('select * from users')
        console.log(users)
        return { hello: 'ok' }
    })
    instance.get('/query', async (request, reply) => {
        console.log('message:', emailAndCodeMessages)
        request.log.info(emailAndCodeMessages)
        return reply.code(200).send('ok')
    })
    done()
}
