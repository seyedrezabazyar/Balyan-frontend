// Get all provinces
export default defineEventHandler(async (event) => {
  try {
    // Forward request to Laravel backend
    const response = await $fetch('http://localhost:8000/api/provinces', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    return response
  } catch (error: any) {
    // Return mock data if backend is not available
    return [
      { id: 1, name: 'تهران', slug: 'tehran', code: 'THR', display_order: 1 },
      { id: 2, name: 'اصفهان', slug: 'isfahan', code: 'ISF', display_order: 2 },
      { id: 3, name: 'فارس', slug: 'fars', code: 'FRS', display_order: 3 },
      { id: 4, name: 'خراسان رضوی', slug: 'khorasan-razavi', code: 'KHR', display_order: 4 },
      { id: 5, name: 'آذربایجان شرقی', slug: 'azarbaijan-sharghi', code: 'AZS', display_order: 5 },
      { id: 6, name: 'مازندران', slug: 'mazandaran', code: 'MZN', display_order: 6 },
      { id: 7, name: 'گیلان', slug: 'gilan', code: 'GIL', display_order: 7 },
      { id: 8, name: 'خوزستان', slug: 'khuzestan', code: 'KHZ', display_order: 8 },
      { id: 9, name: 'کرمان', slug: 'kerman', code: 'KRM', display_order: 9 },
      { id: 10, name: 'البرز', slug: 'alborz', code: 'ALB', display_order: 10 }
    ]
  }
})