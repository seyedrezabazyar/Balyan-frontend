// app/composables/usePermissions.ts
export const usePermissions = () => {
  const { user, hasRole, hasPermission, isAdmin } = useAuth()

  // Check if user can view users
  const canViewUsers = computed(() => {
    return isAdmin.value || hasPermission(['users.view', 'users.manage'])
  })

  // Check if user can create users
  const canCreateUsers = computed(() => {
    return isAdmin.value || hasPermission(['users.create', 'users.manage'])
  })

  // Check if user can edit users
  const canEditUsers = computed(() => {
    return isAdmin.value || hasPermission(['users.edit', 'users.manage'])
  })

  // Check if user can delete users
  const canDeleteUsers = computed(() => {
    return isAdmin.value || hasPermission(['users.delete', 'users.manage'])
  })

  // Check if user can manage roles
  const canManageRoles = computed(() => {
    return isAdmin.value || hasPermission(['roles.manage', 'roles.edit'])
  })

  // Check if user can view roles
  const canViewRoles = computed(() => {
    return isAdmin.value || hasPermission(['roles.view', 'roles.manage'])
  })

  // Check if user can manage permissions
  const canManagePermissions = computed(() => {
    return isAdmin.value || hasPermission(['permissions.manage', 'permissions.edit'])
  })

  // Check if user can view permissions
  const canViewPermissions = computed(() => {
    return isAdmin.value || hasPermission(['permissions.view', 'permissions.manage'])
  })

  // Check if user can manage books
  const canManageBooks = computed(() => {
    return hasRole(['admin', 'editor', 'author']) || 
           hasPermission(['books.create', 'books.edit', 'books.delete'])
  })

  // Check if user can view books
  const canViewBooks = computed(() => {
    return hasPermission('books.view')
  })

  // Check if user can manage categories
  const canManageCategories = computed(() => {
    return hasRole(['admin', 'editor']) || 
           hasPermission(['categories.create', 'categories.edit', 'categories.delete'])
  })

  // Check if user can view categories
  const canViewCategories = computed(() => {
    return hasPermission('categories.view')
  })

  // Check if user can manage media
  const canManageMedia = computed(() => {
    return hasRole(['admin', 'editor']) || 
           hasPermission(['media.upload', 'media.delete'])
  })

  // Check if user can view media
  const canViewMedia = computed(() => {
    return hasPermission('media.view')
  })

  // Check if user can manage comments
  const canManageComments = computed(() => {
    return hasRole(['admin', 'moderator']) || 
           hasPermission(['comments.edit', 'comments.delete'])
  })

  // Check if user can view reports
  const canViewReports = computed(() => {
    return isAdmin.value || hasPermission('reports.view')
  })

  // Check if user can manage settings
  const canManageSettings = computed(() => {
    return isAdmin.value || hasPermission('settings.manage')
  })

  // Generic permission check with multiple conditions
  const checkAccess = (options: {
    roles?: string | string[]
    permissions?: string | string[]
    requireAll?: boolean
  }): boolean => {
    const { roles, permissions, requireAll = false } = options

    const checks: boolean[] = []

    if (roles) {
      checks.push(hasRole(roles))
    }

    if (permissions) {
      checks.push(hasPermission(permissions))
    }

    if (checks.length === 0) return true

    return requireAll ? checks.every(Boolean) : checks.some(Boolean)
  }

  // Check if user has any admin privileges
  const hasAdminPrivileges = computed(() => {
    return isAdmin.value || hasRole(['admin', 'super-admin'])
  })

  // Check if user has content management privileges
  const hasContentPrivileges = computed(() => {
    return hasRole(['admin', 'editor', 'author']) ||
           hasPermission(['books.create', 'posts.create', 'media.upload'])
  })

  // Check if user has moderation privileges
  const hasModerationPrivileges = computed(() => {
    return hasRole(['admin', 'moderator']) ||
           hasPermission(['comments.moderate', 'comments.delete'])
  })

  return {
    // User checks
    canViewUsers,
    canCreateUsers,
    canEditUsers,
    canDeleteUsers,
    
    // Role checks
    canManageRoles,
    canViewRoles,
    
    // Permission checks
    canManagePermissions,
    canViewPermissions,
    
    // Content checks
    canManageBooks,
    canViewBooks,
    canManageCategories,
    canViewCategories,
    canManageMedia,
    canViewMedia,
    canManageComments,
    
    // Other checks
    canViewReports,
    canManageSettings,
    
    // General checks
    hasAdminPrivileges,
    hasContentPrivileges,
    hasModerationPrivileges,
    
    // Generic check function
    checkAccess
  }
}