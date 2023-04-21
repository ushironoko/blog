<script setup lang="ts">
import 'highlight.js/styles/monokai.css';

const { params, fullPath } = useRoute();

const id = Array.isArray(params.id) ? params.id[0] : params.id;

const { data } = await useFetch(
  `/api/posts/postData?id=${encodeURIComponent(id)}`,
  {
    key: id,
  }
);

const postTitle = data.value?.title ?? 'ushironoko.me';

const description = data.value?.contentHtml
  .match(/^\<p\>.*\<\/p\>/g)
  ?.toString()
  .replace('<p>', '')
  .replace('</p>', '')
  .replace('<code>', '')
  .replace('</code>', '');

const ogUrl = `https://og-image-noko-ushiro.vercel.app/${
  data?.value?.title ?? 'ushironoko.me'
}?theme=light&md=1&fontSize=95px`;

useHead({
  title: postTitle,
  meta: [
    {
      property: 'og:url',
      content: `https://ushironoko.me${fullPath}` ?? 'https://ushironoko.me/',
    },
    {
      property: 'og:image',
      content: `${ogUrl}` ?? '',
    },
    {
      property: 'og:image:secure_url',
      content: `${ogUrl}` ?? '',
    },
    {
      name: 'og:description',
      content:
        description ?? 'ushironokoのブログです。技術・ゲーム・趣味・仕事など。',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:title',
      content: postTitle,
    },
    {
      property: 'og:site_name',
      content: 'ushironoko.me',
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:site',
      content: '@ushirono_noko',
    },
    {
      name: 'twitter:title',
      content: postTitle,
    },
  ],
});
</script>

<template>
  <div class="flex justify-center mt-2 mb-6">
    <h1 class="text-32">{{ data?.title }}</h1>
  </div>
  <div class="whitespace-pre-wrap" v-html="data?.contentHtml"></div>
</template>
