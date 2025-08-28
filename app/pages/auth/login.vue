<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>ورود به حساب</h1>

      <!-- Step 1: Email/Phone Input -->
      <div v-if="step === 1">
        <div class="form-group">
          <label>ایمیل یا شماره تلفن</label>
          <input
            v-model="identifier"
            type="text"
            placeholder="example@email.com یا 09123456789"
            :disabled="isLoading"
          />
        </div>

        <div v-if="errorMessage" class="error">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="success">
          {{ successMessage }}
        </div>

        <button
          @click="handleIdentifierSubmit"
          :disabled="isLoading || !identifier.trim()"
          class="btn"
        >
          <span v-if="!isLoading">ادامه</span>
          <span v-else>در حال بررسی...</span>
        </button>
      </div>

      <!-- Step 2: Password Input -->
      <div v-if="step === 2">
        <div class="user-info">
          <p>ورود برای: <strong>{{ identifier }}</strong></p>
          <button @click="goBack" class="back-btn">تغییر</button>
        </div>

        <div class="form-group">
          <label>رمز عبور</label>
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="رمز عبور خود را وارد کنید"
            :disabled="isLoading"
          />
          <button type="button" @click="showPassword = !showPassword" class="toggle-password">
            {{ showPassword ? 'مخفی' : 'نمایش' }}
          </button>
        </div>

        <div v-if="errorMessage" class="error">
          {{ errorMessage }}
        </div>

        <div class="action-buttons">
          <button
            @click="handlePasswordLogin"
            :disabled="isLoading || !password.trim()"
            class="btn btn-primary"
          >
            <span v-if="!isLoading">ورود</span>
            <span v-else>در حال ورود...</span>
          </button>

          <button @click="handleOTPLogin" :disabled="isLoading" class="btn btn-secondary">
            ورود با کد
          </button>
        </div>
      </div>

      <!-- Step 3: OTP Input -->
      <div v-if="step === 3">
        <div class="user-info">
          <p>کد تایید برای: <strong>{{ identifier }}</strong></p>
          <button @click="goBack" class="back-btn">تغییر</button>
        </div>

        <div class="otp-info">
          <p>کد تایید 6 رقمی برای شما ارسال شد</p>
        </div>

        <div class="form-group">
          <label>کد تایید</label>
          <input
            v-model="otpCode"
            type="text"
            placeholder="123456"
            maxlength="6"
            :disabled="isLoading"
            @input="handleOTPInput"
          />
        </div>

        <div v-if="otpTimer > 0" class="timer">
          ارسال مجدد کد تا {{ otpTimer }} ثانیه دیگر
        </div>

        <div v-else class="resend">
          <p>کد را دریافت نکردید؟</p>
          <button @click="handleResendOTP" :disabled="isLoading" class="resend-btn">
            ارسال مجدد
          </button>
        </div>

        <div v-if="errorMessage" class="error">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="success">
          {{ successMessage }}
        </div>

        <button
          @click="handleOTPVerify"
          :disabled="isLoading || otpCode.length !== 6"
          class="btn"
        >
          <span v-if="!isLoading">تایید کد</span>
          <span v-else>در حال تایید...</span>
        </button>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>حساب کاربری ندارید؟ <NuxtLink to="/auth/register">ثبت نام کنید</NuxtLink></p>
        <NuxtLink to="/">بازگشت به صفحه اصلی</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const { checkUser, loginWithPassword, sendOTP, verifyOTP, resendOTP, isLoading } = useAuth();

definePageMeta({
  middleware: 'guest',
  layout: false
});

const step = ref(1);
const identifier = ref('');
const password = ref('');
const otpCode = ref('');
const showPassword = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const hasPassword = ref(false);
const otpTimer = ref(0);
let timerInterval = null;

const clearMessages = () => {
  errorMessage.value = '';
  successMessage.value = '';
};

const goBack = () => {
  step.value = 1;
  clearMessages();
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
  clearMessages();

  if (!identifier.value.trim()) {
    errorMessage.value = 'لطفاً ایمیل یا شماره تلفن خود را وارد کنید';
    return;
  }

  console.log('Checking user existence...');

  const result = await checkUser(identifier.value);

  console.log('Check user result:', result);

  if (result.success || result.data) {
    hasPassword.value = result.data?.has_password || false;
    step.value = hasPassword.value ? 2 : 3;

    if (!hasPassword.value) {
      await handleSendOTP();
    }
  } else {
    errorMessage.value = result.message || 'خطا در بررسی حساب کاربری';
  }
};

const handlePasswordLogin = async () => {
  clearMessages();

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
  clearMessages();
  step.value = 3;
  await handleSendOTP();
};

const handleSendOTP = async () => {
  console.log('Sending OTP for login...');

  const result = await sendOTP(identifier.value, 'login');

  console.log('Send OTP result:', result);

  if (result.success || result.message === 'OTP sent successfully' || result.message?.includes('OTP sent')) {
    successMessage.value = 'کد تایید با موفقیت ارسال شد!';
    startOTPTimer();

    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
  } else {
    errorMessage.value = result.message || 'خطا در ارسال کد تایید';
  }
};

const handleOTPInput = (event) => {
  const target = event.target;
  target.value = target.value.replace(/[^0-9]/g, '');
  otpCode.value = target.value;
};

const handleOTPVerify = async () => {
  clearMessages();

  if (otpCode.value.length !== 6) {
    errorMessage.value = 'لطفاً کد تایید 6 رقمی را وارد کنید';
    return;
  }

  console.log('Verifying OTP for login...');

  const result = await verifyOTP(identifier.value, otpCode.value, 'login');

  console.log('Verify OTP result:', result);

  if (result.success) {
    await navigateTo('/dashboard');
  } else {
    errorMessage.value = result.message || 'کد تایید اشتباه است';
  }
};

const handleResendOTP = async () => {
  clearMessages();

  console.log('Resending OTP for login...');

  const result = await resendOTP(identifier.value, 'login');

  console.log('Resend OTP result:', result);

  if (result.success || result.message === 'OTP sent successfully' || result.message?.includes('OTP sent')) {
    successMessage.value = 'کد تایید مجدداً ارسال شد!';
    startOTPTimer();
    otpCode.value = '';

    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
  } else {
    errorMessage.value = result.message || 'خطا در ارسال مجدد کد';
  }
};

onBeforeUnmount(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  direction: rtl;
}

.auth-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #1a1a1a;
  font-size: 2rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #374151;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  background: #f9fafb;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
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

.back-btn {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 5px;
}

.toggle-password {
  position: absolute;
  left: 15px;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 0.8rem;
}

.otp-info {
  padding: 15px;
  background: #e0f2fe;
  border-radius: 10px;
  margin-bottom: 25px;
  text-align: center;
}

.timer {
  text-align: center;
  padding: 10px;
  background: #fef3c7;
  color: #92400e;
  border-radius: 8px;
  margin-bottom: 20px;
}

.resend {
  text-align: center;
  margin-bottom: 20px;
}

.resend-btn {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  text-decoration: underline;
}

.error {
  background: #fee2e2;
  color: #dc2626;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
}

.success {
  background: #d1fae5;
  color: #065f46;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
}

.btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 10px;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.action-buttons .btn {
  width: auto;
  flex: 1;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.footer {
  text-align: center;
  margin-top: 30px;
  color: #6b7280;
}

.footer a {
  color: #667eea;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}
</style>
