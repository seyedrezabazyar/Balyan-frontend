export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  // Logic to get permissions for a specific role
  return { data: [{ id: 1, name: 'manage-users', display_name: 'Manage Users' }] }
})
