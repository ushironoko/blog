import { NuxtConfig } from '@nuxt/types'
import readingTime from 'reading-time'
import { getOrigin } from './src/config/getOrigin'

const origin = getOrigin()

let posts: any[] = []

const constructFeedItem = (post: any, dir: string, hostname: string) => {
  const url = `${hostname}/${dir}/${post.slug}`
  return {
    title: post.title,
    id: url,
    link: url,
    description: post.description,
    content: post.bodyPlainText,
  }
}

const create = async (feed: any, args: any) => {
  const [filePath, ext] = args
  const hostname = origin
  feed.options = {
    title: 'ushironoko.me',
    description: 'ushironoko.me RSS feed',
    link: `${hostname}/feed.${ext}`,
  }
  const { $content } = require('@nuxt/content')
  if (posts === null || posts.length === 0)
    posts = await $content(filePath, { deep: true }).fetch()

  for (const post of posts) {
    const feedItem = constructFeedItem(post, filePath, hostname)
    feed.addItem(feedItem)
  }
  return feed
}

const config: NuxtConfig = {
  srcDir: 'src',
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'ushironoko.me',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'ushironokoのブログです。日常から技術の話までなんでも書きます。',
      },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/articles/images/ushironoko.jpg',
      },
    ],
    script: [
      {
        src: 'https://b.st-hatena.com/js/bookmark_button.js',
      },
      {
        src: 'https://platform.twitter.com/widgets.js',
      },
    ],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/composition-api',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    '~/modules/sitemap',
    ['@nuxtjs/sitemap', { hostname: origin }],
    '@nuxtjs/feed',
  ],

  feed: [
    {
      path: '/feed.xml',
      create,
      cacheTime: 1000 * 60 * 15,
      type: 'rss2',
      data: ['articles', 'xml'],
    },
  ],

  hooks: {
    'content:file:beforeInsert': (document) => {
      if (document.extension === '.md') {
        const { text } = readingTime(document.slug)

        document.reading_time = text
      }
    },
  },

  // Content module configuration (https://go.nuxtjs.dev/config-content)
  content: {},

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},
}

export default config
