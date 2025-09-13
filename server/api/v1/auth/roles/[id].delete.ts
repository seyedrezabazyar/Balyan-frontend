export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  // Logic to delete role with the given id
  return { status: 'ok', message: `Role ${id} deleted` }
})
