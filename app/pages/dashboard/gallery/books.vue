<template>
  <div class="books-gallery-container">
    <!-- Header -->
    <header class="gallery-header">
      <div class="header-content">
        <h1 class="gallery-title">گالری تصاویر کتاب‌ها</h1>
        <p class="gallery-subtitle">بررسی و تایید تصاویر در انتظار</p>
      </div>
      <div class="stats-info">
        <span class="pending-count">{{ pendingImages.length }} تصویر در انتظار بررسی</span>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loader"></div>
      <p>در حال بارگذاری تصاویر...</p>
    </div>

    <!-- Images Grid -->
    <div v-else-if="pendingImages.length > 0" class="images-grid">
      <div v-for="image in pendingImages" :key="image.id" class="image-card">
        <div class="image-wrapper">
          <img 
            :src="`http://127.0.0.1:8000/${image.image_path}`" 
            :alt="image.alt_text || 'تصویر کتاب'"
            @error="handleImageError"
          />
        </div>
        <div class="image-info">
          <p class="book-id">کتاب شماره: {{ image.book_id }}</p>
          <p class="upload-date">{{ formatDate(image.created_at) }}</p>
        </div>
        <div class="action-buttons">
          <button 
            @click="reviewImage(image.id, 'approved')" 
            class="btn btn-approve"
            :disabled="processingIds.includes(image.id)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            تایید
          </button>
          <button 
            @click="reviewImage(image.id, 'rejected')" 
            class="btn btn-reject"
            :disabled="processingIds.includes(image.id)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            رد
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </svg>
      <h3>تصویری برای بررسی وجود ندارد</h3>
      <p>همه تصاویر بررسی شده‌اند</p>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// State
const pendingImages = ref([])
const loading = ref(true)
const processingIds = ref([])
const message = ref('')
const messageType = ref('success')

// Fetch pending images
const fetchPendingImages = async () => {
  try {
    loading.value = true
    const token = localStorage.getItem('token')
    
    const response = await fetch('http://127.0.0.1:8000/api/book-images?status=pending', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('خطا در دریافت تصاویر')
    }

    const data = await response.json()
    pendingImages.value = data.data || []
  } catch (error) {
    console.error('Error fetching images:', error)
    showMessage('خطا در بارگذاری تصاویر', 'error')
  } finally {
    loading.value = false
  }
}

// Review image (approve/reject)
const reviewImage = async (imageId, status) => {
  try {
    processingIds.value.push(imageId)
    const token = localStorage.getItem('token')
    
    const response = await fetch(`http://127.0.0.1:8000/api/book-images/${imageId}/review`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        status: status,
        rejection_reason: status === 'rejected' ? 'تصویر مناسب نیست' : null
      })
    })

    if (!response.ok) {
      throw new Error('خطا در بررسی تصویر')
    }

    // Remove image from list
    pendingImages.value = pendingImages.value.filter(img => img.id !== imageId)
    
    const statusText = status === 'approved' ? 'تایید' : 'رد'
    showMessage(`تصویر با موفقیت ${statusText} شد`, 'success')
  } catch (error) {
    console.error('Error reviewing image:', error)
    showMessage('خطا در بررسی تصویر', 'error')
  } finally {
    processingIds.value = processingIds.value.filter(id => id !== imageId)
  }
}

// Show message
const showMessage = (text, type = 'success') => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR').format(date)
}

// Handle image load error
const handleImageError = (event) => {
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTEwQzE3NSA5Ni4xOTI5IDE4Ni4xOTMgODUgMjAwIDg1QzIxMy44MDcgODUgMjI1IDk2LjE5MjkgMjI1IDExMEMyMjUgMTIzLjgwNyAyMTMuODA3IDEzNSAyMDAgMTM1QzE4Ni4xOTMgMTM1IDE3NSAxMjMuODA3IDE3NSAxMTBaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIvPgo8cGF0aCBkPSJNMTIwIDE5MEgxMjBDMTIwIDE3Ni4xOTMgMTMxLjE5MyAxNjUgMTQ1IDE2NUgyNTVDMjY4LjgwNyAxNjUgMjgwIDE3Ni4xOTMgMjgwIDE5MFYxOTBIMTIwWiIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+'
}

// Mount
onMounted(() => {
  fetchPendingImages()
})
</script>

<style scoped>
.books-gallery-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

/* Header */
.gallery-header {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.header-content {
  margin-bottom: 1rem;
}

.gallery-title {
  font-size: 2rem;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
  font-weight: bold;
}

.gallery-subtitle {
  color: #6b7280;
  margin: 0;
}

.stats-info {
  display: flex;
  gap: 2rem;
}

.pending-count {
  background: #fef3c7;
  color: #92400e;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
}

/* Loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: white;
  border-radius: 16px;
  gap: 1rem;
}

.loader {
  width: 48px;
  height: 48px;
  border: 4px solid #f3f4f6;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Images Grid */
.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.image-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.image-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.image-wrapper {
  width: 100%;
  height: 250px;
  overflow: hidden;
  background: #f3f4f6;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-info {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.book-id {
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.upload-date {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
}

.btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
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
}

.btn-reject {
  background: #ef4444;
  color: white;
}

.btn-reject:hover:not(:disabled) {
  background: #dc2626;
}

/* Empty State */
.empty-state {
  background: white;
  border-radius: 16px;
  padding: 4rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-state svg {
  color: #9ca3af;
}

.empty-state h3 {
  color: #374151;
  margin: 0;
  font-size: 1.5rem;
}

.empty-state p {
  color: #6b7280;
  margin: 0;
}

/* Messages */
.message {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  animation: slideIn 0.3s;
  z-index: 1000;
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

/* Responsive */
@media (max-width: 768px) {
  .books-gallery-container {
    padding: 1rem;
  }

  .gallery-header {
    padding: 1.5rem;
  }

  .gallery-title {
    font-size: 1.5rem;
  }

  .images-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }

  .message {
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
  }
}
</style>