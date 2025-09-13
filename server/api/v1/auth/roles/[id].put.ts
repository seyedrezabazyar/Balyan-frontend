export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  // const body = await readBody(event)
  // Logic to update role with the given id
  return { status: 'ok', message: `Role ${id} updated` }
})
