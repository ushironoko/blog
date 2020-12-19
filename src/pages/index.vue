<template>
  <main>
    <section v-for="(post, i) in posts" :key="i">
      <div>
        <NuxtLink :to="post.path">{{ post.title }}</NuxtLink>
      </div>
    </section>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import { IContentDocument } from '@nuxt/content/types/content'

export default Vue.extend({
  async asyncData({ $content }) {
    const posts = await $content('articles/2020')
      .sortBy('date', 'desc')
      .limit(10)
      .fetch()
    return {
      posts,
    }
  },
  data() {
    return {
      posts: [] as IContentDocument[],
    }
  },
})
</script>
