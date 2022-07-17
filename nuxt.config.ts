import { IContentDocument } from '@nuxt/content/types/content'
import { NuxtConfig } from '@nuxt/types'
import readingTime from 'reading-time'
import axios from 'axios'
import consola from 'consola'
import { JSDOM } from 'jsdom'
import { preloadHtmlList } from './functions/prerender'
import type { TweeticParams, TweeticResponse } from './src/types/tweetic'

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

export function getReadingTime(document: IContentDocument) {
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

  return {
    text,
  }
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
    bodyAttrs: {
      class: 'dark:bg-black dark:text-white',
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
      ...preloadHtmlList({
        baseURL,
        targetArticles: 'articles/2022',
        maxLength: 5,
      }),
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
  css: ['~/assets/css/tailwind.css'],
  plugins: [],
  components: true,
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxt/postcss8',
    '@nuxtjs/composition-api/module',
    '@nuxtjs/google-analytics',
  ],
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
    // @ts-ignore
    'content:file:beforeInsert': (document) => {
      if (document.extension === '.md') {
        const { text } = getReadingTime(document)

        document.reading_time = text

        const firstParagraph = document.text
          .match(/^[^。]*/)[0]
          .replace(/\r?\n/g, '')

        document.firstParagraph = firstParagraph
      }
    },
    generate: {
      page: async (page: { route: any; path: any; html: string }) => {
        const matchers = /"https:\/\/twitter.com\/.+?\/status\/[0-9]+?"/gi
        const matchedUrls = page.html.match(matchers)
        if (!matchedUrls) return

        const targetUrls = matchedUrls.map((url) => url.replace(/"/g, ''))

        if (!targetUrls.length) return

        await Promise.all(
          targetUrls.map(async (url) => {
            return await axios.get<TweeticResponse>(
              'https://www.tweetic.io/api/tweet',
              {
                params: {
                  layout: '',
                  url,
                } as TweeticParams,
              }
            )
          })
        )
          .then((res) => {
            const dom = new JSDOM(page.html)
            const aTags = dom.window.document.querySelectorAll('a')
            const replaceList: { target: string; staticHtml: string }[] = []

            aTags.forEach((aTag) => {
              if (aTag.parentElement?.tagName === 'P') {
                res.forEach(({ data }) => {
                  const {
                    html: staticHtml,
                    oembed: { url },
                  } = data

                  if (aTag.parentElement && aTag.href === url) {
                    replaceList.push({
                      target: aTag.parentElement.outerHTML,
                      staticHtml: `${staticHtml}<p><a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a></p>`,
                    })
                  }
                })
              }
            })

            page.html = replaceList.reduce((acc, { target, staticHtml }) => {
              return acc.replace(target, staticHtml)
            }, dom.serialize())
          })
          .catch((err) => {
            consola.error(err)
          })
      },
    },
  },
  render: {
    injectScripts: false,
  },
  content: {
    markdown: {
      rehypePlugins: [
        'rehype-plugin-image-native-lazy-loading',
        [
          'rehype-plugin-auto-resolve-layout-shift',
          { type: 'maxWidth', maxWidth: 640 },
        ],
      ],
      prism: {
        theme: 'prism-themes/themes/prism-material-dark.css',
      },
    },
  },
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
  },
  publicRuntimeConfig: {
    baseURL,
    googleAnalytics: {
      id: process.env.GOOGLE_ANALYTICS_ID,
    },
  },
}

export default config
