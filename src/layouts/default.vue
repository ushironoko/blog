<template>
  <div>
    <div class="container">
      <TheHeader />
      <main class="font-light">
        <Nuxt />
      </main>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.container {
  @apply max-w-screen-sm mx-auto py-4 px-4 leading-loose;
}
</style>
