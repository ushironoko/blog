<template>
  <article>
    <template v-if="post">
      <h1 class="mb-2 text-2xl">{{ post.title }}</h1>
      <NuxtContent :document="post" />
    </template>
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
