import { fileURLToPath } from 'node:url'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxt/content',
        '@unocss/nuxt',
        'nuxt-vitest',
        '@nuxt/image-edge',
        '@pinia/nuxt',
        '@sidebase/nuxt-auth'
    ],
    content: {
        // https://content.nuxtjs.org/api/configuration
    },
    image: {
        // Options
    },
    pinia: {
        autoImports: ['defineStore', 'acceptHMRUpdate']
    },
    alias: {
        images: '/<rootDir>/assets/images'
    },
    auth: {
        baseURL: 'http://127.0.0.1:3001/',
        provider: {
            type: 'local',

            endpoints: {
                signIn: { path: '/login', method: 'post' },
                signOut: { path: '/logout', method: 'post' },
                signUp: { path: '/register', method: 'post' },
                getSession: { path: '/session', method: 'get' }
            }
        }
    }
})
