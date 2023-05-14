import winston from 'winston'
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' }, // You can include a default metadata object
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`.
        // - Write all logs error (and below) to `error.log`.
        //
        new winston.transports.File({
            filename: './log/error.log',
            level: 'error'
        }),
        new winston.transports.File({ filename: './log/combined.log' })
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: './log/exceptions.log' })
    ]
})

// If we're not in production then log to the `console`
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple()
        })
    )
}

export default logger
