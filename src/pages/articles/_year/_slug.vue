<template>
  <article class="prose">
    <template v-if="post">
      <NuxtContent :document="post" />
    </template>
    <div class="mt-8 flex">
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
import { IContentDocument } from '@nuxt/content/types/content'
import { defineComponent, useContext, useAsync } from '@nuxtjs/composition-api'
import { fetchArticle } from '~/composables/fetch'

export default defineComponent({
  setup() {
    const { $content } = useContext()

    const post = useAsync(async () => {
      const { params } = useContext()
      return (await fetchArticle(params, $content)) as IContentDocument
    })

    return {
      post,
    }
  },
})
</script>

<style lang="postcss" scoped>
.nuxt-content {
  a {
    text-decoration: none;
  }
}
</style>
