<template>
  <div>
    <template v-if="posts">
      <section v-for="(post, i) in posts" :key="i" class="mb-4">
        <NuxtLink :to="post.path">
          <h2 class="mb-2">
            {{ post.title }}
          </h2>
          <TheDescriptions :post="post" />
        </NuxtLink>
      </section>
    </template>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  useAsync,
  useContext,
  useMeta,
} from '@nuxtjs/composition-api'
import { fetchArticles } from '~/composables/fetch'

export default defineComponent({
  head: {},
  setup() {
    const {
      route,
      $config: { baseURL },
    } = useContext()

    const posts = useAsync(async () => {
      return await fetchArticles()
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
          content: `${baseURL}`,
        },
        {
          property: 'og:title',
          content: 'ushironoko.me',
        },
        {
          property: 'og:description',
          content:
            'ushironokoのブログです。日常から技術の話までなんでも書きます。',
        },
        {
          property: 'og:image',
          content: `${baseURL}/articles/images/ushironoko.jpg`,
        },
      ],
    }))

    return {
      posts,
    }
  },
})
</script>
