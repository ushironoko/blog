<template>
  <div>
    <p class="description">
      {{ dateFormat(post.updatedAt) }}
      /
      {{ post.reading_time }}
    </p>
    <p class="description">{{ post.slug }}</p>
  </div>
</template>

<script lang="ts">
import { IContentDocument } from '@nuxt/content/types/content'
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { dateFormat } from '../utils/format'

export default defineComponent({
  props: {
    post: {
      type: Object as PropType<IContentDocument>,
      required: true,
    },
  },
  setup() {
    return {
      dateFormat,
    }
  },
})
</script>

<style lang="postcss" scoped>
.description {
  @apply text-gray-600 text-sm;
}
</style>
