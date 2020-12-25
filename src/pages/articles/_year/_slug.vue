<template>
  <article>
    <template v-if="post">
      <h1>{{ post.title }}</h1>
      <TheDescriptions :post="post" :is-show-description="false" />
      <NuxtContent :document="post" />
      <div class="my-12 flex justify-center">
        <a :href="post.twitterLink" target="_blank" rel="noopener"
          ><img
            style="width: 24px"
            class="text-gray-900"
            src="/Twitter_Social_Icon_Circle_White.svg"
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
import { fetchArticle } from '~/composables/fetch'
import { getOrigin } from '~/config/getOrigin'

export default defineComponent({
  head: {},
  setup() {
    const origin = getOrigin()
    const { route } = useContext()
    const post = useAsync(async () => {
      return await fetchArticle()
    }, route.value.fullPath)

    useMeta(() => ({
      title: 'ushironoko.me',
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
          content: `${origin}${post?.value?.path || origin}`,
        },
        {
          property: 'og:title',
          content: post?.value?.post?.title || 'ushironoko.me',
        },
        {
          property: 'og:description',
          content:
            post?.value?.post?.description ||
            'ushironokoのブログです。日常から技術の話までなんでも書きます。',
        },
        {
          property: 'og:image',
          content: `${origin}/articles/images/ushironoko.jpg`,
        },
      ],
    }))

    return {
      post,
    }
  },
})
</script>
