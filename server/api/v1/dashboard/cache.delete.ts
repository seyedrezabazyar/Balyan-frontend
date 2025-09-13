export default defineEventHandler((event) => {
  // Logic to clear some cache for the dashboard
  console.log('Dashboard cache cleared.');
  return { success: true, message: 'Cache cleared' }
})
