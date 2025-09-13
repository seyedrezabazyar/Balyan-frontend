export default defineEventHandler(async (event) => {
  // Logic to send an email verification link/code
  const body = await readBody(event);
  console.log(`Sending email verification to: ${body.email}`);
  return { success: true, message: 'Verification email sent' }
})
