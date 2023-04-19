<script setup lang="ts">
const route = useRoute();

if (route.path.startsWith('/articles')) {
  console.log('route.path: ', route.path);
  const redirectPath = route.path
    .replace('/articles/', '/posts/')
    .replace('/2022', '')
    .replace('/2021', '')
    .replace('/2020', '');

  navigateTo(redirectPath);
} else {
  navigateTo('/');
}
</script>
