import { defineStore } from 'pinia';
import { getStorageAdapter } from '../services/storageFactory';

export const useViewsStore = defineStore('views', {
  state: () => ({
    views: [],
    currentViewId: null,
    loading: false,
    error: null,
    storage: null,
  }),

  getters: {
    /**
     * Get the current active view
     */
    currentView: (state) => {
      if (!state.currentViewId) return null;
      return state.views.find(view => view.id === state.currentViewId);
    },

    /**
     * Get view by ID
     */
    getViewById: (state) => {
      return (id) => state.views.find(view => view.id === id);
    },

    /**
     * Get all built-in views
     */
    builtInViews: (state) => {
      return state.views.filter(view => view.isBuiltIn);
    },

    /**
     * Get all custom views
     */
    customViews: (state) => {
      return state.views.filter(view => !view.isBuiltIn);
    },
  },

  actions: {
    /**
     * Initialize the store and load views from storage
     */
    async init() {
      try {
        this.storage = getStorageAdapter();
        await this.storage.init();
        await this.loadViews();

        // Create default views if none exist
        if (this.views.length === 0) {
          await this.createDefaultViews();
        }

        // Set default view
        if (!this.currentViewId && this.views.length > 0) {
          this.currentViewId = this.views[0].id;
        }
      } catch (error) {
        console.error('Failed to initialize views store:', error);
        this.error = error.message;
      }
    },

    /**
     * Load all views from storage
     */
    async loadViews() {
      this.loading = true;
      this.error = null;

      try {
        this.views = await this.storage.getViews();
      } catch (error) {
        console.error('Failed to load views:', error);
        this.error = error.message;
        this.views = [];
      } finally {
        this.loading = false;
      }
    },

    /**
     * Create a new view
     */
    async createView(viewData) {
      try {
        const newView = {
          id: this.generateId(),
          name: viewData.name || 'New View',
          type: viewData.type || 'custom',
          isBuiltIn: viewData.isBuiltIn || false,

          // View configuration
          filters: viewData.filters || {},
          sorting: viewData.sorting || { field: 'order', direction: 'asc' },
          grouping: viewData.grouping || null,
          columns: viewData.columns || [],

          // Display options
          showCompleted: viewData.showCompleted ?? true,
          showHierarchy: viewData.showHierarchy ?? true,

          // Metadata
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString(),
        };

        this.views.push(newView);
        await this.storage.saveViews(this.views);

        return newView;
      } catch (error) {
        console.error('Failed to create view:', error);
        this.error = error.message;
        throw error;
      }
    },

    /**
     * Update an existing view
     */
    async updateView(id, updates) {
      try {
        const index = this.views.findIndex(v => v.id === id);
        if (index === -1) {
          throw new Error(`View with id "${id}" not found`);
        }

        this.views[index] = {
          ...this.views[index],
          ...updates,
          id, // Ensure ID cannot be changed
          modifiedAt: new Date().toISOString(),
        };

        await this.storage.saveViews(this.views);
        return this.views[index];
      } catch (error) {
        console.error('Failed to update view:', error);
        this.error = error.message;
        throw error;
      }
    },

    /**
     * Delete a view
     */
    async deleteView(id) {
      try {
        // Don't allow deleting built-in views
        const view = this.getViewById(id);
        if (view && view.isBuiltIn) {
          throw new Error('Cannot delete built-in views');
        }

        this.views = this.views.filter(v => v.id !== id);

        // If deleted view was active, switch to first view
        if (this.currentViewId === id && this.views.length > 0) {
          this.currentViewId = this.views[0].id;
        }

        await this.storage.saveViews(this.views);
      } catch (error) {
        console.error('Failed to delete view:', error);
        this.error = error.message;
        throw error;
      }
    },

    /**
     * Set the current active view
     */
    setCurrentView(viewId) {
      this.currentViewId = viewId;
    },

    /**
     * Generate a unique ID
     */
    generateId() {
      return `view_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Create default built-in views
     */
    async createDefaultViews() {
      const defaultViews = [
        {
          name: 'All Tasks',
          type: 'outline',
          isBuiltIn: true,
          filters: {},
          sorting: { field: 'order', direction: 'asc' },
          showCompleted: true,
          showHierarchy: true,
          columns: ['title', 'dueDate', 'importance', 'contexts'],
        },
        {
          name: 'To-Do',
          type: 'todo',
          isBuiltIn: true,
          filters: { isCompleted: false },
          sorting: { field: 'computedScore', direction: 'desc' },
          showCompleted: false,
          showHierarchy: false,
          columns: ['title', 'dueDate', 'importance', 'urgency'],
        },
        {
          name: 'Inbox',
          type: 'inbox',
          isBuiltIn: true,
          filters: { isInInbox: true },
          sorting: { field: 'createdAt', direction: 'desc' },
          showCompleted: false,
          showHierarchy: false,
          columns: ['title', 'createdAt'],
        },
        {
          name: 'Active Actions',
          type: 'active',
          isBuiltIn: true,
          filters: { isActive: true, isCompleted: false },
          sorting: { field: 'computedScore', direction: 'desc' },
          showCompleted: false,
          showHierarchy: false,
          columns: ['title', 'dueDate', 'importance'],
        },
        {
          name: 'Goals',
          type: 'goals',
          isBuiltIn: true,
          filters: { hasGoalType: true },
          grouping: { field: 'goalType' },
          sorting: { field: 'importance', direction: 'desc' },
          showCompleted: false,
          showHierarchy: true,
          columns: ['title', 'goalType', 'dueDate'],
        },
        {
          name: 'Review',
          type: 'review',
          isBuiltIn: true,
          filters: { needsReview: true },
          sorting: { field: 'lastReviewed', direction: 'asc' },
          showCompleted: false,
          showHierarchy: true,
          columns: ['title', 'lastReviewed', 'reviewPeriod'],
        },
      ];

      for (const viewData of defaultViews) {
        await this.createView(viewData);
      }
    },
  },
});
