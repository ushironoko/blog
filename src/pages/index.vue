<template>
  <main>
    <template v-if="posts">
      <section v-for="(post, i) in posts" :key="i" class="mb-4">
        <NuxtLink :to="post.path">
          <h2 class="mb-2">
            {{ post.title }}
          </h2>
          <p class="description">
            {{ post.updatedAt }} /
            {{ post.reading_time }}
          </p>
          <p class="description">
            {{ post.slug }}
          </p>
        </NuxtLink>
      </section>
    </template>
  </main>
</template>

<script lang="ts">
import { defineComponent, useContext, useAsync } from '@nuxtjs/composition-api'
import { IContentDocument } from '@nuxt/content/types/content'
import { toJPFormat } from '../utils/format'

export default defineComponent({
  setup() {
    const { $content } = useContext()
    const posts = useAsync(async () => {
      const posts = await $content('articles/2020')
        .sortBy('date', 'desc')
        .limit(10)
        .fetch()

      return posts as IContentDocument[]
    })

    return {
      posts,
      toJPFormat,
    }
  },
})
</script>

<style lang="postcss" scoped>
.description {
  @apply text-gray-600 text-sm;
}
</style>
