/**
 * Storage Adapter Interface
 *
 * This defines the contract that all storage adapters must implement.
 * This abstraction allows us to swap between localStorage, IndexedDB,
 * or a backend API without changing the rest of the application.
 */

export class IStorageAdapter {
  /**
   * Initialize the storage adapter
   * @returns {Promise<void>}
   */
  async init() {
    throw new Error('Method init() must be implemented');
  }

  /**
   * Get all tasks
   * @returns {Promise<Array>}
   */
  async getTasks() {
    throw new Error('Method getTasks() must be implemented');
  }

  /**
   * Save all tasks
   * @param {Array} tasks - Array of task objects
   * @returns {Promise<void>}
   */
  async saveTasks(tasks) {
    throw new Error('Method saveTasks() must be implemented');
  }

  /**
   * Get a single task by ID
   * @param {string} id - Task ID
   * @returns {Promise<Object|null>}
   */
  async getTask(id) {
    throw new Error('Method getTask() must be implemented');
  }

  /**
   * Create a new task
   * @param {Object} task - Task object
   * @returns {Promise<Object>}
   */
  async createTask(task) {
    throw new Error('Method createTask() must be implemented');
  }

  /**
   * Update an existing task
   * @param {string} id - Task ID
   * @param {Object} updates - Partial task object with updates
   * @returns {Promise<Object>}
   */
  async updateTask(id, updates) {
    throw new Error('Method updateTask() must be implemented');
  }

  /**
   * Delete a task
   * @param {string} id - Task ID
   * @returns {Promise<void>}
   */
  async deleteTask(id) {
    throw new Error('Method deleteTask() must be implemented');
  }

  /**
   * Get all contexts
   * @returns {Promise<Array>}
   */
  async getContexts() {
    throw new Error('Method getContexts() must be implemented');
  }

  /**
   * Save all contexts
   * @param {Array} contexts - Array of context objects
   * @returns {Promise<void>}
   */
  async saveContexts(contexts) {
    throw new Error('Method saveContexts() must be implemented');
  }

  /**
   * Get user settings
   * @returns {Promise<Object>}
   */
  async getSettings() {
    throw new Error('Method getSettings() must be implemented');
  }

  /**
   * Save user settings
   * @param {Object} settings - Settings object
   * @returns {Promise<void>}
   */
  async saveSettings(settings) {
    throw new Error('Method saveSettings() must be implemented');
  }

  /**
   * Get all view configurations
   * @returns {Promise<Array>}
   */
  async getViews() {
    throw new Error('Method getViews() must be implemented');
  }

  /**
   * Save all view configurations
   * @param {Array} views - Array of view objects
   * @returns {Promise<void>}
   */
  async saveViews(views) {
    throw new Error('Method saveViews() must be implemented');
  }

  /**
   * Clear all data (for testing/reset)
   * @returns {Promise<void>}
   */
  async clearAll() {
    throw new Error('Method clearAll() must be implemented');
  }

  /**
   * Export all data
   * @returns {Promise<Object>}
   */
  async exportData() {
    throw new Error('Method exportData() must be implemented');
  }

  /**
   * Import data
   * @param {Object} data - Data object to import
   * @returns {Promise<void>}
   */
  async importData(data) {
    throw new Error('Method importData() must be implemented');
  }
}
