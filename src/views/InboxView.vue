<template>
  <div class="view-container">
    <div class="view-header">
      <h2 class="view-title">Inbox</h2>
      <p class="view-description">Quick capture area for new tasks</p>
    </div>

    <div class="view-content">
      <div v-if="inboxTasks.length === 0" class="empty-state">
        <div class="empty-icon">📥</div>
        <h3>Inbox is empty</h3>
        <p>All tasks have been processed</p>
      </div>
      <div v-else class="task-list">
        <div
          v-for="task in inboxTasks"
          :key="task.id"
          class="task-item"
        >
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
const inboxTasks = computed(() => tasksStore.inboxTasks);

const toggleComplete = async (taskId) => {
  await tasksStore.toggleComplete(taskId);
};
</script>

<style scoped lang="scss">
@import './view-styles.scss';
</style>
