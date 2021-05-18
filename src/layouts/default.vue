<template>
  <div class="dark:bg-gray-900 dark:text-white">
    <div class="container">
      <TheHeader />
      <main>
        <Nuxt />
      </main>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.container {
  @apply max-w-screen-sm mx-auto py-4 px-4 leading-loose text-base;
}
</style>
