<template>
  <article>
    <NuxtContent :document="post" />
  </article>
</template>

<script lang="ts">
import Vue from 'vue'
import { IContentDocument } from '@nuxt/content/types/content'

export default Vue.extend({
  async asyncData({ $content, route }) {
    const post = await $content(`${route.path}`).fetch()
    return {
      post,
    }
  },
  data() {
    return {
      post: {} as IContentDocument,
    }
  },
})
</script>
