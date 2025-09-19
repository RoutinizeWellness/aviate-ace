// Test script for Convex ID validation
import { isValidConvexId, generateValidConvexId } from './convex-example.js';

console.log('=== Convex ID Validation Tests ===');

// Test valid ID
const validId = 'users_gbkwz6iehdsho37g';
console.log(`Valid ID test (${validId}):`, isValidConvexId(validId));

// Test invalid ID (too long)
const invalidId = 'users_gbkwz6iehdsho37g_extra';
console.log(`Invalid ID test (${invalidId}):`, isValidConvexId(invalidId));

// Test another invalid ID (wrong characters)
const invalidId2 = 'users_gbkwz6iehdsho371'; // contains '1' which is not allowed
console.log(`Invalid ID test (${invalidId2}):`, isValidConvexId(invalidId2));

// Generate and test a new valid ID
const generatedId = generateValidConvexId('users');
console.log(`Generated ID test (${generatedId}):`, isValidConvexId(generatedId));

console.log('=== Tests Complete ===');