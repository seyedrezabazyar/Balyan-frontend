<!-- components/dashboard/StatsGrid.vue -->
<template>
  <div class="stats-grid">
    <div
      v-for="(stat, index) in stats"
      :key="index"
      class="stat-card"
      :class="[`stat-${stat.color}`]"
    >
      <div class="stat-icon" :class="[`icon-${stat.color}`]">
        {{ stat.icon }}
      </div>

      <div class="stat-content">
        <h3 class="stat-title">{{ stat.title }}</h3>
        <p class="stat-value">{{ stat.value }}</p>
        <p class="stat-change" :class="[`change-${stat.changeType}`]">
          {{ stat.changeType === 'positive' ? '↗' : stat.changeType === 'negative' ? '↘' : '→' }}
          {{ stat.change }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
interface Stat {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: string
  color: 'primary' | 'success' | 'warning' | 'info'
}

interface Props {
  stats: Stat[]
}

defineProps<Props>()
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: var(--shadow);
  transition: var(--transition);
  border-left: 4px solid transparent;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.stat-card.stat-primary { border-left-color: var(--primary); }
.stat-card.stat-success { border-left-color: var(--success); }
.stat-card.stat-warning { border-left-color: var(--warning); }
.stat-card.stat-info { border-left-color: var(--info); }

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  flex-shrink: 0;
}

.icon-primary { background: linear-gradient(135deg, var(--primary), var(--primary-dark)); }
.icon-success { background: linear-gradient(135deg, var(--success), #059669); }
.icon-warning { background: linear-gradient(135deg, var(--warning), #d97706); }
.icon-info { background: linear-gradient(135deg, var(--info), #2563eb); }

.stat-content {
  flex: 1;
}

.stat-title {
  font-size: 0.875rem;
  color: var(--gray);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--dark);
  margin-bottom: 0.25rem;
}

.stat-change {
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
}

.change-positive { color: var(--success); }
.change-negative { color: var(--danger); }
.change-neutral { color: var(--gray); }

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .stat-card {
    padding: 1.25rem;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    font-size: 1.5rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }
}
</style>
