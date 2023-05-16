// Import the fastify type definitions
import fastify from 'fastify'

// Import your MySQL Promise Pool type
import { MySQLPromisePool } from '@fastify/mysql'
declare module 'fastify' {
    export interface FastifyInstance {
        mysql: MySQLPromisePool
    }
}
