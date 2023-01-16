// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
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
          content: 'ushironokoのブログです。技術・ゲーム・趣味・仕事など。',
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
          href: '/img/ushironoko.jpg',
        },
      ],
    },
  },
  srcDir: 'src',
  css: ['~/assets/css/tailwind.css', '~/assets/css/global.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: [
    [
      '@nuxtjs/google-fonts',
      {
        families: { Abel: true, 'Noto+Sans+JP': true },
        download: true,
        inject: true,
      },
    ],
  ],
});
