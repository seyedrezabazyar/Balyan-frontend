<template>
  <div class="home-container">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          خوش آمدید به
          <span class="gradient-text">پلتفرم مدیریت</span>
        </h1>
        <p class="hero-description">
          راهکار ساده و قدرتمند برای مدیریت کسب و کار شما
        </p>
        <div class="hero-buttons">
          <NuxtLink to="/dashboard" class="btn btn-primary">
            <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            ورود به داشبورد
          </NuxtLink>
          <button class="btn btn-secondary">
            <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="10 8 16 12 10 16 10 8"></polygon>
            </svg>
            مشاهده دمو
          </button>
        </div>
      </div>
      <div class="hero-image">
        <div class="floating-card card-1">
          <div class="card-icon">📊</div>
          <div class="card-text">آمار لحظه‌ای</div>
        </div>
        <div class="floating-card card-2">
          <div class="card-icon">💎</div>
          <div class="card-text">طراحی زیبا</div>
        </div>
        <div class="floating-card card-3">
          <div class="card-icon">⚡</div>
          <div class="card-text">سرعت بالا</div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="features-section">
      <h2 class="section-title">ویژگی‌های کلیدی</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2L2 7L12 12L22 7L12 2Z"></path>
              <path d="M2 17L12 22L22 17"></path>
              <path d="M2 12L12 17L22 12"></path>
            </svg>
          </div>
          <h3>ساده و کاربردی</h3>
          <p>رابط کاربری ساده و آسان برای استفاده همه</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path>
              <path d="M12 6v6l4 2"></path>
            </svg>
          </div>
          <h3>آمار لحظه‌ای</h3>
          <p>دسترسی به آمار و اطلاعات در لحظه</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"></path>
            </svg>
          </div>
          <h3>امنیت بالا</h3>
          <p>حفاظت از اطلاعات با بالاترین استانداردها</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
              <line x1="12" y1="18" x2="12" y2="18"></line>
            </svg>
          </div>
          <h3>ریسپانسیو</h3>
          <p>سازگار با تمام دستگاه‌ها و صفحه نمایش‌ها</p>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="cta-section">
      <h2>آماده شروع هستید؟</h2>
      <p>همین حالا وارد داشبورد شوید و از امکانات استفاده کنید</p>
      <NuxtLink to="/dashboard" class="btn btn-cta">
        شروع کنید
        <svg class="btn-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"></path>
        </svg>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  direction: rtl;
}

/* Hero Section */
.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 80px 5%;
  min-height: 70vh;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: moveGrid 20s linear infinite;
}

@keyframes moveGrid {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

.hero-content {
  flex: 1;
  max-width: 600px;
  z-index: 1;
}

.hero-title {
  font-size: 3.5rem;
  color: white;
  margin-bottom: 20px;
  line-height: 1.2;
  font-weight: 700;
}

.gradient-text {
  background: linear-gradient(45deg, #FFD700, #FFA500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 40px;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 35px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-icon {
  transition: transform 0.3s ease;
}

.btn:hover .btn-icon {
  transform: scale(1.1);
}

.btn-primary {
  background: white;
  color: #667eea;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: white;
}

/* Hero Image */
.hero-image {
  flex: 1;
  position: relative;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-card {
  position: absolute;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 20px 25px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 15px;
  animation: float 3s ease-in-out infinite;
}

.card-1 {
  top: 20%;
  right: 10%;
  animation-delay: 0s;
}

.card-2 {
  top: 50%;
  left: 10%;
  animation-delay: 1s;
}

.card-3 {
  bottom: 20%;
  right: 30%;
  animation-delay: 2s;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.card-icon {
  font-size: 2rem;
}

.card-text {
  font-size: 1.1rem;
  color: #333;
  font-weight: 600;
}

/* Features Section */
.features-section {
  padding: 80px 5%;
  background: white;
  border-radius: 50px 50px 0 0;
  margin-top: -50px;
  position: relative;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 60px;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 2px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: #f8f9fa;
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 20px;
  margin-bottom: 20px;
  color: white;
}

.feature-card h3 {
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 15px;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
  font-size: 1rem;
}

/* CTA Section */
.cta-section {
  padding: 100px 5%;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.cta-section h2 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.cta-section p {
  font-size: 1.2rem;
  margin-bottom: 40px;
  opacity: 0.9;
}

.btn-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: white;
  color: #667eea;
  padding: 18px 40px;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.btn-cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  gap: 15px;
}

.btn-arrow {
  transition: transform 0.3s ease;
}

.btn-cta:hover .btn-arrow {
  transform: translateX(-5px);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    padding: 40px 5%;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-description {
    font-size: 1.1rem;
  }

  .hero-image {
    margin-top: 40px;
    height: 300px;
  }

  .floating-card {
    padding: 15px 20px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 2rem;
  }
}
</style>