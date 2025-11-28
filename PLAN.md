# MyLifeOrganized Clone - Implementation Plan

## Project Overview

This project is a full-featured browser-based clone of MyLifeOrganized (MLO), a powerful task management application. The goal is to replicate the exact UI and feature set of MLO, running entirely in the browser using VueJS 3, with local data persistence.

## Core Philosophy

MyLifeOrganized's power comes from:
1. **Unlimited hierarchical organization** - tasks can be broken down infinitely
2. **Smart auto-prioritization** - computed scores based on importance, urgency, and dates
3. **Flexible views and filters** - see your tasks in multiple ways
4. **Context awareness** - tasks shown based on where you are and what tools you have
5. **Dependency management** - tasks can depend on others across the entire hierarchy

## Technology Stack

### Frontend Framework
- **Vue 3** with Composition API
- **Pinia** for state management
- **Vue Router** for view navigation
- **Vite** for build tooling

### Supporting Libraries
- **date-fns** - Date manipulation and formatting
- **localforage** - IndexedDB wrapper for local data persistence
- **@vueuse/core** - Vue composition utilities
- **Sass** - CSS preprocessing

### Data Storage
- **IndexedDB** via localforage for task data persistence
- **localStorage** for user preferences and settings

## Feature Set (Complete MLO Replication)

### 1. Task Data Model

Each task will have the following properties:

```javascript
{
  id: String (UUID),
  title: String,
  notes: String (rich text/markdown),

  // Hierarchy
  parentId: String | null,
  childIds: Array<String>,
  order: Number,

  // Task Type
  type: 'task' | 'project' | 'folder',

  // Priority Calculation
  importance: Number (0-200, default 100),
  urgency: Number (0-200, default 100),
  computedScore: Number (calculated),

  // Dates & Times
  startDate: Date | null,
  startTime: String | null,
  dueDate: Date | null,
  dueTime: String | null,
  completedDate: Date | null,

  // Status
  isCompleted: Boolean,
  isActive: Boolean (calculated),
  projectProgress: Number (0-100, for projects),

  // Organization
  contexts: Array<String>,
  tags: Array<String>,
  flags: Array<String>,
  isStarred: Boolean,

  // Goals & Review
  goalType: 'weekly' | 'monthly' | 'yearly' | null,
  reviewPeriod: Number | null (days),
  lastReviewed: Date | null,

  // Recurrence
  recurrence: {
    enabled: Boolean,
    pattern: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'hourly',
    interval: Number,
    regenerate: Boolean (regenerate after completion),
    customPattern: String | null,
    resetSubtasks: Boolean
  } | null,

  // Dependencies
  dependsOn: Array<String> (task IDs),
  blockedBy: Array<String> (calculated),

  // Metadata
  createdAt: Date,
  modifiedAt: Date
}
```

### 2. Core Features

#### 2.1 Hierarchical Task Management
- **Unlimited nesting** - tasks can have infinite depth
- **Drag & drop** - reorganize tasks by dragging
- **Task types**:
  - **Task**: Regular actionable item
  - **Project**: Container with progress tracking (blue highlight, progress bar)
  - **Folder**: Non-completable container for organization
- **Expand/collapse** - show/hide subtask trees
- **Indent/outdent** - keyboard shortcuts to change hierarchy

#### 2.2 Task Properties & Editing
- **Quick inline editing** - click to edit task title
- **Detail panel** - comprehensive editor for all task properties
- **Notes editor** - rich text notes with file link support
- **Importance slider** - 0-200 scale with keyboard shortcuts (1-5 keys)
- **Urgency slider** - 0-200 scale with keyboard shortcuts
- **Date pickers** - start date/time and due date/time
- **Context selector** - multi-select with hierarchical contexts
- **Tag editor** - free-form tags
- **Flag picker** - visual flags for categorization
- **Star toggle** - quick favorite marking

#### 2.3 Smart Prioritization System
- **Computed score** - automatic calculation based on:
  - Importance (0-200)
  - Urgency (0-200)
  - Days until due date (negative score as deadline approaches)
  - Days since start date (positive score as time passes)
  - Parent project importance/urgency (inherited)
- **Active task detection** - tasks are "active" when:
  - Not completed
  - Start date has passed (or no start date)
  - No blocking dependencies
  - Parent is not a sequential project or all previous siblings are complete
- **To-Do list generation** - automatically shows top-priority active tasks

#### 2.4 Recurring Tasks
- **Recurrence patterns**:
  - **Daily**: Every N days
  - **Weekly**: Specific days of week
  - **Monthly**: Specific day of month or relative (e.g., "last Sunday")
  - **Yearly**: Specific date
  - **Hourly**: Every N hours
  - **Custom**: Advanced patterns (e.g., "first working day of month")
- **Regeneration mode** - create next task based on completion date
- **Subtask handling** - options for completed subtasks on recurrence
- **Time preservation** - maintain specific reminder times

#### 2.5 Views System

##### Primary Views:
1. **Outline View** (Hierarchical)
   - Full task tree with expand/collapse
   - Shows all properties in columns
   - Drag & drop reorganization
   - Color coding (projects in blue, active tasks in green)

2. **To-Do View** (Flat List)
   - Auto-generated list of active tasks
   - Sorted by computed priority score
   - No hierarchy shown (tasks from all levels)
   - Quick check-off interface

3. **Active Actions View**
   - Only shows immediately actionable tasks
   - Highest priority items
   - Updates automatically on completion

4. **Inbox View**
   - Quick capture area for new tasks
   - Unsorted/unprocessed items
   - Easy to organize into hierarchy later

5. **Goals View**
   - Filter by goal type (weekly/monthly/yearly)
   - Grouped by time period
   - Progress tracking

6. **Review View**
   - Tasks that need periodic review
   - Sorted by last reviewed date
   - One-click to mark as reviewed

##### View Features:
- **Custom views** - user-defined filter combinations
- **View presets** - save and load view configurations
- **Columns** - customizable visible columns per view
- **Sorting** - multi-level sorting by any property
- **Grouping** - group by context, tag, date, etc.

#### 2.6 Filtering & Search
- **Context filter** - show only tasks for current context(s)
- **Date filters**:
  - Due today/this week/this month
  - Starting today/this week/this month
  - Overdue tasks
- **Status filters**:
  - Active/inactive tasks
  - Completed/incomplete
  - Starred tasks
  - Flagged tasks
- **Hierarchy filters**:
  - Show parent if child matches
  - Show children if parent matches
  - Both parent and child
- **Advanced filter builder** - combine multiple criteria with AND/OR
- **Text search** - search across titles and notes

#### 2.7 Contexts
- **Hierarchical contexts** - contexts can contain other contexts
- **Context inheritance** - child contexts inherit parent availability
- **Context schedules** - contexts can be open/closed at specific times
- **Quick context switching** - dropdown to change current context
- **Context assignment** - multi-select contexts for tasks

Common context examples:
- @Work → @Computer, @Phone, @Office
- @Home → @Computer, @Phone, @Errands
- @Anywhere

#### 2.8 Dependencies
- **Cross-branch dependencies** - tasks can depend on tasks anywhere in hierarchy
- **Dependency visualization** - show what's blocking a task
- **Auto-activation** - tasks become active when dependencies complete
- **Sequential subtasks** - shortcut for making each subtask depend on previous

#### 2.9 Project Management
- **Project type** - special task type for large initiatives
- **Progress calculation** - automatic based on completed subtasks
- **Progress bar** - visual indicator of project completion
- **Project status** - track overall health
- **Milestone support** - flag important subtasks as milestones

#### 2.10 Dashboards
- **Multi-view layout** - display multiple views simultaneously
- **Customizable panels** - resize and arrange view panels
- **Common layouts**:
  - Inbox + Outline (for processing)
  - To-Do + Outline (for execution)
  - Projects + Active Actions (for management)
- **Drag & drop between views** - move tasks from inbox to outline

#### 2.11 Data Management
- **Local persistence** - all data stored in IndexedDB
- **Auto-save** - changes saved immediately
- **Export/Import** - JSON format for backup
- **Data validation** - ensure data integrity

### 3. User Interface Design

#### 3.1 Overall Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Top Bar                                                      │
│ [Quick Add] [Views ▼] [Contexts ▼] [Search...]  [Settings] │
├──────────────────┬──────────────────────────────────────────┤
│ Sidebar          │ Main Content Area                        │
│                  │                                           │
│ Views:           │ ┌──────────────────────────────────────┐ │
│ • All Tasks      │ │ View Title         [Filter] [Sort]   │ │
│ • To-Do          │ ├──────────────────────────────────────┤ │
│ • Active Actions │ │                                      │ │
│ • Inbox          │ │    Task List / Outline               │ │
│ • Goals          │ │    ├─ Task 1                         │ │
│ • Review         │ │    │  ├─ Subtask 1                   │ │
│                  │ │    │  └─ Subtask 2                   │ │
│ Contexts:        │ │    ├─ Task 2                         │ │
│ • @Work          │ │    └─ Task 3                         │ │
│ • @Home          │ │                                      │ │
│                  │ │                                      │ │
│                  │ └──────────────────────────────────────┘ │
├──────────────────┴──────────────────────────────────────────┤
│ Bottom Bar                                                   │
│ [Active Tasks: 5] [Overdue: 2] [Completed Today: 3]        │
└─────────────────────────────────────────────────────────────┘
```

#### 3.2 Task List/Outline Display
- **Checkbox** - complete/uncomplete task
- **Expand/collapse icon** - for tasks with children
- **Task icon** - indicates type (task/project/folder)
- **Title** - editable inline
- **Flags** - visual indicators
- **Star** - favorite marker
- **Contexts** - small tags
- **Dates** - due date indicator (red if overdue)
- **Progress bar** - for projects
- **Priority indicator** - color-coded importance

#### 3.3 Task Detail Panel (Right Sidebar)
Opens when task is selected:
- **Title editor** - large text input
- **Notes editor** - rich text area with toolbar
- **Property editors**:
  - Importance slider with numeric display
  - Urgency slider with numeric display
  - Start date/time pickers
  - Due date/time pickers
  - Context multi-select
  - Tags input
  - Flags picker
  - Star toggle
  - Goal type selector
  - Review period input
- **Recurrence settings** - expandable section
- **Dependencies** - list with add/remove
- **Metadata** - created, modified dates

#### 3.4 Quick Add
- **Keyboard shortcut** (Ctrl/Cmd + K)
- **Modal dialog** with title input
- **Smart parsing** - detect dates, contexts, flags from text
  - "Call client @phone #urgent !today" → creates task with context, tag, due date
- **Quick property buttons** - set importance/urgency with one click
- **Location picker** - add to inbox or specific parent

### 4. Implementation Architecture

#### 4.1 Application Structure
```
src/
├── main.js                 # App entry point
├── App.vue                 # Root component
├── router/
│   └── index.js            # Vue Router configuration
├── stores/                 # Pinia stores
│   ├── tasks.js            # Task data and operations
│   ├── views.js            # View configurations
│   ├── contexts.js         # Context management
│   ├── filters.js          # Filter state
│   └── settings.js         # User preferences
├── components/
│   ├── layout/
│   │   ├── TopBar.vue
│   │   ├── Sidebar.vue
│   │   ├── BottomBar.vue
│   │   └── Dashboard.vue
│   ├── tasks/
│   │   ├── TaskList.vue
│   │   ├── TaskItem.vue
│   │   ├── TaskDetail.vue
│   │   ├── TaskEditor.vue
│   │   └── TaskCheckbox.vue
│   ├── views/
│   │   ├── OutlineView.vue
│   │   ├── TodoView.vue
│   │   ├── InboxView.vue
│   │   ├── GoalsView.vue
│   │   └── ReviewView.vue
│   ├── inputs/
│   │   ├── QuickAdd.vue
│   │   ├── ImportanceSlider.vue
│   │   ├── DatePicker.vue
│   │   ├── ContextSelector.vue
│   │   └── TagInput.vue
│   ├── filters/
│   │   ├── FilterBuilder.vue
│   │   └── FilterTag.vue
│   └── common/
│       ├── IconButton.vue
│       ├── Dropdown.vue
│       └── Modal.vue
├── composables/
│   ├── useTasks.js         # Task operations
│   ├── usePriority.js      # Priority calculation
│   ├── useFilters.js       # Filtering logic
│   ├── useRecurrence.js    # Recurring task logic
│   └── useDragDrop.js      # Drag & drop handling
├── utils/
│   ├── database.js         # IndexedDB wrapper
│   ├── priority.js         # Priority calculation algorithms
│   ├── dateHelpers.js      # Date utilities
│   ├── taskHelpers.js      # Task manipulation utilities
│   └── exportImport.js     # Data export/import
└── styles/
    ├── variables.scss      # Design tokens
    ├── mixins.scss         # Reusable styles
    └── global.scss         # Global styles
```

#### 4.2 State Management (Pinia)

##### Tasks Store
- **State**: tasks array, selected task, loading state
- **Getters**:
  - `getRootTasks` - top-level tasks
  - `getTaskById` - find task by ID
  - `getActiveTasksList` - computed active tasks
  - `getTasksByContext` - filter by context
  - `getOverdueTasks` - tasks past due date
- **Actions**:
  - `createTask` - add new task
  - `updateTask` - modify task properties
  - `deleteTask` - remove task (and optionally children)
  - `completeTask` - mark as complete (handle recurrence)
  - `moveTask` - change parent/order
  - `calculatePriority` - recompute scores
  - `loadTasks` - from IndexedDB
  - `saveTasks` - to IndexedDB

##### Views Store
- **State**: active view, view configurations, dashboard layout
- **Getters**:
  - `getCurrentView` - active view definition
  - `getFilteredTasks` - tasks for current view
- **Actions**:
  - `setView` - switch active view
  - `createCustomView` - save new view
  - `updateViewConfig` - modify view settings

##### Contexts Store
- **State**: contexts array, active contexts, context schedules
- **Getters**:
  - `getRootContexts` - top-level contexts
  - `getActiveContexts` - currently applicable contexts
  - `isContextOpen` - check if context is available now
- **Actions**:
  - `createContext` - add new context
  - `updateContext` - modify context
  - `setActiveContexts` - change current context filter

#### 4.3 Priority Calculation Algorithm

```javascript
function calculatePriority(task) {
  let score = 0;

  // Base importance and urgency
  score += task.importance; // 0-200
  score += task.urgency;    // 0-200

  // Due date impact (increases as deadline approaches)
  if (task.dueDate) {
    const daysUntilDue = differenceInDays(task.dueDate, new Date());
    if (daysUntilDue <= 0) {
      score += 200; // Overdue - highest boost
    } else if (daysUntilDue <= 1) {
      score += 150; // Due today/tomorrow
    } else if (daysUntilDue <= 7) {
      score += 100; // Due this week
    } else if (daysUntilDue <= 30) {
      score += 50;  // Due this month
    }
  }

  // Start date impact (increases after start date)
  if (task.startDate) {
    const daysSinceStart = differenceInDays(new Date(), task.startDate);
    if (daysSinceStart > 0) {
      score += Math.min(daysSinceStart * 5, 100);
    }
  }

  // Inherit from parent
  if (task.parentId) {
    const parent = getTaskById(task.parentId);
    score += (parent.importance * 0.3) + (parent.urgency * 0.3);
  }

  // Star bonus
  if (task.isStarred) {
    score += 50;
  }

  return score;
}
```

#### 4.4 Active Task Detection

```javascript
function isTaskActive(task) {
  // Must not be completed
  if (task.isCompleted) return false;

  // Must have started (or no start date)
  if (task.startDate && isAfter(task.startDate, new Date())) {
    return false;
  }

  // Must not have blocking dependencies
  if (task.dependsOn && task.dependsOn.length > 0) {
    const hasIncompleteDependency = task.dependsOn.some(depId => {
      const dep = getTaskById(depId);
      return !dep.isCompleted;
    });
    if (hasIncompleteDependency) return false;
  }

  // If parent is sequential, must not have incomplete siblings before it
  if (task.parentId) {
    const parent = getTaskById(task.parentId);
    if (parent.isSequential) {
      const siblings = parent.childIds.map(getTaskById);
      const taskIndex = siblings.findIndex(t => t.id === task.id);
      const hasIncompleteEarlierSibling = siblings
        .slice(0, taskIndex)
        .some(sibling => !sibling.isCompleted);
      if (hasIncompleteEarlierSibling) return false;
    }
  }

  // Must match current context filter (if any)
  const activeContexts = getActiveContexts();
  if (activeContexts.length > 0) {
    const hasMatchingContext = task.contexts.some(ctx =>
      activeContexts.includes(ctx)
    );
    if (!hasMatchingContext) return false;
  }

  return true;
}
```

#### 4.5 Data Persistence

```javascript
// database.js - IndexedDB wrapper using localforage

import localforage from 'localforage';

const taskDB = localforage.createInstance({
  name: 'MLO-Clone',
  storeName: 'tasks'
});

const settingsDB = localforage.createInstance({
  name: 'MLO-Clone',
  storeName: 'settings'
});

export async function saveTasks(tasks) {
  await taskDB.setItem('allTasks', tasks);
}

export async function loadTasks() {
  return await taskDB.getItem('allTasks') || [];
}

export async function saveSettings(settings) {
  await settingsDB.setItem('userSettings', settings);
}

export async function loadSettings() {
  return await settingsDB.getItem('userSettings') || {};
}
```

### 5. UI/UX Details

#### 5.1 Visual Design
- **Color scheme** matching MLO:
  - Blue for projects (#4A90E2)
  - Green for active tasks (#7ED321)
  - Red for overdue (#D0021B)
  - Gray for inactive/completed (#9B9B9B)
- **Icons**: Use a clean icon set (e.g., Lucide, Heroicons)
- **Typography**: Clean sans-serif (Inter, Roboto)
- **Spacing**: Comfortable padding and margins
- **Hover states**: Highlight interactive elements

#### 5.2 Keyboard Shortcuts
- **Global**:
  - `Ctrl/Cmd + K` - Quick add task
  - `Ctrl/Cmd + F` - Search
  - `Ctrl/Cmd + /` - Show shortcuts
- **Task navigation**:
  - `↑/↓` - Navigate tasks
  - `Enter` - Edit selected task
  - `Space` - Toggle complete
  - `Ctrl + →` - Expand task
  - `Ctrl + ←` - Collapse task
- **Task editing**:
  - `Tab` - Indent (make child)
  - `Shift + Tab` - Outdent (make sibling of parent)
  - `Ctrl + ↑/↓` - Move task up/down
- **Importance/Urgency quick set**:
  - `1-5` - Set to 0, 50, 100, 150, 200

#### 5.3 Drag & Drop
- **Reorder tasks** - drag to change order within parent
- **Change parent** - drag to make child of different task
- **Visual feedback**:
  - Drop zone highlighting
  - Insertion line indicator
  - Ghost element while dragging

#### 5.4 Responsive Design
- **Desktop-first** (MLO is primarily desktop software)
- **Tablet support** - adjust layout for smaller screens
- **Mobile considerations** - simplified view for very small screens

### 6. Implementation Phases

#### Phase 1: Foundation (Week 1)
- ✅ Set up Vue 3 + Vite project
- ✅ Install dependencies (Pinia, Vue Router, date-fns, localforage)
- Set up basic routing
- Create Pinia stores (tasks, views, contexts)
- Implement database wrapper (IndexedDB)
- Create basic layout components (TopBar, Sidebar, BottomBar)

#### Phase 2: Core Task Management (Week 2)
- Task data model implementation
- Create/Read/Update/Delete operations
- Task hierarchy (parent/child relationships)
- Task list component with basic display
- Inline task editing
- Task checkbox and completion

#### Phase 3: Task Properties (Week 3)
- Task detail panel component
- Importance/Urgency sliders
- Date/time pickers
- Contexts selector
- Tags input
- Flags and stars
- Notes editor

#### Phase 4: Priority & Active Tasks (Week 4)
- Priority calculation algorithm
- Active task detection
- To-Do view (flat, prioritized list)
- Outline view (hierarchical display)
- View switching

#### Phase 5: Views & Filtering (Week 5)
- Filter builder component
- Context filtering
- Date filtering
- Custom views
- Goals view
- Review view
- Inbox view

#### Phase 6: Advanced Features (Week 6)
- Recurring tasks implementation
- Dependencies system
- Project progress tracking
- Sequential tasks
- Dashboard layout

#### Phase 7: Polish & UX (Week 7)
- Drag & drop implementation
- Keyboard shortcuts
- Quick add modal with smart parsing
- Search functionality
- Export/Import

#### Phase 8: Testing & Optimization (Week 8)
- Performance optimization (large task lists)
- Data validation
- Error handling
- Cross-browser testing
- Documentation

### 7. Technical Challenges & Solutions

#### Challenge 1: Efficient Hierarchy Rendering
**Problem**: Rendering thousands of nested tasks can be slow.

**Solution**:
- Virtual scrolling for long lists
- Lazy loading of collapsed branches
- Memoization of computed properties
- Debounced priority recalculation

#### Challenge 2: Real-time Priority Updates
**Problem**: Priority scores need to update when dates change.

**Solution**:
- Scheduled recalculation (every minute)
- Incremental updates (only affected tasks)
- Web Worker for background computation

#### Challenge 3: Complex Filtering
**Problem**: Multiple filter combinations can be expensive.

**Solution**:
- Pre-computed indices for common filters
- Cached filter results
- Incremental filter updates

#### Challenge 4: Drag & Drop in Hierarchy
**Problem**: Determining drop target and position in nested structure.

**Solution**:
- Drop zone detection with tolerance
- Visual indicators for drop position
- Prevent invalid drops (e.g., making parent a child of itself)

### 8. Data Migration & Backup

#### Export Format (JSON)
```json
{
  "version": "1.0",
  "exportDate": "2025-01-15T10:30:00Z",
  "tasks": [...],
  "contexts": [...],
  "settings": {...}
}
```

#### Import Process
1. Validate JSON structure
2. Check version compatibility
3. Generate new UUIDs if conflicts exist
4. Merge or replace data based on user choice
5. Rebuild indices and computed properties

### 9. Future Enhancements (Post-MVP)

- **Cloud sync** - Optional cloud storage for cross-device sync
- **Collaboration** - Share tasks with others
- **Attachments** - Real file attachments (not just links)
- **Templates** - Task templates for common workflows
- **Time tracking** - Track time spent on tasks
- **Reports** - Analytics and productivity reports
- **Mobile apps** - Native iOS/Android apps
- **Calendar integration** - Sync with Google Calendar, etc.
- **AI assistant** - Smart task suggestions and prioritization
- **Themes** - Dark mode and custom themes

### 10. Testing Strategy

#### Unit Tests
- Task CRUD operations
- Priority calculation
- Active task detection
- Recurring task generation
- Date utilities

#### Integration Tests
- View filtering
- Drag & drop
- Data persistence
- Import/Export

#### E2E Tests
- Complete task workflows
- View navigation
- Quick add with parsing
- Multi-view dashboard

### 11. Performance Targets

- **Initial load**: < 2 seconds
- **Task creation**: < 100ms
- **View switching**: < 200ms
- **Priority recalculation** (1000 tasks): < 500ms
- **Smooth scrolling**: 60 FPS

### 12. Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 13. Accessibility

- **Keyboard navigation** - Full keyboard support
- **Screen reader** - ARIA labels and roles
- **Color contrast** - WCAG AA compliance
- **Focus indicators** - Clear visual focus

## Conclusion

This plan provides a comprehensive roadmap for building a full-featured MyLifeOrganized clone in the browser. The implementation focuses on:

1. **Accurate replication** of MLO's core features
2. **Performance** for handling large task lists
3. **Usability** with keyboard shortcuts and drag & drop
4. **Reliability** with local data persistence
5. **Extensibility** for future enhancements

The phased approach allows for incremental development and testing, ensuring each feature works before moving to the next. The result will be a powerful, browser-based task management application that matches MLO's functionality while being accessible anywhere with a web browser.

## References

Based on research of MyLifeOrganized documentation and features, including:
- Official MLO website and feature descriptions
- User guides and tutorials
- Community discussions and reviews
- Feature comparison with other task management tools
