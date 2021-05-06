<template>
  <div class="mb-8">
    <p class="text-sm text-gray-500">
      {{ dateFormat(post.publishedAt) }} ⏳ {{ post.reading_time }}
    </p>
    <p v-if="isShowDescription" class="text-sm text-gray-500">
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
