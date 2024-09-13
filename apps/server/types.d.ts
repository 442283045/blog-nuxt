import type { PrismaClient } from '@prisma/client'

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      JWT_SECRET: string
      CLIENT_URL: string
      COOKIE_SECRET: string
      MAILBOX_AUTHORIZATION_CODE: string
      MAILBOX_EMAIL: string
    }
    verifyJWT: FastifyPluginAsync
    prisma: PrismaClient
    sendMail: FastifyPluginAsync
    logger: winston.Logger
  }
  interface FastifyContextConfig {
    userId?: number
  }
}
