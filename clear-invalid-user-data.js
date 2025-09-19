// Script to clear invalid user data from localStorage
(function() {
  console.log('Clearing invalid user data from localStorage...');
  
  // Clear all auth-related data
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('auth') || key.includes('user') || key.includes('convex') || key.includes('supabase'))) {
      keysToRemove.push(key);
    }
  }
  
  console.log('Keys to remove:', keysToRemove);
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log(`Removed: ${key}`);
  });
  
  // Also clear all data as a failsafe
  localStorage.clear();
  
  console.log('All localStorage data cleared.');
  console.log('Generating new valid user data...');
  
  // Generate a valid Convex-style ID (16 base32 characters)
  const generateValidConvexId = () => {
    const base32Chars = 'abcdefghijklmnopqrstuvwxyz234567';
    let result = 'user_';
    for (let i = 0; i < 16; i++) {
      result += base32Chars.charAt(Math.floor(Math.random() * base32Chars.length));
    }
    return result;
  };
  
  // Create new valid user data
  const validUserId = generateValidConvexId();
  const newUserData = {
    user: {
      id: validUserId,
      _id: validUserId,
      email: 'test@example.com',
      fullName: 'Test User'
    },
    profile: {
      userId: validUserId,
      displayName: 'Test User',
      avatarUrl: null,
      createdAt: new Date().toISOString()
    }
  };
  
  // Store the new valid data
  localStorage.setItem('convex-auth-dev-user', JSON.stringify(newUserData));
  
  console.log('New valid user data created with ID:', validUserId);
  console.log('Data stored in localStorage.');
  console.log('\nPlease refresh your browser to use the application with valid data.');
})();