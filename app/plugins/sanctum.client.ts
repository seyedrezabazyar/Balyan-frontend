export default defineNuxtPlugin(async () => {
  try {
    await $fetch('/sanctum/csrf-cookie', {
      credentials: 'include',
    });
    console.log('Sanctum CSRF cookie requested successfully.');
  } catch (error) {
    console.error('Failed to fetch Sanctum CSRF cookie:', error);
  }
});
