// ~/composables/useApiTest.ts
export const useApiTest = () => {
  const testApiConnection = async () => {
    try {
      console.log('Testing API connection...')

      // Test basic API health
      const healthResponse = await fetch('http://localhost:8000/api/auth/health')
      console.log('Health check status:', healthResponse.status)

      if (healthResponse.ok) {
        const healthData = await healthResponse.json()
        console.log('Health check data:', healthData)
      } else {
        console.error('Health check failed')
        return false
      }

      return true
    } catch (error) {
      console.error('API connection failed:', error)
      return false
    }
  }

  const testAuthEndpoint = async (token: string) => {
    try {
      console.log('Testing auth endpoint...')
      console.log('Token:', token)

      const response = await fetch('http://localhost:8000/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      console.log('Auth test status:', response.status)
      console.log('Auth test headers:', Object.fromEntries(response.headers.entries()))

      if (response.ok) {
        const data = await response.json()
        console.log('Auth test data:', data)
        return data
      } else {
        const errorData = await response.text()
        console.error('Auth test error:', errorData)
        return null
      }
    } catch (error) {
      console.error('Auth test failed:', error)
      return null
    }
  }

  const testAdminEndpoint = async (token: string) => {
    try {
      console.log('Testing admin endpoint...')

      const response = await fetch('http://localhost:8000/api/auth/users/statistics', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      console.log('Admin test status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('Admin test data:', data)
        return data
      } else {
        const errorData = await response.text()
        console.error('Admin test error:', errorData)
        return null
      }
    } catch (error) {
      console.error('Admin test failed:', error)
      return null
    }
  }

  return {
    testApiConnection,
    testAuthEndpoint,
    testAdminEndpoint
  }
}
