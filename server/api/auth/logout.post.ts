export default defineEventHandler(async (event) => {
  // در محیط واقعی می‌توانید توکن را در دیتابیس باطل کنید
  // یا از blacklist استفاده کنید
  
  return {
    success: true,
    message: 'خروج با موفقیت انجام شد'
  }
})