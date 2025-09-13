export default defineEventHandler((event) => {
  // Logic to get all permissions, grouped by module
  return {
    data: {
      'Users': [{ id: 1, name: 'manage-users', display_name: 'Manage Users' }],
      'Roles': [{ id: 2, name: 'manage-roles', display_name: 'Manage Roles' }]
    }
  }
})
