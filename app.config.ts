export default defineAppConfig({
  ui: {
    primary: 'blue',
    gray: 'zinc',
    button: {
      color: {
        gray: {
          solid: 'bg-gray-500 dark:bg-gray-400 text-white dark:text-gray-900',
          ghost: 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800',
          outline: 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
        },
        white: {
          solid: 'bg-white text-gray-900',
          ghost: 'text-white hover:bg-white/10',
          outline: 'border-white text-white hover:bg-white/10'
        },
        green: {
          solid: 'bg-green-500 dark:bg-green-400 text-white dark:text-gray-900',
          subtle: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
        },
        blue: {
          solid: 'bg-blue-500 dark:bg-blue-400 text-white dark:text-gray-900',
          subtle: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
        },
        red: {
          solid: 'bg-red-500 dark:bg-red-400 text-white dark:text-gray-900',
          subtle: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
          link: 'text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300'
        },
        purple: {
          solid: 'bg-purple-500 dark:bg-purple-400 text-white dark:text-gray-900',
          subtle: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
        }
      }
    },
    badge: {
      color: {
        gray: {
          subtle: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
        },
        green: {
          subtle: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
        },
        blue: {
          subtle: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
        },
        red: {
          subtle: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
        },
        purple: {
          subtle: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
        }
      }
    },
    alert: {
      color: {
        red: {
          subtle: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'
        }
      }
    }
  }
})