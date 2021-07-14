<template>
  <div v-if="post">
    <h1 class="mb-2">{{ post.title }}</h1>
    <TheDescriptions :post="post" :is-show-description="false" />
    <article>
      <NuxtContent :document="post" />
    </article>
    <footer class="flex justify-center my-12">
      <a class="w-6 h-6" :href="post.twitterLink" target="_blank" rel="noopener"
        ><svg
          class="text-black dark:text-white"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 400 400"
        >
          <title>Twitter Share Button</title>
          <path
            d="M400,200c0,110.5-89.5,200-200,200S0,310.5,0,200S89.5,0,200,0S400,89.5,400,200z M163.4,305.5
	c88.7,0,137.2-73.5,137.2-137.2c0-2.1,0-4.2-0.1-6.2c9.4-6.8,17.6-15.3,24.1-25c-8.6,3.8-17.9,6.4-27.7,7.6
	c10-6,17.6-15.4,21.2-26.7c-9.3,5.5-19.6,9.5-30.6,11.7c-8.8-9.4-21.3-15.2-35.2-15.2c-26.6,0-48.2,21.6-48.2,48.2
	c0,3.8,0.4,7.5,1.3,11c-40.1-2-75.6-21.2-99.4-50.4c-4.1,7.1-6.5,15.4-6.5,24.2c0,16.7,8.5,31.5,21.5,40.1c-7.9-0.2-15.3-2.4-21.8-6
	c0,0.2,0,0.4,0,0.6c0,23.4,16.6,42.8,38.7,47.3c-4,1.1-8.3,1.7-12.7,1.7c-3.1,0-6.1-0.3-9.1-0.9c6.1,19.2,23.9,33.1,45,33.5
	c-16.5,12.9-37.3,20.6-59.9,20.6c-3.9,0-7.7-0.2-11.5-0.7C110.8,297.5,136.2,305.5,163.4,305.5"
          /></svg
      ></a>
    </footer>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  useAsync,
  useMeta,
  useContext,
} from '@nuxtjs/composition-api'
import { useArticle } from '~/composables/articles'

export default defineComponent({
  head: {},
  setup() {
    const {
      route,
      $config: { baseURL },
      $content,
      params,
    } = useContext()

    const { fetchArticle } = useArticle($content, params, baseURL as string)

    const post = useAsync(async () => {
      return await fetchArticle()
    }, route.value.fullPath)

    useMeta(() => ({
      title: `${post?.value?.title || 'ブログ'} - ushironoko.me`,
      meta: [
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:site',
          content: '@ushirono_noko',
        },
        {
          property: 'og:url',
          content: `${baseURL}${post?.value?.path || baseURL}`,
        },
        {
          property: 'og:title',
          content: post?.value?.title || 'ushironoko.me',
        },
        {
          property: 'og:description',
          content:
            post?.value?.description ||
            'ushironokoのブログです。日常から技術の話までなんでも書きます。',
        },
        {
          property: 'og:image',
          content: `${process.env.OGP_IMAGE_ORIGIN}${
            post?.value?.title || 'ushironoko.me.'
          }?theme=light&md=1&fontSize=95px`,
        },
      ],
    }))

    return {
      post,
    }
  },
})
</script>

<style lang="postcss" scoped>
::v-deep blockquote {
  @apply p-2;
  @apply italic;
  @apply border-l-4;
  @apply bg-gray-100 dark:bg-gray-900;
  @apply text-gray-600 dark:text-gray-200;
  @apply border-gray-500 dark:border-gray-800;
}

::v-deep a {
  @apply text-blue-800;
  @apply dark:text-blue-400;
  @apply underline;
}

::v-deep a:visited {
  @apply text-purple-900;
  @apply dark:text-purple-400;
}

svg {
  fill: currentColor;
}
</style>
