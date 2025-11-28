import { IStorageAdapter } from './IStorageAdapter';

/**
 * LocalStorage Adapter
 *
 * Implements data persistence using browser localStorage.
 * All data is stored as JSON strings and parsed on retrieval.
 *
 * Storage keys:
 * - mlo_tasks: Array of all tasks
 * - mlo_contexts: Array of all contexts
 * - mlo_settings: User settings object
 * - mlo_views: Array of view configurations
 */
export class LocalStorageAdapter extends IStorageAdapter {
  constructor() {
    super();
    this.keys = {
      tasks: 'mlo_tasks',
      contexts: 'mlo_contexts',
      settings: 'mlo_settings',
      views: 'mlo_views',
    };
  }

  /**
   * Initialize the storage adapter
   */
  async init() {
    // LocalStorage is always available in browser, no initialization needed
    // We could check for quota here if needed
    return Promise.resolve();
  }

  /**
   * Helper method to get data from localStorage
   */
  _getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  }

  /**
   * Helper method to set data in localStorage
   */
  _setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
      // Handle quota exceeded errors
      if (error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Please delete some data.');
      }
      throw error;
    }
  }

  /**
   * Get all tasks
   */
  async getTasks() {
    return this._getItem(this.keys.tasks, []);
  }

  /**
   * Save all tasks
   */
  async saveTasks(tasks) {
    this._setItem(this.keys.tasks, tasks);
  }

  /**
   * Get a single task by ID
   */
  async getTask(id) {
    const tasks = await this.getTasks();
    return tasks.find(task => task.id === id) || null;
  }

  /**
   * Create a new task
   */
  async createTask(task) {
    const tasks = await this.getTasks();
    tasks.push(task);
    await this.saveTasks(tasks);
    return task;
  }

  /**
   * Update an existing task
   */
  async updateTask(id, updates) {
    const tasks = await this.getTasks();
    const index = tasks.findIndex(task => task.id === id);

    if (index === -1) {
      throw new Error(`Task with id "${id}" not found`);
    }

    tasks[index] = {
      ...tasks[index],
      ...updates,
      id, // Ensure ID cannot be changed
      modifiedAt: new Date().toISOString(),
    };

    await this.saveTasks(tasks);
    return tasks[index];
  }

  /**
   * Delete a task
   */
  async deleteTask(id) {
    const tasks = await this.getTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);
    await this.saveTasks(filteredTasks);
  }

  /**
   * Get all contexts
   */
  async getContexts() {
    return this._getItem(this.keys.contexts, []);
  }

  /**
   * Save all contexts
   */
  async saveContexts(contexts) {
    this._setItem(this.keys.contexts, contexts);
  }

  /**
   * Get user settings
   */
  async getSettings() {
    return this._getItem(this.keys.settings, {});
  }

  /**
   * Save user settings
   */
  async saveSettings(settings) {
    this._setItem(this.keys.settings, settings);
  }

  /**
   * Get all view configurations
   */
  async getViews() {
    return this._getItem(this.keys.views, []);
  }

  /**
   * Save all view configurations
   */
  async saveViews(views) {
    this._setItem(this.keys.views, views);
  }

  /**
   * Clear all data
   */
  async clearAll() {
    Object.values(this.keys).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  /**
   * Export all data
   */
  async exportData() {
    return {
      version: '1.0',
      exportDate: new Date().toISOString(),
      tasks: await this.getTasks(),
      contexts: await this.getContexts(),
      settings: await this.getSettings(),
      views: await this.getViews(),
    };
  }

  /**
   * Import data
   */
  async importData(data) {
    // Validate data structure
    if (!data.version || !data.tasks) {
      throw new Error('Invalid import data format');
    }

    // Import each data type
    if (data.tasks) await this.saveTasks(data.tasks);
    if (data.contexts) await this.saveContexts(data.contexts);
    if (data.settings) await this.saveSettings(data.settings);
    if (data.views) await this.saveViews(data.views);
  }
}
