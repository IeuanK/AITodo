# MyLifeOrganized Clone

A full-featured browser-based clone of MyLifeOrganized (MLO), a powerful task management application. This project replicates the exact UI and feature set of MLO, running entirely in the browser using Vue 3.

## 🚀 Features

- **Unlimited hierarchical task organization** - Break down tasks infinitely
- **Smart auto-prioritization** - Computed scores based on importance, urgency, and dates
- **Flexible views and filters** - See your tasks in multiple ways
- **Context awareness** - Filter tasks based on your current context
- **Recurring tasks** - Advanced recurrence patterns with regeneration
- **Dependencies** - Tasks can depend on others across the entire hierarchy
- **Project management** - Track progress with visual indicators
- **Goals & Reviews** - Weekly, monthly, and yearly goal tracking
- **Multiple views** - Outline, To-Do, Inbox, Active Actions, Goals, Review

## 🏗️ Architecture

### Storage Abstraction Layer

The application uses a **storage abstraction layer** based on the Repository Pattern, allowing seamless switching between different storage backends:

- **LocalStorage** (current) - Browser localStorage for immediate persistence
- **API Backend** (future-ready) - REST API integration via adapter pattern

This architecture means you can start with localStorage and seamlessly migrate to a backend API without changing any application code.

### Tech Stack

- **Vue 3** - Progressive JavaScript framework with Composition API
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Vite** - Build tooling and dev server
- **date-fns** - Date manipulation
- **@vueuse/core** - Vue composition utilities
- **Sass** - CSS preprocessing

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/IeuanK/AITodo.git
cd AITodo

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 🔧 Configuration

### Storage Backend

Configure the storage backend via `.env` file:

```bash
# Use localStorage (default)
VITE_STORAGE_TYPE=localStorage

# Or use API backend
VITE_STORAGE_TYPE=api
VITE_API_BASE_URL=https://api.example.com/v1
VITE_API_TOKEN=your-auth-token-here
```

### App Settings

```bash
VITE_APP_NAME=MyLifeOrganized Clone
VITE_APP_VERSION=1.0.0
```

## 🚢 Deployment

### GitHub Pages (Automatic)

The project is configured for automatic deployment to GitHub Pages:

1. Push changes to `main` branch
2. GitHub Actions automatically builds, merges to the `gh-pages` branch, and deploys from there
3. Site is live at `https://[username].github.io/AITodo/`

### Manual Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 📖 Documentation

See [PLAN.md](./PLAN.md) for comprehensive implementation details including:

- Complete feature specifications
- Task data model
- Priority calculation algorithms
- Component architecture
- Implementation phases
- API integration guide

## 🛠️ Development

### Project Structure

```
src/
├── services/           # Storage abstraction layer
│   ├── IStorageAdapter.js
│   ├── LocalStorageAdapter.js
│   ├── ApiStorageAdapter.js
│   └── storageFactory.js
├── stores/             # Pinia stores
├── components/         # Vue components
├── router/             # Vue Router configuration
├── composables/        # Composition API utilities
└── utils/              # Helper functions
```

### Storage Adapters

All storage adapters implement the `IStorageAdapter` interface:

```javascript
// Get the storage adapter (singleton)
import { getStorageAdapter } from '@/services/storageFactory';

const storage = getStorageAdapter();

// Use in Pinia store
await storage.getTasks();
await storage.createTask(task);
await storage.updateTask(id, updates);
```

### Switching to API Backend

1. Implement your API endpoints matching the adapter interface:
   - `GET /tasks` - Get all tasks
   - `POST /tasks` - Create task
   - `PATCH /tasks/:id` - Update task
   - `DELETE /tasks/:id` - Delete task
   - etc.

2. Update `.env`:
   ```bash
   VITE_STORAGE_TYPE=api
   VITE_API_BASE_URL=https://your-api.com/v1
   ```

3. Rebuild and deploy - no code changes needed!

## 🧪 Testing

```bash
# Run unit tests (coming soon)
npm run test

# Run E2E tests (coming soon)
npm run test:e2e
```

## 📝 Implementation Status

### Phase 1: Foundation ✅
- ✅ Vue 3 + Vite project setup
- ✅ Dependencies installed
- ✅ GitHub Pages deployment configured
- ✅ Storage abstraction layer created
- ⏳ Basic routing
- ⏳ Pinia stores with storage integration
- ⏳ Layout components

### Phase 2-8: Coming Soon
See [PLAN.md](./PLAN.md) for the complete 8-phase implementation roadmap.

## 🤝 Contributing

Contributions are welcome! Please read the [PLAN.md](./PLAN.md) to understand the architecture and implementation approach.

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

This project is inspired by [MyLifeOrganized](https://www.mylifeorganized.net/), a powerful task management application. This is an independent implementation and is not affiliated with or endorsed by MyLifeOrganized.

## 📚 Resources

- [MyLifeOrganized Official Website](https://www.mylifeorganized.net/)
- [Vue 3 Documentation](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
