import type { FastifyPluginAsync } from 'fastify'
import { PrismaClient } from '@prisma/client'
import fp from 'fastify-plugin'

const prismaPlugin: FastifyPluginAsync = fp(async (server) => {
  const prisma = new PrismaClient()

  await prisma.$connect()

  // Make Prisma Client available through the fastify server instance: server.prisma
  server.decorate('prisma', prisma)

  server.addHook('onClose', async (server) => {
    await server.prisma.$disconnect()
  })
})

export default prismaPlugin
