# Fix for Convex Login Mutation Error

## Problem
The error occurs because we're trying to execute [loginUser](file://c:\Users\Hernandez\OneDrive%20-%20VOSS%20Group\Escritorio\qoooder\aviate-ace\convex\auth.ts#L55-L69) as a Mutation, but it's defined as a Query in the Convex functions.

Error message:
```
[CONVEX M(auth:loginUser)] [Request ID: d851a2d746781b8a] Server Error
Trying to execute auth.js:loginUser as Mutation, but it is defined as Query.
```

## Solution
We've already fixed the issue by converting [loginUser](file://c:\Users\Hernandez\OneDrive%20-%20VOSS%20Group\Escritorio\qoooder\aviate-ace\convex\auth.ts#L55-L69) from a Query to a Mutation in the Convex functions.

## Files Updated
1. `convex/auth.ts` - Changed [loginUser](file://c:\Users\Hernandez\OneDrive%20-%20VOSS%20Group\Escritorio\qoooder\aviate-ace\convex\auth.ts#L55-L69) from query to mutation
2. `src/hooks/useConvexAuth.tsx` - Already correctly using loginUser as a mutation

## Steps to Resolve
1. Redeploy the Convex functions to apply the changes:
   ```bash
   npx convex dev
   ```
   
   Or run the PowerShell script:
   ```powershell
   .\redeploy-convex.ps1
   ```

2. Restart your development server:
   ```bash
   npm run dev
   ```

## Why This Happens
The mismatch occurs when:
- A Convex function is defined as a Query but called as a Mutation (or vice versa)
- The Convex client and server definitions are out of sync
- Cached definitions haven't been updated after changes

## Prevention
- Always ensure Convex function definitions match how they're called in the client
- Redeploy Convex functions after making changes
- Clear browser cache when testing authentication flows