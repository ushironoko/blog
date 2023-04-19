<script setup lang="ts">
const route = useRoute();

if (route.path.startsWith('/articles')) {
  const redirectPath = route.path
    .replace('/articles/', '/posts/')
    .replace('/2022', '')
    .replace('/2021', '')
    .replace('/2020', '');

  await navigateTo(redirectPath);
} else {
  await navigateTo('/');
}
</script>
