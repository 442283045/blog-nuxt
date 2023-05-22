import env from '@fastify/env'
import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
const schema = {
    type: 'object',
    required: [
        'JWT_SECRET',
        'CLIENT_URL',
        'COOKIE_SECRET',
        'MAILBOX_EMAIL',
        'MAILBOX_AUTHORIZATION_CODE'
    ],
    properties: {
        JWT_SECRET: {
            type: 'string'
        },
        CLIENT_URL: {
            type: 'string'
        },
        COOKIE_SECRET: {
            type: 'string'
        },
        MAILBOX_EMAIL: {
            type: 'string'
        },
        MAILBOX_AUTHORIZATION_CODE: {
            type: 'string'
        }
    }
}

const envOptions = {
    confKey: 'config',
    dotenv: true,
    schema: schema,
    data: process.env
}

const envPlugin: FastifyPluginAsync = fp(async (server, options) => {
    server.register(env, envOptions)
})

export default envPlugin
