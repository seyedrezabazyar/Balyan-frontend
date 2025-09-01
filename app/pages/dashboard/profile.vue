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
      <div class="profile-grid">
        <!-- Profile Picture Section -->
        <div class="profile-picture-section">
          <div class="picture-container">
            <div class="picture-wrapper">
              <img 
                v-if="profileData.avatar_url" 
                :src="profileData.avatar_url" 
                alt="Profile Picture"
                class="profile-picture"
              >
              <div v-else class="picture-placeholder">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <label for="avatar-upload" class="upload-overlay">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                <span>تغییر تصویر</span>
              </label>
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                @change="handleAvatarUpload"
                class="hidden"
              >
            </div>
            <div class="picture-info">
              <p class="info-text">فرمت‌های مجاز: JPG, PNG, GIF</p>
              <p class="info-text">حداکثر حجم: ۵ مگابایت</p>
            </div>
          </div>
        </div>

        <!-- Personal Information Section -->
        <div class="form-section">
          <h2 class="section-title">اطلاعات شخصی</h2>
          <form @submit.prevent="updatePersonalInfo" class="profile-form">
            <div class="form-group">
              <label for="name" class="form-label">نام و نام خانوادگی</label>
              <input 
                id="name" 
                v-model="profileData.name" 
                type="text" 
                class="form-input"
                placeholder="نام خود را وارد کنید"
              >
            </div>

            <div class="form-group">
              <label for="email" class="form-label">ایمیل</label>
              <div class="input-with-status">
                <input 
                  id="email" 
                  v-model="profileData.email" 
                  type="email" 
                  class="form-input"
                  placeholder="email@example.com"
                >
                <span v-if="user?.email_verified_at" class="status-badge verified">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  تایید شده
                </span>
                <span v-else class="status-badge unverified">تایید نشده</span>
              </div>
            </div>

            <div class="form-group">
              <label for="phone" class="form-label">شماره موبایل</label>
              <div class="input-with-status">
                <input 
                  id="phone" 
                  v-model="profileData.phone" 
                  type="tel" 
                  class="form-input"
                  placeholder="09123456789"
                  pattern="09[0-9]{9}"
                >
                <span v-if="user?.phone_verified_at" class="status-badge verified">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  تایید شده
                </span>
                <span v-else class="status-badge unverified">تایید نشده</span>
              </div>
            </div>

            <div class="form-group">
              <label for="username" class="form-label">نام کاربری</label>
              <input 
                id="username" 
                v-model="profileData.username" 
                type="text" 
                class="form-input"
                placeholder="نام کاربری را وارد کنید"
              >
            </div>

            <div class="form-group">
              <label for="preferred_method" class="form-label">روش ورود ترجیحی</label>
              <select 
                id="preferred_method" 
                v-model="profileData.preferred_method" 
                class="form-input"
              >
                <option value="password">رمز عبور</option>
                <option value="otp">کد یکبار مصرف</option>
              </select>
            </div>

            <button 
              type="submit" 
              class="submit-btn"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="loading-spinner"></span>
              <span v-else>ذخیره تغییرات</span>
            </button>
          </form>
        </div>

        <!-- Security Settings Section -->
        <div class="form-section">
          <h2 class="section-title">تنظیمات امنیتی</h2>
          
          <!-- Set Password (for OTP users) -->
          <div v-if="!hasPassword" class="security-block">
            <h3 class="block-title">تنظیم رمز عبور</h3>
            <p class="block-description">شما با کد یکبار مصرف وارد شده‌اید. می‌توانید رمز عبور تنظیم کنید.</p>
            <form @submit.prevent="setPassword" class="password-form">
              <div class="form-group">
                <label for="new-password" class="form-label">رمز عبور جدید</label>
                <div class="password-input-wrapper">
                  <input 
                    id="new-password" 
                    v-model="passwordForm.password" 
                    :type="showPassword.new ? 'text' : 'password'" 
                    class="form-input"
                    placeholder="حداقل ۸ کاراکتر"
                    minlength="8"
                    required
                  >
                  <button 
                    type="button" 
                    @click="showPassword.new = !showPassword.new"
                    class="toggle-password"
                  >
                    <svg v-if="showPassword.new" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                    <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label for="confirm-password" class="form-label">تکرار رمز عبور</label>
                <div class="password-input-wrapper">
                  <input 
                    id="confirm-password" 
                    v-model="passwordForm.password_confirmation" 
                    :type="showPassword.confirm ? 'text' : 'password'" 
                    class="form-input"
                    placeholder="رمز عبور را مجدد وارد کنید"
                    minlength="8"
                    required
                  >
                  <button 
                    type="button" 
                    @click="showPassword.confirm = !showPassword.confirm"
                    class="toggle-password"
                  >
                    <svg v-if="showPassword.confirm" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                    <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                class="submit-btn secondary"
                :disabled="isPasswordLoading"
              >
                <span v-if="isPasswordLoading" class="loading-spinner"></span>
                <span v-else>تنظیم رمز عبور</span>
              </button>
            </form>
          </div>

          <!-- Change Password (for existing password users) -->
          <div v-else class="security-block">
            <h3 class="block-title">تغییر رمز عبور</h3>
            <p class="block-description">برای تغییر رمز عبور، ابتدا رمز فعلی را وارد کنید.</p>
            <form @submit.prevent="changePassword" class="password-form">
              <div class="form-group">
                <label for="current-password" class="form-label">رمز عبور فعلی</label>
                <div class="password-input-wrapper">
                  <input 
                    id="current-password" 
                    v-model="passwordForm.current_password" 
                    :type="showPassword.current ? 'text' : 'password'" 
                    class="form-input"
                    placeholder="رمز عبور فعلی را وارد کنید"
                    required
                  >
                  <button 
                    type="button" 
                    @click="showPassword.current = !showPassword.current"
                    class="toggle-password"
                  >
                    <svg v-if="showPassword.current" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                    <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label for="new-password-change" class="form-label">رمز عبور جدید</label>
                <div class="password-input-wrapper">
                  <input 
                    id="new-password-change" 
                    v-model="passwordForm.password" 
                    :type="showPassword.new ? 'text' : 'password'" 
                    class="form-input"
                    placeholder="حداقل ۸ کاراکتر"
                    minlength="8"
                    required
                  >
                  <button 
                    type="button" 
                    @click="showPassword.new = !showPassword.new"
                    class="toggle-password"
                  >
                    <svg v-if="showPassword.new" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                    <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label for="confirm-password-change" class="form-label">تکرار رمز عبور جدید</label>
                <div class="password-input-wrapper">
                  <input 
                    id="confirm-password-change" 
                    v-model="passwordForm.password_confirmation" 
                    :type="showPassword.confirm ? 'text' : 'password'" 
                    class="form-input"
                    placeholder="رمز عبور جدید را مجدد وارد کنید"
                    minlength="8"
                    required
                  >
                  <button 
                    type="button" 
                    @click="showPassword.confirm = !showPassword.confirm"
                    class="toggle-password"
                  >
                    <svg v-if="showPassword.confirm" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                    <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                class="submit-btn secondary"
                :disabled="isPasswordLoading"
              >
                <span v-if="isPasswordLoading" class="loading-spinner"></span>
                <span v-else>تغییر رمز عبور</span>
              </button>
            </form>
          </div>

          <!-- Logout from all devices -->
          <div class="security-block">
            <h3 class="block-title">خروج از همه دستگاه‌ها</h3>
            <p class="block-description">با این عملیات از تمام دستگاه‌هایی که وارد شده‌اید خارج می‌شوید.</p>
            <button 
              @click="logoutFromAllDevices" 
              class="submit-btn danger"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="loading-spinner"></span>
              <span v-else>خروج از همه دستگاه‌ها</span>
            </button>
          </div>
        </div>

        <!-- Account Activity Section -->
        <div class="form-section full-width">
          <h2 class="section-title">فعالیت حساب کاربری</h2>
          <div class="activity-grid">
            <div class="activity-item">
              <div class="activity-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
              </div>
              <div class="activity-content">
                <h4 class="activity-title">آخرین ورود</h4>
                <p class="activity-value">{{ formatDate(user?.last_login_at) || 'نامشخص' }}</p>
              </div>
            </div>

            <div class="activity-item">
              <div class="activity-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-3.5l6-4.5-6-4.5z"/>
                </svg>
              </div>
              <div class="activity-content">
                <h4 class="activity-title">تاریخ عضویت</h4>
                <p class="activity-value">{{ formatDate(user?.created_at) || 'نامشخص' }}</p>
              </div>
            </div>

            <div class="activity-item">
              <div class="activity-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div class="activity-content">
                <h4 class="activity-title">نقش کاربری</h4>
                <p class="activity-value">{{ user?.is_admin ? 'مدیر سیستم' : 'کاربر عادی' }}</p>
              </div>
            </div>

            <div class="activity-item">
              <div class="activity-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
              </div>
              <div class="activity-content">
                <h4 class="activity-title">وضعیت حساب</h4>
                <p class="activity-value" :class="{ 'text-danger': user?.locked_until }">
                  {{ user?.locked_until ? 'قفل شده' : 'فعال' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Toast Messages -->
    <Transition name="toast">
      <div v-if="message" :class="['toast', messageType]" @click="clearMessage">
        <div class="toast-content">
          <svg v-if="messageType === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
          <svg v-else-if="messageType === 'error'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
          <span>{{ message }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Page metadata
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// Use auth composable
const { user, updateProfile, setPassword: setUserPassword, updatePassword, uploadAvatar, logoutAll } = useAuth()

// Reactive data
const message = ref('')
const messageType = ref<'success' | 'error'>('success')
const isLoading = ref(false)
const isPasswordLoading = ref(false)

const profileData = ref({
  name: '',
  email: '',
  phone: '',
  username: '',
  preferred_method: 'password' as 'password' | 'otp',
  avatar_url: ''
})

const passwordForm = ref({
  current_password: '',
  password: '',
  password_confirmation: ''
})

const showPassword = ref({
  current: false,
  new: false,
  confirm: false
})

// Computed
const hasPassword = computed(() => {
  // Check if user has password based on preferred_method or other logic
  return user.value?.preferred_method === 'password'
})

// Methods
const loadProfileData = () => {
  if (user.value) {
    profileData.value = {
      name: user.value.name || '',
      email: user.value.email || '',
      phone: user.value.phone || '',
      username: user.value.username || '',
      preferred_method: user.value.preferred_method || 'otp',
      avatar_url: user.value.avatar_url || ''
    }
  }
}

const updatePersonalInfo = async () => {
  isLoading.value = true
  try {
    const result = await updateProfile({
      name: profileData.value.name,
      email: profileData.value.email,
      phone: profileData.value.phone,
      username: profileData.value.username,
      preferred_method: profileData.value.preferred_method
    })

    if (result.success) {
      showMessage('اطلاعات شخصی با موفقیت به‌روزرسانی شد', 'success')
      loadProfileData() // Reload data
    } else {
      showMessage(result.message || 'خطا در به‌روزرسانی اطلاعات', 'error')
    }
  } catch (error: any) {
    showMessage(error.message || 'خطا در به‌روزرسانی اطلاعات', 'error')
  } finally {
    isLoading.value = false
  }
}

const setPassword = async () => {
  if (passwordForm.value.password !== passwordForm.value.password_confirmation) {
    showMessage('رمز عبور و تکرار آن یکسان نیستند', 'error')
    return
  }

  isPasswordLoading.value = true
  try {
    const result = await setUserPassword(
      passwordForm.value.password,
      passwordForm.value.password_confirmation
    )

    if (result.success) {
      showMessage('رمز عبور با موفقیت تنظیم شد', 'success')
      passwordForm.value = {
        current_password: '',
        password: '',
        password_confirmation: ''
      }
    } else {
      showMessage(result.message || 'خطا در تنظیم رمز عبور', 'error')
    }
  } catch (error: any) {
    showMessage(error.message || 'خطا در تنظیم رمز عبور', 'error')
  } finally {
    isPasswordLoading.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.value.password !== passwordForm.value.password_confirmation) {
    showMessage('رمز عبور جدید و تکرار آن یکسان نیستند', 'error')
    return
  }

  isPasswordLoading.value = true
  try {
    const result = await updatePassword(
      passwordForm.value.current_password,
      passwordForm.value.password,
      passwordForm.value.password_confirmation
    )

    if (result.success) {
      showMessage('رمز عبور با موفقیت تغییر یافت', 'success')
      passwordForm.value = {
        current_password: '',
        password: '',
        password_confirmation: ''
      }
    } else {
      showMessage(result.message || 'خطا در تغییر رمز عبور', 'error')
    }
  } catch (error: any) {
    showMessage(error.message || 'خطا در تغییر رمز عبور', 'error')
  } finally {
    isPasswordLoading.value = false
  }
}

const handleAvatarUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    showMessage('حجم فایل نباید بیشتر از ۵ مگابایت باشد', 'error')
    return
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    showMessage('لطفا یک فایل تصویری انتخاب کنید', 'error')
    return
  }

  isLoading.value = true
  try {
    const result = await uploadAvatar(file)

    if (result.success) {
      showMessage('تصویر پروفایل با موفقیت آپلود شد', 'success')
      if (result.avatar_url) {
        profileData.value.avatar_url = result.avatar_url
      }
    } else {
      showMessage(result.message || 'خطا در آپلود تصویر', 'error')
    }
  } catch (error: any) {
    showMessage(error.message || 'خطا در آپلود تصویر', 'error')
  } finally {
    isLoading.value = false
  }
}

const logoutFromAllDevices = async () => {
  if (!confirm('آیا مطمئن هستید که می‌خواهید از همه دستگاه‌ها خارج شوید؟')) {
    return
  }

  isLoading.value = true
  try {
    const result = await logoutAll()

    if (result.success) {
      showMessage('با موفقیت از همه دستگاه‌ها خارج شدید', 'success')
      // Will redirect to login page automatically
    } else {
      showMessage(result.message || 'خطا در خروج از حساب کاربری', 'error')
    }
  } catch (error: any) {
    showMessage(error.message || 'خطا در خروج از حساب کاربری', 'error')
  } finally {
    isLoading.value = false
  }
}

const formatDate = (dateString?: string | null) => {
  if (!dateString) return null
  
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  
  return new Intl.DateTimeFormat('fa-IR', options).format(date)
}

const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
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
/* Container */
.profile-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

/* Header */
.profile-header {
  max-width: 1200px;
  margin: 0 auto 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.profile-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.5rem;
}

.profile-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-4px);
}

/* Main Content */
.profile-main {
  max-width: 1200px;
  margin: 0 auto;
}

.profile-grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
}

@media (max-width: 968px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
  
  .profile-picture-section {
    max-width: 300px;
    margin: 0 auto;
  }
}

/* Profile Picture Section */
.profile-picture-section {
  height: fit-content;
}

.picture-container {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.picture-wrapper {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  overflow: hidden;
  background: #f3f4f6;
}

.profile-picture {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.picture-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

.upload-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s;
}

.picture-wrapper:hover .upload-overlay {
  opacity: 1;
}

.picture-info {
  text-align: center;
}

.info-text {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0.25rem 0;
}

/* Form Sections */
.form-section {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.form-section.full-width {
  grid-column: 1 / -1;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e5e7eb;
}

/* Forms */
.profile-form,
.password-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-with-status {
  position: relative;
}

.status-badge {
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.status-badge.verified {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.unverified {
  background: #fee2e2;
  color: #991b1b;
}

/* Password Input */
.password-input-wrapper {
  position: relative;
}

.password-input-wrapper .form-input {
  padding-right: 3rem;
}

.toggle-password {
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s;
}

.toggle-password:hover {
  color: #374151;
}

/* Security Blocks */
.security-block {
  padding: 1.5rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.security-block:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.block-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem;
}

.block-description {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0 0 1rem;
}

/* Activity Grid */
.activity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 0.75rem;
  transition: all 0.3s;
}

.activity-item:hover {
  background: #f3f4f6;
  transform: translateY(-2px);
}

.activity-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.activity-title {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.25rem;
}

.activity-value {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.text-danger {
  color: #ef4444;
}

/* Buttons */
.submit-btn {
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 48px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit-btn.secondary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.submit-btn.danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

/* Loading Spinner */
.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Toast */
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  padding: 1rem 1.5rem;
  min-width: 300px;
  z-index: 1000;
  cursor: pointer;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toast.success {
  border-left: 4px solid #10b981;
}

.toast.success svg {
  color: #10b981;
}

.toast.error {
  border-left: 4px solid #ef4444;
}

.toast.error svg {
  color: #ef4444;
}

/* Toast Animation */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Utility */
.hidden {
  display: none;
}

/* Responsive */
@media (max-width: 640px) {
  .profile-container {
    padding: 1rem;
  }

  .profile-title {
    font-size: 1.5rem;
  }

  .form-section {
    padding: 1.5rem;
  }

  .activity-grid {
    grid-template-columns: 1fr;
  }

  .toast {
    right: 1rem;
    left: 1rem;
    min-width: auto;
  }
}
</style>
