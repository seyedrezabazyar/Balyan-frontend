<!-- app/pages/profile.vue -->
<template>
  <div class="max-w-6xl mx-auto p-6 space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">پروفایل کاربری</h1>
          <p class="text-gray-600 mt-1">مدیریت اطلاعات شخصی و تنظیمات حساب کاربری</p>
        </div>
        <div class="flex gap-3">
          <NuxtLink to="/dashboard"
                    class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
            بازگشت به داشبورد
          </NuxtLink>
          <button v-if="!showDebug" @click="showDebug = true"
                  class="px-3 py-1 text-xs bg-gray-200 text-gray-600 rounded hover:bg-gray-300">
            Debug Mode
          </button>
        </div>
      </div>
    </div>

    <!-- Debug Panel -->
    <div v-if="showDebug" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div class="flex justify-between items-start mb-3">
        <h3 class="font-semibold text-yellow-800">Debug Information</h3>
        <button @click="showDebug = false" class="text-yellow-600 hover:text-yellow-800">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div class="space-y-1">
          <div><strong>Token:</strong> {{ authStore.token ? 'موجود' : 'ندارد' }}</div>
          <div><strong>User ID:</strong> {{ user?.id || 'نامشخص' }}</div>
        </div>
        <div class="space-y-1">
          <div><strong>Email Verified:</strong> {{ user?.email_verified_at ? 'تایید شده' : 'خیر' }}</div>
          <div><strong>Phone Verified:</strong> {{ user?.phone_verified_at ? 'تایید شده' : 'خیر' }}</div>
        </div>
        <div class="space-y-1">
          <div><strong>Has Password:</strong> {{ hasPassword ? 'دارد' : 'ندارد' }}</div>
          <div><strong>Is Admin:</strong> {{ authStore.isAdmin ? 'بله' : 'خیر' }}</div>
        </div>
        <div class="space-y-1">
          <div><strong>Form Changed:</strong> {{ hasFormChanges ? 'بله' : 'خیر' }}</div>
          <div><strong>Loading:</strong> {{ loading ? 'بله' : 'خیر' }}</div>
        </div>
      </div>
      <details class="mt-3">
        <summary class="cursor-pointer text-sm font-medium text-yellow-700">نمایش کل اطلاعات کاربر</summary>
        <pre class="mt-2 text-xs bg-yellow-100 p-3 rounded overflow-auto max-h-40">{{ JSON.stringify(user, null, 2) }}</pre>
      </details>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="message" :class="messageClass"
         class="p-4 rounded-lg flex items-start gap-3 animate-fade-in">
      <svg v-if="messageType === 'success'" class="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
      <svg v-else class="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
      <div class="flex-1">
        <p class="font-medium">{{ message }}</p>
        <button @click="clearMessage" class="text-sm underline mt-1 opacity-75 hover:opacity-100">
          بستن
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-3 space-y-6">

        <!-- Basic Information -->
        <div class="bg-white rounded-lg shadow-sm">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              اطلاعات شخصی
            </h2>
          </div>

          <div class="p-6">
            <form @submit.prevent="updateProfile" class="space-y-6">
              <!-- Name and Username Row -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    نام و نام خانوادگی <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="نام کامل خود را وارد کنید"
                    required
                  />
                  <p class="text-xs text-gray-500">این نام در سراسر سایت نمایش داده خواهد شد</p>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 flex items-center gap-1">
                    نام کاربری
                    <svg v-if="!isUsernameChangeable" class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                    </svg>
                  </label>
                  <div class="relative">
                    <input
                      v-model="form.username"
                      type="text"
                      class="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors"
                      :class="{
                        'border-gray-300 focus:border-blue-500 focus:ring-blue-500': !usernameError,
                        'bg-gray-100 cursor-not-allowed': !isUsernameChangeable,
                        'border-red-500 focus:border-red-500 focus:ring-red-500': usernameError,
                        'pr-10': form.username !== user?.username && isUsernameChangeable
                      }"
                      :disabled="!isUsernameChangeable"
                      placeholder="نام کاربری منحصر به فرد"
                    />
                    <div v-if="form.username !== user?.username && isUsernameChangeable"
                         class="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <button type="button" @click="showUsernameWarning = true"
                              class="text-amber-500 hover:text-amber-600">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p v-if="usernameError" class="text-xs text-red-600 mt-1">{{ usernameError }}</p>
                  <p v-else-if="user && user.days_until_username_change > 0" class="text-xs text-red-600 mt-1">
                    شما فقط هر ۳۶۵ روز یک بار می‌توانید نام کاربری خود را تغییر دهید. {{ user.days_until_username_change }} روز تا تغییر بعدی باقی مانده است.
                  </p>
                  <p v-else class="text-xs text-gray-500 mt-1">
                    نام کاربری فقط هر ۳۶۵ روز یکبار قابل تغییر است.
                  </p>
                </div>
              </div>

              <!-- Contact Information -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">اطلاعات تماس</h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Email -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      آدرس ایمیل
                      <span v-if="user?.email_verified_at" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <svg class="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                        تایید شده
                      </span>
                      <span v-else class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        تایید نشده
                      </span>
                    </label>
                    <div class="relative">
                      <input
                        v-model="form.email"
                        type="email"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        :class="{
                          'bg-gray-100 cursor-not-allowed': !!user?.email_verified_at,
                          'pl-10': user?.email_verified_at
                        }"
                        :disabled="!!user?.email_verified_at"
                        placeholder="example@domain.com"
                      />
                      <div v-if="user?.email_verified_at" class="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div v-if="!user?.email_verified_at && form.email && form.email !== user?.email"
                         class="flex justify-end">
                      <button
                        type="button"
                        @click="handleEmailVerification"
                        :disabled="emailVerificationSending"
                        class="text-xs bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        {{ emailVerificationSending ? 'در حال ارسال...' : 'ارسال کد تایید' }}
                      </button>
                    </div>
                  </div>

                  <!-- Phone -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      شماره موبایل
                      <span v-if="user?.phone_verified_at" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <svg class="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                        تایید شده
                      </span>
                      <span v-else class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        تایید نشده
                      </span>
                    </label>
                    <div class="relative">
                      <input
                        v-model="form.phone"
                        type="tel"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        :class="{
                          'bg-gray-100 cursor-not-allowed': !!user?.phone_verified_at,
                          'pl-10': user?.phone_verified_at
                        }"
                        :disabled="!!user?.phone_verified_at"
                        placeholder="09123456789"
                        maxlength="11"
                      />
                      <div v-if="user?.phone_verified_at" class="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div v-if="!user?.phone_verified_at && form.phone && form.phone !== user?.phone"
                         class="flex justify-end">
                      <button
                        type="button"
                        @click="handlePhoneVerification"
                        :disabled="smsVerificationSending"
                        class="text-xs bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        {{ smsVerificationSending ? 'در حال ارسال...' : 'ارسال کد تایید' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>


              <!-- Address Information -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  آدرس و موقعیت مکانی
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">استان</label>
                    <select
                      v-model="form.province_id"
                      @change="onProvinceChange"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">انتخاب استان</option>
                      <option v-for="province in provinces" :key="province.id" :value="province.id">
                        {{ province.name }}
                      </option>
                    </select>
                  </div>

                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">شهر</label>
                    <select
                      v-model="form.city_id"
                      :disabled="!form.province_id || loadingCities"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    >
                      <option value="">{{ loadingCities ? 'در حال بارگذاری...' : 'انتخاب شهر' }}</option>
                      <option v-for="city in cities" :key="city.id" :value="city.id">
                        {{ city.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">آدرس کامل</label>
                  <textarea
                    v-model="form.address"
                    rows="4"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="آدرس کامل و دقیق خود را وارد کنید..."
                  ></textarea>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  :disabled="loading || !hasFormChanges"
                  class="flex-1 sm:flex-none bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ loading ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}
                </button>

                <button
                  v-if="hasFormChanges"
                  type="button"
                  @click="resetForm"
                  class="flex-1 sm:flex-none bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium transition-colors"
                >
                  بازگردانی تغییرات
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Password Management -->
        <div class="bg-white rounded-lg shadow-sm">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              مدیریت رمز عبور
            </h2>
          </div>

          <div class="p-6">
            <!-- Password Status -->
            <div v-if="!hasPassword" class="mb-6">
              <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-amber-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  <div class="flex-1">
                    <h3 class="text-sm font-medium text-amber-800">رمز عبور تنظیم نشده</h3>
                    <p class="text-sm text-amber-700 mt-1">
                      در حال حاضر فقط با کد یکبار مصرف وارد می‌شوید. با تنظیم رمز عبور امنیت حساب خود را افزایش دهید.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="mb-6">
              <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <div class="flex-1">
                    <h3 class="text-sm font-medium text-green-800">رمز عبور فعال است</h3>
                    <p class="text-sm text-green-700 mt-1">
                      می‌توانید با رمز عبور یا کد یکبار مصرف وارد شوید.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Password Form Toggle -->
            <div v-if="!showPasswordForm" class="text-center">
              <button
                @click="showPasswordForm = true"
                class="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors"
                :class="hasPassword
     ? 'bg-amber-600 text-white hover:bg-amber-700'
     : 'bg-green-600 text-white hover:bg-green-700'"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                {{ hasPassword ? 'تغییر رمز عبور' : 'تنظیم رمز عبور' }}
              </button>
            </div>

            <!-- Password Form -->
            <form v-if="showPasswordForm" @submit.prevent="handlePassword" class="space-y-6">
              <div v-if="hasPassword" class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">رمز عبور فعلی *</label>
                <input
                  v-model="passwordForm.current_password"
                  type="password"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="رمز عبور فعلی خود را وارد کنید"
                  required
                />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">رمز عبور جدید *</label>
                <input
                  v-model="passwordForm.password"
                  type="password"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="رمز عبور جدید"
                  minlength="8"
                  required
                />
                <div class="text-xs text-gray-500 space-y-1">
                  <p>رمز عبور باید حداقل 8 کاراکتر باشد</p>
                  <p>ترکیبی از حروف کوچک، بزرگ و اعداد توصیه می‌شود</p>
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">تکرار رمز عبور جدید *</label>
                <input
                  v-model="passwordForm.password_confirmation"
                  type="password"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  :class="{
       'border-red-300 focus:border-red-500 focus:ring-red-500': passwordForm.password_confirmation && passwordForm.password !== passwordForm.password_confirmation
     }"
                  placeholder="تکرار رمز عبور جدید"
                  minlength="8"
                  required
                />
                <p v-if="passwordForm.password_confirmation && passwordForm.password !== passwordForm.password_confirmation"
                   class="text-xs text-red-600">
                  رمز عبور و تکرار آن باید یکسان باشند
                </p>
              </div>

              <div class="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  :disabled="loading || (passwordForm.password !== passwordForm.password_confirmation)"
                  class="flex-1 sm:flex-none bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg v-if="loading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ loading ? 'در حال ذخیره...' : 'ذخیره رمز عبور' }}
                </button>
                <button
                  type="button"
                  @click="cancelPasswordForm"
                  class="flex-1 sm:flex-none bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium transition-colors"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Account Status -->
        <div class="bg-white rounded-lg shadow-sm">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">وضعیت حساب</h3>
          </div>

          <div class="p-6 space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">وضعیت حساب:</span>
              <span v-if="user?.locked_until"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
             <svg class="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
               <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
             </svg>
             قفل شده
           </span>
              <span v-else class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
             <svg class="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
               <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
             </svg>
             فعال
           </span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">ایمیل:</span>
              <span v-if="user?.email_verified_at"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
             تایید شده
           </span>
              <span v-else class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
             تایید نشده
           </span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">موبایل:</span>
              <span v-if="user?.phone_verified_at"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
             تایید شده
           </span>
              <span v-else class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
             تایید نشده
           </span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">رمز عبور:</span>
              <span v-if="hasPassword"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
             تنظیم شده
           </span>
              <span v-else class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
             تنظیم نشده
           </span>
            </div>

            <div v-if="authStore.isAdmin" class="flex items-center justify-between">
              <span class="text-sm text-gray-600">نقش:</span>
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
             <svg class="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
               <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 12c0-2.21-.896-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 12a5.983 5.983 0 01-.757 2.829 1 1 0 01-1.415-1.415A3.987 3.987 0 0013 12a3.987 3.987 0 00-.172-1.414 1 1 0 010-1.415z" clip-rule="evenodd" />
             </svg>
             مدیر سیستم
           </span>
            </div>
          </div>
        </div>

        <!-- Account Information -->
        <div class="bg-white rounded-lg shadow-sm">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">اطلاعات حساب</h3>
          </div>

          <div class="p-6 space-y-4">
            <div>
              <span class="text-sm text-gray-600">شناسه کاربری:</span>
              <p class="text-sm font-medium text-gray-900">#{{ user?.id || 'نامشخص' }}</p>
            </div>

            <div>
              <span class="text-sm text-gray-600">تاریخ عضویت:</span>
              <p class="text-sm font-medium text-gray-900">
                {{ formatDate(user?.created_at) }}
              </p>
            </div>

            <div>
              <span class="text-sm text-gray-600">آخرین ورود:</span>
              <p class="text-sm font-medium text-gray-900">
                {{ user?.last_login_at ? formatDate(user.last_login_at) : 'هیچوقت' }}
              </p>
            </div>

            <div v-if="user?.username_last_changed_at">
              <span class="text-sm text-gray-600">آخرین تغییر نام کاربری:</span>
              <p class="text-sm font-medium text-gray-900">
                {{ formatDate(user.username_last_changed_at) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-lg shadow-sm">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">دسترسی سریع</h3>
          </div>

          <div class="p-6 space-y-3">
            <NuxtLink to="/dashboard"
                      class="block w-full text-center bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
              داشبورد
            </NuxtLink>

            <NuxtLink v-if="authStore.isAdmin" to="/admin"
                      class="block w-full text-center bg-purple-100 text-purple-700 py-2 px-4 rounded-lg hover:bg-purple-200 transition-colors">
              پنل مدیریت
            </NuxtLink>

            <button @click="refreshUserData"
                    :disabled="loading"
                    class="block w-full text-center bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50">
              بارگذاری مجدد اطلاعات
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Username Change Warning Modal -->
    <div v-if="showUsernameWarning" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <div class="flex items-start gap-3">
          <svg class="w-6 h-6 text-amber-500 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900">تأیید تغییر نام کاربری</h3>
            <p class="text-sm text-gray-600 mt-2">
              نام کاربری فقط یک بار در سال قابل تغییر است. پس از این تغییر تا سال آینده نمی‌توانید دوباره نام کاربری خود را تغییر دهید.
            </p>
            <p class="text-sm font-medium text-gray-900 mt-3">
              آیا مطمئن هستید که می‌خواهید نام کاربری خود را به
              <span class="font-bold text-blue-600">{{ form.username }}</span>
              تغییر دهید؟
            </p>
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button
            @click="confirmUsernameChange"
            class="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 font-medium"
          >
            بله، تغییر دهید
          </button>
          <button
            @click="cancelUsernameChange"
            class="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 font-medium"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>

    <!-- Verification Code Modal -->
    <div v-if="showVerificationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            {{ verificationModal.type === 'email' ? 'تایید ایمیل' : 'تایید شماره موبایل' }}
          </h3>

          <p class="text-sm text-gray-600 mb-1">
            کد تایید به {{ verificationModal.target }} ارسال شد
          </p>

          <p class="text-xs text-red-600 mb-6">
            برای تست، کد تایید: <span class="font-mono font-bold">123456</span>
          </p>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">کد تایید</label>
            <input
              v-model="verificationCode"
              type="text"
              maxlength="6"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg tracking-widest font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••"
              @input="verificationCode = verificationCode.replace(/[^0-9]/g, '')"
            />
          </div>

          <div class="flex gap-3">
            <button
              @click="verifyCode"
              :disabled="!verificationCode || verificationCode.length !== 6 || loading"
              class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {{ loading ? 'در حال تایید...' : 'تایید' }}
            </button>
            <button
              @click="closeVerificationModal"
              class="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 font-medium"
            >
              انصراف
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useProfile } from '~/composables/useProfile'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// Store
const authStore = useAuthStore()
const profileComposable = useProfile()

// Reactive state
const user = ref(null)
const loading = ref(false)
const message = ref('')
const messageType = ref('success')
const usernameError = ref('')
const showPasswordForm = ref(false)
const showUsernameWarning = ref(false)
const showVerificationModal = ref(false)
const showDebug = ref(false)
const emailVerificationSending = ref(false)
const smsVerificationSending = ref(false)
const loadingCities = ref(false)

// Data
const provinces = ref([])
const cities = ref([])
const verificationCode = ref('')
const verificationModal = ref({
  type: '', // 'email' or 'phone'
  target: ''
})

// Original form data for comparison
const originalForm = ref({})

// Forms
const form = ref({
  name: '',
  email: '',
  phone: '',
  username: '',
  province_id: '',
  city_id: '',
  address: ''
})

const passwordForm = ref({
  current_password: '',
  password: '',
  password_confirmation: ''
})

// Computed properties
const isUsernameChangeable = computed(() => {
  // 1. If a server error is active, field is not changeable.
  if (usernameError.value) {
    return false
  }
  // 2. If user data is not loaded yet, default to not changeable to prevent premature editing.
  if (!user.value) {
    return false
  }
  // 3. The backend now provides the source of truth.
  // The field is changeable if the days remaining is 0, null, or undefined.
  return !(user.value.days_until_username_change > 0)
})

const hasPassword = computed(() => {
  if (!user.value) return false
  // Prioritize the more explicit 'has_password' field if it exists.
  if (typeof user.value.has_password === 'boolean') {
    return user.value.has_password
  }
  // Fallback to the 'password' field.
  return !!user.value.password
})

const messageClass = computed(() => {
  return messageType.value === 'success'
    ? 'bg-green-50 text-green-700 border border-green-200'
    : 'bg-red-50 text-red-700 border border-red-200'
})

const hasFormChanges = computed(() => {
  if (!originalForm.value || !form.value) return false

  return Object.keys(form.value).some(key => {
    return form.value[key] !== originalForm.value[key]
  })
})

// Methods
const loadUserData = async () => {
  try {
    loading.value = true
    const response = await profileComposable.getCurrentUser()
    user.value = response.user || response

    console.log('User loaded:', user.value)

    // پر کردن فرم با اطلاعات کاربر
    const formData = {
      name: user.value.name || '',
      email: user.value.email || '',
      phone: user.value.phone || '',
      username: user.value.username || '',
      province_id: user.value.province_id || '',
      city_id: user.value.city_id || '',
      address: user.value.address || ''
    }

    form.value = { ...formData }
    originalForm.value = { ...formData }

    // بارگذاری شهرها اگر استان انتخاب شده
    if (form.value.province_id) {
      await loadCitiesData(form.value.province_id)
    }

  } catch (error) {
    showMessage('خطا در دریافت اطلاعات کاربر', 'error')
    console.error('Error loading user data:', error)
  } finally {
    loading.value = false
  }
}


const loadProvincesData = async () => {
  try {
    const response = await profileComposable.getProvinces()
    provinces.value = response.data || response
  } catch (error) {
    console.error('خطا در دریافت استان‌ها:', error)
  }
}

const loadCitiesData = async (provinceId) => {
  if (!provinceId) {
    cities.value = []
    return
  }

  loadingCities.value = true
  try {
    const response = await profileComposable.getCities(provinceId)
    cities.value = response.data || response
  } catch (error) {
    console.error('خطا در دریافت شهرها:', error)
  } finally {
    loadingCities.value = false
  }
}

const onProvinceChange = async () => {
  form.value.city_id = ''
  await loadCitiesData(form.value.province_id)
}

const updateProfile = async () => {
  loading.value = true
  clearMessage()
  usernameError.value = ''

  try {
    console.log('Sending update data:', form.value)

    const updateData = {
      name: form.value.name,
      province_id: form.value.province_id || null,
      city_id: form.value.city_id || null,
      address: form.value.address || null
    }

    // فقط فیلدهای تغییر یافته را ارسال کن
    if (form.value.email !== originalForm.value.email) {
      updateData.email = form.value.email || null
    }
    if (form.value.phone !== originalForm.value.phone) {
      updateData.phone = form.value.phone || null
    }
    if (form.value.username !== originalForm.value.username) {
      updateData.username = form.value.username
    }

    console.log('Final update data:', updateData)

    const response = await profileComposable.updateProfile(updateData)

    console.log('Update response:', response)

    const updatedUser = response.user || response
    user.value = updatedUser
    authStore.setUser(updatedUser)

    // Update original form data
    originalForm.value = { ...form.value }

    showMessage('اطلاعات با موفقیت ذخیره شد', 'success')
  } catch (error) {
    console.error('Error updating profile:', error)
    if (error.statusCode === 422 && error.data?.errors?.username) {
      usernameError.value = error.data.errors.username[0]
    } else {
      showMessage(error.data?.message || 'خطا در ذخیره اطلاعات', 'error')
    }
  } finally {
    loading.value = false
  }
}

const handlePassword = async () => {
  loading.value = true
  clearMessage()

  try {
    if (hasPassword.value) {
      await profileComposable.updatePassword(passwordForm.value)
    } else {
      await profileComposable.setPassword({
        password: passwordForm.value.password,
        password_confirmation: passwordForm.value.password_confirmation
      })
    }

    showMessage('رمز عبور با موفقیت ذخیره شد', 'success')
    showPasswordForm.value = false
    resetPasswordForm()
    await loadUserData()
  } catch (error) {
    console.error('Error handling password:', error)
    const errorMap = {
      "The password field must contain at least one uppercase and one lowercase letter.": "رمز عبور باید شامل حروف بزرگ و کوچک انگلیسی باشد.",
      "The password field must contain at least one symbol.": "رمز عبور باید شامل حداقل یک نماد (مانند @#$!) باشد.",
      "The password field must be at least 8 characters.": "رمز عبور باید حداقل ۸ کاراکتر باشد."
    };

    let errorMessage = 'خطا در ذخیره رمز عبور';
    if (error.data?.errors?.password) {
      const passwordErrors = error.data.errors.password;
      // Translate each error and join with a newline for better readability
      errorMessage = passwordErrors.map(e => errorMap[e] || e).join('\n');
    } else if (error.data?.message) {
      errorMessage = error.data.message;
    }
    showMessage(errorMessage, 'error');
  } finally {
    loading.value = false
  }
}

const handleEmailVerification = async () => {
  if (!form.value.email) return

  emailVerificationSending.value = true
  try {
    await profileComposable.sendEmailVerification(form.value.email)

    verificationModal.value = {
      type: 'email',
      target: form.value.email
    }
    showVerificationModal.value = true
  } catch (error) {
    showMessage('خطا در ارسال کد تایید ایمیل', 'error')
    console.error('Error sending email verification:', error)
  } finally {
    emailVerificationSending.value = false
  }
}

const handlePhoneVerification = async () => {
  if (!form.value.phone) return

  smsVerificationSending.value = true
  try {
    await profileComposable.sendPhoneVerification(form.value.phone)

    verificationModal.value = {
      type: 'phone',
      target: form.value.phone
    }
    showVerificationModal.value = true
  } catch (error) {
    showMessage('خطا در ارسال کد تایید موبایل', 'error')
    console.error('Error sending phone verification:', error)
  } finally {
    smsVerificationSending.value = false
  }
}

const verifyCode = async () => {
  if (!verificationCode.value || verificationCode.value.length !== 6) return

  loading.value = true
  try {
    let response
    if (verificationModal.value.type === 'email') {
      response = await profileComposable.verifyEmail(verificationModal.value.target, verificationCode.value)
      showMessage('ایمیل با موفقیت تایید شد', 'success')
    } else {
      response = await profileComposable.verifyPhone(verificationModal.value.target, verificationCode.value)
      showMessage('شماره موبایل با موفقیت تایید شد', 'success')
    }

    // Use the response to update state directly, avoiding race conditions with refetching.
    if (response) {
      const updatedUser = response.user || response
      if (updatedUser && typeof updatedUser === 'object') {
        user.value = updatedUser
        authStore.setUser(updatedUser)

        // Update the form to reflect the new verified data
        form.value.email = updatedUser.email || ''
        form.value.phone = updatedUser.phone || ''
        originalForm.value.email = updatedUser.email || ''
        originalForm.value.phone = updatedUser.phone || ''
      }
    }

    closeVerificationModal()
  } catch (error) {
    showMessage(error.data?.message || 'کد تایید اشتباه است', 'error')
    console.error('Error verifying code:', error)
  } finally {
    loading.value = false
  }
}

const confirmUsernameChange = () => {
  showUsernameWarning.value = false
}

const cancelUsernameChange = () => {
  form.value.username = originalForm.value.username
  showUsernameWarning.value = false
}

const cancelPasswordForm = () => {
  showPasswordForm.value = false
  resetPasswordForm()
  clearMessage()
}

const resetPasswordForm = () => {
  passwordForm.value = {
    current_password: '',
    password: '',
    password_confirmation: ''
  }
}

const closeVerificationModal = () => {
  showVerificationModal.value = false
  verificationCode.value = ''
  verificationModal.value = { type: '', target: '' }
}

const resetForm = () => {
  form.value = { ...originalForm.value }
}

const refreshUserData = async () => {
  await loadUserData()
  showMessage('اطلاعات بروزرسانی شد', 'success')
}

const showMessage = (msg, type = 'success') => {
  message.value = msg
  messageType.value = type

  setTimeout(() => {
    clearMessage()
  }, 5000)
}

const clearMessage = () => {
  message.value = ''
  messageType.value = 'success'
}

const formatDate = (dateString) => {
  if (!dateString) return 'نامشخص'
  return new Date(dateString).toLocaleDateString('fa-IR')
}

// Watchers
watch(() => form.value.username, (newUsername) => {
  if (newUsername !== user.value?.username && !isUsernameChangeable.value) {
    form.value.username = user.value?.username || ''
  }
})

// Lifecycle
onMounted(async () => {
  console.log('Profile page mounted')
  await Promise.all([
    loadUserData(),
    loadProvincesData()
  ])
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom scrollbar for debug section */
.overflow-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
