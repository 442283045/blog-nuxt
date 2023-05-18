import logger from './log/index.js'
import server from './app.js'

server.listen({ port: 3001 }, function (err, address) {
    if (err) {
        server.log.error(err)
        process.exit(1)
    }

    logger.info(`Server listening on ${address}`)
})

export default server
