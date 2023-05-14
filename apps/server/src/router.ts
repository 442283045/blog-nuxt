import fastify, { FastifyInstance } from 'fastify'
import { RowDataPacket } from 'mysql2'
import sendMail from './nodemailer/index.js'
import { MySQLPromisePool } from '@fastify/mysql'
import bcrypt from 'bcrypt'
import logger from './log/index.js'
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

    instance.post('/api/send_code', async (request, reply) => {
        try {
            const { email } = request.body as { [key: string]: string }

            if (!email) {
                logger.info('The email is empty, please provide the email')
                return reply
                    .status(400)
                    .send('The email is empty, please provide the email')
            }

            if (!isValidEmail(email)) {
                console.log({ email })
                logger.info({ email })
                logger.info('The email is illegal')
                return reply.status(400).send({ msg: 'The email is illegal' })
            }

            const rawEmail = await getEmailFromDB(instance, email)
            if (rawEmail && Array.isArray(rawEmail) && rawEmail.length === 1) {
                logger.info('The email already exists')
                return reply
                    .status(400)
                    .send({ msg: 'The email already exists' })
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
                    sendMail(email, code, function (error: any, info: any) {
                        if (error) {
                            logger.error(error)

                            logger.error('email sending failed')
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
                            logger.info('email has expired：', email)
                        }, 120000)
                        console.log('mail sent:', info.response)
                        logger.info('email sending successful')
                        logger.info(`the code is ${code}`)
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
            // Am I execute?
            console.log('-----executed')
            // console.log(request.body)
            const { email, password, code } = request.body as {
                [key: string]: string
            }
            console.log('-----')
            console.log({ email, password, code })
            if (!email || !password || !code) {
                logger.error('the verification information is invalid')
                console.log({ email, password, code })
                logger.info({ email, password, code })
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
                logger.error('the verification code is invalid')
                logger.info({
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
                        `INSERT INTO users (username, email, password, avatar_path) VALUES ("${email}", "${email}", "${hashedPassword}",'/public/avatar/default.png'); `
                    )

                    .catch((err) => {
                        console.log('database insertion error')
                        console.log(err)
                        reply.code(500).send({ msg: 'Internal Server Error' })
                    })

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
                logger.info(rows)

                logger.info({ userId: rows[0].id })
                let userId: number = rows[0].id

                const token = instance.jwt.sign({
                    payload: userId
                })
                if (!token) {
                    return
                }
                logger.info({ token })
                resolve('success')
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

    instance.get('/query', async (request, reply) => {
        console.log('message:', emailAndCodeMessages)
        logger.info(emailAndCodeMessages)
        return reply.code(200).send('ok')
    })
    instance.get('/api/check_login', async (request, reply) => {
        console.log(request.cookies.token)
        const token = request.cookies.token
        if (!token) {
            return reply
                .code(200)
                .send({ msg: 'user is not logged in', login: false })
        }
        interface VerifyPayloadType {
            payload: string
        }
        let rows: RowDataPacket[]
        interface UserRow extends RowDataPacket {
            username: string
            // Add other properties as needed
        }
        try {
            const decode = instance.jwt.verify(token) as VerifyPayloadType
            console.log(decode) // { foo: 'bar' }
            const [rows] = await instance.mysql.query<UserRow[]>(
                `select id, username, email, avatar_path from users where id = "${decode.payload}"`
            )
            if (rows.length === 0) {
                reply.setCookie('token', '', {
                    httpOnly: true,
                    // secure: true, // Set to true if using HTTPS
                    // domain: 'your-domain.com', // Uncomment and set to your domain if needed
                    // sameSite: 'strict', // Uncomment and set to 'strict' or 'lax' if needed
                    path: '/',
                    maxAge: 0, // 7 days in seconds
                    sameSite: 'none',
                    secure: true
                })
                return reply
                    .code(200)
                    .send({ msg: 'user is not logged in', login: false })
            }
            console.log(rows[0])
            const { id, username, email, avatar_path } = rows[0]
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
            logger.error(err)
            reply.setCookie('token', '', {
                httpOnly: true,
                // secure: true, // Set to true if using HTTPS
                // domain: 'your-domain.com', // Uncomment and set to your domain if needed
                // sameSite: 'strict', // Uncomment and set to 'strict' or 'lax' if needed
                path: '/',
                maxAge: 0, // 7 days in seconds
                sameSite: 'none',
                secure: true
            })
            return reply
                .code(200)
                .send({ msg: 'user is not logged in', login: false })
        }
    })
    done()
}
