# Convex Setup Instructions

This document provides instructions on how to properly set up Convex for the aviate-ace project.

## Prerequisites

1. Create a Convex account at https://convex.dev/
2. Install the Convex CLI: `npm install -g convex`

## Setting up Convex

1. In your project directory, run:
   ```bash
   convex dev
   ```

2. This will:
   - Create a new Convex project (if you don't have one)
   - Deploy your Convex functions
   - Provide you with a deployment URL

3. Copy the deployment URL from the output and update your `.env` file:
   ```env
   VITE_CONVEX_URL="https://your-actual-deployment-url.convex.cloud"
   ```

## Deploying Convex Functions

The project already includes Convex functions in the `convex/` directory:
- `auth.ts` - Authentication functions
- `exams.ts` - Exam-related functions
- `schema.ts` - Database schema

To deploy these functions:
```bash
convex deploy
```

## Testing the Setup

After updating your `.env` file with the correct Convex URL:
1. Restart your development server: `npm run dev`
2. The "Convex not available" warning should no longer appear
3. Authentication and data fetching should work properly

## Troubleshooting

If you still see "Convex not available" messages:
1. Verify your Convex URL in `.env` is correct
2. Ensure your Convex functions are deployed
3. Check your internet connection
4. Make sure you're not behind a firewall blocking Convex

For more information, refer to the [Convex documentation](https://docs.convex.dev/).# Convex Setup Instructions

This document provides instructions on how to properly set up Convex for the aviate-ace project.

## Prerequisites

1. Create a Convex account at https://convex.dev/
2. Install the Convex CLI: `npm install -g convex`

## Setting up Convex

1. In your project directory, run:
   ```bash
   convex dev
   ```

2. This will:
   - Create a new Convex project (if you don't have one)
   - Deploy your Convex functions
   - Provide you with a deployment URL

3. Copy the deployment URL from the output and update your `.env` file:
   ```env
   VITE_CONVEX_URL="https://your-actual-deployment-url.convex.cloud"
   ```

## Deploying Convex Functions

The project already includes Convex functions in the `convex/` directory:
- `auth.ts` - Authentication functions
- `exams.ts` - Exam-related functions
- `schema.ts` - Database schema

To deploy these functions:
```bash
convex deploy
```

## Testing the Setup

After updating your `.env` file with the correct Convex URL:
1. Restart your development server: `npm run dev`
2. The "Convex not available" warning should no longer appear
3. Authentication and data fetching should work properly

## Troubleshooting

If you still see "Convex not available" messages:
1. Verify your Convex URL in `.env` is correct
2. Ensure your Convex functions are deployed
3. Check your internet connection
4. Make sure you're not behind a firewall blocking Convex

For more information, refer to the [Convex documentation](https://docs.convex.dev/).