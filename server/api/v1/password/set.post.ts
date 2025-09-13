export default defineEventHandler(async (event) => {
  // Logic to set a user's password for the first time
  const body = await readBody(event);
  console.log('Setting password');
  return { success: true, message: 'Password set' }
})
