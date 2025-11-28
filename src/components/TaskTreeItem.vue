<template>
  <div class="task-tree-item" :style="{ '--indent-level': indentLevel }">
    <div
      class="task-row"
      :class="{
        'completed': task.isCompleted,
        'selected': isSelected,
        'has-children': hasChildren
      }"
      @click="handleSelect"
      @dblclick="startEditing"
    >
      <!-- Indent spacer -->
      <div class="indent-spacer"></div>

      <!-- Expand/Collapse arrow -->
      <div class="expand-toggle" @click.stop="toggleExpanded">
        <span v-if="hasChildren" class="arrow" :class="{ expanded: isExpanded }">▶</span>
        <span v-else class="arrow-placeholder"></span>
      </div>

      <!-- Color indicator -->
      <div
        class="color-indicator"
        :style="{ backgroundColor: task.color || '#e0e0e0' }"
        @click.stop="showColorPicker"
      ></div>

      <!-- Checkbox -->
      <input
        type="checkbox"
        :checked="task.isCompleted"
        @change.stop="toggleComplete"
        class="task-checkbox"
      />

      <!-- Task title (editable) -->
      <div class="task-title-wrapper" v-if="!isEditing">
        <span class="task-title">{{ task.title }}</span>

        <!-- Task metadata badges -->
        <div class="task-badges">
          <span v-if="task.isStarred" class="badge star">⭐</span>
          <span v-if="task.dueDate" class="badge due-date" :class="dueDateClass">
            {{ formatDueDate(task.dueDate) }}
          </span>
          <span v-if="task.contexts && task.contexts.length > 0" class="badge context">
            @{{ task.contexts[0] }}
          </span>
          <span v-if="hasChildren" class="badge child-count">
            {{ childCount }}
          </span>
        </div>
      </div>

      <!-- Inline editor -->
      <input
        v-else
        ref="titleInput"
        v-model="editTitle"
        @blur="saveEdit"
        @keydown.enter="saveEdit"
        @keydown.esc="cancelEdit"
        class="task-title-input"
        @click.stop
      />

      <!-- Action buttons (visible on hover) -->
      <div class="task-actions">
        <button @click.stop="addChild" class="action-btn" title="Add child task">+</button>
        <button @click.stop="deleteTask" class="action-btn danger" title="Delete task">×</button>
      </div>
    </div>

    <!-- Child tasks (recursive) -->
    <div v-if="isExpanded && hasChildren" class="task-children">
      <TaskTreeItem
        v-for="child in children"
        :key="child.id"
        :task="child"
        :indent-level="indentLevel + 1"
        :selected-task-id="selectedTaskId"
        @select="$emit('select', $event)"
        @toggle-complete="$emit('toggle-complete', $event)"
        @update="$emit('update', $event)"
        @delete="$emit('delete', $event)"
        @add-child="$emit('add-child', $event)"
      />
    </div>

    <!-- Color picker (shown on demand) -->
    <div v-if="showingColorPicker" class="color-picker-overlay" @click.stop="hideColorPicker">
      <div class="color-picker" @click.stop>
        <div class="color-picker-title">Choose Color</div>
        <div class="color-grid">
          <div
            v-for="color in colorOptions"
            :key="color"
            class="color-option"
            :style="{ backgroundColor: color }"
            :class="{ selected: task.color === color }"
            @click="selectColor(color)"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue';
import { useTasksStore } from '../stores/tasks';

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  indentLevel: {
    type: Number,
    default: 0
  },
  selectedTaskId: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['select', 'toggle-complete', 'update', 'delete', 'add-child']);

const tasksStore = useTasksStore();

// State
const isExpanded = ref(true);
const isEditing = ref(false);
const editTitle = ref('');
const titleInput = ref(null);
const showingColorPicker = ref(false);

// Color options for the color picker
const colorOptions = [
  '#e0e0e0', // Default gray
  '#ffcdd2', // Red
  '#f8bbd0', // Pink
  '#e1bee7', // Purple
  '#c5cae9', // Indigo
  '#bbdefb', // Blue
  '#b2dfdb', // Teal
  '#c8e6c9', // Green
  '#fff9c4', // Yellow
  '#ffe0b2', // Orange
  '#d7ccc8', // Brown
  '#b0bec5', // Blue Gray
];

// Computed
const hasChildren = computed(() => {
  return props.task.childIds && props.task.childIds.length > 0;
});

const children = computed(() => {
  if (!hasChildren.value) return [];
  return tasksStore.getChildTasks(props.task.id);
});

const childCount = computed(() => {
  return props.task.childIds ? props.task.childIds.length : 0;
});

const isSelected = computed(() => {
  return props.task.id === props.selectedTaskId;
});

const dueDateClass = computed(() => {
  if (!props.task.dueDate) return '';

  const now = new Date();
  const dueDate = new Date(props.task.dueDate);
  const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'overdue';
  if (diffDays === 0) return 'today';
  if (diffDays <= 3) return 'soon';
  return '';
});

// Methods
const toggleExpanded = () => {
  if (hasChildren.value) {
    isExpanded.value = !isExpanded.value;
  }
};

const handleSelect = () => {
  emit('select', props.task.id);
};

const toggleComplete = () => {
  emit('toggle-complete', props.task.id);
};

const startEditing = () => {
  if (props.task.isCompleted) return; // Don't edit completed tasks
  isEditing.value = true;
  editTitle.value = props.task.title;
  nextTick(() => {
    if (titleInput.value) {
      titleInput.value.focus();
      titleInput.value.select();
    }
  });
};

const saveEdit = () => {
  if (editTitle.value.trim() && editTitle.value !== props.task.title) {
    emit('update', { id: props.task.id, updates: { title: editTitle.value.trim() } });
  }
  isEditing.value = false;
};

const cancelEdit = () => {
  isEditing.value = false;
  editTitle.value = '';
};

const deleteTask = () => {
  if (confirm('Delete this task and all its children?')) {
    emit('delete', { id: props.task.id, deleteChildren: true });
  }
};

const addChild = () => {
  emit('add-child', props.task.id);
};

const formatDueDate = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
  if (diffDays <= 7) return `${diffDays}d`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const showColorPicker = () => {
  showingColorPicker.value = true;
};

const hideColorPicker = () => {
  showingColorPicker.value = false;
};

const selectColor = (color) => {
  emit('update', { id: props.task.id, updates: { color } });
  hideColorPicker();
};
</script>

<style scoped lang="scss">
.task-tree-item {
  --indent-size: 20px;
  --row-height: 28px;
  user-select: none;
}

.task-row {
  display: flex;
  align-items: center;
  height: var(--row-height);
  padding: 2px 8px 2px 0;
  cursor: pointer;
  transition: background-color 0.1s;
  position: relative;

  &:hover {
    background-color: #f5f5f5;

    .task-actions {
      opacity: 1;
    }
  }

  &.selected {
    background-color: #e3f2fd;

    &:hover {
      background-color: #d1e7fd;
    }
  }

  &.completed {
    opacity: 0.5;

    .task-title {
      text-decoration: line-through;
      color: #999;
    }
  }
}

.indent-spacer {
  width: calc(var(--indent-level) * var(--indent-size));
  flex-shrink: 0;
}

.expand-toggle {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 4px;
  cursor: pointer;

  &:hover .arrow {
    color: #333;
  }
}

.arrow {
  font-size: 10px;
  color: #666;
  transition: transform 0.2s;
  display: inline-block;

  &.expanded {
    transform: rotate(90deg);
  }
}

.arrow-placeholder {
  width: 10px;
  display: inline-block;
}

.color-indicator {
  width: 4px;
  height: 20px;
  border-radius: 2px;
  flex-shrink: 0;
  margin-right: 8px;
  cursor: pointer;
  transition: width 0.2s;

  &:hover {
    width: 6px;
  }
}

.task-checkbox {
  margin: 0 8px 0 0;
  cursor: pointer;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}

.task-title-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  overflow: hidden;
}

.task-title {
  font-size: 13px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-title-input {
  flex: 1;
  font-size: 13px;
  padding: 2px 4px;
  border: 1px solid #4a90e2;
  border-radius: 2px;
  outline: none;
  font-family: inherit;
}

.task-badges {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.badge {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 3px;
  white-space: nowrap;

  &.star {
    background: none;
    padding: 0;
  }

  &.due-date {
    background: #e0e0e0;
    color: #666;

    &.today {
      background: #fff9c4;
      color: #f57c00;
    }

    &.soon {
      background: #ffe0b2;
      color: #e65100;
    }

    &.overdue {
      background: #ffcdd2;
      color: #c62828;
      font-weight: 600;
    }
  }

  &.context {
    background: #e1f5fe;
    color: #0277bd;
  }

  &.child-count {
    background: #f5f5f5;
    color: #999;
    font-size: 10px;
  }
}

.task-actions {
  display: flex;
  gap: 4px;
  margin-left: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.action-btn {
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 3px;
  background: #e0e0e0;
  color: #666;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  padding: 0;
  line-height: 1;

  &:hover {
    background: #d0d0d0;
    color: #333;
  }

  &.danger:hover {
    background: #f44336;
    color: white;
  }
}

.task-children {
  // Children are rendered with increased indent-level
}

// Color picker overlay
.color-picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.color-picker {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
}

.color-picker-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.color-option {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
    border-color: #666;
  }

  &.selected {
    border-color: #4a90e2;
    border-width: 3px;
  }
}
</style>
