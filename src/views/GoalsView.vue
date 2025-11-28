<template>
  <div class="view-container">
    <div class="view-header">
      <h2 class="view-title">Goals</h2>
      <p class="view-description">Track your weekly, monthly, and yearly goals</p>
    </div>

    <div class="view-content">
      <div v-if="goalTasks.length === 0" class="empty-state">
        <div class="empty-icon">🎯</div>
        <h3>No goals set</h3>
        <p>Mark tasks as goals to track them here</p>
      </div>
      <div v-else class="task-list">
        <div v-for="task in goalTasks" :key="task.id" class="task-item">
          <input type="checkbox" @change="toggleComplete(task.id)" class="task-checkbox" />
          <span class="task-title">{{ task.title }}</span>
          <span class="task-meta">{{ task.goalType }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTasksStore } from '../stores/tasks';

const tasksStore = useTasksStore();
const goalTasks = computed(() => tasksStore.goalTasks);

const toggleComplete = async (taskId) => {
  await tasksStore.toggleComplete(taskId);
};
</script>

<style scoped lang="scss">
@import './view-styles.scss';
</style>
