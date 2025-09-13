export default defineEventHandler((event) => {
  // Logic to get roles, potentially with permissions
  // const query = getQuery(event)
  // if (query.with_permissions) { ... }
  return { data: [{ id: 1, display_name: 'Admin', description: 'Administrator' }] }
})
