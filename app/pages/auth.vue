<!-- pages/auth.vue -->
<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <div class="logo">⚡</div>
        <h1>{{ title }}</h1>
        <p>{{ subtitle }}</p>
      </div>

      <!-- Step 1: Identifier -->
      <div v-if="step === 1" class="auth-step">
        <div class="form-group">
          <label>ایمیل یا شماره تلفن</label>
          <input
            v-model="identifier"
            placeholder="example@email.com یا 09123456789"
            :disabled="isLoading"
            @keyup.enter="handleStep1"
          />
        </div>

        <div v-if="showNameInput" class="form-group">
          <label>نام کامل</label>
          <input
            v-model="name"
            placeholder="نام و نام خانوادگی"
            :disabled="isLoading"
            @keyup.enter="handleStep1"
          />
        </div>

        <div v-if="message" :class="['message', messageType]">{{ message }}</div>

        <button
          @click="handleStep1"
          :disabled="isLoading || !identifier.trim() || (showNameInput && !name.trim())"
          class="btn btn-primary"
        >
          {{ isLoading ? 'در حال بررسی...' : 'ادامه' }}
        </button>
      </div>

      <!-- Step 2: Password -->
      <div v-if="step === 2" class="auth-step">
        <div class="user-info">
          <span>{{ userInfo.identifier }}</span>
          <button @click="goBack" class="back-btn">تغییر</button>
        </div>

        <div v-if="userInfo.user_name" class="welcome">
          خوش آمدید، {{ userInfo.user_name }}! 👋
        </div>

        <div class="form-group">
          <label>رمز عبور</label>
          <div class="password-input">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="رمز عبور خود را وارد کنید"
              :disabled="isLoading"
              @keyup.enter="handlePasswordLogin"
            />
            <button type="button" @click="showPassword = !showPassword" class="toggle-password">
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
        </div>

        <div v-if="message" :class="['message', messageType]">{{ message }}</div>

        <div class="btn-group">
          <button
            @click="handlePasswordLogin"
            :disabled="isLoading || !password.trim()"
            class="btn btn-primary"
          >
            {{ isLoading ? 'در حال ورود...' : 'ورود' }}
          </button>

          <button @click="switchToOTP" :disabled="isLoading" class="btn btn-secondary">
            ورود با کد
          </button>
        </div>
      </div>

      <!-- Step 3: OTP -->
      <div v-if="step === 3" class="auth-step">
        <div class="user-info">
          <span>{{ userInfo.identifier }}</span>
          <button @click="goBack" class="back-btn">تغییر</button>
        </div>

        <div class="otp-info">
          📱 کد تایید 6 رقمی به {{ identifier.includes('@') ? 'ایمیل' : 'شماره تلفن' }} شما ارسال شد
        </div>

        <div class="form-group">
          <label>کد تایید</label>
          <input
            v-model="otpCode"
            placeholder="123456"
            maxlength="6"
            class="otp-input"
            :disabled="isLoading"
            @input="handleOTPInput"
            @keyup.enter="handleOTPVerify"
          />
        </div>

        <div v-if="otpTimer > 0" class="timer">
          ⏱️ ارسال مجدد تا {{ otpTimer }} ثانیه
        </div>

        <div v-else class="resend">
          <span>کد را دریافت نکردید؟</span>
          <button @click="handleResendOTP" :disabled="isLoading" class="resend-btn">
            ارسال مجدد
          </button>
        </div>

        <div v-if="message" :class="['message', messageType]">{{ message }}</div>

        <button
          @click="handleOTPVerify"
          :disabled="isLoading || otpCode.length !== 6"
          class="btn btn-primary"
        >
          {{ isLoading ? (isRegistration ? 'در حال ثبت نام...' : 'در حال ورود...') : (isRegistration ? 'ثبت نام' : 'ورود') }}
        </button>
      </div>

      <!-- Step 4: Success -->
      <div v-if="step === 4" class="auth-step success-step">
        <div class="success-icon">✅</div>
        <h2>{{ isRegistration ? 'ثبت نام موفق!' : 'ورود موفق!' }}</h2>
        <p>{{ isRegistration ? 'حساب شما ایجاد شد' : 'به حساب خود خوش آمدید' }}</p>
        <button @click="goToDashboard" class="btn btn-primary">ورود به داشبورد</button>
      </div>

      <div class="footer-link">
        <NuxtLink to="/">← بازگشت به خانه</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'guest', layout: false });

const { checkUser, loginWithPassword, sendOTP, verifyOTP, isLoading } = useAuth();

// State
const step = ref(1);
const identifier = ref('');
const name = ref('');
const password = ref('');
const otpCode = ref('');
const showPassword = ref(false);
const message = ref('');
const messageType = ref('success');
const otpTimer = ref(0);
const userInfo = ref({});
const isRegistration = ref(false);

let timerInterval = null;

// Computed
const showNameInput = computed(() => userInfo.value.status === 'new_user');

const title = computed(() => {
  const titles = { 1: 'احراز هویت', 2: 'ورود', 3: isRegistration.value ? 'ثبت نام' : 'تایید', 4: 'موفق!' };
  return titles[step.value] || 'احراز هویت';
});

const subtitle = computed(() => {
  const subtitles = {
    1: showNameInput.value ? 'برای ثبت نام اطلاعات را وارد کنید' : 'ایمیل یا شماره تلفن خود را وارد کنید',
    2: 'رمز عبور خود را وارد کنید',
    3: 'کد تایید ارسال شده را وارد کنید',
    4: 'شما با موفقیت وارد شدید'
  };
  return subtitles[step.value] || '';
});

// Methods
const clearMessage = () => { message.value = ''; };
const showMessage = (text, type = 'error') => { message.value = text; messageType.value = type; };

const goBack = () => {
  step.value = 1;
  clearMessage();
  password.value = '';
  otpCode.value = '';
};

const goToDashboard = () => navigateTo('/dashboard');

const startTimer = (seconds = 120) => {
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

// Step handlers
const handleStep1 = async () => {
  clearMessage();
  if (!identifier.value.trim()) return showMessage('لطفاً ایمیل یا تلفن را وارد کنید');

  const result = await checkUser(identifier.value);
  if (!result.success) return showMessage(result.message);

  userInfo.value = result;

  if (result.status === 'existing_user_with_password') {
    step.value = 2;
  } else {
    isRegistration.value = result.status === 'new_user';
    if (isRegistration.value && !name.value.trim()) {
      return showMessage('لطفاً نام خود را وارد کنید');
    }
    await sendOTPAndProceed();
  }
};

const handlePasswordLogin = async () => {
  clearMessage();
  if (!password.value.trim()) return showMessage('رمز عبور را وارد کنید');

  const result = await loginWithPassword(identifier.value, password.value);
  if (result.success) {
    step.value = 4;
    setTimeout(goToDashboard, 2000);
  } else {
    showMessage(result.message);
  }
};

const switchToOTP = async () => {
  clearMessage();
  isRegistration.value = false;
  await sendOTPAndProceed();
};

const sendOTPAndProceed = async () => {
  const result = await sendOTP(identifier.value);
  if (result.success) {
    step.value = 3;
    startTimer();
    showMessage('کد تایید ارسال شد!', 'success');
    setTimeout(clearMessage, 3000);
  } else {
    showMessage(result.message);
  }
};

const handleOTPInput = (event) => {
  event.target.value = event.target.value.replace(/[^0-9]/g, '');
  otpCode.value = event.target.value;
};

const handleOTPVerify = async () => {
  clearMessage();
  if (otpCode.value.length !== 6) return showMessage('کد 6 رقمی وارد کنید');

  const userName = isRegistration.value ? name.value : undefined;
  const result = await verifyOTP(identifier.value, otpCode.value, userName);

  if (result.success) {
    step.value = 4;
    setTimeout(goToDashboard, 2000);
  } else {
    showMessage(result.message);
  }
};

const handleResendOTP = () => sendOTPAndProceed();

onBeforeUnmount(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  direction: rtl;
}

.auth-container {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  margin: 0 auto 1rem;
}

.auth-header h1 {
  margin: 0 0 0.5rem;
  color: #1a1a1a;
}

.auth-header p {
  margin: 0;
  color: #6b7280;
}

.auth-step {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  background: #f9fafb;
  transition: all 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
}

.otp-input {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 0.5rem;
}

.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.back-btn {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  transition: background 0.3s;
}

.back-btn:hover { background: #e0e7ff; }

.welcome {
  background: #d1fae5;
  color: #065f46;
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
  margin-bottom: 1rem;
}

.otp-info {
  background: #e0f2fe;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.timer {
  text-align: center;
  background: #fef3c7;
  color: #92400e;
  padding: 0.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.resend {
  text-align: center;
  margin-bottom: 1rem;
}

.resend-btn {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-weight: 500;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background 0.3s;
}

.resend-btn:hover { background: #e0e7ff; }

.message {
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.message.success {
  background: #d1fae5;
  color: #065f46;
}

.message.error {
  background: #fee2e2;
  color: #dc2626;
}

.btn {
  width: 100%;
  padding: 0.875rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover:not(:disabled) {
  background: #e5e7eb;
}

.btn-group {
  display: flex;
  gap: 0.5rem;
}

.btn-group .btn {
  width: auto;
  flex: 1;
}

.success-step {
  text-align: center;
  padding: 2rem 0;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.success-step h2 {
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.success-step p {
  color: #6b7280;
  margin-bottom: 2rem;
}

.footer-link {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.footer-link a {
  color: #6b7280;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-link a:hover {
  color: #374151;
}

@media (max-width: 480px) {
  .auth-page { padding: 1rem; }
  .auth-container { padding: 1.5rem; }
  .btn-group { flex-direction: column; }
}
</style>
