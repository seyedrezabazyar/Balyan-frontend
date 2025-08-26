<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
        ایجاد حساب کاربری
      </h2>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        قبلاً ثبت نام کرده‌اید؟
        <NuxtLink to="/login" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
          وارد شوید
        </NuxtLink>
      </p>
    </div>

    <!-- Form -->
    <UForm :schema="schema" :state="form" @submit="onSubmit" class="space-y-6">
      <!-- Name -->
      <UFormGroup label="نام و نام خانوادگی" name="name" required>
        <UInput
          v-model="form.name"
          type="text"
          placeholder="علی احمدی"
          icon="i-heroicons-user"
          size="lg"
          :disabled="isLoading"
        />
      </UFormGroup>

      <!-- Email -->
      <UFormGroup label="ایمیل" name="email" required>
        <UInput
          v-model="form.email"
          type="email"
          placeholder="example@domain.com"
          icon="i-heroicons-envelope"
          size="lg"
          :disabled="isLoading"
        />
      </UFormGroup>

      <!-- Password -->
      <UFormGroup label="رمز عبور" name="password" required>
        <UInput
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="••••••••"
          icon="i-heroicons-lock-closed"
          size="lg"
          :disabled="isLoading"
        >
          <template #trailing>
            <UButton
              :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
              variant="ghost"
              color="neutral"
              size="xs"
              @click="showPassword = !showPassword"
            />
          </template>
        </UInput>
        <template #help>
          <div class="mt-2 space-y-1">
            <div class="flex items-center space-x-2 space-x-reverse">
              <Icon 
                :name="passwordStrength.length ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" 
                :class="passwordStrength.length ? 'text-green-500' : 'text-gray-400'"
                class="w-4 h-4"
              />
              <span class="text-xs" :class="passwordStrength.length ? 'text-green-600 dark:text-green-400' : 'text-gray-500'">
                حداقل 8 کاراکتر
              </span>
            </div>
            <div class="flex items-center space-x-2 space-x-reverse">
              <Icon 
                :name="passwordStrength.uppercase ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" 
                :class="passwordStrength.uppercase ? 'text-green-500' : 'text-gray-400'"
                class="w-4 h-4"
              />
              <span class="text-xs" :class="passwordStrength.uppercase ? 'text-green-600 dark:text-green-400' : 'text-gray-500'">
                حداقل یک حرف بزرگ
              </span>
            </div>
            <div class="flex items-center space-x-2 space-x-reverse">
              <Icon 
                :name="passwordStrength.number ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" 
                :class="passwordStrength.number ? 'text-green-500' : 'text-gray-400'"
                class="w-4 h-4"
              />
              <span class="text-xs" :class="passwordStrength.number ? 'text-green-600 dark:text-green-400' : 'text-gray-500'">
                حداقل یک عدد
              </span>
            </div>
          </div>
        </template>
      </UFormGroup>

      <!-- Password Confirmation -->
      <UFormGroup label="تکرار رمز عبور" name="password_confirmation" required>
        <UInput
          v-model="form.password_confirmation"
          :type="showPassword ? 'text' : 'password'"
          placeholder="••••••••"
          icon="i-heroicons-lock-closed"
          size="lg"
          :disabled="isLoading"
        />
      </UFormGroup>

      <!-- Terms -->
      <UCheckbox
        v-model="form.terms"
        :disabled="isLoading"
      >
        <template #label>
          <span class="text-sm text-gray-700 dark:text-gray-300">
            با
            <NuxtLink to="/terms" class="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
              شرایط و قوانین
            </NuxtLink>
            و
            <NuxtLink to="/privacy" class="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
              سیاست حریم خصوصی
            </NuxtLink>
            موافقم
          </span>
        </template>
      </UCheckbox>

      <!-- Error Alert -->
      <UAlert
        v-if="error"
        color="error"
        variant="subtle"
        :title="error"
        :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'error', variant: 'link' }"
        @close="error = null"
      />

      <!-- Submit Button -->
      <UButton
        type="submit"
        color="primary"
        size="lg"
        block
        :loading="isLoading"
        :disabled="isLoading || !form.terms"
      >
        ثبت نام
      </UButton>

      <!-- Divider -->
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white dark:bg-gray-900 text-gray-500">یا ثبت نام با</span>
        </div>
      </div>

      <!-- Social Login -->
      <div class="grid grid-cols-2 gap-3">
        <UButton
          color="neutral"
          variant="outline"
          size="lg"
          block
          :disabled="isLoading"
          @click="socialLogin('google')"
        >
          <Icon name="mdi:google" class="w-5 h-5 ml-2" />
          Google
        </UButton>
        <UButton
          color="neutral"
          variant="outline"
          size="lg"
          block
          :disabled="isLoading"
          @click="socialLogin('github')"
        >
          <Icon name="mdi:github" class="w-5 h-5 ml-2" />
          GitHub
        </UButton>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

// Page meta
definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

// Schema validation
const schema = z.object({
  name: z.string().min(3, 'نام باید حداقل 3 کاراکتر باشد'),
  email: z.string().email('ایمیل معتبر وارد کنید'),
  password: z.string()
    .min(8, 'رمز عبور باید حداقل 8 کاراکتر باشد')
    .regex(/[A-Z]/, 'رمز عبور باید حداقل یک حرف بزرگ داشته باشد')
    .regex(/[0-9]/, 'رمز عبور باید حداقل یک عدد داشته باشد'),
  password_confirmation: z.string(),
  terms: z.boolean().refine(val => val === true, {
    message: 'باید با شرایط و قوانین موافقت کنید'
  })
}).refine(data => data.password === data.password_confirmation, {
  message: 'رمز عبور و تکرار آن یکسان نیستند',
  path: ['password_confirmation']
})

type Schema = z.output<typeof schema>

// State
const authStore = useAuthStore()
const showPassword = ref(false)
const isLoading = ref(false)
const error = ref<string | null>(null)

const form = reactive<Schema>({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  terms: false
})

// Password strength checker
const passwordStrength = computed(() => ({
  length: form.password.length >= 8,
  uppercase: /[A-Z]/.test(form.password),
  number: /[0-9]/.test(form.password)
}))

// Submit handler
async function onSubmit(event: FormSubmitEvent<Schema>) {
  error.value = null
  isLoading.value = true

  try {
    const result = await authStore.register({
      name: event.data.name,
      email: event.data.email,
      password: event.data.password,
      password_confirmation: event.data.password_confirmation
    })

    if (!result.success) {
      error.value = result.error || 'خطا در ثبت نام'
    }
  } catch (err) {
    error.value = 'خطای غیرمنتظره رخ داد'
  } finally {
    isLoading.value = false
  }
}

// Social login
async function socialLogin(provider: string) {
  isLoading.value = true
  try {
    // Redirect to social login endpoint
    await navigateTo(`${useRuntimeConfig().public.apiBase}/auth/${provider}`, {
      external: true
    })
  } finally {
    isLoading.value = false
  }
}
</script>