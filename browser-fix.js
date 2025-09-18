// Browser console fix script for Convex ID validation issues
console.log('=== Browser Comprehensive Convex ID Fix ===');

// Clear all storage
console.log('Clearing localStorage...');
localStorage.clear();

console.log('Clearing sessionStorage...');
sessionStorage.clear();

// Clear any cookies
console.log('Clearing cookies...');
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});

// Generate a valid Convex ID
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

console.log('=== Fix complete ===');
console.log('New user created with valid Convex ID:', newUser._id);
console.log('Storage cleared and reset.');
console.log('Please refresh the page to apply changes.');