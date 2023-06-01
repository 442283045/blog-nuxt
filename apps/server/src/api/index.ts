import logout from './logout.js'
import login from './login.js'
import register from './register.js'
import articles from './articles.js'
import user from './user.js'
import test from './test.js'
import { FastifyPluginAsync } from 'fastify'

const plugin: FastifyPluginAsync = async function (instance, options) {
    try {
        instance.register(logout)
        instance.register(login)
        instance.register(register)
        instance.register(articles)
        instance.register(user)
        instance.register(test)
    } catch (err) {
        console.log(err)
    }
}
export default plugin
