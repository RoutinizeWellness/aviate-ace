// Complete fix script to彻底解决 Convex ID validation issues
console.log('=== Complete Convex ID Fix ===');

// Function to validate Convex ID format
function isValidConvexId(id) {
  return /^[a-z]+_[a-z2-7]{16}$/.test(id);
}

// Function to generate proper Convex IDs
function generateConvexId(table) {
  const base32Chars = 'abcdefghijklmnopqrstuvwxyz234567';
  let result = '';
  
  // Generate exactly 16 random characters from the base32 charset
  for (let i = 0; i < 16; i++) {
    const randomIndex = Math.floor(Math.random() * base32Chars.length);
    result += base32Chars[randomIndex];
  }
  
  return `${table}_${result}`;
}

// Clear all storage mechanisms
console.log('Clearing all storage...');
localStorage.clear();
sessionStorage.clear();

// Clear cookies
console.log('Clearing cookies...');
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});

// Check if there are any global variables storing the invalid ID
console.log('Checking for global variables with invalid IDs...');
for (let key in window) {
  try {
    if (typeof window[key] === 'string' && window[key].includes('users_gbkwz6iehdsho37g')) {
      console.log('Found invalid ID in global variable:', key);
      // We can't directly modify window properties, but we can log them
    }
  } catch (e) {
    // Ignore errors for properties that can't be accessed
  }
}

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
    if (item && typeof item === 'string' && item.includes('users_gbkwz6iehdsho37g')) {
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
    if (item && typeof item === 'string' && item.includes('users_gbkwz6iehdsho37g')) {
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
console.log('');
console.log('IMPORTANT: Please refresh the page to apply changes.');
console.log('After refreshing, the Convex ID validation errors should be resolved.');