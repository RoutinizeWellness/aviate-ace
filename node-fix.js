// Node.js version of the comprehensive fix script
const fs = require('fs');
const path = require('path');

console.log('=== Node.js Comprehensive Convex ID Fix ===');

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

// Create a new user with a valid ID
const newUser = {
  _id: generateConvexId('users'),
  email: 'user@example.com',
  displayName: 'User',
  createdAt: Date.now(),
  updatedAt: Date.now()
};

console.log('Generated new user with valid ID:', newUser._id);

// Save to a file that can be used in the browser
const fixScript = `
// Browser console fix script
console.log('=== Browser Comprehensive Convex ID Fix ===');

// Clear all storage
localStorage.clear();
sessionStorage.clear();

// Create a new user with a valid ID
const newUser = {
  _id: '${newUser._id}',
  email: 'user@example.com',
  displayName: 'User',
  createdAt: ${newUser.createdAt},
  updatedAt: ${newUser.updatedAt}
};

// Save the new user to localStorage
localStorage.setItem('convex_user', JSON.stringify(newUser));

console.log('New user created with valid Convex ID:', '${newUser._id}');
console.log('Storage cleared and reset. Please refresh the page.');
`;

// Write the browser script to a file
const scriptPath = path.join(__dirname, 'browser-fix.js');
fs.writeFileSync(scriptPath, fixScript);

console.log('=== Fix complete ===');
console.log('New user created with valid Convex ID:', newUser._id);
console.log('Browser fix script saved to:', scriptPath);
console.log('To fix the issue in your browser:');
console.log('1. Open the browser console (F12)');
console.log('2. Copy and paste the contents of browser-fix.js');
console.log('3. Press Enter to execute');
console.log('4. Refresh the page');