export default defineEventHandler(async (event) => {
  return {
    success: true,
    message: 'User check successful.',
    data: {
      is_user: true,
    },
  };
});