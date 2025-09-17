<template>
  <div class="api-debugger">
    <button class="toggler" @click="toggleVisibility">
      {{ isVisible ? 'Hide' : 'Show' }} API Debugger
    </button>

    <div v-if="isVisible" class="debugger-content">
      <div class="controls">
        <button @click="clearLogs">Clear Logs</button>
      </div>

      <div v-if="apiLogs.length === 0" class="empty-state">
        No API requests logged yet.
      </div>

      <div v-for="log in apiLogs" :key="log.id" class="log-entry" :class="getLogClass(log)">
        <div class="log-header">
          <span class="method">{{ log.method }}</span>
          <span class="url">{{ log.url }}</span>
          <span class="status" :class="getStatusClass(log.status)">{{ log.status }}</span>
          <span class="duration">{{ log.duration }}ms</span>
        </div>
        <div class="log-details">
          <details>
            <summary>Request</summary>
            <pre>{{ log.request }}</pre>
          </details>
          <details>
            <summary>Response</summary>
            <pre>{{ log.response }}</pre>
          </details>
          <details v-if="log.error">
            <summary>Error</summary>
            <pre>{{ log.error }}</pre>
          </details>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useApiDebugger } from '~/composables/useApiDebugger'

const { apiLogs, clearLogs } = useApiDebugger()
const isVisible = ref(true)

const toggleVisibility = () => {
  isVisible.value = !isVisible.value
}

const getLogClass = (log) => {
  if (log.error || (log.status && log.status >= 400)) {
    return 'error'
  }
  return 'success'
}

const getStatusClass = (status) => {
  if (status >= 500) return 'status-error'
  if (status >= 400) return 'status-warn'
  if (status >= 300) return 'status-redirect'
  return 'status-success'
}
</script>

<style scoped>
.api-debugger {
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 9999;
}

.toggler {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.debugger-content {
  width: 80vw;
  max-width: 900px;
  height: 60vh;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  padding: 15px;
  margin-top: 10px;
}

.controls {
  margin-bottom: 10px;
}

.controls button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}

.empty-state {
  text-align: center;
  color: #6c757d;
  padding: 20px;
}

.log-entry {
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
  padding: 10px;
}

.log-entry.success {
  border-left: 5px solid #28a745;
}

.log-entry.error {
  border-left: 5px solid #dc3545;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: monospace;
}

.method {
  font-weight: bold;
  color: #007bff;
}

.status-success { color: #28a745; }
.status-warn { color: #ffc107; }
.status-error { color: #dc3545; }
.status-redirect { color: #17a2b8; }

.log-details {
  margin-top: 10px;
}

.log-details pre {
  background-color: #e9ecef;
  padding: 10px;
  border-radius: 4px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
