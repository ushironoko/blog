import { defineNuxtModule } from '@nuxtjs/composition-api'

export default defineNuxtModule(function () {
  const routes: string[] = []
  this.nuxt.hook('generate:route', ({ route }: { route: string }) => {
    routes.push(route)
  })
  this.nuxt.hook(
    'sitemap:generate:before',
    (_: unknown, sitemapOptions: any) => {
      if (!sitemapOptions[0].routes) {
        sitemapOptions[0].routes = []
      }
      sitemapOptions[0].routes = [...sitemapOptions[0].routes, ...routes]
    }
  )
})
