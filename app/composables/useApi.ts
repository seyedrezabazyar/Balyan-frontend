// app/composables/useApi.ts
export const useApi = () => {
  const { token } = useAuth()
  const { showToast } = useToast()
  
  const apiCall = async (url: string, options: RequestInit = {}) => {
    // Ensure we have a token
    if (!token.value && !url.includes('/auth/login') && !url.includes('/auth/check-user')) {
      showToast('لطفا ابتدا وارد شوید', 'error')
      await navigateTo('/auth')
      return null
    }
    
    // Set default headers
    const headers: HeadersInit = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
    
    // Add authorization header if token exists
    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }
    
    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include'
      })
      
      if (!response.ok) {
        // Handle specific error codes
        if (response.status === 401) {
          showToast('نشست شما منقضی شده است', 'error')
          const { clearAuth } = useAuth()
          clearAuth()
          await navigateTo('/auth')
          return null
        }
        
        if (response.status === 403) {
          showToast('شما دسترسی به این بخش را ندارید', 'error')
          return null
        }
        
        if (response.status === 404) {
          showToast('صفحه مورد نظر یافت نشد', 'error')
          return null
        }
        
        // Try to get error message from response
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `خطا: ${response.status}`)
      }
      
      return await response.json()
    } catch (error: any) {
      console.error('API call error:', error)
      showToast(error.message || 'خطا در ارتباط با سرور', 'error')
      return null
    }
  }
  
  return {
    get: (url: string, options?: RequestInit) => 
      apiCall(url, { ...options, method: 'GET' }),
    
    post: (url: string, body?: any, options?: RequestInit) => 
      apiCall(url, { ...options, method: 'POST', body: JSON.stringify(body) }),
    
    put: (url: string, body?: any, options?: RequestInit) => 
      apiCall(url, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    
    delete: (url: string, options?: RequestInit) => 
      apiCall(url, { ...options, method: 'DELETE' }),
    
    patch: (url: string, body?: any, options?: RequestInit) => 
      apiCall(url, { ...options, method: 'PATCH', body: JSON.stringify(body) })
  }
}