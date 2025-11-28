<template>
  <aside class="sidebar">
    <nav class="sidebar-nav">
      <div class="nav-section">
        <h3 class="section-title">Views</h3>
        <ul class="nav-list">
          <li
            v-for="route in mainRoutes"
            :key="route.name"
            class="nav-item"
            :class="{ active: isActiveRoute(route.name) }"
          >
            <router-link :to="route.path" class="nav-link">
              <span class="nav-icon">{{ getIcon(route.meta?.icon) }}</span>
              <span class="nav-text">{{ route.meta?.title }}</span>
            </router-link>
          </li>
        </ul>
      </div>

      <div class="nav-section">
        <h3 class="section-title">Contexts</h3>
        <ul class="nav-list">
          <li
            v-for="context in contexts"
            :key="context.id"
            class="nav-item context-item"
            :class="{ active: isContextActive(context.id) }"
            @click="toggleContext(context.id)"
          >
            <span class="context-indicator"></span>
            <span class="nav-text">{{ context.name }}</span>
          </li>
        </ul>
        <button class="add-context-btn" @click="addContext">
          + Add Context
        </button>
      </div>

      <div class="nav-section">
        <h3 class="section-title">Custom Views</h3>
        <ul class="nav-list">
          <li
            v-for="view in customViews"
            :key="view.id"
            class="nav-item"
          >
            <span class="nav-text">{{ view.name }}</span>
          </li>
        </ul>
        <button class="add-view-btn" @click="addView">
          + Add View
        </button>
      </div>
    </nav>

    <div class="sidebar-footer">
      <div class="stats">
        <div class="stat-item">
          <span class="stat-label">Active:</span>
          <span class="stat-value">{{ activeTasks }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Overdue:</span>
          <span class="stat-value overdue">{{ overdueTasks }}</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useContextsStore } from '../../stores/contexts';
import { useViewsStore } from '../../stores/views';
import { useTasksStore } from '../../stores/tasks';

const route = useRoute();
const router = useRouter();
const contextsStore = useContextsStore();
const viewsStore = useViewsStore();
const tasksStore = useTasksStore();

const mainRoutes = computed(() => {
  return router.options.routes.filter(r => r.meta?.title);
});

const contexts = computed(() => contextsStore.rootContexts);
const customViews = computed(() => viewsStore.customViews);
const activeTasks = computed(() => tasksStore.activeTasks.length);
const overdueTasks = computed(() => tasksStore.overdueTasks.length);

const isActiveRoute = (routeName) => {
  return route.name === routeName;
};

const isContextActive = (contextId) => {
  return contextsStore.activeContextIds.includes(contextId);
};

const toggleContext = (contextId) => {
  contextsStore.toggleContext(contextId);
};

const addContext = () => {
  // TODO: Implement add context modal
  console.log('Add context clicked');
};

const addView = () => {
  // TODO: Implement add view modal
  console.log('Add view clicked');
};

// Simple icon mapping (replace with proper icon component later)
const getIcon = (iconName) => {
  const icons = {
    'list-tree': '📋',
    'check-square': '✓',
    'inbox': '📥',
    'zap': '⚡',
    'target': '🎯',
    'eye': '👁️',
  };
  return icons[iconName] || '•';
};
</script>

<style scoped lang="scss">
.sidebar {
  width: 250px;
  background: #f8f9fa;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
}

.nav-section {
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  margin: 0;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #999;
  letter-spacing: 0.05em;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0.25rem 0;
}

.nav-item {
  margin: 0;
  cursor: pointer;

  &.active {
    background: #e3f2fd;

    .nav-link {
      color: #4a90e2;
      font-weight: 500;
    }
  }

  &:hover {
    background: #f0f0f0;
  }
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 1rem;
  color: #333;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.nav-icon {
  font-size: 1.1rem;
  width: 1.2rem;
  text-align: center;
}

.nav-text {
  flex: 1;
}

.context-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;

  &.active .context-indicator {
    background: #4a90e2;
  }
}

.context-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d0d0d0;
  transition: background 0.2s;
}

.add-context-btn,
.add-view-btn {
  width: calc(100% - 2rem);
  margin: 0.5rem 1rem;
  padding: 0.5rem;
  background: transparent;
  border: 1px dashed #d0d0d0;
  border-radius: 4px;
  color: #666;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f0f0f0;
    border-color: #999;
    color: #333;
  }
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
  background: #fff;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}

.stat-label {
  color: #666;
}

.stat-value {
  font-weight: 600;
  color: #333;

  &.overdue {
    color: #d0021b;
  }
}
</style>
