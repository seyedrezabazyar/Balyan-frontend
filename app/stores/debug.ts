import { defineStore } from 'pinia'

interface DebugRequestLog {
  timestamp: string;
  url: string;
  headers: any;
}

export const useDebugStore = defineStore('debug', {
  state: () => ({
    requests: [] as DebugRequestLog[],
  }),
  actions: {
    addRequestLog(url: string, headers: any) {
      this.requests.push({
        timestamp: new Date().toISOString(),
        url,
        headers: JSON.parse(JSON.stringify(headers)), // Deep copy to avoid reactivity issues
      })
    },
    clearLogs() {
      this.requests = []
    },
  },
})
