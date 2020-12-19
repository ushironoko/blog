<template>
  <div>
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
  @apply container max-w-screen-md mx-auto py-4 px-4 leading-loose;
}
</style>
