// UI Component Types

export type UIColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'

export interface TableColumn<T = any, V = any> {
  key: string
  label?: string
  sortable?: boolean
  class?: string
  [key: string]: any
}