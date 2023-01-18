<script setup lang="ts">
const { params, fullPath } = useRoute();

const id = Array.isArray(params.id) ? params.id[0] : params.id;

const { data } = useFetch(`/api/posts/postData?id=${encodeURIComponent(id)}`, {
  key: id,
});

const description = data.value?.contentHtml
  .match(/^\<p\>.*\<\/p\>/g)
  ?.toString()
  .replace('<p>', '')
  .replace('</p>', '');

useHead({
  meta: [
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
      content: data.value?.title ?? 'ushironoko.me',
    },
    {
      name: 'twitter:image',
      content:
        `https://og-image-noko-ushiro.vercel.app/${
          data?.value?.title ?? 'ushironoko.me'
        }?theme=light&md=1&fontSize=95px` ?? '',
    },
    {
      name: 'twitter:description',
      content:
        description ?? 'ushironokoのブログです。技術・ゲーム・趣味・仕事など。',
    },
    {
      name: 'description',
      content:
        description ?? 'ushironokoのブログです。技術・ゲーム・趣味・仕事など。',
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
      content: data.value?.title ?? 'ushironoko.me',
    },
    {
      property: 'og:site_name',
      content: data.value?.title ?? 'ushironoko.me',
    },
    {
      property: 'og:url',
      content: `https://ushironoko.me/${fullPath}` ?? 'https://ushironoko.me/',
    },
    {
      property: 'og:image',
      content:
        `https://og-image-noko-ushiro.vercel.app/${
          data?.value?.title ?? 'ushironoko.me'
        }?theme=light&md=1&fontSize=95px` ?? '',
    },
    {
      property: 'og:image:secure_url',
      content:
        `https://og-image-noko-ushiro.vercel.app/${
          data?.value?.title ?? 'ushironoko.me'
        }?theme=light&md=1&fontSize=95px` ?? '',
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
