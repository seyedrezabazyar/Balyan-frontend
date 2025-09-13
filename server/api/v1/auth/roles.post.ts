export default defineEventHandler(async (event) => {
  // const body = await readBody(event)
  // Logic to create a new role
  return { status: 'ok', message: 'Role created' }
})
