<template>
  <div class="view-container">
    <div class="view-header">
      <h2 class="view-title">Review</h2>
      <p class="view-description">Tasks that need periodic review</p>
    </div>

    <div class="view-content">
      <div v-if="reviewTasks.length === 0" class="empty-state">
        <div class="empty-icon">👁️</div>
        <h3>Nothing to review</h3>
        <p>All tasks have been reviewed recently</p>
      </div>
      <div v-else class="task-list">
        <div v-for="task in reviewTasks" :key="task.id" class="task-item">
          <span class="task-title">{{ task.title }}</span>
          <span class="task-meta">Review period: {{ task.reviewPeriod }} days</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTasksStore } from '../stores/tasks';

const tasksStore = useTasksStore();
const reviewTasks = computed(() => tasksStore.reviewTasks);
</script>

<style scoped lang="scss">
@import './view-styles.scss';
</style>
