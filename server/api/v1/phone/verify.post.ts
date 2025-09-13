export default defineEventHandler(async (event) => {
  // Logic to verify the phone number with a code
  const body = await readBody(event);
  console.log(`Verifying phone ${body.phone} with code ${body.code}`);
  return { success: true, message: 'Phone number verified' }
})
