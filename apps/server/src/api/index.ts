import type { FastifyPluginAsync } from 'fastify'
import articles from './articles.js'
import login from './login.js'
import logout from './logout.js'
import register from './register.js'
import test from './test.js'
import user from './user.js'

const plugin: FastifyPluginAsync = async function (instance) {
  try {
    instance.register(logout)
    instance.register(login)
    instance.register(register)
    instance.register(articles)
    instance.register(user)
    instance.register(test)
  }
  catch (err) {
    console.error(err)
  }
}
export default plugin
