<script setup lang="ts">
const { data: posts } = useFetch('/api/posts/sortedpostsData');
const ogImageUrlOrigin = (title: string) =>
  `https://og-image-noko-ushiro.vercel.app/${title}?theme=light&md=1&fontSize=95px`;
</script>

<template>
  <div class="flex justify-center">
    <main>
      <section
        class="grid pc:grid-cols-[1fr_1fr_1fr] tablet:grid-cols-[1fr_1fr] grid-cols-[1fr] gap-5"
      >
        <div v-for="post in posts" :key="post.id">
          <PostDescriptionViewCard
            :postData="post"
            :ogImageUrlOrigin="ogImageUrlOrigin"
          />
        </div>
      </section>
    </main>
  </div>
</template>
