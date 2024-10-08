import type { FastifyInstance, FastifyPluginCallback } from 'fastify'

import bcrypt from 'bcrypt'

const plugin: FastifyPluginCallback = async function (instance) {
  const isValidEmail = (email: string) => {
    const emailRegex = /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i
    return emailRegex.test(email)
  }

  const getEmailFromDB = async (instance: FastifyInstance, email: string) => {
    try {
      const user = await instance.prisma.users.findUnique({
        where: { email },
      })

      if (!user) {
        return null
      }
      instance.log.info(`getEmailFromDB: ${email}`)
      return user.email as string
    }
    catch (err) {
      instance.log.error(`database error: ${err}`)
    }
  }
  const isEmailCooldownActive = (emailData: {
    code: string
    sendTime: number
  }) => {
    const nowMilliseconds = Date.now() - emailData.sendTime
    const waitSeconds
            = nowMilliseconds > 0 ? Math.floor(nowMilliseconds / 1000) : 0

    return {
      cooldownActive: waitSeconds < 120,
      waitSeconds,
    }
  }

  const emailAndCodeMessages = new Map<
    string,
    { code: string, sendTime: number }
  >()

  instance.post('/api/send_code', async (request, reply) => {
    try {
      const { email } = request.body as { [key: string]: string }

      if (!email) {
        instance.log.info(
          'The email is empty, please provide the email',
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
          status: false,
        })
      }

      const emailData = emailAndCodeMessages.get(email)
      if (emailData) {
        const { cooldownActive, waitSeconds }
                    = isEmailCooldownActive(emailData)

        if (cooldownActive) {
          return reply.status(400).send({
            status: 'no',
            message: `Email has been sent, if you want to resend, please wait ${
              120 - waitSeconds
            } seconds`,
          })
        }
      }

      const code = Math.random().toString().substring(2, 8)
      try {
        await new Promise((resolve) => {
          instance.sendMail(
            email,
            code,
            (error: Error | null) => {
              if (error) {
                resolve('')
                instance.logger.error(error.message, { error })
                return reply.code(400).send({
                  message:
                                        'Sending code failed, please try it again',
                  status: false,
                })
              }

              emailAndCodeMessages.set(email, {
                code,
                sendTime: Date.now(),
              })

              setTimeout(() => {
                emailAndCodeMessages.delete(email)
                instance.log.info('email has expired：', email)
              }, 120000)

              resolve('')
              return reply.code(200).send({
                status: true,
                message: 'Email sending successful',
              })
            },
          )
        })
      }
      catch (error) {
        console.error(error)
        reply.status(500).send('Email sending failed')
      }
    }
    catch (err) {
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
        return reply.code(400).send({
          message: 'the verification information is invalid',
          status: false,
        })
      }
      const emailRegex = /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i
      if (!emailRegex.test(email)) {
        reply
          .code(400)
          .send({ message: 'The email is illegal', status: false })
      }

      const passwordRegex
                = /^[\w!@#$%^&*()+\-=[\]{};':"\\|,.<>/?]{8,20}$/
      if (!passwordRegex.test(password)) {
        reply.code(400).send({
          message: 'The password does not meet the requirements',
          status: false,
        })
        return
      }

      const codeRegex = /^\d{6}$/
      if (!codeRegex.test(code)) {
        reply.code(400).send({
          message: 'The verification code should consist of 6 digits',
          status: false,
        })
        return
      }

      if (
        !emailAndCodeMessages.has(email)
        || emailAndCodeMessages.get(email)?.code !== code
      ) {
        return reply.code(400).send({
          status: false,
          message: 'The verification code is invalid',
        })
      }
      const hashedPassword = await bcrypt
        .hash(password, 5)
        .catch((err) => {
          console.error(err)
          return reply.code(500).send({
            message: 'Internal Server Error',
            status: false,
          })
        })

      try {
        // Create user
        const newUser = await instance.prisma.users.create({
          data: {
            email,
            username: email,
            password: hashedPassword,
            avatar_path: '/avatar/default.png',
          },
        })

        instance.log.info(newUser)

        // Generate token
        const token = instance.jwt.sign({ payload: newUser.user_id })
        if (!token) {
          throw new Error('Token generation failed')
        }

        instance.log.info({ token })

        // Set cookie
        reply.setCookie('token', token, {
          httpOnly: true,
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
        })

        // Send response
        return reply.send({
          status: true,
          message: 'Register successfully',
          user: {
            email: newUser.email,
            avatar_path: newUser.avatar_path,
            username: newUser.username,
            userId: newUser.user_id,
            userBio: newUser.user_bio,
          },
        })
      }
      catch (error) {
        instance.log.error(error)
        return reply.send({
          status: false,
          message: 'Registration failed',
        })
      }
    }
    catch (err) {
      console.error(err)
      return reply.code(500).send({
        message: 'Internal Server Error',
        status: false,
      })
    }
  })

  instance.get('/api/check_login', async (request, reply) => {
    const token = request.cookies.token
    instance.log.info({ token })
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
      instance.log.info(decode)
      const user = await instance.prisma.users.findUnique({
        where: {
          user_id: decode.payload,
        },
      })
      if (!user) {
        reply.setCookie('token', '', {
          httpOnly: true,

          path: '/',
          maxAge: 0, // 7 days in seconds
        })
        return reply.code(200).send({
          message: 'user is not logged in',
          login: false,
        })
      }
      instance.log.info(user)

      return reply.send({
        message: 'Logged in',
        login: true,
        user: {
          email: user.email,
          avatar_path: user.avatar_path,
          username: user.username,
          userId: user.user_id,
          userBio: user.user_bio,
        },
      })
    }
    catch (err) {
      instance.log.error(err)
      reply.setCookie('token', '', {
        httpOnly: true,

        path: '/',
        maxAge: 0, // 7 days in seconds
      })
      return reply
        .code(200)
        .send({ message: 'user is not logged in', login: false })
    }
  })
}
export default plugin
