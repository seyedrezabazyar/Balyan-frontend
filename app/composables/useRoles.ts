// app/composables/useRoles.ts
interface Role {
  id: number
  name: string
  display_name: string
  description?: string
  users_count?: number
  permissions?: Array<{ id: number; name: string; display_name: string }>
}

interface RolesResponse {
  success: boolean
  data: Role[]
}

interface PermissionsGroupedResponse {
  success: boolean
  data: Record<string, Array<{ id: number; name: string; display_name: string }>>
}

export const useRoles = () => {
  const { api } = useAuth()
  const { showToast } = useToast()

  const roles = ref<Role[]>([])
  const permissions = ref<PermissionsGroupedResponse['data'] | null>(null)
  const loading = ref(false)

  const fetchRoles = async (withPermissions = true): Promise<Role[] | null> => {
    loading.value = true
    try {
      const response: RolesResponse = await api(`/api/auth/roles?with_permissions=${withPermissions ? 'true' : 'false'}`, { method: 'GET' })
      if (response?.success) {
        roles.value = response.data || []
        return roles.value
      }
      showToast('خطا در دریافت نقش‌ها', 'error')
      return null
    } catch (error: any) {
      console.error('Error fetching roles:', error)
      showToast(error.message || 'خطا در دریافت نقش‌ها', 'error')
      return null
    } finally {
      loading.value = false
    }
  }

  const fetchPermissions = async (): Promise<PermissionsGroupedResponse['data'] | null> => {
    try {
      const response: PermissionsGroupedResponse = await api('/api/auth/permissions', { method: 'GET' })
      if (response?.success) {
        permissions.value = response.data
        return response.data
      }
      showToast('خطا در دریافت دسترسی‌ها', 'error')
      return null
    } catch (error: any) {
      console.error('Error fetching permissions:', error)
      showToast(error.message || 'خطا در دریافت دسترسی‌ها', 'error')
      return null
    }
  }

  const assignRoleToUser = async (userId: number, roleId: number): Promise<boolean> => {
    try {
      const response = await api(`/api/auth/roles/user/${userId}/assign`, {
        method: 'POST',
        body: { role_id: roleId }
      })
      if ((response as any)?.success) {
        showToast('نقش به کاربر اختصاص یافت', 'success')
        return true
      }
      showToast((response as any)?.message || 'خطا در اختصاص نقش', 'error')
      return false
    } catch (error: any) {
      console.error('Error assigning role:', error)
      showToast(error.message || 'خطا در اختصاص نقش', 'error')
      return false
    }
  }

  const removeRoleFromUser = async (userId: number, roleId: number): Promise<boolean> => {
    try {
      const response = await api(`/api/auth/roles/user/${userId}/remove`, {
        method: 'POST',
        body: { role_id: roleId }
      })
      if ((response as any)?.success) {
        showToast('نقش از کاربر حذف شد', 'success')
        return true
      }
      showToast((response as any)?.message || 'خطا در حذف نقش', 'error')
      return false
    } catch (error: any) {
      console.error('Error removing role:', error)
      showToast(error.message || 'خطا در حذف نقش', 'error')
      return false
    }
  }

  const updateRolePermissions = async (roleId: number, permissionIds: number[]): Promise<boolean> => {
    try {
      const response = await api(`/api/auth/permissions/role/${roleId}`, {
        method: 'PUT',
        body: { permission_ids: permissionIds }
      })
      if ((response as any)?.success) {
        showToast('دسترسی‌های نقش به‌روزرسانی شد', 'success')
        return true
      }
      showToast((response as any)?.message || 'خطا در به‌روزرسانی دسترسی‌ها', 'error')
      return false
    } catch (error: any) {
      console.error('Error updating role permissions:', error)
      showToast(error.message || 'خطا در به‌روزرسانی دسترسی‌ها', 'error')
      return false
    }
  }

  return {
    roles: readonly(roles),
    permissions: readonly(permissions),
    loading: readonly(loading),
    fetchRoles,
    fetchPermissions,
    assignRoleToUser,
    removeRoleFromUser,
    updateRolePermissions
  }
}

