<template>
  <div class="auth-container">
    <div class="auth-wrapper">
      <!-- Register Card -->
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo">
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2L2 7L12 12L22 7L12 2Z"></path>
              <path d="M2 17L12 22L22 17"></path>
              <path d="M2 12L12 17L22 12"></path>
            </svg>
          </div>
          <h1 class="auth-title">ثبت نام</h1>
          <p class="auth-subtitle">برای ایجاد حساب کاربری جدید اطلاعات خود را وارد کنید</p>
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

            <!-- Name Input -->
            <div class="form-group">
              <label for="name" class="form-label">نام و نام خانوادگی</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <input
                  id="name"
                  v-model="name"
                  type="text"
                  class="form-input"
                  placeholder="نام کامل خود را وارد کنید"
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
              :disabled="isLoading || !identifier.trim() || !name.trim()"
            >
              <svg v-if="!isLoading" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
              <span v-if="!isLoading">ادامه</span>
              <span v-else>در حال بررسی...</span>
            </button>
          </div>

          <!-- Step 2: OTP Verification -->
          <div v-if="step === 2" class="step-container">
            <div class="user-info">
              <p>تایید حساب: <strong>{{ identifier }}</strong></p>
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
              <span v-if="!isLoading">ثبت نام</span>
              <span v-else>در حال ثبت نام...</span>
            </button>
          </div>

          <!-- Step 3: Success Message -->
          <div v-if="step === 3" class="step-container">
            <div class="success-message">
              <div class="success-icon">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h2>ثبت نام با موفقیت انجام شد!</h2>
              <p>حساب کاربری شما ایجاد شد و می‌توانید از امکانات سیستم استفاده کنید。</p>

              <button @click="goToDashboard" class="submit-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                ورود به داشبورد
              </button>
            </div>
          </div>
        </div>

        <!-- Footer Links -->
        <div class="auth-footer" v-if="step !== 3">
          <p>قبلاً حساب کاربری دارید؟ <NuxtLink to="/auth/login" class="signin-link">وارد شوید</NuxtLink></p>
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
          <h2>به خانواده ما بپیوندید</h2>
          <p>ثبت نام آسان و سریع با تایید هویت امن</p>
          <div class="features-list">
            <div class="feature-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>ثبت نام سریع</span>
            </div>
            <div class="feature-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>تایید هویت امن</span>
            </div>
            <div class="feature-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>دسترسی فوری</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Composable
const { sendOTP, verifyOTP, resendOTP, isLoading } = useAuth();

// Middleware
definePageMeta({
  middleware: 'guest',
  layout: false
});

// State
const step = ref(1);
const identifier = ref('');
const name = ref('');
const otpCode = ref('');
const errorMessage = ref('');
const otpTimer = ref(0);
let timerInterval = null;

// Methods
const clearError = () => {
  errorMessage.value = '';
};

const goBack = () => {
  step.value = 1;
  clearError();
  otpCode.value = '';
};

const goToDashboard = async () => {
  await navigateTo('/dashboard');
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

  if (!name.value.trim()) {
    errorMessage.value = 'لطفاً نام و نام خانوادگی خود را وارد کنید';
    return;
  }

  // ارسال OTP برای ثبت نام
  const result = await sendOTP(identifier.value, 'registration');

  if (result.success) {
    step.value = 2;
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

  // تایید OTP با نام کاربر برای ثبت نام
  const result = await verifyOTP(identifier.value, otpCode.value, 'registration', name.value);

  if (result.success) {
    step.value = 3;
    // پس از 2 ثانیه به داشبورد هدایت شود
    setTimeout(() => {
      navigateTo('/dashboard');
    }, 2000);
  } else {
    errorMessage.value = result.message || 'کد تایید اشتباه است';
  }
};

const handleResendOTP = async () => {
  clearError();

  const result = await resendOTP(identifier.value, 'registration');

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
/* استایل‌های مشابه login.vue */
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

/* سایر استایل‌ها مشابه login.vue */
.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f3f4f6;
  border-radius: 10px;
  margin-bottom: 25px;
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

.otp-info {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #e0f2fe;
  border-radius: 10px;
  margin-bottom: 25px;
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

.resend-btn {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-weight: 500;
  text-decoration: underline;
}

.success-message {
  text-align: center;
  padding: 40px 20px;
}

.success-icon svg {
  color: #10b981;
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

.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
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

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-footer {
  margin-top: 30px;
  text-align: center;
  color: #6b7280;
  font-size: 0.95rem;
}

.signin-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
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

.decoration-content {
  position: relative;
  z-index: 1;
  color: white;
  text-align: center;
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

@media (max-width: 900px) {
  .side-decoration {
    display: none;
  }
  .auth-card {
    min-width: unset;
    padding: 40px 30px;
  }
}
</style>
