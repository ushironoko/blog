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

    const { fetchAllArticles } = useArticle($content, params, baseURL as string)

    const posts = useAsync(async () => {
      return await fetchAllArticles()
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
          content: `https://og-image-one-pearl.vercel.app/ushironoko.me?theme=light&md=1&fontSize=95px`,
        },
      ],
    }))

    return {
      posts,
    }
  },
})
</script>
