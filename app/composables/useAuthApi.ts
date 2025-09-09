// ~/composables/useAuthApi.ts
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'

export const useAuthApi = () => {
  const authStore = useAuthStore()
  const token = authStore.token

  if (!token) {
    console.warn('Auth token is not available. API calls may fail.')
    // You might want to handle this case, e.g., by redirecting to login
  }

  const api = useApi(token)

  return {
    getRoles: () => {
      return api.get('/admin/roles')
    },

    getPermissions: () => {
      return api.get('/admin/permissions')
    },

    getRolePermissions: (roleId: number) => {
      return api.get(`/admin/roles/${roleId}/permissions`)
    },

    updateRolePermissions: (roleId: number, permissionIds: number[]) => {
      return api.put(`/admin/roles/${roleId}/permissions`, {
        permissions: permissionIds
      })
    }
  }
}
