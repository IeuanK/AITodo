<template>
  <div class="view-container">
    <div class="view-header">
      <h2 class="view-title">Active Actions</h2>
      <p class="view-description">Tasks ready to be worked on right now</p>
    </div>

    <div class="view-content">
      <div v-if="activeTasks.length === 0" class="empty-state">
        <div class="empty-icon">⚡</div>
        <h3>No active actions</h3>
        <p>All tasks are either completed or blocked</p>
      </div>
      <div v-else class="task-list">
        <div v-for="task in activeTasks" :key="task.id" class="task-item">
          <input type="checkbox" @change="toggleComplete(task.id)" class="task-checkbox" />
          <span class="task-title">{{ task.title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTasksStore } from '../stores/tasks';

const tasksStore = useTasksStore();
const activeTasks = computed(() => tasksStore.activeTasks);

const toggleComplete = async (taskId) => {
  await tasksStore.toggleComplete(taskId);
};
</script>

<style scoped lang="scss">
@import './view-styles.scss';
</style>
