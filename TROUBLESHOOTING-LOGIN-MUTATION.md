# Troubleshooting Convex Login Mutation Error

## Problem
The error occurs when trying to execute [loginUser](file://c:\Users\Hernandez\OneDrive%20-%20VOSS%20Group\Escritorio\qoooder\aviate-ace\convex\auth.ts#L55-L89) as a Mutation, but Convex reports it's defined as a Query.

Error message:
```
[CONVEX M(auth:loginUser)] [Request ID: defe1600ca445f6c] Server Error
Trying to execute auth.js:loginUser as Mutation, but it is defined as Query.
```

## Root Cause
This error typically happens due to one of these reasons:
1. Function definition mismatch (query vs mutation)
2. Cached/stale function definitions
3. Incomplete redeployment of Convex functions
4. Browser cache issues

## Solution Implemented
We've already fixed the core issue:
1. ✅ Changed [loginUser](file://c:\Users\Hernandez\OneDrive%20-%20VOSS%20Group\Escritorio\qoooder\aviate-ace\convex\auth.ts#L55-L89) from a Query to a Mutation in `convex/auth.ts`
2. ✅ Redeployed Convex functions with `npx convex dev`
3. ✅ Restarted the development server

## Additional Troubleshooting Steps

### 1. Clear Browser Cache
- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cookies and cache for localhost
- Try in an incognito/private browsing window

### 2. Verify Function Definition
Check that [loginUser](file://c:\Users\Hernandez\OneDrive%20-%20VOSS%20Group\Escritorio\qoooder\aviate-ace\convex\auth.ts#L55-L89) is defined as a mutation in `convex/auth.ts`:
```typescript
export const loginUser = mutation({
  // ... function definition
});
```

### 3. Check Client Usage
Verify that the client is using the function as a mutation in `src/hooks/useConvexAuth.tsx`:
```typescript
const loginUser = useMutation(api.auth.loginUser);
```

### 4. Force Function Redeployment
If the issue persists:
```bash
# Stop the development server (Ctrl+C)
# Redeploy Convex functions
npx convex dev
# Restart the development server
npm run dev
```

### 5. Check Convex Dashboard
Visit the Convex dashboard to verify the function type:
1. Go to https://dashboard.convex.dev
2. Navigate to your project
3. Check the Functions tab
4. Verify [loginUser](file://c:\Users\Hernandez\OneDrive%20-%20VOSS%20Group\Escritorio\qoooder\aviate-ace\convex\auth.ts#L55-L89) is listed as a Mutation

## Prevention
To avoid this issue in the future:
1. Always ensure function definitions match their usage (query vs mutation)
2. Redeploy Convex functions after making changes
3. Clear browser cache when testing authentication flows
4. Use the Convex dashboard to verify function definitions

## Common Mistakes
1. Defining authentication functions as queries instead of mutations
2. Forgetting to redeploy after changing function types
3. Not clearing browser cache after redeployment
4. Mixing up function names or imports

## Need More Help?
If the issue persists:
1. Check the Convex documentation: https://docs.convex.dev/functions
2. Review the Convex community forum: https://convex.dev/community
3. Contact Convex support: support@convex.dev