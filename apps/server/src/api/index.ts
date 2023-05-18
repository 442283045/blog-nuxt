import logout from './logout.js'
import login from './login.js'
import { FastifyPluginAsync, FastifyPluginCallback } from 'fastify'

const plugin: FastifyPluginAsync = async function (instance, options) {
    try {
        instance.register(logout)
        instance.register(login)
    } catch (err) {
        console.log(err)
    }
}
export default plugin
