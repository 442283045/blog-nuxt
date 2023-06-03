import winston from 'winston'
import fp from 'fastify-plugin'

import { FastifyPluginAsync } from 'fastify'
import path from 'node:path'
const { format } = winston
const winstonPlugin: FastifyPluginAsync = fp(async (server, options) => {
    try {
        const logFormat = format.printf(
            (info) =>
                `${info.level} ${info.timestamp}: ${
                    info.message
                } ${JSON.stringify(info.metadata)}`
        )

        const logger = winston.createLogger({
            level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
            format: format.combine(
                format.timestamp({
                    format: `${new Date(Date.now()).toLocaleString('zh-CN')}`
                }),
                // Format the metadata object
                format.metadata({
                    fillExcept: ['message', 'level', 'timestamp']
                })
            ),
            transports: [
                new winston.transports.File({
                    filename: path.join(process.cwd(), 'log', 'info.log'),
                    format: format.combine(format.json())
                }),
                new winston.transports.File({
                    filename: path.join(process.cwd(), 'log', 'error.log'),
                    level: 'error',
                    format: format.combine(format.json())
                })
            ],
            exceptionHandlers: [
                new winston.transports.File({
                    filename: path.join(process.cwd(), 'log', 'exceptions.log')
                })
            ],
            rejectionHandlers: [
                new winston.transports.File({
                    filename: path.join(process.cwd(), 'log', 'rejection.log')
                })
            ],

            exitOnError: false
        })
        if (process.env.NODE_ENV !== 'production') {
            logger.add(
                new winston.transports.Console({
                    format: format.combine(format.colorize(), logFormat)
                })
            )
        }
        console.log({
            'process.env.NODE_ENV': process.env.NODE_ENV
        })
        server.decorate('logger', logger)
    } catch (err) {
        console.log(err)
    }
})
export default winstonPlugin
