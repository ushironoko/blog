<script setup lang="ts">
import { Post } from '../types/posts';
import { format } from 'date-fns';

const props = defineProps<{
  postData: Post;
  ogImageUrlOrigin: (title: string) => string;
}>();
</script>

<template>
  <div class="w-[280px] pc:h-auto h-auto pc:min-h-[288px]">
    <NuxtLink :href="`/posts/${postData.id}`">
      <div class="flex flex-col">
        <div class="mb-1">
          <div>
            <img
              alt=""
              class="w-full rounded-sm"
              width="252"
              height="164"
              :src="ogImageUrlOrigin(postData.title)"
            />
          </div>
          <div class="mt-2">
            <h2 class="font-normal text-16">
              <p>{{ postData.title }}</p>
            </h2>
          </div>
        </div>
        <div>
          <p class="text-12">
            {{ format(new Date(postData.publishedAt), 'yyyy/MM/dd') }}
          </p>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>
