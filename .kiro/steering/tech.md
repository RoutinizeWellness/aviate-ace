# Technology Stack

## Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **Styling**: Tailwind CSS with custom aviation theme
- **UI Components**: Radix UI primitives with shadcn/ui
- **Routing**: React Router DOM v6
- **State Management**: React Query (TanStack Query) + Convex React hooks
- **Forms**: React Hook Form with Zod validation

## Backend & Database
- **Backend**: Convex (serverless backend-as-a-service)
- **Database**: Convex built-in database with real-time sync
- **Authentication**: Convex Auth system
- **File Storage**: Convex file storage

## Integrations
- **Payments**: Stripe with React Stripe.js
- **Deployment**: Netlify with automatic deployments
- **Legacy Database**: Supabase (being phased out in favor of Convex)

## Development Tools
- **Package Manager**: npm (with bun.lockb present but npm preferred)
- **Linting**: ESLint v9 with TypeScript support
- **Type Checking**: TypeScript 5.8+
- **CSS Processing**: PostCSS with Autoprefixer

## Common Commands

### Development
```bash
npm run dev              # Start development server (port 8080)
npm run build            # Production build with memory optimization
npm run build:dev        # Development build
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

### Convex Operations
```bash
npm run verify:convex    # Verify Convex connection
npm run seed:convex      # Seed database with questions
npm run test:seed        # Test seeding process
npm run check:convex     # Check Convex status
```

### Deployment
```bash
npm run deploy:netlify   # Deploy to Netlify with Convex integration
```

## Build Configuration
- Uses Vite with manual chunk splitting for optimal loading
- Memory optimization for large builds (8GB heap)
- Separate chunks for vendor libraries (React, Convex, Radix UI)
- Question data lazy-loaded to reduce initial bundle size