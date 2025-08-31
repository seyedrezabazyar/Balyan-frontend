import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { CheckUserResponse } from '../types/auth.types';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const checkUserSchema = yup.object({
  identifier: yup.string().required('ایمیل یا شماره موبایل الزامی است'),
});

const passwordSchema = yup.object({
  password: yup.string().required('رمز عبور الزامی است'),
});

const otpSchema = yup.object({
  otp: yup.string().required('کد تایید الزامی است').length(6, 'کد تایید باید 6 رقم باشد'),
  name: yup.string().when('requiresName', {
    is: true,
    then: (schema) => schema.required('نام الزامی است'),
  }),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { checkUser, sendOTP, verifyOTP, loginWithPassword } = useAuth();
  const [step, setStep] = useState<'check' | 'password' | 'otp'>('check');
  const [identifier, setIdentifier] = useState('');
  const [userStatus, setUserStatus] = useState<CheckUserResponse | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const checkForm = useForm({
    resolver: yupResolver(checkUserSchema),
  });

  const passwordForm = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const otpForm = useForm({
    resolver: yupResolver(otpSchema),
  });

  // Countdown timer for OTP resend
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleCheckUser = async (data: { identifier: string }) => {
    try {
      const response = await checkUser(data.identifier);
      setIdentifier(data.identifier);
      setUserStatus(response);

      if (response.status === 'existing_user_with_password') {
        setStep('password');
      } else {
        // New user or OTP-only user
        await handleSendOTP();
        setStep('otp');
      }
    } catch (error) {
      console.error('Check user error:', error);
    }
  };

  const handleSendOTP = async () => {
    try {
      await sendOTP(identifier);
      setOtpSent(true);
      setCountdown(60); // 60 seconds countdown
      toast.success('کد تایید ارسال شد');
    } catch (error) {
      console.error('Send OTP error:', error);
    }
  };

  const handlePasswordLogin = async (data: { password: string }) => {
    try {
      await loginWithPassword(identifier, data.password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Password login error:', error);
    }
  };

  const handleOTPVerification = async (data: { otp: string; name?: string }) => {
    try {
      await verifyOTP(identifier, data.otp, data.name);
      navigate('/dashboard');
    } catch (error) {
      console.error('OTP verification error:', error);
    }
  };

  const handleUseOTP = async () => {
    await handleSendOTP();
    setStep('otp');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ورود به حساب کاربری
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            برای ورود ایمیل یا شماره موبایل خود را وارد کنید
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          {/* Step 1: Check User */}
          {step === 'check' && (
            <form onSubmit={checkForm.handleSubmit(handleCheckUser)} className="space-y-6">
              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                  ایمیل یا شماره موبایل
                </label>
                <div className="mt-1">
                  <input
                    {...checkForm.register('identifier')}
                    type="text"
                    autoComplete="username"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="example@email.com یا 09123456789"
                    dir="ltr"
                  />
                  {checkForm.formState.errors.identifier && (
                    <p className="mt-2 text-sm text-red-600">
                      {checkForm.formState.errors.identifier.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={checkForm.formState.isSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {checkForm.formState.isSubmitting ? 'در حال بررسی...' : 'ادامه'}
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Password Login */}
          {step === 'password' && userStatus && (
            <form onSubmit={passwordForm.handleSubmit(handlePasswordLogin)} className="space-y-6">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">سلام {userStatus.user_name}</p>
                <p className="text-xs text-gray-500 mt-1">{identifier}</p>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  رمز عبور
                </label>
                <div className="mt-1 relative">
                  <input
                    {...passwordForm.register('password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm pl-10"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 left-0 pl-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {passwordForm.formState.errors.password && (
                  <p className="mt-2 text-sm text-red-600">
                    {passwordForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('check')}
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  تغییر حساب
                </button>
                <button
                  type="button"
                  onClick={handleUseOTP}
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  ورود با کد یکبار مصرف
                </button>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={passwordForm.formState.isSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {passwordForm.formState.isSubmitting ? 'در حال ورود...' : 'ورود'}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: OTP Verification */}
          {step === 'otp' && userStatus && (
            <form onSubmit={otpForm.handleSubmit(handleOTPVerification)} className="space-y-6">
              <div className="text-center mb-4">
                {userStatus.status === 'new_user' ? (
                  <p className="text-sm text-gray-600">ثبت نام کاربر جدید</p>
                ) : (
                  <p className="text-sm text-gray-600">سلام {userStatus.user_name}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">{identifier}</p>
                {otpSent && (
                  <p className="text-sm text-green-600 mt-2">
                    کد تایید به {identifier.includes('@') ? 'ایمیل' : 'شماره موبایل'} شما ارسال شد
                  </p>
                )}
              </div>

              {userStatus.requires_name && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    نام و نام خانوادگی
                  </label>
                  <div className="mt-1">
                    <input
                      {...otpForm.register('name')}
                      type="text"
                      autoComplete="name"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="نام و نام خانوادگی"
                    />
                    {otpForm.formState.errors.name && (
                      <p className="mt-2 text-sm text-red-600">
                        {otpForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  کد تایید 6 رقمی
                </label>
                <div className="mt-1">
                  <input
                    {...otpForm.register('otp')}
                    type="text"
                    autoComplete="one-time-code"
                    maxLength={6}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-center text-2xl tracking-widest"
                    placeholder="123456"
                    dir="ltr"
                  />
                  {otpForm.formState.errors.otp && (
                    <p className="mt-2 text-sm text-red-600">
                      {otpForm.formState.errors.otp.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('check')}
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  تغییر حساب
                </button>
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={countdown > 0}
                  className="text-sm text-primary-600 hover:text-primary-500 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {countdown > 0 ? `ارسال مجدد (${countdown})` : 'ارسال مجدد کد'}
                </button>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={otpForm.formState.isSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {otpForm.formState.isSubmitting ? 'در حال تایید...' : 'تایید و ورود'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  در محیط توسعه از کد 123456 استفاده کنید
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;