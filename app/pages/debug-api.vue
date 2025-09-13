<template>
  <div class="font-sans text-gray-800 bg-gray-50 min-h-screen p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">API Debugging Page</h1>
      <p class="text-gray-600 mb-8">This page displays runtime configuration and allows for testing API calls directly.</p>

      <!-- Environment and Config Section -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">Environment & Runtime Configuration</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="font-medium text-gray-600">Nuxt Environment (process.dev):</span>
              <span class="font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">{{ isDev }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-600">Execution Context (process.server):</span>
              <span class="font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">{{ isServer }}</span>
            </div>
             <div class="flex justify-between">
              <span class="font-medium text-gray-600">Execution Context (process.client):</span>
              <span class="font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">{{ isClient }}</span>
            </div>
          </div>
          <div class="space-y-2">
            <h3 class="font-medium text-gray-600 mb-2">Public Runtime Config (useRuntimeConfig().public):</h3>
            <pre class="bg-gray-100 p-4 rounded-lg text-xs font-mono overflow-auto">{{ publicConfig }}</pre>
          </div>
        </div>
      </div>

      <!-- API Test Section -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">API Call Tests</h2>
        <div class="space-y-4">
          <p class="text-sm text-gray-600">Click the buttons below to make API calls using the <code class="font-mono bg-gray-100 text-sm px-1 rounded">useApi()</code> composable. The results will be displayed below.</p>
          <div class="flex flex-wrap gap-4">
            <button @click="runTest('/auth/check-user', { method: 'POST', body: { identifier: 'test@example.com' } })" :disabled="loading" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
              Test: POST /auth/check-user
            </button>
            <button @click="runTest('/locations/provinces')" :disabled="loading" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50">
              Test: GET /locations/provinces
            </button>
             <button @click="runTest('/sanctum/csrf-cookie')" :disabled="loading" class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition disabled:opacity-50">
              Test: GET /sanctum/csrf-cookie
            </button>
          </div>
        </div>

        <!-- Results Section -->
        <div v-if="testResult || testError" class="mt-6 border-t pt-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">Test Result for: <code class="font-mono text-sm">{{ lastTestUrl }}</code></h3>
          <div v-if="loading" class="text-center p-4">
            <p class="text-blue-600">Loading...</p>
          </div>
          <!-- Success Result -->
          <div v-if="testResult" class="bg-green-50 border border-green-200 p-4 rounded-lg">
            <h4 class="font-bold text-green-800">Success (Status: {{ testResult.status }})</h4>
            <p class="text-xs text-green-700 mb-2">Response received at: {{ new Date().toLocaleTimeString() }}</p>
            <pre class="bg-white p-3 rounded text-xs font-mono overflow-auto">{{ testResult.data }}</pre>
          </div>
          <!-- Error Result -->
          <div v-if="testError" class="bg-red-50 border border-red-200 p-4 rounded-lg">
            <h4 class="font-bold text-red-800">Error (Status: {{ testError.status }})</h4>
             <p class="text-xs text-red-700 mb-2">Error received at: {{ new Date().toLocaleTimeString() }}</p>
            <pre class="bg-white p-3 rounded text-xs font-mono overflow-auto">{{ testError.data }}</pre>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApi } from '~/composables/useApi'

const config = useRuntimeConfig()
const api = useApi()

// --- Data for Display ---
const isDev = ref(process.dev)
const isServer = ref(process.server)
const isClient = ref(process.client)

const publicConfig = computed(() => {
  return JSON.stringify(config.public, null, 2)
})

// --- API Test Logic ---
const loading = ref(false)
const lastTestUrl = ref('')
const testResult = ref<any>(null)
const testError = ref<any>(null)

const runTest = async (url: string, options: any = {}) => {
  lastTestUrl.value = url
  loading.value = true
  testResult.value = null
  testError.value = null

  try {
    // We need to get the raw response, so we can't use the simple api.get/post
    // We will use $fetch directly with the same logic as useApi for this debug page
    // This is not ideal, but necessary to get the full response object including status
    const fetchOptions = {
        baseURL: process.dev ? '/api/v1' : new URL(config.public.apiBase).origin,
        method: options.method || 'GET',
        body: options.body,
    }

    let path = url
    if (!path.startsWith('/api/v1') && !path.startsWith('/sanctum')) {
        path = `/api/v1${path}`
    }
    if (url === '/sanctum/csrf-cookie') {
        path = url
        fetchOptions.baseURL = process.dev ? '' : config.public.apiBase
    }

    const { data, status, error } = await useFetch(path, fetchOptions as any)

    if (error.value) {
      throw error.value
    }

    testResult.value = {
      status: status.value,
      data: JSON.stringify(data.value, null, 2),
    }

  } catch (error: any) {
    testError.value = {
      status: error.statusCode || 'N/A',
      data: JSON.stringify(error.data || { message: error.message }, null, 2),
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
