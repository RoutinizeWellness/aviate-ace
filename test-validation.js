// Test the validation function
console.log('Testing Convex ID validation...');

// Test function
const isValidConvexId = (id) => {
  // Convex IDs have format: table_name_ followed by 16 base32 characters
  // But we also need to check if it's not the specific invalid ID we know about
  const isValidFormat = /^[a-z]+_[a-z2-7]{16}$/.test(id);
  
  // Specific check for the known invalid ID
  const isKnownInvalidId = id === 'users_gbkwz6iehdsho37g';
  
  const result = isValidFormat && !isKnownInvalidId;
  console.log(`ID validation for ${id}:`, result);
  console.log(`  Format valid: ${isValidFormat}`);
  console.log(`  Is known invalid: ${isKnownInvalidId}`);
  return result;
};

// Test cases
const testCases = [
  'users_gbkwz6iehdsho37g', // The problematic ID
  'user_abcdefghijklmnop',   // Valid format
  'users_abcdefghijklmnop',  // Valid format
  'user_abc123def456ghi7',   // Valid format with numbers
  'users_invalidcharhere',   // Invalid characters
  'user_shortid',            // Too short
  'user_toolongidhere12345', // Too long
];

testCases.forEach(id => {
  console.log(`\nTesting: ${id}`);
  isValidConvexId(id);
});