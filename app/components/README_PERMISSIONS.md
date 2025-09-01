# راهنمای سیستم سطح دسترسی

## 📋 نحوه استفاده از سیستم دسترسی‌ها

### 1. استفاده از Middleware ها

#### Middleware `auth`
برای صفحاتی که نیاز به احراز هویت دارند:
```vue
<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>
```

#### Middleware `admin`
برای صفحاتی که فقط ادمین‌ها دسترسی دارند:
```vue
<script setup>
definePageMeta({
  middleware: 'admin'
})
</script>
```

#### Middleware `role`
برای بررسی نقش خاص:
```vue
<script setup>
definePageMeta({
  middleware: 'role',
  meta: {
    role: 'editor' // یا ['editor', 'author']
  }
})
</script>
```

#### Middleware `permission`
برای بررسی دسترسی خاص:
```vue
<script setup>
definePageMeta({
  middleware: 'permission',
  meta: {
    permission: 'books.create' // یا ['books.create', 'books.edit']
  }
})
</script>
```

### 2. استفاده از Composable ها

#### useAuth
```vue
<script setup>
const { 
  user,
  isLoggedIn,
  isAdmin,
  hasRole,
  hasPermission,
  userRoles,
  userPermissions
} = useAuth()

// بررسی نقش
if (hasRole('editor')) {
  // کاربر نقش editor دارد
}

// بررسی دسترسی
if (hasPermission('books.create')) {
  // کاربر دسترسی ایجاد کتاب دارد
}

// بررسی چند نقش (OR)
if (hasRole(['editor', 'author'])) {
  // کاربر یکی از این نقش‌ها را دارد
}
</script>
```

#### usePermissions
```vue
<script setup>
const {
  canViewUsers,
  canCreateUsers,
  canEditUsers,
  canDeleteUsers,
  canManageRoles,
  canManageBooks,
  hasAdminPrivileges,
  checkAccess
} = usePermissions()

// استفاده از دسترسی‌های آماده
if (canEditUsers.value) {
  // نمایش دکمه ویرایش
}

// بررسی دسترسی سفارشی
const canDoSomething = checkAccess({
  roles: ['admin', 'editor'],
  permissions: 'special.permission',
  requireAll: false // OR logic
})
</script>
```

### 3. استفاده از کامپوننت AccessControl

#### نمایش محتوا بر اساس نقش
```vue
<template>
  <AccessControl roles="admin">
    <button>حذف کاربر</button>
  </AccessControl>
</template>
```

#### نمایش محتوا بر اساس دسترسی
```vue
<template>
  <AccessControl permissions="books.create">
    <button>ایجاد کتاب جدید</button>
  </AccessControl>
</template>
```

#### ترکیب نقش و دسترسی
```vue
<template>
  <AccessControl 
    :roles="['admin', 'editor']"
    :permissions="['books.create', 'books.edit']"
    :require-all="false"
  >
    <div>محتوای محافظت شده</div>
  </AccessControl>
</template>
```

#### نمایش پیام در صورت عدم دسترسی
```vue
<template>
  <AccessControl 
    permissions="admin.panel"
    :show-fallback="true"
    fallback-message="برای دسترسی به پنل ادمین باید مجوز داشته باشید"
  >
    <AdminPanel />
  </AccessControl>
</template>
```

## 🔐 نقش‌های پیش‌فرض سیستم

| نقش | توضیحات | دسترسی‌ها |
|-----|---------|-----------|
| **admin** | مدیر سیستم | دسترسی کامل به تمام بخش‌ها |
| **editor** | ویرایشگر | مدیریت محتوا (کتاب، مقاله، دسته‌بندی) |
| **moderator** | ناظر | مدیریت نظرات و گزارش‌ها |
| **author** | نویسنده | ایجاد و ویرایش محتوای خود |
| **user** | کاربر عادی | مشاهده محتوا و داشبورد شخصی |

## 📝 دسترسی‌های سیستم

### دسترسی‌های کاربران
- `users.view` - مشاهده لیست کاربران
- `users.create` - ایجاد کاربر جدید
- `users.edit` - ویرایش اطلاعات کاربران
- `users.delete` - حذف کاربران
- `users.manage` - مدیریت کامل کاربران

### دسترسی‌های کتاب‌ها
- `books.view` - مشاهده کتاب‌ها
- `books.create` - ایجاد کتاب جدید
- `books.edit` - ویرایش کتاب‌ها
- `books.delete` - حذف کتاب‌ها

### دسترسی‌های نقش‌ها
- `roles.view` - مشاهده نقش‌ها
- `roles.create` - ایجاد نقش جدید
- `roles.edit` - ویرایش نقش‌ها
- `roles.delete` - حذف نقش‌ها
- `roles.manage` - مدیریت دسترسی‌های نقش‌ها

### دسترسی‌های رسانه
- `media.view` - مشاهده گالری
- `media.upload` - آپلود فایل
- `media.delete` - حذف فایل‌ها

## 🎯 مثال‌های کاربردی

### مثال 1: صفحه مدیریت کاربران
```vue
<template>
  <div>
    <!-- فقط ادمین‌ها می‌توانند این صفحه را ببینند -->
    <h1>مدیریت کاربران</h1>
    
    <!-- دکمه ایجاد کاربر -->
    <AccessControl permissions="users.create">
      <button @click="createUser">کاربر جدید</button>
    </AccessControl>
    
    <!-- جدول کاربران -->
    <table>
      <tr v-for="user in users" :key="user.id">
        <td>{{ user.name }}</td>
        <td>
          <!-- دکمه ویرایش -->
          <AccessControl permissions="users.edit">
            <button @click="editUser(user)">ویرایش</button>
          </AccessControl>
          
          <!-- دکمه حذف - فقط ادمین -->
          <AccessControl roles="admin">
            <button @click="deleteUser(user)">حذف</button>
          </AccessControl>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth', 'admin'],
  layout: 'dashboard'
})

const { canCreateUsers, canEditUsers, canDeleteUsers } = usePermissions()
</script>
```

### مثال 2: منوی داشبورد
```vue
<template>
  <nav>
    <!-- آیتم‌های عمومی -->
    <NuxtLink to="/dashboard">داشبورد</NuxtLink>
    <NuxtLink to="/dashboard/profile">پروفایل</NuxtLink>
    
    <!-- آیتم‌های محتوا -->
    <template v-if="hasPermission('books.view')">
      <NuxtLink to="/dashboard/books">کتاب‌ها</NuxtLink>
    </template>
    
    <!-- آیتم‌های ادمین -->
    <template v-if="isAdmin">
      <NuxtLink to="/dashboard/users">کاربران</NuxtLink>
      <NuxtLink to="/dashboard/roles">نقش‌ها</NuxtLink>
      <NuxtLink to="/dashboard/permissions">دسترسی‌ها</NuxtLink>
    </template>
  </nav>
</template>

<script setup>
const { isAdmin, hasPermission } = useAuth()
</script>
```

### مثال 3: فرم ویرایش با دسترسی‌های مختلف
```vue
<template>
  <form @submit.prevent="saveBook">
    <!-- همه می‌توانند ببینند -->
    <input v-model="book.title" :disabled="!canEdit" />
    
    <!-- فقط ویرایشگران می‌توانند دسته‌بندی را تغییر دهند -->
    <AccessControl :roles="['admin', 'editor']">
      <select v-model="book.category_id">
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
    </AccessControl>
    
    <!-- دکمه ذخیره -->
    <AccessControl :permissions="['books.edit', 'books.create']">
      <button type="submit">ذخیره</button>
    </AccessControl>
  </form>
</template>

<script setup>
const { hasRole, hasPermission } = useAuth()

const canEdit = computed(() => {
  return hasPermission(['books.edit', 'books.create'])
})
</script>
```

## 🔄 API Endpoints

### بررسی دسترسی در Backend
```javascript
// دریافت کاربران - نیاز به دسترسی users.view
GET /api/auth/users

// ایجاد نقش - نیاز به دسترسی roles.create
POST /api/auth/roles

// به‌روزرسانی دسترسی‌های نقش - نیاز به دسترسی roles.manage
PUT /api/auth/permissions/role/{roleId}
```

## 🚀 نکات مهم

1. **همیشه دسترسی‌ها را در Backend هم بررسی کنید** - Frontend فقط برای UX است
2. **از Middleware ها برای محافظت از صفحات استفاده کنید**
3. **از AccessControl برای مخفی کردن المان‌ها استفاده کنید**
4. **دسترسی‌های حساس را با requireAll محافظت کنید**
5. **همیشه fallback مناسب برای کاربران بدون دسترسی داشته باشید**