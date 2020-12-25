<template>
  <div class="description">
    <p>
      {{ dateFormat(post.publishedAt) }}
      / ⏳ {{ post.reading_time }}
    </p>
    <p v-if="isShowDescription">
      {{ post.description }}
    </p>
  </div>
</template>

<script lang="ts">
import { IContentDocument } from '@nuxt/content/types/content'
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { dateFormat } from '~/utils/format'

export default defineComponent({
  props: {
    post: {
      type: Object as PropType<IContentDocument>,
      required: true,
    },
    isShowDescription: {
      type: Boolean,
      default: true,
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
  @apply mb-8;
}
</style>
