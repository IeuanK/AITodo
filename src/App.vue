<template>
  <div id="app" class="app-container">
    <TopBar />

    <div class="app-body">
      <Sidebar />

      <main class="main-content">
        <router-view />
      </main>
    </div>

    <BottomBar />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import TopBar from './components/layout/TopBar.vue';
import Sidebar from './components/layout/Sidebar.vue';
import BottomBar from './components/layout/BottomBar.vue';
import { useTasksStore } from './stores/tasks';
import { useContextsStore } from './stores/contexts';
import { useViewsStore } from './stores/views';
import { useSettingsStore } from './stores/settings';

const tasksStore = useTasksStore();
const contextsStore = useContextsStore();
const viewsStore = useViewsStore();
const settingsStore = useSettingsStore();

// Initialize all stores on mount
onMounted(async () => {
  await tasksStore.init();
  await contextsStore.init();
  await viewsStore.init();
  await settingsStore.init();
});
</script>

<style lang="scss">
// Reset and base styles
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #f5f5f5;
}

#app {
  height: 100%;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.app-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  background: #ffffff;
}

// Utility classes
.text-muted {
  color: #666;
}

.text-danger {
  color: #d0021b;
}

.text-success {
  color: #7ed321;
}

.text-info {
  color: #4a90e2;
}
</style>
