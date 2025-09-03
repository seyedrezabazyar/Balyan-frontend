// Get cities for a province
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const provinceId = query.province_id

  if (!provinceId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Province ID is required'
    })
  }

  try {
    // Forward request to Laravel backend
    const response = await $fetch(`http://localhost:8000/api/cities?province_id=${provinceId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    return response
  } catch (error: any) {
    // Return mock data if backend is not available
    const mockCities: Record<string, any[]> = {
      '1': [ // Tehran
        { id: 10, province_id: 1, name: 'تهران', slug: 'tehran-city', display_order: 1 },
        { id: 11, province_id: 1, name: 'کرج', slug: 'karaj', display_order: 2 },
        { id: 12, province_id: 1, name: 'شهریار', slug: 'shahriar', display_order: 3 },
        { id: 13, province_id: 1, name: 'اسلامشهر', slug: 'eslamshahr', display_order: 4 }
      ],
      '2': [ // Isfahan
        { id: 20, province_id: 2, name: 'اصفهان', slug: 'isfahan-city', display_order: 1 },
        { id: 21, province_id: 2, name: 'کاشان', slug: 'kashan', display_order: 2 },
        { id: 22, province_id: 2, name: 'خمینی‌شهر', slug: 'khomeinishahr', display_order: 3 }
      ],
      '3': [ // Fars
        { id: 30, province_id: 3, name: 'شیراز', slug: 'shiraz', display_order: 1 },
        { id: 31, province_id: 3, name: 'مرودشت', slug: 'marvdasht', display_order: 2 },
        { id: 32, province_id: 3, name: 'لار', slug: 'lar', display_order: 3 }
      ],
      '4': [ // Khorasan Razavi
        { id: 40, province_id: 4, name: 'مشهد', slug: 'mashhad', display_order: 1 },
        { id: 41, province_id: 4, name: 'نیشابور', slug: 'neyshabur', display_order: 2 },
        { id: 42, province_id: 4, name: 'سبزوار', slug: 'sabzevar', display_order: 3 }
      ],
      '5': [ // Azerbaijan Sharghi
        { id: 50, province_id: 5, name: 'تبریز', slug: 'tabriz', display_order: 1 },
        { id: 51, province_id: 5, name: 'مراغه', slug: 'maragheh', display_order: 2 },
        { id: 52, province_id: 5, name: 'مرند', slug: 'marand', display_order: 3 }
      ]
    }

    return mockCities[provinceId] || []
  }
})