import fastify from 'fastify'
import jwt from '@fastify/jwt'
// import auth from '@fastify/auth'
import type { FastifyCookieOptions } from '@fastify/cookie'
import cookie from '@fastify/cookie'
import router from './router.js'
import articlesApi from './api/articles.js'
import dbConnector from './database.js'
import cors from '@fastify/cors'
import fileServer from '@fastify/static'
import path from 'node:path'
// import logger from './log/index.js'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import api from './api/index.js'
dotenv.config()
const server = fastify({})

server.register(cors, {
    origin: ['http://localhost:3000'], // The origins that are allowed access
    credentials: true
})
server.register(fileServer, {
    root: path.join(path.resolve(), 'public'), // Replace 'public' with your directory containing static files
    prefix: '/public/' // Optional: Prefix all routes with '/public/'
})
server.register(cookie, {
    secret: 'my-secret', // for cookies signature
    parseOptions: {} // options for parsing cookies
} as FastifyCookieOptions)
server.register(jwt, { secret: 'supersecret' })
// server.register(auth)
server.register(dbConnector)
server.register(router)
server.register(articlesApi)
server.register(api)
export default server
