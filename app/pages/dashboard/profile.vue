<!-- app/pages/dashboard/profile.vue -->
<template>
  <div class="profile-container">
    <!-- Header -->
    <header class="profile-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="profile-title">ویرایش پروفایل</h1>
          <p class="profile-subtitle">مدیریت اطلاعات شخصی و تنظیمات حساب کاربری</p>
        </div>
        <div class="header-right">
          <NuxtLink to="/dashboard" class="back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5"></path>
              <path d="M12 19l-7-7 7-7"></path>
            </svg>
            بازگشت به داشبورد
          </NuxtLink>
        </div>
      </div>
    </header>

    <main class="profile-main">
      <!-- Import profile edit page content here -->
      <!-- This would include all the form sections, modals, and functionality -->
      <!-- from the profile-edit-page artifact -->

      <div class="profile-grid">
        <!-- Profile Picture Section -->
        <div class="profile-picture-section">
          <!-- Profile picture upload component -->
        </div>

        <!-- Personal Information Section -->
        <div class="form-section">
          <!-- Personal info form -->
        </div>

        <!-- Security Settings Section -->
        <div class="form-section">
          <!-- Security settings form -->
        </div>

        <!-- Account Activity Section -->
        <div class="form-section full-width">
          <!-- Account activity display -->
        </div>
      </div>
    </main>

    <!-- Toast Messages -->
    <div v-if="message" :class="['toast', messageType]" @click="clearMessage">
      <div class="toast-content">
        <span>{{ message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import all the reactive data, computed properties, and methods
// from the profile-edit-page artifact

// Page metadata
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// Use auth composable
const { user, updateProfile, setPassword: setUserPassword, updatePassword, logoutAll } = useAuth()

// All reactive data and methods would be imported/defined here
const message = ref('')
const messageType = ref('success')
const profileData = ref({})
const passwordForm = ref({})
const isLoading = ref(false)
const isPasswordLoading = ref(false)
const showPassword = ref(false)

// Methods would be defined here
const loadProfileData = () => {
  // Load profile data
}

const updatePersonalInfo = async () => {
  // Update personal information
}

const setPassword = async () => {
  // Set password for OTP users
}

const changePassword = async () => {
  // Change password for existing users
}

const logoutFromAllDevices = async () => {
  // Logout from all devices
}

const showMessage = (text, type = 'success') => {
  message.value = text
  messageType.value = type

  setTimeout(() => {
    message.value = ''
  }, 5000)
}

const clearMessage = () => {
  message.value = ''
}

// Lifecycle
onMounted(() => {
  loadProfileData()
})
</script>

<style scoped>
/* Import all the styles from the profile-edit-page artifact */
</style>
