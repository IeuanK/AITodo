<template>
  <header class="top-bar">
    <div class="top-bar-left">
      <h1 class="app-title">{{ appName }}</h1>
    </div>

    <div class="top-bar-center">
      <button
        class="quick-add-btn"
        @click="showQuickAdd"
        title="Quick Add (Ctrl+K)"
      >
        + Add Task
      </button>

      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search tasks..."
          class="search-input"
          @input="onSearch"
        />
      </div>
    </div>

    <div class="top-bar-right">
      <div class="context-selector">
        <label>Context:</label>
        <select v-model="selectedContext" @change="onContextChange">
          <option value="">All Contexts</option>
          <option v-for="context in contexts" :key="context.id" :value="context.id">
            {{ context.name }}
          </option>
        </select>
      </div>

      <button
        class="settings-btn"
        @click="openSettings"
        title="Settings"
      >
        ⚙️
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useContextsStore } from '../../stores/contexts';

const contextsStore = useContextsStore();

const appName = import.meta.env.VITE_APP_NAME || 'MyLifeOrganized Clone';
const searchQuery = ref('');
const selectedContext = ref('');

const contexts = computed(() => contextsStore.rootContexts);

const showQuickAdd = () => {
  // TODO: Implement quick add modal
  console.log('Quick add clicked');
};

const onSearch = () => {
  // TODO: Implement search functionality
  console.log('Search:', searchQuery.value);
};

const onContextChange = () => {
  if (selectedContext.value) {
    contextsStore.setActiveContexts([selectedContext.value]);
  } else {
    contextsStore.clearActiveContexts();
  }
};

const openSettings = () => {
  // TODO: Implement settings modal
  console.log('Settings clicked');
};
</script>

<style scoped lang="scss">
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  gap: 1rem;
}

.top-bar-left {
  flex: 0 0 auto;
}

.app-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.top-bar-center {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 600px;
}

.quick-add-btn {
  padding: 0.5rem 1rem;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;

  &:hover {
    background: #357abd;
  }

  &:active {
    background: #2a6aa8;
  }
}

.search-box {
  flex: 1;
}

.search-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #4a90e2;
  }
}

.top-bar-right {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.context-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;

  label {
    color: #666;
  }

  select {
    padding: 0.4rem 0.6rem;
    border: 1px solid #d0d0d0;
    border-radius: 4px;
    font-size: 0.9rem;
    outline: none;
    cursor: pointer;
    transition: border-color 0.2s;

    &:focus {
      border-color: #4a90e2;
    }
  }
}

.settings-btn {
  padding: 0.4rem 0.6rem;
  background: transparent;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
    border-color: #999;
  }
}
</style>
