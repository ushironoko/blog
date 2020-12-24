import { defineNuxtModule } from '@nuxtjs/composition-api'

const routes: string[] = []

export default defineNuxtModule(function () {
  this.nuxt.hook('generate:route', ({ route }: { route: string }) => {
    routes.push(route)
  })
  this.nuxt.hook('sitemap:generate:before', (_: any, sitemapOptions: any) => {
    if (!sitemapOptions[0].routes) {
      sitemapOptions[0].routes = []
    }
    sitemapOptions[0].routes = [...sitemapOptions[0].routes, ...routes]
  })
})
