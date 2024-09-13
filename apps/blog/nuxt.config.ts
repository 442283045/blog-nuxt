// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@unocss/nuxt',
    '@nuxt/test-utils/module',
    '@nuxt/image-edge',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],
  content: {
    // https://content.nuxtjs.org/api/configuration
  },
  image: {
    // Options
  },
  pinia: {},
  testUtils: {},
  alias: {
    images: '/<rootDir>/assets/images',
  },
})
