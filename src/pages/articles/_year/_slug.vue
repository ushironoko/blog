<template>
  <article>
    <template v-if="post">
      <h1 class="mb-2">{{ post.title }}</h1>
      <TheDescriptions :post="post" :is-show-description="false" />
      <NuxtContent class="content-font" :document="post" />
      <div class="flex justify-center my-12">
        <a :href="post.twitterLink" target="_blank" rel="noopener"
          ><img
            width="24px"
            height="24px"
            class="text-gray-900"
            src="/Twitter_Social_Icon_Circle_White.svg"
            alt=""
        /></a>
      </div>
    </template>
  </article>
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
          content: `${baseURL}/articles/images/ushironoko.jpg`,
        },
      ],
    }))

    return {
      post,
    }
  },
})
</script>

<style scoped>
.content-font {
  font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN',
    'Hiragino Sans', Meiryo, sans-serif;
}
</style>
