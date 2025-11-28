import { IStorageAdapter } from './IStorageAdapter';

/**
 * API Storage Adapter
 *
 * Implements data persistence using a backend API.
 * This is a stub implementation to be completed when the backend is ready.
 *
 * Configuration:
 * - Set API_BASE_URL in environment variables or config
 * - Implement authentication if needed
 * - Handle API errors and retries
 */
export class ApiStorageAdapter extends IStorageAdapter {
  constructor(config = {}) {
    super();
    this.baseUrl = config.baseUrl || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
    this.token = config.token || null;
  }

  /**
   * Initialize the storage adapter
   * This might include authentication, checking API availability, etc.
   */
  async init() {
    // TODO: Implement API initialization
    // - Check if API is reachable
    // - Authenticate if needed
    // - Load initial data or sync state
    console.log('API Storage Adapter initialized with base URL:', this.baseUrl);
  }

  /**
   * Helper method to make API requests
   */
  async _request(method, endpoint, data = null) {
    const url = `${this.baseUrl}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Add authentication token if available
    if (this.token) {
      options.headers['Authorization'] = `Bearer ${this.token}`;
    }

    // Add request body for POST/PUT/PATCH
    if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return null;
    } catch (error) {
      console.error(`API request error (${method} ${endpoint}):`, error);
      throw error;
    }
  }

  /**
   * Get all tasks
   */
  async getTasks() {
    return await this._request('GET', '/tasks');
  }

  /**
   * Save all tasks
   * Note: For API, we might want to batch update or sync only changes
   */
  async saveTasks(tasks) {
    return await this._request('PUT', '/tasks', { tasks });
  }

  /**
   * Get a single task by ID
   */
  async getTask(id) {
    return await this._request('GET', `/tasks/${id}`);
  }

  /**
   * Create a new task
   */
  async createTask(task) {
    return await this._request('POST', '/tasks', task);
  }

  /**
   * Update an existing task
   */
  async updateTask(id, updates) {
    return await this._request('PATCH', `/tasks/${id}`, updates);
  }

  /**
   * Delete a task
   */
  async deleteTask(id) {
    return await this._request('DELETE', `/tasks/${id}`);
  }

  /**
   * Get all contexts
   */
  async getContexts() {
    return await this._request('GET', '/contexts');
  }

  /**
   * Save all contexts
   */
  async saveContexts(contexts) {
    return await this._request('PUT', '/contexts', { contexts });
  }

  /**
   * Get user settings
   */
  async getSettings() {
    return await this._request('GET', '/settings');
  }

  /**
   * Save user settings
   */
  async saveSettings(settings) {
    return await this._request('PUT', '/settings', settings);
  }

  /**
   * Get all view configurations
   */
  async getViews() {
    return await this._request('GET', '/views');
  }

  /**
   * Save all view configurations
   */
  async saveViews(views) {
    return await this._request('PUT', '/views', { views });
  }

  /**
   * Clear all data
   */
  async clearAll() {
    return await this._request('DELETE', '/data');
  }

  /**
   * Export all data
   */
  async exportData() {
    return await this._request('GET', '/export');
  }

  /**
   * Import data
   */
  async importData(data) {
    return await this._request('POST', '/import', data);
  }
}
