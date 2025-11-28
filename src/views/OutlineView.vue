<template>
  <div class="view-container">
    <div class="view-header">
      <h2 class="view-title">Outline</h2>
      <div class="view-actions">
        <button @click="addTask" class="btn-primary">+ Add Task</button>
      </div>
    </div>

    <div class="view-content">
      <div v-if="loading" class="loading-message">Loading tasks...</div>
      <div v-else-if="error" class="error-message">{{ error }}</div>
      <div v-else-if="tasks.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>No tasks yet</h3>
        <p>Click "Add Task" to create your first task</p>
      </div>
      <div v-else class="task-list">
        <div
          v-for="task in rootTasks"
          :key="task.id"
          class="task-item"
          :class="{ completed: task.isCompleted }"
        >
          <input
            type="checkbox"
            :checked="task.isCompleted"
            @change="toggleComplete(task.id)"
            class="task-checkbox"
          />
          <span class="task-title">{{ task.title }}</span>
          <span v-if="task.dueDate" class="task-due-date">
            {{ formatDate(task.dueDate) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTasksStore } from '../stores/tasks';

const tasksStore = useTasksStore();

const loading = computed(() => tasksStore.loading);
const error = computed(() => tasksStore.error);
const tasks = computed(() => tasksStore.tasks);
const rootTasks = computed(() => tasksStore.rootTasks);

const addTask = async () => {
  await tasksStore.createTask({
    title: 'New Task',
    isInInbox: false,
  });
};

const toggleComplete = async (taskId) => {
  await tasksStore.toggleComplete(taskId);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};
</script>

<style scoped lang="scss">
.view-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.view-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.view-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.view-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-primary {
  padding: 0.6rem 1.2rem;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #357abd;
  }
}

.view-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.loading-message,
.error-message {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.error-message {
  color: #d0021b;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #999;

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
    color: #666;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
  }
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: #f0f0f0;
    border-color: #d0d0d0;
  }

  &.completed {
    opacity: 0.6;

    .task-title {
      text-decoration: line-through;
    }
  }
}

.task-checkbox {
  cursor: pointer;
}

.task-title {
  flex: 1;
  font-size: 0.95rem;
  color: #333;
}

.task-due-date {
  font-size: 0.85rem;
  color: #666;
}
</style>
