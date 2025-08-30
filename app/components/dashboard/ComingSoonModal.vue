<!-- components/dashboard/ComingSoonModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click="$emit('update:modelValue', false)">
        <div class="modal-content" @click.stop>
          <div class="modal-icon">⏰</div>
          <h3>به زودی...</h3>
          <p>این قابلیت در حال توسعه است و به زودی در دسترس قرار خواهد گرفت.</p>
          <button @click="$emit('update:modelValue', false)" class="btn btn-primary">
            متوجه شدم
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: var(--shadow-xl);
}

.modal-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.modal-content h3 {
  color: var(--dark);
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.modal-content p {
  color: var(--gray);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.modal-enter-active, .modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
