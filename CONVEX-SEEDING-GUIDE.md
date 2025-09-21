# Convex Database Seeding Guide

This guide explains how to seed the Convex database with the real aviation questions for the PilotPrepFlightX application.

## Overview

The application uses Convex as its primary database for storing exam questions and user data. The real aviation questions (75+ official A320 and general aviation questions) need to be seeded into the Convex database to be used in the application.

## Prerequisites

1. Make sure you have the Convex CLI installed:
   ```bash
   npm install -g convex
   ```

2. Ensure you're logged into your Convex account:
   ```bash
   npx convex login
   ```

3. Make sure your Convex project is properly configured and deployed.

## Seeding the Database

### Method 1: Using the Custom Script (Recommended)

Run the custom seeding script:
```bash
npm run seed:convex
```

This will execute the `seedRealAviationQuestions` mutation in your Convex functions, which will:
1. Check if questions already exist in the database
2. If not, insert all 75+ real aviation questions from the static data
3. Return a success message with the count of inserted questions

### Method 2: Direct Convex CLI Command

You can also run the seeding directly using the Convex CLI:
```bash
npx convex run seedQuestions:seedRealAviationQuestions
```

### Method 3: Manual Seeding via Convex Dashboard

1. Go to your Convex dashboard: https://dashboard.convex.dev/
2. Select your project
3. Navigate to the "Functions" section
4. Find the `seedQuestions:seedRealAviationQuestions` mutation
5. Run it manually

## Testing the Seeding

To test if the seeding works correctly, you can run:
```bash
npm run test:seed
```

This will:
1. Check the current count of questions in the database
2. Run the seeding process
3. Check the count again to verify the questions were added

## Checking Database Status

To check the current status of your Convex database, run:
```bash
npm run check:convex
```

This will show:
- Current question count
- Available relevant functions
- Sample questions from the database

## Verifying the Seeding

After seeding, you can verify that the questions were inserted correctly:

1. Check the Convex dashboard query section
2. Run a query to count the questions:
   ```bash
   npx convex run exams:getExamQuestions --watch
   ```

3. Or check in your application - the exams should now show the real aviation questions instead of the limited set.

## Troubleshooting

### Common Issues

1. **Authentication Error**: Make sure you're logged into Convex (`npx convex login`)

2. **Function Not Found**: Ensure your Convex functions are deployed:
   ```bash
   npx convex dev
   ```

3. **Permission Denied**: Make sure your Convex project credentials are correct

### Clearing Existing Data (if needed)

If you need to clear existing questions and re-seed:
```bash
npx convex run seedQuestions:clearAllExamQuestions
npm run seed:convex
```

## How It Works

The seeding process works by:

1. The `seedRealAviationQuestions` mutation in `convex/seedQuestions.ts` is called
2. It checks if real aviation questions already exist in the database
3. If not, it reads the questions from `src/data/realAviationQuestions.ts`
4. It inserts each question into the `examQuestions` table in Convex
5. It returns the count of successfully inserted questions

## Database Schema

The questions are stored in the `examQuestions` table with the following fields:
- `question`: The question text
- `options`: Array of answer options
- `correctAnswer`: Index of the correct answer (0-based)
- `explanation`: Detailed explanation of the correct answer
- `aircraftType`: Type of aircraft (A320_FAMILY, BOEING_737, etc.)
- `category`: Question category (Electrical, Hydraulics, etc.)
- `difficulty`: Difficulty level (beginner, intermediate, advanced)
- `isActive`: Whether the question is active
- `createdAt`: Timestamp when the question was created
- `reference`: Official reference documentation
- `regulationCode`: Applicable aviation regulation

## Maintenance

When adding new questions to `src/data/realAviationQuestions.ts`, you can re-run the seeding script to add them to the database. The seeding function is designed to be idempotent - it won't duplicate existing questions.