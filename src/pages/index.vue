<script setup lang="ts">
const { data: posts } = useFetch('/api/posts/sortedpostsData');
const ogImageUrl = 'https://placehold.jp/252x164.png';
</script>

<template>
  <div class="flex justify-center">
    <main>
      <section
        class="grid pc:grid-cols-[1fr_1fr_1fr] tablet:grid-cols-[1fr_1fr] grid-cols-[1fr] gap-5"
      >
        <div v-for="post in posts" :key="post.id">
          <PostDescriptionViewCard :postData="post" :ogImageUrl="ogImageUrl" />
        </div>
      </section>
    </main>
  </div>
</template>
