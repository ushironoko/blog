<template>
  <article>
    <template v-if="post">
      <h1>{{ post.title }}</h1>
      <TheDescriptions :post="post" :is-show-description="false" />
      <NuxtContent :document="post" />
    </template>
    <div class="my-8 flex">
      <div>
        <a
          href="https://twitter.com/share?ref_src=twsrc%5Etfw"
          class="twitter-share-button"
          data-show-count="false"
        ></a>
      </div>
      <div class="ml-2">
        <a
          href="https://b.hatena.ne.jp/entry/"
          class="hatena-bookmark-button"
          data-hatena-bookmark-layout="basic-label"
          data-hatena-bookmark-lang="ja"
          title="このエントリーをはてなブックマークに追加"
          ><img
            src="https://b.st-hatena.com/images/v4/public/entry-button/button-only@2x.png"
            alt="このエントリーをはてなブックマークに追加"
            width="20"
            height="20"
            style="border: none"
        /></a>
      </div>
    </div>
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

export default defineComponent({
  head: {},
  setup() {
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
          content: `${process.env.ORIGIN}${
            post?.value?.path || process.env.ORIGIN
          }`,
        },
        {
          property: 'og:title',
          content: post?.value?.title || process.env.ORIGIN,
        },
        {
          property: 'og:description',
          content: post?.value?.description || process.env.ORIGIN,
        },
        {
          property: 'og:image',
          content: `${process.env.ORIGIN}/articles/images/ushironoko.jpg`,
        },
      ],
    }))

    return {
      post,
    }
  },
})
</script>
