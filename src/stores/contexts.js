import { defineStore } from 'pinia';
import { getStorageAdapter } from '../services/storageFactory';

export const useContextsStore = defineStore('contexts', {
  state: () => ({
    contexts: [],
    activeContextIds: [],
    loading: false,
    error: null,
    storage: null,
  }),

  getters: {
    /**
     * Get all root-level contexts (contexts without a parent)
     */
    rootContexts: (state) => {
      return state.contexts.filter(context => !context.parentId);
    },

    /**
     * Get context by ID
     */
    getContextById: (state) => {
      return (id) => state.contexts.find(context => context.id === id);
    },

    /**
     * Get children of a specific context
     */
    getChildContexts: (state) => {
      return (parentId) => {
        return state.contexts.filter(context => context.parentId === parentId);
      };
    },

    /**
     * Get active contexts (only IDs)
     */
    activeContexts: (state) => {
      return state.activeContextIds
        .map(id => state.contexts.find(c => c.id === id))
        .filter(Boolean);
    },

    /**
     * Check if a context is currently active/open
     */
    isContextOpen: (state) => {
      return (contextId) => {
        const context = state.contexts.find(c => c.id === contextId);
        if (!context) return false;

        // If no schedule, context is always open
        if (!context.schedule) return true;

        // Check if current time is within the schedule
        const now = new Date();
        const currentDay = now.getDay();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        // Simple schedule check (can be expanded later)
        // For now, just return true
        return true;
      };
    },

    /**
     * Get all contexts that are currently available
     */
    availableContexts: (state) => {
      return state.contexts.filter(context => {
        return state.isContextOpen(context.id);
      });
    },
  },

  actions: {
    /**
     * Initialize the store and load contexts from storage
     */
    async init() {
      try {
        this.storage = getStorageAdapter();
        await this.storage.init();
        await this.loadContexts();
      } catch (error) {
        console.error('Failed to initialize contexts store:', error);
        this.error = error.message;
      }
    },

    /**
     * Load all contexts from storage
     */
    async loadContexts() {
      this.loading = true;
      this.error = null;

      try {
        this.contexts = await this.storage.getContexts();
      } catch (error) {
        console.error('Failed to load contexts:', error);
        this.error = error.message;
        this.contexts = [];
      } finally {
        this.loading = false;
      }
    },

    /**
     * Create a new context
     */
    async createContext(contextData) {
      try {
        const newContext = {
          id: this.generateId(),
          name: contextData.name || 'New Context',
          icon: contextData.icon || null,
          color: contextData.color || null,
          parentId: contextData.parentId || null,
          schedule: contextData.schedule || null,
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString(),
        };

        this.contexts.push(newContext);
        await this.storage.saveContexts(this.contexts);

        return newContext;
      } catch (error) {
        console.error('Failed to create context:', error);
        this.error = error.message;
        throw error;
      }
    },

    /**
     * Update an existing context
     */
    async updateContext(id, updates) {
      try {
        const index = this.contexts.findIndex(c => c.id === id);
        if (index === -1) {
          throw new Error(`Context with id "${id}" not found`);
        }

        this.contexts[index] = {
          ...this.contexts[index],
          ...updates,
          id, // Ensure ID cannot be changed
          modifiedAt: new Date().toISOString(),
        };

        await this.storage.saveContexts(this.contexts);
        return this.contexts[index];
      } catch (error) {
        console.error('Failed to update context:', error);
        this.error = error.message;
        throw error;
      }
    },

    /**
     * Delete a context
     */
    async deleteContext(id) {
      try {
        this.contexts = this.contexts.filter(c => c.id !== id);
        this.activeContextIds = this.activeContextIds.filter(cid => cid !== id);
        await this.storage.saveContexts(this.contexts);
      } catch (error) {
        console.error('Failed to delete context:', error);
        this.error = error.message;
        throw error;
      }
    },

    /**
     * Set active contexts (for filtering)
     */
    setActiveContexts(contextIds) {
      this.activeContextIds = contextIds;
    },

    /**
     * Toggle a context's active state
     */
    toggleContext(contextId) {
      const index = this.activeContextIds.indexOf(contextId);
      if (index === -1) {
        this.activeContextIds.push(contextId);
      } else {
        this.activeContextIds.splice(index, 1);
      }
    },

    /**
     * Clear all active contexts
     */
    clearActiveContexts() {
      this.activeContextIds = [];
    },

    /**
     * Generate a unique ID
     */
    generateId() {
      return `context_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Create default contexts
     */
    async createDefaultContexts() {
      const defaults = [
        { name: '@Work', icon: 'briefcase', color: '#4A90E2' },
        { name: '@Home', icon: 'home', color: '#7ED321' },
        { name: '@Computer', icon: 'laptop', color: '#9B9B9B' },
        { name: '@Phone', icon: 'phone', color: '#F5A623' },
        { name: '@Errands', icon: 'shopping-cart', color: '#D0021B' },
      ];

      for (const contextData of defaults) {
        await this.createContext(contextData);
      }
    },
  },
});
