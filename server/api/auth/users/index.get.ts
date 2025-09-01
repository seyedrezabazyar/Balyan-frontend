export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'لطفا ابتدا وارد شوید'
    });
  }

  // Check if user has admin role or users.view permission
  const hasAccess = user.is_admin || user.permissions?.includes('users.view');

  if (!hasAccess) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'شما دسترسی به این بخش را ندارید',
      data: { required_permissions: ['users.view'] }
    });
  }

  // Query parameters
  const query = getQuery(event);
  const page = parseInt(query.page as string) || 1;
  const perPage = parseInt(query.per_page as string) || 15;
  const search = query.search as string;
  const emailVerified = query.email_verified as string;
  const phoneVerified = query.phone_verified as string;
  const sortBy = query.sort_by as string || 'created_at';
  const sortOrder = query.sort_order as string || 'desc';

  // Build database query
  let dbQuery = db.table('users')
    .select(
      'id',
      'name',
      'username',
      'email',
      'phone',
      'preferred_method',
      'email_verified_at',
      'phone_verified_at',
      'last_login_at',
      'created_at',
      'updated_at',
      'avatar',
      'province_id',
      'city_id',
      'is_admin',
      'failed_attempts',
      'locked_until'
    );

  // Apply search filter
  if (search) {
    dbQuery = dbQuery.where('name', 'like', `%${search}%`)
      .orWhere('email', 'like', `%${search}%`)
      .orWhere('phone', 'like', `%${search}%`);
  }

  // Apply email verification filter
  if (emailVerified) {
    dbQuery = dbQuery.where('email_verified_at', emailVerified === 'true' ? '!=' : '=', null);
  }

  // Apply phone verification filter
  if (phoneVerified) {
    dbQuery = dbQuery.where('phone_verified_at', phoneVerified === 'true' ? '!=' : '=', null);
  }

  // Apply sorting
  dbQuery = dbQuery.orderBy(sortBy, sortOrder);

  // Paginate results
  const total = await dbQuery.clone().count('* as count').first();
  const users = await dbQuery.offset((page - 1) * perPage).limit(perPage);

  return {
    success: true,
    data: users,
    meta: {
      current_page: page,
      last_page: Math.ceil(total.count / perPage),
      per_page: perPage,
      total: total.count,
      from: (page - 1) * perPage + 1,
      to: Math.min(page * perPage, total.count)
    }
  };
});
