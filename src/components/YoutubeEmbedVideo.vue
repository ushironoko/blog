<template>
  <div class="video-container">
    <div class="video-player">
      <YoutubeEmbedVideoChild :src="url" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import YoutubeEmbedVideoChild from './YoutubeEmbedVideoChild.vue'

export default defineComponent({
  components: {
    YoutubeEmbedVideoChild,
  },
  props: {
    youtubeId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const url = `https://www.youtube.com/embed/${props.youtubeId}`

    return {
      url,
    }
  },
})
</script>
