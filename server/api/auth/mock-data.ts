// Mock user data for testing
export const mockUser = {
  id: 1,
  name: 'کاربر تست',
  username: 'testuser',
  email: 'test@example.com',
  email_verified_at: '2024-01-01T12:00:00.000Z',
  phone: '09123456789',
  phone_verified_at: null,
  national_id: '1234567890',
  avatar: null,
  province_id: 1,
  city_id: 10,
  is_admin: false,
  preferred_method: 'otp',
  password: null, // Set to a value if password is set
  created_at: '2024-01-01T10:00:00.000Z',
  last_login_at: '2024-01-20T14:30:00.000Z',
  profile: {
    id: 1,
    user_id: 1,
    bio: 'یک توسعه‌دهنده نرم‌افزار با علاقه به برنامه‌نویسی وب',
    avatar_path: null,
    cover_image_path: null,
    website: 'https://example.com',
    visibility: 'public',
    show_achievements: true,
    show_statistics: true,
    total_points: 1250,
    current_level: 5,
    reputation_score: 85,
    referral_code: 'TEST123'
  }
}

export const updateMockUser = (updates: any) => {
  // Update main user fields
  if (updates.name !== undefined) mockUser.name = updates.name
  if (updates.username !== undefined) mockUser.username = updates.username
  if (updates.email !== undefined) mockUser.email = updates.email
  if (updates.phone !== undefined) mockUser.phone = updates.phone
  if (updates.national_id !== undefined) mockUser.national_id = updates.national_id
  if (updates.avatar !== undefined) mockUser.avatar = updates.avatar
  if (updates.province_id !== undefined) mockUser.province_id = updates.province_id
  if (updates.city_id !== undefined) mockUser.city_id = updates.city_id
  if (updates.preferred_method !== undefined) mockUser.preferred_method = updates.preferred_method

  // Update profile fields
  if (updates.bio !== undefined) mockUser.profile.bio = updates.bio
  if (updates.website !== undefined) mockUser.profile.website = updates.website
  if (updates.visibility !== undefined) mockUser.profile.visibility = updates.visibility
  if (updates.show_achievements !== undefined) mockUser.profile.show_achievements = updates.show_achievements
  if (updates.show_statistics !== undefined) mockUser.profile.show_statistics = updates.show_statistics

  return mockUser
}