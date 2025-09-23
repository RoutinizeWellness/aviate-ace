# Project Structure

## Root Directory
- **Configuration Files**: `vite.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `netlify.toml`
- **Package Management**: `package.json`, `package-lock.json`, `bun.lockb`
- **Environment**: `.env` (Convex URL and other secrets)
- **Scripts**: Various utility scripts for data processing and deployment

## Source Structure (`src/`)

### Core Application
- `main.tsx` - Application entry point
- `App.tsx` - Main app component with routing and providers
- `App.css` / `index.css` - Global styles

### Components (`src/components/`)
- `ui/` - shadcn/ui components (buttons, dialogs, forms, etc.)
- Feature components (quiz, subscription, auth, etc.)
- Layout components (`UnifiedSidebar.tsx`, `ProtectedRoute.tsx`)

### Pages (`src/pages/`)
- Route components organized by feature
- Authentication: `Login.tsx`, `Register.tsx`
- Learning: `Dashboard.tsx`, `ExamMode.tsx`, `Flashcards.tsx`
- Admin: `AdminPanel.tsx`, `AdminSetup.tsx`
- Legal: `Terms.tsx`, `Privacy.tsx`, `Contact.tsx`

### Data Layer
- `hooks/` - Custom React hooks for data fetching and state
- `services/` - Business logic and API integrations
- `data/` - Static question databases and mock data
- `types/` - TypeScript type definitions

### Utilities
- `lib/` - Shared utilities (`utils.ts`, `stripe.ts`, `convex.ts`)
- `config/` - Application configuration (pricing tiers, etc.)
- `utils/` - Helper functions and utilities

## Backend Structure (`convex/`)
- `schema.ts` - Database schema definitions
- `auth.ts` - Authentication functions
- `courses.ts` - Course and lesson management
- `exams.ts` - Exam and question handling
- `seedQuestions.ts` - Database seeding utilities
- `_generated/` - Auto-generated Convex files

## Deployment & Infrastructure
- `netlify/` - Netlify functions and configuration
- `public/` - Static assets (favicon, robots.txt, etc.)
- `scripts/` - Build and deployment scripts

## Naming Conventions
- **Files**: PascalCase for components, camelCase for utilities
- **Directories**: lowercase with hyphens where needed
- **Components**: Descriptive names reflecting functionality
- **Hooks**: Prefixed with `use` (e.g., `useConvexAuth`)
- **Services**: Suffixed with `Service` (e.g., `lessonContentService`)

## Import Patterns
- Use `@/` alias for src imports
- Relative imports for same-directory files
- Group imports: external libraries, internal modules, relative imports