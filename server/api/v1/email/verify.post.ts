export default defineEventHandler(async (event) => {
  // Logic to verify the email with a code
  const body = await readBody(event);
  console.log(`Verifying email ${body.email} with code ${body.code}`);
  return { success: true, message: 'Email verified' }
})
