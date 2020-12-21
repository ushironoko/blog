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

export default defineComponent({
  setup() {
    const { $content, route } = useContext()
    const post = useAsync(async () => {
      return (await $content(route.value.path).fetch()) as IContentDocument
    })

    return {
      post,
    }
  },
})
</script>
