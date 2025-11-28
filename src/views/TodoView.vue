<template>
  <div class="view-container">
    <div class="view-header">
      <h2 class="view-title">To-Do</h2>
      <p class="view-description">Active tasks sorted by priority</p>
    </div>

    <div class="view-content">
      <div v-if="activeTasks.length === 0" class="empty-state">
        <div class="empty-icon">✓</div>
        <h3>All caught up!</h3>
        <p>No active tasks at the moment</p>
      </div>
      <div v-else class="task-list">
        <div
          v-for="task in activeTasks"
          :key="task.id"
          class="task-item"
        >
          <input
            type="checkbox"
            @change="toggleComplete(task.id)"
            class="task-checkbox"
          />
          <span class="task-title">{{ task.title }}</span>
          <span class="task-priority">Priority: {{ task.importance }}</span>
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
