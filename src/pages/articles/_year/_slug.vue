<template>
  <div class="container">
    <NuxtContent :document="post" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { IContentDocument } from '@nuxt/content/types/content'

export default Vue.extend({
  async asyncData({ $content, route }) {
    const post = await $content(`${route.path}`).sortBy('date', 'desc').fetch()
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
