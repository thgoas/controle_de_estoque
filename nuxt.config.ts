// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  app: {
    head: {
      title: 'Controle de Estoque - Minimalista e Fácil de Usar',
      meta: [
        { name: 'description', content: 'Controle de Estoque - Minimalista e Fácil de Usar' }
      ],
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    }
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],

  runtimeConfig: {
    pgDBURL: process.env.DATABASE_URL,

  },
})