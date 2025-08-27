// plugins/auth.client.ts
export default defineNuxtPlugin(async () => {
  const { initialize } = useAuth();

  // بارگذاری اطلاعات احراز هویت از localStorage
  initialize();
});
