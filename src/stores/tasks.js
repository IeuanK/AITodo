import { defineStore } from 'pinia';
import { getStorageAdapter } from '../services/storageFactory';

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    selectedTaskId: null,
    loading: false,
    error: null,
    storage: null,
  }),

  getters: {
    /**
     * Get all root-level tasks (tasks without a parent)
     */
    rootTasks: (state) => {
      return state.tasks.filter(task => !task.parentId);
    },

    /**
     * Get task by ID
     */
    getTaskById: (state) => {
      return (id) => state.tasks.find(task => task.id === id);
    },

    /**
     * Get children of a specific task
     */
    getChildTasks: (state) => {
      return (parentId) => {
        return state.tasks
          .filter(task => task.parentId === parentId)
          .sort((a, b) => a.order - b.order);
      };
    },

    /**
     * Get the currently selected task
     */
    selectedTask: (state) => {
      if (!state.selectedTaskId) return null;
      return state.tasks.find(task => task.id === state.selectedTaskId);
    },

    /**
     * Get all active tasks (not completed, start date has passed, no blocking dependencies)
     */
    activeTasks: (state) => {
      const now = new Date();
      return state.tasks.filter(task => {
        // Must not be completed
        if (task.isCompleted) return false;

        // Must have started (or no start date)
        if (task.startDate) {
          const startDate = new Date(task.startDate);
          if (startDate > now) return false;
        }

        // TODO: Check dependencies when implemented
        return true;
      });
    },

    /**
     * Get tasks in inbox (tasks without a parent and not processed)
     */
    inboxTasks: (state) => {
      return state.tasks.filter(task =>
        !task.parentId && task.isInInbox === true
      );
    },

    /**
     * Get overdue tasks
     */
    overdueTasks: (state) => {
      const now = new Date();
      return state.tasks.filter(task => {
        if (task.isCompleted || !task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate < now;
      });
    },

    /**
     * Get tasks marked as goals
     */
    goalTasks: (state) => {
      return state.tasks.filter(task => task.goalType !== null);
    },

    /**
     * Get tasks that need review
     */
    reviewTasks: (state) => {
      const now = new Date();
      return state.tasks.filter(task => {
        if (!task.reviewPeriod) return false;
        if (!task.lastReviewed) return true;

        const lastReviewDate = new Date(task.lastReviewed);
        const daysSinceReview = Math.floor((now - lastReviewDate) / (1000 * 60 * 60 * 24));
        return daysSinceReview >= task.reviewPeriod;
      });
    },
  },

  actions: {
    /**
     * Initialize the store and load tasks from storage
     */
    async init() {
      try {
        this.storage = getStorageAdapter();
        await this.storage.init();
        await this.loadTasks();
      } catch (error) {
        console.error('Failed to initialize tasks store:', error);
        this.error = error.message;
      }
    },

    /**
     * Load all tasks from storage
     */
    async loadTasks() {
      this.loading = true;
      this.error = null;

      try {
        this.tasks = await this.storage.getTasks();
      } catch (error) {
        console.error('Failed to load tasks:', error);
        this.error = error.message;
        this.tasks = [];
      } finally {
        this.loading = false;
      }
    },

    /**
     * Create a new task
     */
    async createTask(taskData) {
      try {
        const newTask = {
          id: this.generateId(),
          title: taskData.title || 'New Task',
          notes: taskData.notes || '',

          // Hierarchy
          parentId: taskData.parentId || null,
          childIds: [],
          order: taskData.order ?? this.getNextOrder(taskData.parentId),

          // Task Type
          type: taskData.type || 'task',

          // Priority
          importance: taskData.importance ?? 100,
          urgency: taskData.urgency ?? 100,
          computedScore: 0,

          // Dates
          startDate: taskData.startDate || null,
          startTime: taskData.startTime || null,
          dueDate: taskData.dueDate || null,
          dueTime: taskData.dueTime || null,
          completedDate: null,

          // Status
          isCompleted: false,
          isActive: false,
          projectProgress: 0,

          // Organization
          contexts: taskData.contexts || [],
          tags: taskData.tags || [],
          flags: taskData.flags || [],
          isStarred: taskData.isStarred || false,
          isInInbox: taskData.isInInbox || false,
          color: taskData.color || null,

          // Goals & Review
          goalType: taskData.goalType || null,
          reviewPeriod: taskData.reviewPeriod || null,
          lastReviewed: null,

          // Recurrence
          recurrence: taskData.recurrence || null,

          // Dependencies
          dependsOn: taskData.dependsOn || [],

          // Metadata
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString(),
        };

        await this.storage.createTask(newTask);
        this.tasks.push(newTask);

        // Update parent's childIds if this task has a parent
        if (newTask.parentId) {
          await this.updateParentChildIds(newTask.parentId, newTask.id, 'add');
        }

        return newTask;
      } catch (error) {
        console.error('Failed to create task:', error);
        this.error = error.message;
        throw error;
      }
    },

    /**
     * Update an existing task
     */
    async updateTask(id, updates) {
      try {
        const updatedTask = await this.storage.updateTask(id, {
          ...updates,
          modifiedAt: new Date().toISOString(),
        });

        const index = this.tasks.findIndex(t => t.id === id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }

        return updatedTask;
      } catch (error) {
        console.error('Failed to update task:', error);
        this.error = error.message;
        throw error;
      }
    },

    /**
     * Delete a task and optionally its children
     */
    async deleteTask(id, deleteChildren = false) {
      try {
        const task = this.getTaskById(id);
        if (!task) return;

        // Delete children if requested
        if (deleteChildren && task.childIds.length > 0) {
          for (const childId of task.childIds) {
            await this.deleteTask(childId, true);
          }
        }

        // Remove from parent's childIds
        if (task.parentId) {
          await this.updateParentChildIds(task.parentId, id, 'remove');
        }

        // Delete from storage
        await this.storage.deleteTask(id);

        // Remove from local state
        this.tasks = this.tasks.filter(t => t.id !== id);

        // Clear selection if this was the selected task
        if (this.selectedTaskId === id) {
          this.selectedTaskId = null;
        }
      } catch (error) {
        console.error('Failed to delete task:', error);
        this.error = error.message;
        throw error;
      }
    },

    /**
     * Toggle task completion status
     */
    async toggleComplete(id) {
      const task = this.getTaskById(id);
      if (!task) return;

      const isCompleted = !task.isCompleted;
      const updates = {
        isCompleted,
        completedDate: isCompleted ? new Date().toISOString() : null,
      };

      await this.updateTask(id, updates);
    },

    /**
     * Select a task
     */
    selectTask(id) {
      this.selectedTaskId = id;
    },

    /**
     * Clear task selection
     */
    clearSelection() {
      this.selectedTaskId = null;
    },

    /**
     * Update parent's childIds array
     */
    async updateParentChildIds(parentId, childId, action) {
      const parent = this.getTaskById(parentId);
      if (!parent) return;

      let childIds = [...parent.childIds];

      if (action === 'add' && !childIds.includes(childId)) {
        childIds.push(childId);
      } else if (action === 'remove') {
        childIds = childIds.filter(id => id !== childId);
      }

      await this.updateTask(parentId, { childIds });
    },

    /**
     * Get the next order number for a given parent
     */
    getNextOrder(parentId) {
      const siblings = this.tasks.filter(t => t.parentId === parentId);
      if (siblings.length === 0) return 0;
      return Math.max(...siblings.map(t => t.order)) + 1;
    },

    /**
     * Generate a unique ID
     */
    generateId() {
      return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Export all tasks
     */
    async exportTasks() {
      try {
        return await this.storage.exportData();
      } catch (error) {
        console.error('Failed to export tasks:', error);
        this.error = error.message;
        throw error;
      }
    },

    /**
     * Import tasks
     */
    async importTasks(data) {
      try {
        await this.storage.importData(data);
        await this.loadTasks();
      } catch (error) {
        console.error('Failed to import tasks:', error);
        this.error = error.message;
        throw error;
      }
    },

    /**
     * Clear all tasks (for testing/reset)
     */
    async clearAll() {
      try {
        await this.storage.clearAll();
        this.tasks = [];
        this.selectedTaskId = null;
      } catch (error) {
        console.error('Failed to clear tasks:', error);
        this.error = error.message;
        throw error;
      }
    },
  },
});
