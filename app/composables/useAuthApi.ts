// ~/composables/useAuthApi.ts
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'

// Define interfaces for our data structures for type safety
export interface Role {
  id: number;
  name: string;
  display_name: string;
  description?: string;
  permissions?: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  display_name: string;
  module: string;
}

export interface CreateRolePayload {
  name: string;
  display_name: string;
  description?: string;
  permission_ids: number[];
}

export interface UpdateRolePayload {
  display_name: string;
  description?: string;
}


export const useAuthApi = () => {
  const authStore = useAuthStore()
  const token = authStore.token

  if (!token) {
    // In a real app, you might want to redirect to login here
    console.warn('Auth token is not available. API calls may fail.')
  }

  const api = useApi(token)

  return {
    // ====== Role Management ======
    getRoles: (withPermissions: boolean = false) => {
      const url = withPermissions ? '/roles?with_permissions=true' : '/roles';
      return api.get(url);
    },

    getRole: (id: number) => {
      return api.get(`/roles/${id}`);
    },

    createRole: (data: CreateRolePayload) => {
      return api.post('/roles', data);
    },

    updateRole: (id: number, data: UpdateRolePayload) => {
      return api.put(`/roles/${id}`, data);
    },

    deleteRole: (id: number) => {
      return api.delete(`/roles/${id}`);
    },

    // ====== Permission Management ======
    getPermissions: () => {
      return api.get('/permissions');
    },

    updateRolePermissions: (roleId: number, permissionIds: number[]) => {
      return api.put(`/permissions/role/${roleId}`, {
        permission_ids: permissionIds
      });
    },

    // ====== User Role Management ======
    assignRoleToUser: (userId: number, roleId: number) => {
      return api.post(`/roles/user/${userId}/assign`, { role_id: roleId });
    },

    removeRoleFromUser: (userId: number, roleId: number) => {
      return api.post(`/roles/user/${userId}/remove`, { role_id: roleId });
    }
  }
}
