export default defineNuxtPlugin(async () => {
  try {
    await $fetch('/sanctum/csrf-cookie', {
      // The baseURL is not needed here because we are using a proxy that maps the root path.
    });
    console.log('Sanctum CSRF cookie requested successfully.');
  } catch (error) {
    console.error('Failed to fetch Sanctum CSRF cookie:', error);
  }
});
