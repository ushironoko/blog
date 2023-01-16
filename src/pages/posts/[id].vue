<script setup lang="ts">
const { params } = useRoute();

const id = Array.isArray(params.id) ? params.id[0] : params.id;

const { data } = useFetch(`/api/posts/postData?id=${encodeURIComponent(id)}`, {
  key: id,
});
</script>

<template>
  <div class="whitespace-pre-wrap" v-html="data?.contentHtml"></div>
</template>
