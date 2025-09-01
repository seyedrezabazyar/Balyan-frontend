<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <!-- Company Info -->
        <div class="footer-section">
          <div class="footer-logo">
            <div class="logo-icon">⚡</div>
            <span>سیستم مدیریت</span>
          </div>
          <p class="footer-description">
            سیستم مدیریت پیشرفته با قابلیت‌های احراز هویت امن و مدیریت کاربران
          </p>
        </div>

        <!-- Quick Links -->
        <div class="footer-section">
          <h3>لینک‌های سریع</h3>
          <ul class="footer-links">
            <li><NuxtLink to="/">صفحه اصلی</NuxtLink></li>
            <li v-if="isLoggedIn"><NuxtLink to="/dashboard">داشبورد</NuxtLink></li>
            <li v-if="!isLoggedIn"><NuxtLink to="/auth">ورود</NuxtLink></li>
          </ul>
        </div>

        <!-- Features -->
        <div class="footer-section">
          <h3>ویژگی‌ها</h3>
          <ul class="footer-links">
            <li>احراز هویت امن</li>
            <li>مدیریت کاربران</li>
            <li>داشبورد تحلیلی</li>
            <li>پشتیبانی ۲۴/۷</li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="footer-section">
          <h3>تماس با ما</h3>
          <ul class="footer-links">
            <li class="contact-item">
              <MailIcon />
              <span>support@example.com</span>
            </li>
            <li class="contact-item">
              <PhoneIcon />
              <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
            </li>
            <li class="contact-item">
              <MapPinIcon />
              <span>تهران، ایران</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p>&copy; {{ currentYear }} تمامی حقوق محفوظ است.</p>
          <div class="footer-bottom-links">
            <a href="#" class="footer-bottom-link">حریم خصوصی</a>
            <a href="#" class="footer-bottom-link">شرایط استفاده</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { h } from 'vue'

const { isLoggedIn } = useAuth()

const currentYear = new Date().getFullYear()

// Icon components
const MailIcon = {
  render() {
    return h('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' }),
      h('polyline', { points: '22 6 12 13 2 6' })
    ])
  }
}

const PhoneIcon = {
  render() {
    return h('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' })
    ])
  }
}

const MapPinIcon = {
  render() {
    return h('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' }),
      h('circle', { cx: '12', cy: '10', r: '3' })
    ])
  }
}
</script>

<style scoped>
.footer {
  background: var(--dark);
  color: #d1d5db;
  margin-top: auto;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 3rem 1rem 2rem;
}

.footer-section h3 {
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  font-size: 1.2rem;
  color: white;
  margin-bottom: 1rem;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--primary), #764ba2);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: white;
}

.footer-description {
  line-height: 1.6;
  color: #9ca3af;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.75rem;
}

.footer-links a {
  color: #d1d5db;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: var(--primary);
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #d1d5db;
}

.contact-item svg {
  color: var(--primary);
}

.footer-bottom {
  border-top: 1px solid #374151;
  padding: 1.5rem 1rem;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-bottom-links {
  display: flex;
  gap: 2rem;
}

.footer-bottom-link {
  color: #9ca3af;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.footer-bottom-link:hover {
  color: var(--primary);
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 2rem 1rem 1.5rem;
  }

  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
  }

  .footer-bottom-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .footer-bottom-links {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
