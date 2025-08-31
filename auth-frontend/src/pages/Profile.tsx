import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const profileSchema = yup.object({
  name: yup.string().required('نام الزامی است'),
  email: yup.string().email('ایمیل نامعتبر است').nullable(),
  phone: yup.string().nullable(),
});

const passwordSchema = yup.object({
  current_password: yup.string().when('hasPassword', {
    is: true,
    then: (schema) => schema.required('رمز عبور فعلی الزامی است'),
  }),
  password: yup
    .string()
    .required('رمز عبور جدید الزامی است')
    .min(8, 'رمز عبور باید حداقل 8 کاراکتر باشد')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'رمز عبور باید شامل حروف بزرگ، کوچک، عدد و کاراکتر خاص باشد'
    ),
  password_confirmation: yup
    .string()
    .required('تکرار رمز عبور الزامی است')
    .oneOf([yup.ref('password')], 'رمز عبور و تکرار آن باید یکسان باشند'),
});

const Profile: React.FC = () => {
  const { user, updateProfile, setPassword, updatePassword } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const profileForm = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  const passwordForm = useForm({
    resolver: yupResolver(passwordSchema),
    context: { hasPassword: user?.preferred_method === 'password' },
  });

  const handleProfileUpdate = async (data: any) => {
    try {
      await updateProfile(data);
      toast.success('پروفایل با موفقیت به‌روزرسانی شد');
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const handlePasswordUpdate = async (data: any) => {
    try {
      if (user?.preferred_method === 'password') {
        await updatePassword(data.current_password, data.password, data.password_confirmation);
      } else {
        await setPassword(data.password, data.password_confirmation);
      }
      passwordForm.reset();
      toast.success('رمز عبور با موفقیت به‌روزرسانی شد');
    } catch (error) {
      console.error('Password update error:', error);
    }
  };

  const tabs = [
    { name: 'اطلاعات شخصی', value: 'profile' },
    { name: 'امنیت', value: 'security' },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">پروفایل کاربری</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              مدیریت اطلاعات شخصی و تنظیمات امنیتی
            </p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value as 'profile' | 'security')}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      activeTab === tab.value
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="px-4 py-5 sm:p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    نام و نام خانوادگی
                  </label>
                  <div className="mt-1">
                    <input
                      {...profileForm.register('name')}
                      type="text"
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                    {profileForm.formState.errors.name && (
                      <p className="mt-2 text-sm text-red-600">
                        {profileForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    ایمیل
                  </label>
                  <div className="mt-1">
                    <input
                      {...profileForm.register('email')}
                      type="email"
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      dir="ltr"
                    />
                    {profileForm.formState.errors.email && (
                      <p className="mt-2 text-sm text-red-600">
                        {profileForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    شماره موبایل
                  </label>
                  <div className="mt-1">
                    <input
                      {...profileForm.register('phone')}
                      type="tel"
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      dir="ltr"
                      placeholder="09123456789"
                    />
                    {profileForm.formState.errors.phone && (
                      <p className="mt-2 text-sm text-red-600">
                        {profileForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={profileForm.formState.isSubmitting}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {profileForm.formState.isSubmitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                  </button>
                </div>
              </form>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-yellow-50 border-r-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="mr-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        {user?.preferred_method === 'password'
                          ? 'تغییر رمز عبور'
                          : 'تنظیم رمز عبور'}
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        {user?.preferred_method === 'password' ? (
                          <p>برای تغییر رمز عبور، ابتدا رمز عبور فعلی خود را وارد کنید.</p>
                        ) : (
                          <p>
                            شما در حال حاضر از کد یکبار مصرف استفاده می‌کنید. می‌توانید یک رمز عبور
                            برای حساب خود تنظیم کنید.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={passwordForm.handleSubmit(handlePasswordUpdate)}
                  className="space-y-6"
                >
                  {user?.preferred_method === 'password' && (
                    <div>
                      <label
                        htmlFor="current_password"
                        className="block text-sm font-medium text-gray-700"
                      >
                        رمز عبور فعلی
                      </label>
                      <div className="mt-1 relative">
                        <input
                          {...passwordForm.register('current_password')}
                          type={showCurrentPassword ? 'text' : 'password'}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md pl-10"
                          dir="ltr"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute inset-y-0 left-0 pl-3 flex items-center"
                        >
                          {showCurrentPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {passwordForm.formState.errors.current_password && (
                        <p className="mt-2 text-sm text-red-600">
                          {passwordForm.formState.errors.current_password.message}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      رمز عبور جدید
                    </label>
                    <div className="mt-1 relative">
                      <input
                        {...passwordForm.register('password')}
                        type={showNewPassword ? 'text' : 'password'}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md pl-10"
                        dir="ltr"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 left-0 pl-3 flex items-center"
                      >
                        {showNewPassword ? (
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

                  <div>
                    <label
                      htmlFor="password_confirmation"
                      className="block text-sm font-medium text-gray-700"
                    >
                      تکرار رمز عبور جدید
                    </label>
                    <div className="mt-1 relative">
                      <input
                        {...passwordForm.register('password_confirmation')}
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md pl-10"
                        dir="ltr"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 left-0 pl-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {passwordForm.formState.errors.password_confirmation && (
                      <p className="mt-2 text-sm text-red-600">
                        {passwordForm.formState.errors.password_confirmation.message}
                      </p>
                    )}
                  </div>

                  <div className="bg-blue-50 border-r-4 border-blue-400 p-4">
                    <div className="flex">
                      <div className="mr-3">
                        <h3 className="text-sm font-medium text-blue-800">نکات امنیتی</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <ul className="list-disc list-inside space-y-1">
                            <li>رمز عبور باید حداقل 8 کاراکتر باشد</li>
                            <li>از ترکیب حروف بزرگ و کوچک استفاده کنید</li>
                            <li>حداقل یک عدد و یک کاراکتر خاص اضافه کنید</li>
                            <li>از رمز عبور قبلی خود استفاده نکنید</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={passwordForm.formState.isSubmitting}
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {passwordForm.formState.isSubmitting
                        ? 'در حال ذخیره...'
                        : user?.preferred_method === 'password'
                        ? 'تغییر رمز عبور'
                        : 'تنظیم رمز عبور'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;