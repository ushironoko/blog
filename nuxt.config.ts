import { NuxtConfig } from '@nuxt/types'
import readingTime from 'reading-time'

let posts: any[] = []

const baseURL = process.env.ORIGIN || 'http://localhost:3000'

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
  feed.options = {
    title: 'ushironoko.me',
    description: 'ushironoko.me RSS feed',
    link: `${baseURL}/feed.${ext}`,
  }
  const { $content } = require('@nuxt/content')
  if (posts === null || posts.length === 0)
    posts = await $content(filePath, { deep: true }).fetch()

  for (const post of posts) {
    const feedItem = constructFeedItem(post, filePath, baseURL)
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
    htmlAttrs: {
      lang: 'ja',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'ushironokoのブログです。日常から技術の話までなんでも書きます。',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:site',
        content: '@ushirono_noko',
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
        src: `https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_ID}`,
      },
      {
        innerHTML: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', "${process.env.GOOGLE_ANALYTICS_ID}");
        `,
        hid: 'ga-script',
      },
    ],
    __dangerouslyDisableSanitizersByTagID: {
      'ga-script': ['innerHTML'],
    },
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
    '@nuxtjs/composition-api/module',
    '@nuxtjs/google-analytics',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    '~/modules/sitemap',
    ['@nuxtjs/sitemap', { hostname: baseURL }],
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
        let wordCount = 0
        const { text } = readingTime(document.text, {
          wordsPerMinute: 1000,
          wordBound: (_) => {
            if (wordCount === 2) {
              wordCount = 0
              return true
            } else {
              wordCount++
              return false
            }
          },
        })
        document.reading_time = text
      }
    },
  },

  render: {
    injectScripts: false,
  },

  // Content module configuration (https://go.nuxtjs.dev/config-content)
  content: {
    markdown: {
      rehypePlugins: [
        'rehype-plugin-image-native-lazy-loading',
        [
          'rehype-plugin-auto-resolve-layout-shift',
          { type: 'maxWidth', maxWidth: 640 },
        ],
      ],
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},

  publicRuntimeConfig: {
    baseURL,
    googleAnalytics: {
      id: process.env.GOOGLE_ANALYTICS_ID,
    },
  },
}

export default config
