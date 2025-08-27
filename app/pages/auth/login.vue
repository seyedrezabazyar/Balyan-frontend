<!-- pages/auth/login.vue -->
<template>
  <div class="auth-container">
    <div class="auth-wrapper">
      <!-- Login Card -->
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo">
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2L2 7L12 12L22 7L12 2Z"></path>
              <path d="M2 17L12 22L22 17"></path>
              <path d="M2 12L12 17L22 12"></path>
            </svg>
          </div>
          <h1 class="auth-title">ورود به حساب</h1>
          <p class="auth-subtitle">برای ادامه وارد حساب کاربری خود شوید</p>
        </div>

        <div class="auth-form">
          <!-- Step 1: Email/Phone Input -->
          <div v-if="step === 1" class="step-container">
            <div class="form-group">
              <label for="identifier" class="form-label">ایمیل یا شماره تلفن</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22 6 12 13 2 6"></polyline>
                </svg>
                <input
                  id="identifier"
                  v-model="identifier"
                  type="text"
                  class="form-input"
                  placeholder="example@email.com یا 09123456789"
                  :disabled="isLoading"
                  @keyup.enter="handleIdentifierSubmit"
                />
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="error-message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {{ errorMessage }}
            </div>

            <!-- Submit Button -->
            <button
              @click="handleIdentifierSubmit"
              class="submit-btn"
              :disabled="isLoading || !identifier.trim()"
            >
              <svg v-if="!isLoading" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
              <span v-if="!isLoading">ادامه</span>
              <span v-else>در حال بررسی...</span>
            </button>
          </div>

          <!-- Step 2: Password Input -->
          <div v-if="step === 2" class="step-container">
            <div class="user-info">
              <p>ورود برای: <strong>{{ identifier }}</strong></p>
              <button @click="goBack" class="back-btn">تغییر</button>
            </div>

            <div class="form-group">
              <label for="password" class="form-label">رمز عبور</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="رمز عبور خود را وارد کنید"
                  :disabled="isLoading"
                  @keyup.enter="handlePasswordLogin"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="password-toggle"
                >
                  <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="error-message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {{ errorMessage }}
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <button
                @click="handlePasswordLogin"
                class="submit-btn"
                :disabled="isLoading || !password.trim()"
              >
                <svg v-if="!isLoading" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                <span v-if="!isLoading">ورود</span>
                <span v-else>در حال ورود...</span>
              </button>

              <button @click="handleOTPLogin" class="secondary-btn" :disabled="isLoading">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                ورود با کد
              </button>
            </div>
          </div>

          <!-- Step 3: OTP Input -->
          <div v-if="step === 3" class="step-container">
            <div class="user-info">
              <p>کد تایید برای: <strong>{{ identifier }}</strong></p>
              <button @click="goBack" class="back-btn">تغییر</button>
            </div>

            <div class="otp-info">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <p>کد تایید 6 رقمی برای شما ارسال شد</p>
            </div>

            <div class="form-group">
              <label for="otpCode" class="form-label">کد تایید</label>
              <div class="input-wrapper">
                <input
                  id="otpCode"
                  v-model="otpCode"
                  type="text"
                  class="form-input otp-input"
                  placeholder="123456"
                  maxlength="6"
                  :disabled="isLoading"
                  @input="handleOTPInput"
                  @keyup.enter="handleOTPVerify"
                />
              </div>
            </div>

            <!-- Timer -->
            <div v-if="otpTimer > 0" class="otp-timer">
              ارسال مجدد کد تا {{ otpTimer }} ثانیه دیگر
            </div>

            <!-- Resend Button -->
            <div v-else class="resend-container">
              <p>کد را دریافت نکردید؟</p>
              <button @click="handleResendOTP" class="resend-btn" :disabled="isLoading">
                ارسال مجدد
              </button>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="error-message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {{ errorMessage }}
            </div>

            <!-- Submit Button -->
            <button
              @click="handleOTPVerify"
              class="submit-btn"
              :disabled="isLoading || otpCode.length !== 6"
            >
              <svg v-if="!isLoading" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span v-if="!isLoading">تایید کد</span>
              <span v-else>در حال تایید...</span>
            </button>
          </div>
        </div>

        <!-- Footer Links -->
        <div class="auth-footer">
          <p>حساب کاربری ندارید؟ <NuxtLink to="/auth/register" class="signup-link">ثبت نام کنید</NuxtLink></p>
          <NuxtLink to="/" class="home-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            بازگشت به صفحه اصلی
          </NuxtLink>
        </div>
      </div>

      <!-- Side Decoration -->
      <div class="side-decoration">
        <div class="decoration-content">
          <h2>سیستم ورود هوشمند</h2>
          <p>با تکنولوژی پیشرفته OTP و امنیت بالا</p>
          <div class="features-list">
            <div class="feature-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>ورود سریع با OTP</span>
            </div>
            <div class="feature-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>امنیت کامل</span>
            </div>
            <div class="feature-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>سازگاری کامل</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Composable
const { checkUser, loginWithPassword, sendOTP, verifyOTP, resendOTP, isLoading } = useAuth();

// Middleware
definePageMeta({
  middleware: 'guest',
  layout: false
});

// State
const step = ref(1);
const identifier = ref('');
const password = ref('');
const otpCode = ref('');
const showPassword = ref(false);
const errorMessage = ref('');
const hasPassword = ref(false);
const otpTimer = ref(0);
let timerInterval = null;

// Methods
const clearError = () => {
  errorMessage.value = '';
};

const goBack = () => {
  step.value = 1;
  clearError();
  password.value = '';
  otpCode.value = '';
};

const startOTPTimer = (seconds = 120) => {
  otpTimer.value = seconds;
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    otpTimer.value--;
    if (otpTimer.value <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }, 1000);
};

const handleIdentifierSubmit = async () => {
  clearError();

  if (!identifier.value.trim()) {
    errorMessage.value = 'لطفاً ایمیل یا شماره تلفن خود را وارد کنید';
    return;
  }

  const result = await checkUser(identifier.value);

  if (result.success) {
    hasPassword.value = result.data?.has_password || false;
    step.value = hasPassword.value ? 2 : 3;

    // اگر پسورد ندارد، مستقیماً OTP ارسال کن
    if (!hasPassword.value) {
      await handleSendOTP();
    }
  } else {
    errorMessage.value = result.message || 'خطا در بررسی حساب کاربری';
  }
};

const handlePasswordLogin = async () => {
  clearError();

  if (!password.value.trim()) {
    errorMessage.value = 'لطفاً رمز عبور خود را وارد کنید';
    return;
  }

  const result = await loginWithPassword(identifier.value, password.value);

  if (result.success) {
    await navigateTo('/dashboard');
  } else {
    errorMessage.value = result.message || 'نام کاربری یا رمز عبور اشتباه است';
  }
};

const handleOTPLogin = async () => {
  clearError();
  step.value = 3;
  await handleSendOTP();
};

const handleSendOTP = async () => {
  const result = await sendOTP(identifier.value);

  if (result.success) {
    startOTPTimer();
  } else {
    errorMessage.value = result.message || 'خطا در ارسال کد تایید';
  }
};

const handleOTPInput = (event) => {
  const target = event.target;
  // فقط اعداد مجاز هستند
  target.value = target.value.replace(/[^0-9]/g, '');
  otpCode.value = target.value;
};

const handleOTPVerify = async () => {
  clearError();

  if (otpCode.value.length !== 6) {
    errorMessage.value = 'لطفاً کد تایید 6 رقمی را وارد کنید';
    return;
  }

  const result = await verifyOTP(identifier.value, otpCode.value);

  if (result.success) {
    await navigateTo('/dashboard');
  } else {
    errorMessage.value = result.message || 'کد تایید اشتباه است';
  }
};

const handleResendOTP = async () => {
  clearError();

  const result = await resendOTP(identifier.value);

  if (result.success) {
    startOTPTimer();
    otpCode.value = '';
  } else {
    errorMessage.value = result.message || 'خطا در ارسال مجدد کد';
  }
};

// Cleanup
onBeforeUnmount(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.auth-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  direction: rtl;
}

.auth-wrapper {
  display: flex;
  width: 100%;
  max-width: 1200px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  min-height: 600px;
}

.auth-card {
  flex: 1;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 400px;
}

.auth-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 20px;
  color: white;
  margin-bottom: 20px;
}

.auth-title {
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 10px;
}

.auth-subtitle {
  color: #6b7280;
  font-size: 1rem;
}

.auth-form {
  flex: 1;
}

.step-container {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f3f4f6;
  border-radius: 10px;
  margin-bottom: 25px;
}

.user-info p {
  margin: 0;
  color: #374151;
  font-size: 0.95rem;
}

.back-btn {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 5px 10px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background: rgba(102, 126, 234, 0.1);
}

.form-group {
  margin-bottom: 25px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  color: #374151;
  font-weight: 500;
  font-size: 0.95rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  right: 15px;
  color: #9ca3af;
  pointer-events: none;
  z-index: 1;
}

.form-input {
  width: 100%;
  padding: 12px 45px 12px 15px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f9fafb;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
}

.otp-input {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 0.5rem;
  padding-right: 15px;
}

.password-toggle {
  position: absolute;
  left: 15px;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:hover {
  color: #667eea;
}

.otp-info {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #e0f2fe;
  border-radius: 10px;
  margin-bottom: 25px;
}

.otp-info svg {
  color: #0891b2;
}

.otp-info p {
  margin: 0;
  color: #0e7490;
  font-size: 0.95rem;
}

.otp-timer {
  text-align: center;
  padding: 10px;
  background: #fef3c7;
  color: #92400e;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 20px;
}

.resend-container {
  text-align: center;
  margin-bottom: 20px;
}

.resend-container p {
  margin: 0 0 10px 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.resend-btn {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-weight: 500;
  text-decoration: underline;
}

.resend-btn:hover {
  color: #764ba2;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.9rem;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.submit-btn, .secondary-btn {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  width: 100%;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.secondary-btn {
  background: #f3f4f6;
  color: #374151;
  border: 2px solid #e5e7eb;
}

.secondary-btn:hover:not(:disabled) {
  background: #e5e7eb;
  border-color: #d1d5db;
}

.auth-footer {
  margin-top: 30px;
  text-align: center;
  color: #6b7280;
  font-size: 0.95rem;
}

.signup-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.signup-link:hover {
  text-decoration: underline;
}

.home-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 15px;
  color: #6b7280;
  text-decoration: none;
  transition: color 0.3s ease;
}

.home-link:hover {
  color: #667eea;
}

.side-decoration {
  flex: 1;
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.side-decoration::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 30px 30px;
  animation: moveGrid 20s linear infinite;
}

@keyframes moveGrid {
  0% { transform: translate(0, 0); }
  100% { transform: translate(30px, 30px); }
}

.decoration-content {
  position: relative;
  z-index: 1;
  color: white;
  text-align: center;
}

.decoration-content h2 {
  font-size: 2rem;
  margin-bottom: 20px;
}

.decoration-content p {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 40px;
  opacity: 0.9;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.feature-item svg {
  color: #ffd700;
}

.feature-item span {
  font-size: 1rem;
}

@media (max-width: 900px) {
  .side-decoration {
    display: none;
  }

  .auth-card {
    min-width: unset;
    padding: 40px 30px;
  }
}

@media (max-width: 480px) {
  .auth-card {
    padding: 30px 20px;
  }

  .auth-title {
    font-size: 1.5rem;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
