// ~/types/auth.ts

export interface Permission {
  id: number;
  name: string;
  display_name: string;
  module: string;
}

export interface Role {
  id: number;
  name: string;
  display_name: string;
  description?: string;
  permissions?: Permission[];
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
