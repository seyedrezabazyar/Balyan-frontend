export default defineEventHandler(async (event) => {
  // Logic to send a phone verification code (SMS)
  const body = await readBody(event);
  console.log(`Sending phone verification to: ${body.phone}`);
  return { success: true, message: 'Verification code sent' }
})
