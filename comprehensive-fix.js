// Comprehensive fix script for Convex ID validation issues
console.log('=== Comprehensive Convex ID Fix ===');

// Function to validate Convex ID format
const isValidConvexId = (id) => {
  return /^[a-z]+_[a-z2-7]{16}$/.test(id);
};

// Function to generate proper Convex IDs
const generateConvexId = (table) => {
  const base32Chars = 'abcdefghijklmnopqrstuvwxyz234567';
  let result = '';
  
  // Generate exactly 16 random characters from the base32 charset
  for (let i = 0; i < 16; i++) {
    const randomIndex = Math.floor(Math.random() * base32Chars.length);
    result += base32Chars[randomIndex];
  }
  
  return `${table}_${result}`;
};

// Function to fix user ID format
const fixUserId = (userId) => {
  if (isValidConvexId(userId)) {
    return userId;
  }
  
  // Generate a new valid ID
  return generateConvexId('users');
};

// Clear all storage first
console.log('Clearing all storage...');
localStorage.clear();
sessionStorage.clear();

// Also clear any cookies that might contain invalid user data
console.log('Clearing cookies...');
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});

// Create a new user with a valid ID
const newUser = {
  _id: generateConvexId('users'),
  email: 'user@example.com',
  displayName: 'User',
  createdAt: Date.now(),
  updatedAt: Date.now()
};

console.log('Generated new user with valid ID:', newUser._id);

// Save the new user to localStorage
localStorage.setItem('convex_user', JSON.stringify(newUser));

// Also check for any other storage items that might contain the invalid ID
console.log('Checking for other storage items with invalid IDs...');

// Check all localStorage items
Object.keys(localStorage).forEach(key => {
  try {
    const item = localStorage.getItem(key);
    if (item && item.includes('users_gbkwz6iehdsho37g')) {
      console.log('Found invalid ID in localStorage key:', key);
      localStorage.removeItem(key);
    }
  } catch (e) {
    // Ignore errors for items that can't be parsed
  }
});

// Check all sessionStorage items
Object.keys(sessionStorage).forEach(key => {
  try {
    const item = sessionStorage.getItem(key);
    if (item && item.includes('users_gbkwz6iehdsho37g')) {
      console.log('Found invalid ID in sessionStorage key:', key);
      sessionStorage.removeItem(key);
    }
  } catch (e) {
    // Ignore errors for items that can't be parsed
  }
});

console.log('=== Fix complete ===');
console.log('New user created with valid Convex ID:', newUser._id);
console.log('All storage cleared and reset.');
console.log('Please refresh the page.');// Save the new user to localStorage
localStorage.setItem('convex_user', JSON.stringify(newUser));

// Also check for any other storage items that might contain the invalid ID
console.log('Checking for other storage items with invalid IDs...');

// Check all localStorage items
Object.keys(localStorage).forEach(key => {
  try {
    const item = localStorage.getItem(key);
    if (item && item.includes('users_gbkwz6iehdsho37g')) {
      console.log('Found invalid ID in localStorage key:', key);
      localStorage.removeItem(key);
    }
  } catch (e) {
    // Ignore errors for items that can't be parsed
  }
});

// Check all sessionStorage items
Object.keys(sessionStorage).forEach(key => {
  try {
    const item = sessionStorage.getItem(key);
    if (item && item.includes('users_gbkwz6iehdsho37g')) {
      console.log('Found invalid ID in sessionStorage key:', key);
      sessionStorage.removeItem(key);
    }
  } catch (e) {
    // Ignore errors for items that can't be parsed
  }
});

console.log('=== Fix complete ===');
console.log('New user created with valid Convex ID:', newUser._id);
console.log('All storage cleared and reset.');
console.log('Please refresh the page.');