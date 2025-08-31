// Mock users API endpoint for testing
export default defineEventHandler(async (event) => {
  // Mock users data
  const mockUsers = [
    {
      id: 1,
      name: 'علی محمدی',
      username: 'ali_mohammadi',
      email: 'ali@example.com',
      phone: '09121234567',
      preferred_method: 'password',
      email_verified_at: '2024-01-15T10:30:00Z',
      phone_verified_at: '2024-01-15T10:30:00Z',
      last_login_at: '2024-12-20T14:30:00Z',
      created_at: '2024-01-15T10:30:00Z',
      status: 'active',
      locked_at: null,
      disabled: false
    },
    {
      id: 2,
      name: 'مریم احمدی',
      username: 'maryam_ahmadi',
      email: 'maryam@example.com',
      phone: '09129876543',
      preferred_method: 'otp',
      email_verified_at: '2024-02-10T09:15:00Z',
      phone_verified_at: null,
      last_login_at: '2024-12-19T11:20:00Z',
      created_at: '2024-02-10T09:15:00Z',
      status: 'active',
      locked_at: null,
      disabled: false
    },
    {
      id: 3,
      name: 'رضا کریمی',
      username: 'reza_karimi',
      email: 'reza@example.com',
      phone: '09351234567',
      preferred_method: 'password',
      email_verified_at: null,
      phone_verified_at: '2024-03-05T14:20:00Z',
      last_login_at: null,
      created_at: '2024-03-05T14:20:00Z',
      status: 'inactive',
      locked_at: '2024-11-10T10:00:00Z',
      disabled: true
    },
    {
      id: 4,
      name: 'فاطمه رضایی',
      username: 'fatemeh_rezaei',
      email: 'fatemeh@example.com',
      phone: '09191234567',
      preferred_method: 'otp',
      email_verified_at: '2024-04-12T08:45:00Z',
      phone_verified_at: '2024-04-12T08:45:00Z',
      last_login_at: '2024-12-18T16:10:00Z',
      created_at: '2024-04-12T08:45:00Z',
      status: 'active',
      locked_at: null,
      disabled: false
    },
    {
      id: 5,
      name: 'محمد حسینی',
      username: 'mohammad_hosseini',
      email: 'mohammad@example.com',
      phone: '09381234567',
      preferred_method: 'password',
      email_verified_at: '2024-05-20T12:00:00Z',
      phone_verified_at: '2024-05-20T12:00:00Z',
      last_login_at: '2024-12-17T09:30:00Z',
      created_at: '2024-05-20T12:00:00Z',
      status: 'active',
      locked_at: null,
      disabled: false
    },
    {
      id: 6,
      name: 'زهرا نوری',
      username: 'zahra_nouri',
      email: 'zahra@example.com',
      phone: '09301234567',
      preferred_method: 'otp',
      email_verified_at: null,
      phone_verified_at: '2024-06-15T15:30:00Z',
      last_login_at: '2024-12-15T13:45:00Z',
      created_at: '2024-06-15T15:30:00Z',
      status: 'active',
      locked_at: null,
      disabled: false
    },
    {
      id: 7,
      name: 'حسین اکبری',
      username: 'hossein_akbari',
      email: 'hossein@example.com',
      phone: '09361234567',
      preferred_method: 'password',
      email_verified_at: '2024-07-01T10:15:00Z',
      phone_verified_at: null,
      last_login_at: '2024-12-10T08:20:00Z',
      created_at: '2024-07-01T10:15:00Z',
      status: 'inactive',
      locked_at: '2024-12-01T12:00:00Z',
      disabled: true
    },
    {
      id: 8,
      name: 'سارا امینی',
      username: 'sara_amini',
      email: 'sara@example.com',
      phone: '09151234567',
      preferred_method: 'otp',
      email_verified_at: '2024-08-10T11:30:00Z',
      phone_verified_at: '2024-08-10T11:30:00Z',
      last_login_at: '2024-12-20T17:00:00Z',
      created_at: '2024-08-10T11:30:00Z',
      status: 'active',
      locked_at: null,
      disabled: false
    }
  ]

  // Return the mock data
  return {
    success: true,
    data: mockUsers,
    users: mockUsers,
    total: mockUsers.length
  }
})