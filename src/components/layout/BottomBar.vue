<template>
  <footer class="bottom-bar">
    <div class="bottom-bar-left">
      <span class="status-text">{{ statusText }}</span>
    </div>

    <div class="bottom-bar-center">
      <div class="quick-stats">
        <span class="stat-item">
          <span class="stat-icon">📝</span>
          Total: {{ totalTasks }}
        </span>
        <span class="stat-item">
          <span class="stat-icon">✓</span>
          Completed: {{ completedTasks }}
        </span>
        <span class="stat-item">
          <span class="stat-icon">⚡</span>
          Active: {{ activeTasks }}
        </span>
        <span class="stat-item" :class="{ warning: overdueTasks > 0 }">
          <span class="stat-icon">⚠️</span>
          Overdue: {{ overdueTasks }}
        </span>
      </div>
    </div>

    <div class="bottom-bar-right">
      <span class="storage-indicator" :title="storageInfo">
        {{ storageType === 'localStorage' ? '💾 Local' : '☁️ API' }}
      </span>
      <span class="version">v{{ version }}</span>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';
import { useTasksStore } from '../../stores/tasks';
import { getStorageType } from '../../services/storageFactory';

const tasksStore = useTasksStore();

const version = import.meta.env.VITE_APP_VERSION || '1.0.0';
const storageType = getStorageType();

const totalTasks = computed(() => tasksStore.tasks.length);
const completedTasks = computed(() =>
  tasksStore.tasks.filter(t => t.isCompleted).length
);
const activeTasks = computed(() => tasksStore.activeTasks.length);
const overdueTasks = computed(() => tasksStore.overdueTasks.length);

const statusText = computed(() => {
  if (tasksStore.loading) return 'Loading...';
  if (tasksStore.error) return `Error: ${tasksStore.error}`;
  return 'Ready';
});

const storageInfo = computed(() => {
  return storageType === 'localStorage'
    ? 'Data stored locally in your browser'
    : 'Data synced with API backend';
});
</script>

<style scoped lang="scss">
.bottom-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1.5rem;
  background: #ffffff;
  border-top: 1px solid #e0e0e0;
  font-size: 0.85rem;
  color: #666;
  gap: 1rem;
}

.bottom-bar-left {
  flex: 0 0 auto;
}

.status-text {
  font-weight: 500;
}

.bottom-bar-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.quick-stats {
  display: flex;
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;

  &.warning {
    color: #d0021b;
    font-weight: 500;
  }
}

.stat-icon {
  font-size: 1rem;
}

.bottom-bar-right {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.storage-indicator {
  padding: 0.25rem 0.5rem;
  background: #f0f0f0;
  border-radius: 3px;
  font-size: 0.8rem;
  cursor: help;
}

.version {
  color: #999;
  font-size: 0.75rem;
}
</style>
