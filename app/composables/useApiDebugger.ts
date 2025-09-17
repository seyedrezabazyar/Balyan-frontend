// app/composables/useApiDebugger.ts
import { useState } from '#app'

// Define the structure of a single API log entry
export interface ApiLog {
  id: string;
  method: string;
  url:string;
  startTime: number;
  endTime?: number;
  duration?: number;
  request?: any;
  response?: any;
  error?: any;
  status?: number;
  statusText?: string;
}

export const useApiDebugger = () => {
  const apiLogs = useState<ApiLog[]>('api-logs', () => [])

  const addLog = (log: Omit<ApiLog, 'id' | 'startTime' | 'status' | 'statusText' | 'response' | 'error' | 'endTime' | 'duration'>): ApiLog => {
    const newLog: ApiLog = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      startTime: Date.now(),
      status: undefined,
      statusText: undefined,
      response: undefined,
      error: undefined,
      endTime: undefined,
      duration: undefined,
    }
    apiLogs.value.unshift(newLog)
    return newLog
  }

  const updateLog = (id: string, updates: Partial<ApiLog>) => {
    const log = apiLogs.value.find(l => l.id === id)
    if (log) {
      Object.assign(log, updates)
      if (log.startTime && log.endTime) {
        log.duration = log.endTime - log.startTime
      }
    }
  }

  const clearLogs = () => {
    apiLogs.value = []
  }

  return {
    apiLogs,
    addLog,
    updateLog,
    clearLogs,
  }
}
