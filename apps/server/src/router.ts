import { FastifyInstance } from 'fastify'

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
    instance.get('/plugin', (request, reply) => {
        reply.send({ hello: 'world' })
    })
    const emailAndCodeMessages = new Map<
        string,
        { code: string; sendTime: number }
    >()
    instance.post('/sendEmail', async (request, reply) => {
        try {
            // console.log(request.body)
            const { email } = request.body as {
                [key: string]: string
            }
            if (!email) {
                return reply
                    .code(400)
                    .send('The email is empty, please provide the email')
            }
            let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            if (!emailRegex.test(email)) {
                return reply.code(400).send('The email is illegal')
            }

            const rawEmail = await instance.mysql.query(
                `select email from users where email=\"${email}\"`
            )
            if (
                Array.isArray(rawEmail) &&
                rawEmail[0] &&
                Array.isArray(rawEmail[0]) &&
                rawEmail[0].length === 1
            ) {
                return reply.code(400).send('The email already exists')
            }
            if (emailAndCodeMessages && emailAndCodeMessages.has(email)) {
                const nowMilliseconds =
                    Date.now() -
                    (
                        emailAndCodeMessages.get(email) as {
                            code: string
                            sendTime: number
                        }
                    ).sendTime
                const waitSeconds =
                    nowMilliseconds > 0 ? Math.floor(nowMilliseconds / 1000) : 0

                return reply.code(400).send({
                    status: 'no',
                    msg: `Email has been sended, if want to resend, please wait ${waitSeconds} seconds`
                })
            }
            let code = Math.random().toString().substring(2, 8)

            await new Promise((resolve, reject) => {
                sendMail(email, code, function (error: any, info: any) {
                    if (error) {
                        console.log(error)

                        resolve('')
                        return reply.code(400).send('Email sending failed')
                    }

                    emailAndCodeMessages.set(email, {
                        code,
                        sendTime: Date.now()
                    })
                    setTimeout(() => {
                        emailAndCodeMessages.delete(email)
                    }, 120000)
                    console.log('mail sent:', info.response)

                    resolve('')
                    return reply.code(200).send({
                        status: 'ok',
                        msg: 'Email sending successful'
                    })
                })
            })
        } catch (err) {
            console.log(err)

            reply.code(500).send('Internal server error')
        }
    })
    instance.post('/register', async (request, reply) => {
        try {
            // console.log(request.body)
            const { email, password, verificationCode } = request.body as {
                [key: string]: string
            }
            if (!email || !password || !verificationCode) {
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

            let verificationCodeRegex = /^\d{6}$/
            if (!verificationCodeRegex.test(verificationCode)) {
                reply
                    .code(400)
                    .send('The verification code should consist of 6 digits')
                return
            }

            if (
                !emailAndCodeMessages.has(email) ||
                emailAndCodeMessages.get(email)?.code != verificationCode
            ) {
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

            await new Promise((resolve, reject) => {
                instance.mysql
                    .query(
                        `INSERT INTO users (username, email, password, avatar_path) VALUES ("${email}", "${email}", "${hashedPassword}",'/default_path'); `
                    )
                    .then(() => {
                        resolve('success')
                        reply.code(201).send({
                            status: 'ok',
                            msg: 'registered successfully'
                        })
                    })
                    .catch((err) => {
                        console.log('database insertion error')
                        console.log(err)
                        reply.code(500).send({ msg: 'Internal Server Error' })
                    })
            })

            // return { ok: 'yes' }
        } catch (err) {
            console.log(err)
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
    done()
}
