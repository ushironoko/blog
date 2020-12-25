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
import { defineComponent, useAsync } from '@nuxtjs/composition-api'
import { fetchArticles } from '~/composables/fetch'

export default defineComponent({
  setup() {
    const posts = useAsync(async () => {
      return await fetchArticles()
    })

    return {
      posts,
    }
  },
})
</script>
