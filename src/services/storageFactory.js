import { LocalStorageAdapter } from './LocalStorageAdapter';
import { ApiStorageAdapter } from './ApiStorageAdapter';

/**
 * Storage Factory
 *
 * Creates and returns the appropriate storage adapter based on configuration.
 *
 * Usage:
 * - Set VITE_STORAGE_TYPE in .env file to 'localStorage' or 'api'
 * - Default is 'localStorage'
 *
 * Example .env:
 * VITE_STORAGE_TYPE=localStorage
 * # or for API:
 * VITE_STORAGE_TYPE=api
 * VITE_API_BASE_URL=https://api.example.com
 */

let storageInstance = null;

/**
 * Get the storage adapter instance (singleton)
 *
 * @param {Object} config - Optional configuration object
 * @param {string} config.type - 'localStorage' or 'api'
 * @param {string} config.apiBaseUrl - Base URL for API (if type is 'api')
 * @param {string} config.apiToken - Authentication token (if type is 'api')
 * @returns {IStorageAdapter}
 */
export function getStorageAdapter(config = {}) {
  // Return existing instance if already created
  if (storageInstance) {
    return storageInstance;
  }

  // Determine storage type from config or environment
  const storageType = config.type || import.meta.env.VITE_STORAGE_TYPE || 'localStorage';

  // Create the appropriate adapter
  switch (storageType) {
    case 'api':
      console.log('📡 Using API Storage Adapter');
      storageInstance = new ApiStorageAdapter({
        baseUrl: config.apiBaseUrl || import.meta.env.VITE_API_BASE_URL,
        token: config.apiToken || import.meta.env.VITE_API_TOKEN,
      });
      break;

    case 'localStorage':
    default:
      console.log('💾 Using LocalStorage Adapter');
      storageInstance = new LocalStorageAdapter();
      break;
  }

  return storageInstance;
}

/**
 * Reset the storage adapter instance
 * Useful for testing or switching adapters at runtime
 */
export function resetStorageAdapter() {
  storageInstance = null;
}

/**
 * Check if API storage is available
 * @returns {boolean}
 */
export function isApiStorageAvailable() {
  return !!import.meta.env.VITE_API_BASE_URL;
}

/**
 * Get current storage type
 * @returns {string}
 */
export function getStorageType() {
  return import.meta.env.VITE_STORAGE_TYPE || 'localStorage';
}
