// Comprehensive script to fix Convex ID issues
console.log('=== Convex ID Fix Script ===');

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

// Function to validate Convex ID format
const isValidConvexId = (id) => {
  return /^[a-z]+_[a-z2-7]{16}$/.test(id);
};

// Function to fix user ID format
const fixUserId = (userId) => {
  if (isValidConvexId(userId)) {
    console.log('ID is already valid:', userId);
    return userId;
  }
  
  // Extract table name (everything before the first underscore or default to 'users')
  const tableMatch = userId.match(/^([a-z]+)_/);
  const table = tableMatch ? tableMatch[1] : 'users';
  
  // Generate a new valid ID
  const newId = generateConvexId(table);
  console.log('Converting invalid ID:', userId, 'to valid ID:', newId);
  return newId;
};

// Clear all auth-related localStorage data
console.log('Clearing auth-related localStorage data...');
const keysToRemove = [];
Object.keys(localStorage).forEach(key => {
  if (key.includes('user') || key.includes('auth') || key.includes('session')) {
    keysToRemove.push(key);
  }
});

keysToRemove.forEach(key => {
  console.log('Removing localStorage key:', key);
  localStorage.removeItem(key);
});

// Specifically handle convex_user data
const userData = localStorage.getItem('convex_user');
if (userData) {
  try {
    const parsed = JSON.parse(userData);
    console.log('Found user data:', parsed);
    
    if (parsed._id) {
      const fixedId = fixUserId(parsed._id);
      if (fixedId !== parsed._id) {
        const fixedUser = {
          ...parsed,
          _id: fixedId,
          updatedAt: Date.now()
        };
        console.log('Updating user with fixed ID:', fixedUser);
        localStorage.setItem('convex_user', JSON.stringify(fixedUser));
      } else {
        console.log('User ID is already valid');
      }
    }
  } catch (e) {
    console.log('Error parsing user data, removing it');
    localStorage.removeItem('convex_user');
  }
}

console.log('=== Fix complete ===');
console.log('Please refresh the page to generate new valid IDs if needed.');