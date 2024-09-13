import type { FastifyPluginAsync } from 'fastify'
import process from 'node:process'
import env from '@fastify/env'
import fp from 'fastify-plugin'

const schema = {
  type: 'object',
  required: [
    'JWT_SECRET',
    'CLIENT_URL',
    'COOKIE_SECRET',
    'MAILBOX_EMAIL',
    'MAILBOX_AUTHORIZATION_CODE',
    'NODE_ENV',
  ],
  properties: {
    JWT_SECRET: {
      type: 'string',
    },
    CLIENT_URL: {
      type: 'string',
    },
    COOKIE_SECRET: {
      type: 'string',
    },
    MAILBOX_EMAIL: {
      type: 'string',
    },
    MAILBOX_AUTHORIZATION_CODE: {
      type: 'string',
    },
    NODE_ENV: {
      type: 'string',
    },
  },
}

const envOptions = {
  confKey: 'config',
  dotenv: true,
  schema,
  data: process.env,
}

const envPlugin: FastifyPluginAsync = fp(async (server) => {
  server.register(env, envOptions)
})

export default envPlugin
