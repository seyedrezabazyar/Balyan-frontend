<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-5">
        <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-pattern)" />
        </svg>
      </div>

      <div class="relative container mx-auto px-4 py-24 sm:py-32">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Content -->
          <div class="space-y-8 animate-fade-in">
            <div class="space-y-4">
              <UBadge color="primary" variant="subtle" size="lg">
                <Icon name="heroicons:sparkles" class="w-4 h-4 ml-1" />
                نسخه جدید منتشر شد
              </UBadge>
              <h1 class="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                پلتفرم حرفه‌ای
                <span class="gradient-text"> مدیریت کسب و کار</span>
              </h1>
              <p class="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                با استفاده از جدیدترین تکنولوژی‌های روز دنیا، کسب و کار خود را به سطح جدیدی از موفقیت برسانید
              </p>
            </div>

            <!-- CTA Buttons -->
            <div class="flex flex-wrap gap-4">
              <UButton
                to="/register"
                size="xl"
                color="primary"
                class="px-8"
              >
                شروع رایگان
                <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" />
              </UButton>
              <UButton
                to="/demo"
                size="xl"
                variant="outline"
                color="gray"
                class="px-8"
              >
                مشاهده دمو
                <Icon name="heroicons:play" class="w-5 h-5 mr-2" />
              </UButton>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-8 pt-8">
              <div>
                <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">۱۰K+</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">کاربر فعال</p>
              </div>
              <div>
                <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">۹۹.۹%</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">آپتایم</p>
              </div>
              <div>
                <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">۲۴/۷</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">پشتیبانی</p>
              </div>
            </div>
          </div>

          <!-- Hero Image/Illustration -->
          <div class="relative">
            <div class="relative z-10 glass rounded-2xl p-8 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop"
                alt="Dashboard Preview"
                class="rounded-lg shadow-lg"
              />
              
              <!-- Floating Cards -->
              <div class="absolute -top-4 -left-4 glass rounded-lg p-4 shadow-lg animate-bounce">
                <div class="flex items-center space-x-3 space-x-reverse">
                  <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Icon name="heroicons:check" class="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">تایید شده</p>
                    <p class="text-xs text-gray-600 dark:text-gray-400">امنیت بالا</p>
                  </div>
                </div>
              </div>

              <div class="absolute -bottom-4 -right-4 glass rounded-lg p-4 shadow-lg animate-pulse">
                <div class="flex items-center space-x-3 space-x-reverse">
                  <div class="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                    <Icon name="heroicons:chart-bar" class="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">+۲۵۶%</p>
                    <p class="text-xs text-gray-600 dark:text-gray-400">رشد ماهانه</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-24 bg-white dark:bg-gray-900">
      <div class="container mx-auto px-4">
        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <UBadge color="primary" variant="subtle" size="lg">
            ویژگی‌ها
          </UBadge>
          <h2 class="text-4xl font-bold text-gray-900 dark:text-gray-100">
            همه چیز که نیاز دارید
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            ابزارهای قدرتمند و حرفه‌ای برای مدیریت بهتر کسب و کار شما
          </p>
        </div>

        <!-- Features Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="feature in features" :key="feature.title" class="group">
            <div class="glass rounded-xl p-6 h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Icon :name="feature.icon" class="w-7 h-7 text-white" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {{ feature.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                {{ feature.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-24 bg-gray-50 dark:bg-gray-800">
      <div class="container mx-auto px-4">
        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <UBadge color="primary" variant="subtle" size="lg">
            نحوه کار
          </UBadge>
          <h2 class="text-4xl font-bold text-gray-900 dark:text-gray-100">
            شروع در ۳ مرحله ساده
          </h2>
        </div>

        <!-- Steps -->
        <div class="grid md:grid-cols-3 gap-8 relative">
          <!-- Connection Line -->
          <div class="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary-500 to-primary-700"></div>

          <div v-for="(step, index) in steps" :key="step.title" class="relative">
            <div class="text-center space-y-4">
              <div class="relative inline-block">
                <div class="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mx-auto">
                  <span class="text-3xl font-bold text-white">{{ index + 1 }}</span>
                </div>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {{ step.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                {{ step.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section class="py-24 bg-white dark:bg-gray-900">
      <div class="container mx-auto px-4">
        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <UBadge color="primary" variant="subtle" size="lg">
            قیمت‌گذاری
          </UBadge>
          <h2 class="text-4xl font-bold text-gray-900 dark:text-gray-100">
            پلن مناسب خود را انتخاب کنید
          </h2>
        </div>

        <!-- Pricing Cards -->
        <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div v-for="plan in pricingPlans" :key="plan.name" 
            :class="[
              'relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2',
              plan.featured ? 'glass border-2 border-primary-500 shadow-xl' : 'bg-gray-50 dark:bg-gray-800'
            ]"
          >
            <!-- Featured Badge -->
            <div v-if="plan.featured" class="absolute -top-4 left-1/2 -translate-x-1/2">
              <UBadge color="primary" size="lg">محبوب‌ترین</UBadge>
            </div>

            <div class="space-y-6">
              <div>
                <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ plan.name }}</h3>
                <p class="text-gray-600 dark:text-gray-400 mt-2">{{ plan.description }}</p>
              </div>

              <div class="flex items-baseline">
                <span class="text-4xl font-bold text-gray-900 dark:text-gray-100">{{ plan.price }}</span>
                <span class="text-gray-600 dark:text-gray-400 mr-2">تومان/ماه</span>
              </div>

              <ul class="space-y-3">
                <li v-for="feature in plan.features" :key="feature" class="flex items-center">
                  <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-500 ml-3 flex-shrink-0" />
                  <span class="text-gray-700 dark:text-gray-300">{{ feature }}</span>
                </li>
              </ul>

              <UButton
                :color="plan.featured ? 'primary' : 'gray'"
                :variant="plan.featured ? 'solid' : 'outline'"
                size="lg"
                block
              >
                انتخاب پلن
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 bg-gradient-to-br from-primary-500 to-primary-700">
      <div class="container mx-auto px-4 text-center">
        <div class="max-w-3xl mx-auto space-y-8">
          <h2 class="text-4xl font-bold text-white">
            آماده شروع هستید؟
          </h2>
          <p class="text-xl text-primary-100">
            همین حالا ثبت نام کنید و از ۱۴ روز دوره آزمایشی رایگان استفاده کنید
          </p>
          <div class="flex flex-wrap gap-4 justify-center">
            <UButton
              to="/register"
              size="xl"
              color="white"
              class="px-8"
            >
              شروع رایگان
            </UButton>
            <UButton
              to="/contact"
              size="xl"
              variant="outline"
              color="white"
              class="px-8 !text-white !border-white hover:!bg-white/10"
            >
              تماس با فروش
            </UButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Page meta
definePageMeta({
  layout: 'default'
})

// Features data
const features = [
  {
    icon: 'heroicons:shield-check',
    title: 'امنیت بالا',
    description: 'رمزنگاری end-to-end و احراز هویت دو مرحله‌ای برای حفاظت کامل از اطلاعات شما'
  },
  {
    icon: 'heroicons:chart-bar',
    title: 'گزارشات پیشرفته',
    description: 'تحلیل‌های دقیق و گزارشات جامع برای تصمیم‌گیری‌های هوشمندانه'
  },
  {
    icon: 'heroicons:users',
    title: 'مدیریت تیم',
    description: 'ابزارهای قدرتمند برای همکاری و مدیریت اعضای تیم'
  },
  {
    icon: 'heroicons:bolt',
    title: 'عملکرد سریع',
    description: 'بهینه‌سازی شده برای سرعت بالا و تجربه کاربری روان'
  },
  {
    icon: 'heroicons:cloud',
    title: 'ذخیره‌سازی ابری',
    description: 'دسترسی به اطلاعات از هر مکان و در هر زمان'
  },
  {
    icon: 'heroicons:cog',
    title: 'قابلیت سفارشی‌سازی',
    description: 'تنظیمات کامل برای شخصی‌سازی بر اساس نیازهای شما'
  }
]

// Steps data
const steps = [
  {
    title: 'ثبت نام',
    description: 'در کمتر از یک دقیقه حساب کاربری خود را ایجاد کنید'
  },
  {
    title: 'پیکربندی',
    description: 'تنظیمات مورد نظر خود را اعمال کنید'
  },
  {
    title: 'شروع استفاده',
    description: 'از تمام امکانات پلتفرم بهره‌مند شوید'
  }
]

// Pricing plans
const pricingPlans = [
  {
    name: 'پایه',
    description: 'برای کسب و کارهای کوچک',
    price: '۲۹۹,۰۰۰',
    features: [
      'تا ۵ کاربر',
      '۱۰ گیگابایت فضای ذخیره‌سازی',
      'پشتیبانی ایمیلی',
      'گزارشات پایه'
    ],
    featured: false
  },
  {
    name: 'حرفه‌ای',
    description: 'برای تیم‌های در حال رشد',
    price: '۹۹۹,۰۰۰',
    features: [
      'تا ۲۰ کاربر',
      '۱۰۰ گیگابایت فضای ذخیره‌سازی',
      'پشتیبانی ۲۴/۷',
      'گزارشات پیشرفته',
      'API دسترسی',
      'اتوماسیون'
    ],
    featured: true
  },
  {
    name: 'سازمانی',
    description: 'برای شرکت‌های بزرگ',
    price: 'تماس بگیرید',
    features: [
      'کاربر نامحدود',
      'فضای ذخیره‌سازی نامحدود',
      'مدیر اختصاصی',
      'آموزش حضوری',
      'SLA ۹۹.۹%',
      'سفارشی‌سازی کامل'
    ],
    featured: false
  }
]
</script>