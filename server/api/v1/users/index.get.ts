export default defineEventHandler((event) => {
  const users = [
    {
      id: 1,
      name: 'Admin User',
      username: 'admin',
      email: 'admin@example.com',
      phone: '123456789',
      email_verified_at: new Date().toISOString(),
      phone_verified_at: new Date().toISOString(),
      is_admin: true,
      locked_until: null,
      last_login_at: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      phone: '987654321',
      email_verified_at: null,
      phone_verified_at: new Date().toISOString(),
      is_admin: false,
      locked_until: new Date(Date.now() + 86400000).toISOString(), // Locked until tomorrow
      last_login_at: null,
    }
  ];

  return {
    data: users,
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: users.length,
      from: 1,
      to: users.length
    }
  };
});
