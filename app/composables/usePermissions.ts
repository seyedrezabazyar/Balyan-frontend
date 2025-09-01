import type { User, Role } from '~/types';

export const usePermissions = () => {
  const { user, isAdmin, hasPermission } = useAuth();

  const canViewUsers = computed(() => {
    return isAdmin?.value || hasPermission('users.view');
  });

  const canCreateUsers = computed(() => {
    return isAdmin?.value || hasPermission('users.create');
  });

  const canEditUsers = computed(() => {
    return isAdmin?.value || hasPermission('users.edit');
  });

  const canDeleteUsers = computed(() => {
    return isAdmin?.value || hasPermission('users.delete');
  });

  const canManageRoles = computed(() => {
    return isAdmin?.value || hasPermission('roles.manage');
  });

  const canViewRoles = computed(() => {
    return isAdmin?.value || hasPermission('roles.view');
  });

  const canManagePermissions = computed(() => {
    return isAdmin?.value || hasPermission('permissions.manage');
  });

  const canViewPermissions = computed(() => {
    return isAdmin?.value || hasPermission('permissions.view');
  });

  const canManageBooks = computed(() => {
    return isAdmin?.value || hasPermission(['books.create', 'books.edit', 'books.delete']);
  });

  const canViewBooks = computed(() => {
    return hasPermission('books.view');
  });

  const canManageCategories = computed(() => {
    return isAdmin?.value || hasPermission(['categories.create', 'categories.edit', 'categories.delete']);
  });

  const canViewCategories = computed(() => {
    return hasPermission('categories.view');
  });

  const canManageMedia = computed(() => {
    return isAdmin?.value || hasPermission(['media.upload', 'media.delete']);
  });

  const canViewMedia = computed(() => {
    return hasPermission('media.view');
  });

  const canManageComments = computed(() => {
    return isAdmin?.value || hasPermission(['comments.edit', 'comments.delete']);
  });

  const canViewReports = computed(() => {
    return isAdmin?.value || hasPermission('reports.view');
  });

  const canManageSettings = computed(() => {
    return isAdmin?.value || hasPermission('settings.manage');
  });

  const checkAccess = (options: {
    permissions?: string | string[];
    requireAll?: boolean;
  }): boolean => {
    if (!options.permissions) return true;
    return hasPermission(options.permissions);
  };

  const hasAdminPrivileges = computed(() => {
    return isAdmin?.value;
  });

  return {
    canViewUsers,
    canCreateUsers,
    canEditUsers,
    canDeleteUsers,
    canManageRoles,
    canViewRoles,
    canManagePermissions,
    canViewPermissions,
    canManageBooks,
    canViewBooks,
    canManageCategories,
    canViewCategories,
    canManageMedia,
    canViewMedia,
    canManageComments,
    canViewReports,
    canManageSettings,
    checkAccess,
    hasAdminPrivileges
  };
};
