import server from './new-app.js'
import process from 'node:process'
server.setErrorHandler((error, request, reply) => {
    // Custom error handling logic
    server.log.error(error)

    // You can also send an error response to the client
    reply.code(500).send({ error: 'Internal Server Error' })
})
process.on('uncaughtException', (err, origin) => {
    server.log.error(
        `Caught exception: ${err}\n` + `Exception origin: ${origin}`
    )
})
process.on('unhandledRejection', (reason, promise) => {
    // Custom error handling logic
    server.log.error('Unhandled Rejection at:', promise)
    server.log.error('Reason:', reason)
})
server.listen({ port: 3001 }, function (err, address) {
    if (err) {
        server.log.error(err)
        process.exit(1)
    }

    server.log.info(`Server listening on ${address}`)
})

export default server
