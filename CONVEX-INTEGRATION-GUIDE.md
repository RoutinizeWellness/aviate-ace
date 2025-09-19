# Convex Integration Guide

This guide explains how to properly integrate Convex into the application and work directly with Convex functions instead of using mock data or local storage.

## Key Changes Made

1. **Fixed Convex Authentication System**:
   - Updated `useConvexAuth.tsx` to properly use Convex mutations and queries
   - Changed `loginUser` from a query to a mutation in `convex/auth.ts`
   - Implemented proper ID validation to ensure all IDs match the Convex format

2. **Enhanced ID Validation**:
   - Added `isValidConvexId` function to validate all user IDs
   - Ensured all generated IDs follow the pattern: `table_lowercase_base32chars`
   - Added validation checks before making Convex queries

3. **Direct Convex Usage**:
   - Removed all mock data implementations
   - Replaced local storage usage with direct Convex function calls
   - Implemented proper error handling for Convex operations

## How to Use Convex Directly

### 1. Authentication Flow

The authentication system now works directly with Convex:

```typescript
// In useConvexAuth.tsx
const registerUser = useMutation(api.auth.registerUser);
const loginUser = useMutation(api.auth.loginUser);
const getUser = useQuery(api.auth.getUser, user ? { userId: user._id } : "skip");
```

### 2. Valid Convex ID Format

All Convex IDs must follow this format:
- Pattern: `^[a-z]+_[a-z2-7]{16}$`
- Example: `users_gbkwz6iehdsho37g`
- Table name + underscore + 16 base32 characters (a-z, 2-7)

### 3. Query Validation

Before making any Convex queries, always validate the user ID:

```typescript
// In Dashboard.tsx
const isValidConvexId = (id: string): boolean => {
  return /^[a-z]+_[a-z2-7]{16}$/.test(id);
};

// Only make queries with valid IDs
const userProfileQueryParams = user && isValidConvexId(user._id) ? { userId: user._id } : "skip";
```

## Deployment Steps

1. **Set up Convex**:
   ```bash
   npm install convex
   npx convex dev
   ```

2. **Configure Environment Variables**:
   Add your Convex deployment URL to your environment variables:
   ```
   VITE_CONVEX_URL=https://your-deployment.convex.cloud
   ```

3. **Update Convex Client**:
   In your main App.tsx file, ensure you're using the correct Convex provider:
   ```typescript
   import { ConvexProvider, ConvexReactClient } from "convex/react";
   
   const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
   ```

## Troubleshooting

### Invalid ID Errors

If you encounter ID validation errors:
1. Run the cleanup script: `cleanup-invalid-ids.js`
2. Ensure all generated IDs follow the correct format
3. Check that no mock data is being used

### Function Not Found Errors

If Convex functions aren't found:
1. Verify the function exists in your `convex/` directory
2. Run `npx convex dev` to sync functions
3. Check that function names match exactly

## Example Usage

Here's a complete example of how to use Convex functions properly:

```typescript
// Register a new user
const result = await registerUser({ 
  email: "user@example.com", 
  fullName: "Test User",
  password: "securepassword"
});

// Login user
const userData = await loginUser({ email: "user@example.com" });

// Get user data
const user = await getUser({ userId: userData._id });
```

## Cleanup Scripts

- `cleanup-invalid-ids.js`: Removes any invalid IDs from storage
- `convex-example.js`: Demonstrates proper Convex usage
- `convex-demo.html`: Interactive demo of Convex functions

## Best Practices

1. Always validate IDs before making Convex queries
2. Use Convex mutations for data changes
3. Use Convex queries for data retrieval
4. Handle errors gracefully
5. Avoid mock data in production
6. Use proper TypeScript types for Convex functions

By following this guide, you should be able to work directly with Convex without encountering ID validation errors or mock data issues.