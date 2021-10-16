<template>
  <iframe
    name="youtube"
    class="w-full h-full"
    frameborder="0"
    allowfullscreen
  ></iframe>
</template>

<style lang="postcss" scoped>
iframe {
  width: 100%;
  height: 100%;
  min-height: 211px;
}

@media (min-width: 768px) {
  iframe {
    min-height: 378px;
  }
}
</style>
