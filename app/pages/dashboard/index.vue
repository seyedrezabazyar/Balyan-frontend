<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
          داشبورد
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          خوش آمدید {{ authStore.user?.name }}! در اینجا می‌توانید نمای کلی از عملکرد خود را مشاهده کنید.
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <UButton color="primary" icon="i-heroicons-plus">
          افزودن جدید
        </UButton>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in stats" :key="stat.title" class="glass rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ stat.title }}</p>
            <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{{ stat.value }}</p>
            <div class="mt-2 flex items-center">
              <Icon 
                :name="stat.trend > 0 ? 'heroicons:arrow-trending-up' : 'heroicons:arrow-trending-down'"
                :class="stat.trend > 0 ? 'text-green-500' : 'text-red-500'"
                class="w-4 h-4 ml-1"
              />
              <span :class="stat.trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'" class="text-sm font-medium">
                {{ Math.abs(stat.trend) }}%
              </span>
              <span class="text-gray-600 dark:text-gray-400 text-sm mr-2">از ماه قبل</span>
            </div>
          </div>
          <div :class="`w-12 h-12 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20 flex items-center justify-center`">
            <Icon :name="stat.icon" :class="`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`" />
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Revenue Chart -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">درآمد ماهانه</h3>
            <USelectMenu
              v-model="selectedPeriod"
              :options="periods"
              placeholder="انتخاب دوره"
            />
          </div>
        </template>
        
        <div class="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          <div class="text-center">
            <Icon name="heroicons:chart-bar" class="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>نمودار درآمد</p>
            <p class="text-sm mt-1">داده‌های نمونه</p>
          </div>
        </div>
      </UCard>

      <!-- Activity Feed -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">فعالیت‌های اخیر</h3>
        </template>
        
        <div class="space-y-4">
          <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start space-x-3 space-x-reverse">
            <div :class="`w-8 h-8 rounded-full bg-${activity.color}-100 dark:bg-${activity.color}-900/20 flex items-center justify-center flex-shrink-0`">
              <Icon :name="activity.icon" :class="`w-4 h-4 text-${activity.color}-600 dark:text-${activity.color}-400`" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900 dark:text-gray-100">
                {{ activity.title }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ activity.time }}
              </p>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Data Table -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">سفارشات اخیر</h3>
          <UButton variant="ghost" color="neutral" size="sm">
            مشاهده همه
          </UButton>
        </div>
      </template>

      <UTable :columns="columns" :rows="orders">
        <template #status-data="{ row }">
          <UBadge :color="getStatusColor(row.status)" variant="subtle">
            {{ row.status }}
          </UBadge>
        </template>
        <template #actions-data="{ row }">
          <UDropdown :items="[[{ label: 'مشاهده', icon: 'i-heroicons-eye' }, { label: 'ویرایش', icon: 'i-heroicons-pencil' }], [{ label: 'حذف', icon: 'i-heroicons-trash', color: 'red' }]]">
            <UButton color="neutral" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
          </UDropdown>
        </template>
      </UTable>
    </UCard>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UCard v-for="action in quickActions" :key="action.title">
        <div class="text-center space-y-4">
          <div :class="`w-16 h-16 mx-auto rounded-full bg-${action.color}-100 dark:bg-${action.color}-900/20 flex items-center justify-center`">
            <Icon :name="action.icon" :class="`w-8 h-8 text-${action.color}-600 dark:text-${action.color}-400`" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ action.title }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ action.description }}</p>
          <UButton :color="action.color" variant="soft" block>
            {{ action.buttonText }}
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page meta
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const authStore = useAuthStore()

// State
const selectedPeriod = ref('ماه جاری')
const periods = ['ماه جاری', '۳ ماه اخیر', '۶ ماه اخیر', 'سال جاری']

// Stats data
const stats = [
  {
    title: 'کل درآمد',
    value: '۴۵.۲M',
    trend: 12.5,
    icon: 'heroicons:currency-dollar',
    color: 'green'
  },
  {
    title: 'کاربران جدید',
    value: '۲,۳۴۵',
    trend: 8.2,
    icon: 'heroicons:users',
    color: 'blue'
  },
  {
    title: 'سفارشات',
    value: '۱,۲۸۰',
    trend: -3.1,
    icon: 'heroicons:shopping-cart',
    color: 'purple'
  },
  {
    title: 'نرخ تبدیل',
    value: '۳.۲%',
    trend: 5.7,
    icon: 'heroicons:chart-pie',
    color: 'orange'
  }
]

// Recent activities
const recentActivities = [
  {
    id: 1,
    title: 'سفارش جدید #۱۲۳۴ ثبت شد',
    time: '۵ دقیقه پیش',
    icon: 'heroicons:shopping-cart',
    color: 'green'
  },
  {
    id: 2,
    title: 'کاربر جدید ثبت نام کرد',
    time: '۱۵ دقیقه پیش',
    icon: 'heroicons:user-plus',
    color: 'blue'
  },
  {
    id: 3,
    title: 'پرداخت موفق برای سفارش #۱۲۳۳',
    time: '۱ ساعت پیش',
    icon: 'heroicons:credit-card',
    color: 'purple'
  },
  {
    id: 4,
    title: 'محصول جدید اضافه شد',
    time: '۲ ساعت پیش',
    icon: 'heroicons:cube',
    color: 'orange'
  },
  {
    id: 5,
    title: 'گزارش ماهانه آماده شد',
    time: '۳ ساعت پیش',
    icon: 'heroicons:document-text',
    color: 'gray'
  }
]

// Table columns
import type { TableColumn } from '~/types/ui'

const columns: TableColumn[] = [
  {
    key: 'id',
    label: 'شماره سفارش'
  },
  {
    key: 'customer',
    label: 'مشتری'
  },
  {
    key: 'date',
    label: 'تاریخ'
  },
  {
    key: 'amount',
    label: 'مبلغ'
  },
  {
    key: 'status',
    label: 'وضعیت'
  },
  {
    key: 'actions',
    label: ''
  }
]

// Sample orders data
const orders = [
  {
    id: '#۱۲۳۴',
    customer: 'علی احمدی',
    date: '۱۴۰۲/۱۰/۱۵',
    amount: '۲,۵۰۰,۰۰۰ تومان',
    status: 'تکمیل شده'
  },
  {
    id: '#۱۲۳۳',
    customer: 'مریم رضایی',
    date: '۱۴۰۲/۱۰/۱۴',
    amount: '۱,۸۰۰,۰۰۰ تومان',
    status: 'در حال پردازش'
  },
  {
    id: '#۱۲۳۲',
    customer: 'حسین محمدی',
    date: '۱۴۰۲/۱۰/۱۳',
    amount: '۳,۲۰۰,۰۰۰ تومان',
    status: 'ارسال شده'
  },
  {
    id: '#۱۲۳۱',
    customer: 'زهرا کریمی',
    date: '۱۴۰۲/۱۰/۱۲',
    amount: '۹۵۰,۰۰۰ تومان',
    status: 'لغو شده'
  },
  {
    id: '#۱۲۳۰',
    customer: 'محمد علیزاده',
    date: '۱۴۰۲/۱۰/۱۱',
    amount: '۴,۱۰۰,۰۰۰ تومان',
    status: 'تکمیل شده'
  }
]

// Quick actions
const quickActions = [
  {
    title: 'افزودن محصول',
    description: 'محصول جدید به فروشگاه اضافه کنید',
    icon: 'heroicons:plus-circle',
    color: 'primary',
    buttonText: 'افزودن محصول'
  },
  {
    title: 'ایجاد گزارش',
    description: 'گزارش‌های سفارشی ایجاد کنید',
    icon: 'heroicons:document-chart-bar',
    color: 'green',
    buttonText: 'ایجاد گزارش'
  },
  {
    title: 'دعوت کاربر',
    description: 'کاربران جدید را دعوت کنید',
    icon: 'heroicons:user-plus',
    color: 'blue',
    buttonText: 'ارسال دعوت'
  }
]

// Helper functions
function getStatusColor(status: string): 'success' | 'info' | 'warning' | 'error' | 'neutral' {
  switch (status) {
    case 'تکمیل شده':
      return 'success'
    case 'در حال پردازش':
      return 'info'
    case 'ارسال شده':
      return 'warning'
    case 'لغو شده':
      return 'error'
    default:
      return 'neutral'
  }
}
</script>