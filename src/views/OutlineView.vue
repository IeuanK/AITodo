<template>
  <div class="view-container">
    <div class="view-header">
      <div class="view-title-section">
        <h2 class="view-title">📋 Outline</h2>
        <span class="task-count">{{ tasks.length }} tasks</span>
      </div>
      <div class="view-actions">
        <button @click="expandAll" class="btn-secondary" title="Expand all">
          ⊞
        </button>
        <button @click="collapseAll" class="btn-secondary" title="Collapse all">
          ⊟
        </button>
        <button @click="addRootTask" class="btn-primary">+ New Task</button>
      </div>
    </div>

    <div class="view-content">
      <div v-if="loading" class="loading-message">Loading tasks...</div>
      <div v-else-if="error" class="error-message">{{ error }}</div>
      <div v-else-if="tasks.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>No tasks yet</h3>
        <p>Click "New Task" to create your first task</p>
      </div>
      <div v-else class="task-tree">
        <TaskTreeItem
          v-for="task in rootTasks"
          :key="task.id"
          :task="task"
          :indent-level="0"
          :selected-task-id="selectedTaskId"
          @select="handleSelectTask"
          @toggle-complete="handleToggleComplete"
          @update="handleUpdateTask"
          @delete="handleDeleteTask"
          @add-child="handleAddChild"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useTasksStore } from '../stores/tasks';
import TaskTreeItem from '../components/TaskTreeItem.vue';

const tasksStore = useTasksStore();

const loading = computed(() => tasksStore.loading);
const error = computed(() => tasksStore.error);
const tasks = computed(() => tasksStore.tasks);
const rootTasks = computed(() => tasksStore.rootTasks);
const selectedTaskId = computed(() => tasksStore.selectedTaskId);

const addRootTask = async () => {
  const newTask = await tasksStore.createTask({
    title: 'New Task',
    isInInbox: false,
    color: null,
  });
  // Auto-select and start editing the new task
  tasksStore.selectTask(newTask.id);
};

const handleSelectTask = (taskId) => {
  tasksStore.selectTask(taskId);
};

const handleToggleComplete = async (taskId) => {
  await tasksStore.toggleComplete(taskId);
};

const handleUpdateTask = async ({ id, updates }) => {
  await tasksStore.updateTask(id, updates);
};

const handleDeleteTask = async ({ id, deleteChildren }) => {
  await tasksStore.deleteTask(id, deleteChildren);
};

const handleAddChild = async (parentId) => {
  const newTask = await tasksStore.createTask({
    title: 'New Child Task',
    parentId,
    isInInbox: false,
    color: null,
  });
  // Auto-select the new child task
  tasksStore.selectTask(newTask.id);
};

const expandAll = () => {
  // This would require state management in TaskTreeItem
  // For now, this is a placeholder
  console.log('Expand all - to be implemented');
};

const collapseAll = () => {
  // This would require state management in TaskTreeItem
  // For now, this is a placeholder
  console.log('Collapse all - to be implemented');
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
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  background: #fafafa;
}

.view-title-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.view-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.task-count {
  font-size: 12px;
  color: #999;
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 10px;
}

.view-actions {
  display: flex;
  gap: 6px;
}

.btn-primary,
.btn-secondary {
  padding: 6px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
  color: #333;

  &:hover {
    background: #f5f5f5;
    border-color: #999;
  }
}

.btn-primary {
  background: #4a90e2;
  color: white;
  border-color: #4a90e2;

  &:hover {
    background: #357abd;
    border-color: #357abd;
  }
}

.btn-secondary {
  min-width: 32px;
  padding: 6px 8px;
  font-size: 16px;
  line-height: 1;
}

.view-content {
  flex: 1;
  overflow-y: auto;
  background: #fff;
}

.loading-message,
.error-message {
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 14px;
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

.task-tree {
  padding: 8px 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
}
</style>
