// server/api/adminUsers.ts
// This is a mock API endpoint to simulate fetching users for the admin panel.
// The real backend endpoint is not yet available.

export default defineEventHandler(async (event) => {
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const mockUsers = [
    {
      id: 1,
      name: 'مدیر سیستم',
      username: 'admin',
      email: 'admin@example.com',
      phone: '09120000001',
      email_verified_at: '2023-01-01T12:00:00.000000Z',
      phone_verified_at: '2023-01-01T12:00:00.000000Z',
      is_admin: true,
      locked_until: null,
      last_login_at: new Date().toISOString(),
      roles: [{ id: 1, name: 'admin', display_name: 'مدیر کل' }],
    },
    {
      id: 2,
      name: 'علی رضایی',
      username: 'ali.rezaei',
      email: 'ali.rezaei@example.com',
      phone: '09120000002',
      email_verified_at: '2023-02-15T10:30:00.000000Z',
      phone_verified_at: null,
      is_admin: false,
      locked_until: null,
      last_login_at: '2024-05-20T18:45:00.000000Z',
      roles: [{ id: 2, name: 'user', display_name: 'کاربر' }],
    },
    {
      id: 3,
      name: 'مریم احمدی',
      username: 'maryam.ahmadi',
      email: 'maryam.ahmadi@example.com',
      phone: '09120000003',
      email_verified_at: null,
      phone_verified_at: '2023-03-10T09:00:00.000000Z',
      is_admin: false,
      locked_until: new Date().toISOString(), // Simulating a locked user
      last_login_at: '2024-05-18T11:20:00.000000Z',
      roles: [{ id: 2, name: 'user', display_name: 'کاربر' }],
    },
    {
      id: 4,
      name: 'نویسنده تستی',
      username: 'author.test',
      email: 'author@example.com',
      phone: '09120000004',
      email_verified_at: '2023-04-01T12:00:00.000000Z',
      phone_verified_at: '2023-04-01T12:00:00.000000Z',
      is_admin: false,
      locked_until: null,
      last_login_at: '2024-05-21T10:00:00.000000Z',
      roles: [
        { id: 2, name: 'user', display_name: 'کاربر' },
        { id: 3, name: 'author', display_name: 'نویسنده' }
      ],
    },
  ];

  // This structure matches what the frontend component expects from the API response.
  return {
    data: mockUsers,
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: mockUsers.length,
      from: 1,
      to: mockUsers.length,
    }
  };
});
