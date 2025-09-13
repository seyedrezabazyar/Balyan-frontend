export default defineEventHandler((event) => {
  const provinceId = getRouterParam(event, 'id')
  // Mock data for cities based on provinceId
  const cities = {
    '1': [{ id: 101, name: 'تهران' }, { id: 102, name: 'شهریار' }],
    '2': [{ id: 201, name: 'اصفهان' }, { id: 202, name: 'کاشان' }],
    '3': [{ id: 301, name: 'مشهد' }, { id: 302, name: 'نیشابور' }],
  }
  return cities[provinceId] || []
})
