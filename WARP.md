# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Aviate Ace** is a modern aviation training platform for commercial pilots, specializing in A320 and B737 type rating preparation. The application provides interactive lessons, practice exams, flashcards, and progress tracking with a focus on real aviation certification requirements.

### Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui + Radix UI components
- **Styling**: Tailwind CSS with custom aviation theming
- **Backend**: Convex (real-time database and functions)
- **Authentication**: Custom Convex auth with fallback mode
- **Payments**: Stripe integration
- **Database**: Supabase (secondary/fallback)
- **Deployment**: Netlify with Node.js 18

## Common Development Commands

### Development
```bash
npm run dev                    # Start development server on port 8080
npm run build                  # Production build with memory optimization (8GB)
npm run build:dev              # Development build
npm run preview                # Preview production build
npm run lint                   # Run ESLint
```

### Convex Backend
```bash
npm run deploy:netlify         # Connect Convex for Netlify deployment
npm run verify:convex          # Verify Convex connection
npm run verify:config          # Verify Convex configuration
npm run verify:netlify         # Verify Netlify-Convex integration
npm run check:convex           # Check Convex deployment status
```

### Database & Content Management
```bash
npm run seed:convex            # Seed Convex database with aviation questions
npm run test:seed              # Test Convex seeding process
npm run generate:questions     # Generate new aviation questions
```

## Project Architecture

### Core Architecture Patterns

**1. Hierarchical Provider Pattern**
The app uses a nested provider architecture for state management:
```typescript
QueryClientProvider → ConvexProvider → AuthProvider → FreeTrialProvider → Elements(Stripe)
```

**2. Graceful Degradation**
The application implements fallback modes when external services are unavailable:
- **Convex Fallback**: Demo mode with mock data when Convex is down
- **Auth Fallback**: Local demo user when authentication services fail
- **Stripe Fallback**: Basic subscription simulation

**3. Route Protection**
Protected routes use subscription-based access control:
- `ProtectedRoute` - Basic authentication required
- `ProtectedRoute requiresSubscription="A320_FAMILY"` - Subscription-specific access

### Directory Structure

```
src/
├── components/           # Reusable UI components
├── pages/               # Route components and main views
├── hooks/               # Custom React hooks (useConvexAuth)
├── contexts/            # React contexts (LanguageContext, FreeTrialContext)
├── lib/                # Utility libraries and configurations
├── data/               # Static data and question banks
└── i18n/               # Internationalization (Spanish/English)

convex/
├── schema.ts           # Database schema definitions
├── auth.ts            # Authentication functions
├── exams.ts           # Exam-related backend functions
├── lessons.ts         # Lesson management functions
└── seed*.ts           # Database seeding scripts

scripts/               # Utility scripts for data management
netlify/              # Netlify deployment configurations
```

### Key Data Models

**User Hierarchy**: `users` → `profiles` → `userStats` → `userProgress`
**Content Hierarchy**: `courses` → `lessons` → `examQuestions`
**Progress Tracking**: `userExamSessions`, `userLessonProgress`, `userTypeRatingProgress`
**Gamification**: `achievements`, `userAchievements`, `userBadges`

### Aviation-Specific Features

**Aircraft Support**: A320 Family and B737 Family with dedicated routes and content
**Question Categories**: Air Conditioning, Autoflight, Doors, Navigation, etc.
**Difficulty Levels**: Basic, Intermediate, Advanced with adaptive learning
**Session Types**: Practice, Timed Exams, Review Mode, Flashcards

### Authentication & Authorization

- **Custom Convex Auth**: Email-based authentication with profile management
- **Admin Detection**: Hard-coded admin emails (`tiniboti@gmail.com`) with role-based access
- **Subscription Tiers**: Free trial, A320 Family, B737 Family, Complete Package
- **IP Restriction**: One account per IP address for exam integrity

### Internationalization

Supports Spanish (es) and English (en) with:
- Extended translation keys in `LanguageContext.tsx`
- JSON-based translations in `src/i18n/`
- Dynamic language switching with React Router key reset

### Build Optimization

The Vite configuration includes:
- **Code splitting**: Vendor libraries separated by functionality (React, Convex, Radix UI)
- **Memory allocation**: 8GB for production builds due to large question datasets
- **Asset optimization**: Question data lazy-loaded as separate chunks

### Environment Configuration

Required environment variables:
- `VITE_CONVEX_URL`: Convex deployment URL (currently: `https://accomplished-swordfish-668.convex.cloud`)
- Stripe API keys for payment processing
- Supabase credentials for fallback database

### Testing & Verification

The application includes comprehensive verification scripts:
- Convex connection and deployment status
- Netlify integration verification
- Database seeding validation
- Stripe payment integration testing

### Deployment

**Primary**: Netlify with automatic deployments
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 18
- SPA routing with catch-all redirects

**Database**: Convex for real-time functionality with Supabase as fallback

## Development Guidelines

### Adding New Questions
Use the seeding scripts in `/scripts/` to add aviation questions. Questions must include:
- Aircraft type (A320_FAMILY or B737_FAMILY)
- Category (specific aviation system)
- Difficulty level
- Official reference documentation
- Detailed explanations

### Component Development
- Follow shadcn/ui patterns for consistency
- Use TypeScript strict mode
- Implement proper error boundaries
- Consider mobile-first responsive design
- Apply aviation-themed styling from Tailwind config

### Database Changes
- Update Convex schema in `convex/schema.ts`
- Create migration scripts if needed
- Test with verification commands before deployment
- Consider backward compatibility for existing user data

### Internationalization
- Add new keys to both `es.json` and `en.json`
- Extend `LanguageContext.tsx` for complex translations
- Test language switching thoroughly
- Consider aviation terminology accuracy

This codebase emphasizes aviation training accuracy, user experience optimization, and robust fallback mechanisms to ensure reliability in professional training environments.