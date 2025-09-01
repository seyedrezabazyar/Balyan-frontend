<!-- pages/dashboard/gallery/books.vue -->
<template>
  <div class="gallery">
    <div class="gallery-header">
      <h1>گالری تصاویر کتاب‌ها</h1>
      <p>بررسی و تایید تصاویر</p>
      <div class="stats">
        <span class="pending-count">{{ pendingImages.length }} تصویر در انتظار</span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>در حال بارگذاری...</p>
    </div>

    <!-- Images Grid -->
    <div v-else-if="pendingImages.length" class="images-grid">
      <div v-for="image in pendingImages" :key="image.id" class="image-card">
        <div class="image-wrapper">
          <img
            :src="`http://127.0.0.1:8000/${image.image_path}`"
            :alt="image.alt_text || 'تصویر کتاب'"
            @error="handleImageError"
          />
        </div>

        <div class="image-info">
          <p><strong>کتاب:</strong> #{{ image.book_id }}</p>
          <p><strong>تاریخ:</strong> {{ formatDate(image.created_at) }}</p>
        </div>

        <div class="image-actions">
          <button
            @click="reviewImage(image.id, 'approved')"
            :disabled="processingIds.includes(image.id)"
            class="btn btn-approve"
          >
            ✓ تایید
          </button>
          <button
            @click="reviewImage(image.id, 'rejected')"
            :disabled="processingIds.includes(image.id)"
            class="btn btn-reject"
          >
            ✗ رد
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">🖼️</div>
      <h3>تصویری برای بررسی وجود ندارد</h3>
      <p>همه تصاویر بررسی شده‌اند</p>
    </div>

    <!-- Message -->
    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
const pendingImages = ref([]);
const loading = ref(true);
const processingIds = ref([]);
const message = ref('');
const messageType = ref('success');

const fetchImages = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem('auth_access_token');

    const response = await fetch('http://127.0.0.1:8000/api/book-images?status=pending', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) throw new Error('خطا در دریافت تصاویر');

    const data = await response.json();
    pendingImages.value = data.data || [];
  } catch (error) {
    showMessage('خطا در بارگذاری تصاویر', 'error');
  } finally {
    loading.value = false;
  }
};

const reviewImage = async (imageId, status) => {
  try {
    processingIds.value.push(imageId);
    const token = localStorage.getItem('auth_access_token');

    const response = await fetch(`http://127.0.0.1:8000/api/book-images/${imageId}/review`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        status: status,
        rejection_reason: status === 'rejected' ? 'نامناسب' : null
      })
    });

    if (!response.ok) throw new Error('خطا در بررسی');

    pendingImages.value = pendingImages.value.filter(img => img.id !== imageId);
    showMessage(`تصویر ${status === 'approved' ? 'تایید' : 'رد'} شد`, 'success');
  } catch (error) {
    showMessage('خطا در بررسی تصویر', 'error');
  } finally {
    processingIds.value = processingIds.value.filter(id => id !== imageId);
  }
};

const showMessage = (text, type = 'success') => {
  message.value = text;
  messageType.value = type;
  setTimeout(() => { message.value = ''; }, 3000);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return new Intl.DateTimeFormat('fa-IR').format(new Date(dateString));
  } catch {
    return '';
  }
};

const handleImageError = (event) => {
  event.target.style.display = 'none';
  event.target.parentElement.innerHTML = '<div class="error-placeholder">🖼️<br>خطا در بارگذاری</div>';
};

onMounted(() => fetchImages());
</script>

<style scoped>
.gallery {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.gallery-header {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.gallery-header h1 {
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.gallery-header p {
  color: #6b7280;
  margin: 0 0 1rem 0;
}

.pending-count {
  background: #fef3c7;
  color: #92400e;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background: white;
  border-radius: 16px;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.image-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.image-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.image-wrapper {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f3f4f6;
  position: relative;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.error-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  color: #9ca3af;
  text-align: center;
  font-size: 0.875rem;
}

.image-info {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.image-info p {
  margin: 0 0 0.5rem 0;
  color: #374151;
  font-size: 0.875rem;
}

.image-info p:last-child {
  margin-bottom: 0;
}

.image-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
}

.btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.875rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-approve {
  background: #10b981;
  color: white;
}

.btn-approve:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-1px);
}

.btn-reject {
  background: #ef4444;
  color: white;
}

.btn-reject:hover:not(:disabled) {
  background: #dc2626;
  transform: translateY(-1px);
}

.empty-state {
  background: white;
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  color: #374151;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6b7280;
  margin: 0;
}

.message {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 500;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.message.success {
  background: #10b981;
  color: white;
}

.message.error {
  background: #ef4444;
  color: white;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .gallery { padding: 1rem; }
  .gallery-header { padding: 1.5rem; }
  .images-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }
  .message {
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
  }
}

@media (max-width: 480px) {
  .images-grid {
    grid-template-columns: 1fr;
  }
}
</style>
