export default defineEventHandler(async (event) => {
  // Logic to update user profile
  const body = await readBody(event);
  console.log('Updating profile with:', body);
  return { success: true, message: 'Profile updated' }
})
