export default defineNuxtRouteMiddleware((to) => {
  if (to.path.startsWith('/articles')) {
    const redirectPath = to.path
      .replace('/articles/', '/posts/')
      .replace('/2022', '')
      .replace('/2021', '')
      .replace('/2020', '');

    return navigateTo(redirectPath);
  }
});
