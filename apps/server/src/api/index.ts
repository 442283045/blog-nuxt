import logout from './logout.js'

import { FastifyPluginAsync, FastifyPluginCallback } from 'fastify'

const plugin: FastifyPluginAsync = async function (instance, options) {
    try {
        instance.register(logout)
    } catch (err) {
        console.log(err)
    }
}
export default plugin
