import { defineStore } from 'pinia';
import { getStorageAdapter } from '../services/storageFactory';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    settings: {
      // Appearance
      theme: 'light',
      fontSize: 'medium',
      compactMode: false,

      // Behavior
      autoSave: true,
      confirmDelete: true,
      showCompletedTasks: true,

      // Notifications
      enableNotifications: false,
      notifyOnDueDate: true,
      notifyBeforeDueDate: 24, // hours

      // Quick Add
      quickAddPosition: 'top', // 'top' or 'bottom'
      quickAddDefaultContext: null,

      // Views
      defaultView: 'outline',
      rememberLastView: true,

      // Storage
      storageType: 'localStorage',

      // Advanced
      debugMode: false,
    },
    loading: false,
    error: null,
    storage: null,
  }),

  getters: {
    /**
     * Get a specific setting value
     */
    getSetting: (state) => {
      return (key) => state.settings[key];
    },

    /**
     * Check if dark mode is enabled
     */
    isDarkMode: (state) => {
      return state.settings.theme === 'dark';
    },
  },

  actions: {
    /**
     * Initialize the store and load settings from storage
     */
    async init() {
      try {
        this.storage = getStorageAdapter();
        await this.storage.init();
        await this.loadSettings();
      } catch (error) {
        console.error('Failed to initialize settings store:', error);
        this.error = error.message;
      }
    },

    /**
     * Load settings from storage
     */
    async loadSettings() {
      this.loading = true;
      this.error = null;

      try {
        const storedSettings = await this.storage.getSettings();

        // Merge with defaults
        this.settings = {
          ...this.settings,
          ...storedSettings,
        };
      } catch (error) {
        console.error('Failed to load settings:', error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Save settings to storage
     */
    async saveSettings() {
      try {
        await this.storage.saveSettings(this.settings);
      } catch (error) {
        console.error('Failed to save settings:', error);
        this.error = error.message;
        throw error;
      }
    },

    /**
     * Update a specific setting
     */
    async updateSetting(key, value) {
      this.settings[key] = value;

      if (this.settings.autoSave) {
        await this.saveSettings();
      }
    },

    /**
     * Update multiple settings at once
     */
    async updateSettings(updates) {
      this.settings = {
        ...this.settings,
        ...updates,
      };

      if (this.settings.autoSave) {
        await this.saveSettings();
      }
    },

    /**
     * Reset settings to defaults
     */
    async resetSettings() {
      this.settings = {
        theme: 'light',
        fontSize: 'medium',
        compactMode: false,
        autoSave: true,
        confirmDelete: true,
        showCompletedTasks: true,
        enableNotifications: false,
        notifyOnDueDate: true,
        notifyBeforeDueDate: 24,
        quickAddPosition: 'top',
        quickAddDefaultContext: null,
        defaultView: 'outline',
        rememberLastView: true,
        storageType: 'localStorage',
        debugMode: false,
      };

      await this.saveSettings();
    },

    /**
     * Toggle dark mode
     */
    async toggleDarkMode() {
      this.settings.theme = this.settings.theme === 'dark' ? 'light' : 'dark';
      await this.saveSettings();
    },
  },
});
