# Convex ID Validation Fix

This document explains how to resolve Convex ID validation errors in the PilotPrepFlightX application.

## Problem

You're encountering this error:
```
ArgumentValidationError: Value does not match validator.
Path: .userId
Value: "users_jc6vtjsivj62ktfl"
Validator: v.id("users")
```

This happens because the application is using invalid Convex IDs that don't match the expected format.

## Solution

We've implemented several fixes:

1. **Enhanced ID Validation** - Both `useConvexAuth.tsx` and `Dashboard.tsx` now have improved validation logic
2. **Automatic Cleanup** - The AuthProvider now automatically cleans up known invalid IDs
3. **Manual Cleanup Tools** - Additional tools for manual cleanup if needed

## Files Updated

1. `src/hooks/useConvexAuth.tsx` - Enhanced authentication with better ID validation and cleanup
2. `src/pages/Dashboard.tsx` - Enhanced ID validation and error handling
3. `cleanup-invalid-ids.js` - Script to manually clean up invalid IDs
4. `run-cleanup.html` - HTML interface to run cleanup in browser
5. `verify-fix.js` - Script to verify the fix is working

## How to Fix the Issue

### Option 1: Automatic Fix (Recommended)
Simply refresh your application. The enhanced AuthProvider will automatically:
- Detect invalid IDs
- Clean them up
- Generate a new valid user

### Option 2: Manual Cleanup
If the automatic fix doesn't work:

1. Open `run-cleanup.html` in your browser
2. Click "Ejecutar Limpieza"
3. Close the window
4. Refresh your application

### Option 3: Browser Console Cleanup
1. Open your browser's developer tools (F12)
2. Go to the Console tab
3. Copy and paste the contents of `cleanup-invalid-ids.js`
4. Press Enter
5. Refresh your application

## Verification

To verify the fix is working:

1. Open your browser's developer tools (F12)
2. Go to the Console tab
3. Copy and paste the contents of `verify-fix.js`
4. Press Enter

You should see a message confirming the fix is working.

## How to Prevent This Issue

1. Always use the enhanced AuthProvider which validates IDs
2. The system now automatically prevents known invalid IDs
3. New users are generated with proper Convex ID format

## Technical Details

Valid Convex IDs:
- Format: `table_name_16_base32_characters`
- Example: `users_xvz2wq4e6y8a1b3c`
- Characters allowed: a-z and 2-7 only
- Length after underscore: exactly 16 characters

The system now:
- Validates all IDs before use
- Automatically converts invalid IDs
- Prevents known problematic IDs
- Generates proper IDs for new users