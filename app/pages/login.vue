<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
        خوش آمدید
      </h2>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        حساب کاربری ندارید؟
        <NuxtLink to="/register" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
          ثبت نام کنید
        </NuxtLink>
      </p>
    </div>

    <!-- Form -->
    <UForm :schema="schema" :state="form" @submit="onSubmit" class="space-y-6">
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
              color="gray"
              size="xs"
              @click="showPassword = !showPassword"
            />
          </template>
        </UInput>
      </UFormGroup>

      <!-- Remember & Forgot -->
      <div class="flex items-center justify-between">
        <UCheckbox
          v-model="form.remember"
          label="مرا به خاطر بسپار"
          :disabled="isLoading"
        />
        <NuxtLink to="/forgot-password" class="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
          فراموشی رمز عبور
        </NuxtLink>
      </div>

      <!-- Error Alert -->
      <UAlert
        v-if="error"
        color="red"
        variant="subtle"
        :title="error"
        :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'link' }"
        @close="error = null"
      />

      <!-- Submit Button -->
      <UButton
        type="submit"
        color="primary"
        size="lg"
        block
        :loading="isLoading"
        :disabled="isLoading"
      >
        ورود به حساب
      </UButton>

      <!-- Divider -->
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white dark:bg-gray-900 text-gray-500">یا ورود با</span>
        </div>
      </div>

      <!-- Social Login -->
      <div class="grid grid-cols-2 gap-3">
        <UButton
          color="gray"
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
          color="gray"
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
  email: z.string().email('ایمیل معتبر وارد کنید'),
  password: z.string().min(8, 'رمز عبور باید حداقل 8 کاراکتر باشد'),
  remember: z.boolean().optional()
})

type Schema = z.output<typeof schema>

// State
const authStore = useAuthStore()
const showPassword = ref(false)
const isLoading = ref(false)
const error = ref<string | null>(null)

const form = reactive<Schema>({
  email: '',
  password: '',
  remember: false
})

// Submit handler
async function onSubmit(event: FormSubmitEvent<Schema>) {
  error.value = null
  isLoading.value = true

  try {
    const result = await authStore.login({
      email: event.data.email,
      password: event.data.password,
      remember: event.data.remember
    })

    if (!result.success) {
      error.value = result.error || 'خطا در ورود به سیستم'
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