// Comprehensive cleanup script for Convex ID issues
(function() {
  console.log('=== Comprehensive Convex ID Cleanup ===');
  
  // List of known invalid IDs
  const knownInvalidIds = [
    'users_gbkwz6iehdsho37g',
    'users_jc6vtjsivj62ktfl'
  ];
  
  // List of keys to check
  const keysToCheck = [
    'convex_user',
    'convex-auth-dev-user',
    'user',
    'auth',
    'profile',
    'user_profile',
    'current_user'
  ];
  
  console.log('Known invalid IDs:', knownInvalidIds);
  console.log('Keys to check:', keysToCheck);
  
  // Check specific keys
  console.log('\n--- Checking specific keys ---');
  keysToCheck.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      console.log(`Checking key: ${key}`);
      let foundInvalid = false;
      
      knownInvalidIds.forEach(invalidId => {
        if (value.includes(invalidId)) {
          console.log(`  Found invalid ID ${invalidId} in ${key}, removing...`);
          localStorage.removeItem(key);
          foundInvalid = true;
        }
      });
      
      if (!foundInvalid) {
        console.log(`  No invalid IDs found in ${key}`);
      }
    }
  });
  
  // Check all localStorage items
  console.log('\n--- Checking all localStorage items ---');
  const allKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    allKeys.push(localStorage.key(i));
  }
  
  let itemsRemoved = 0;
  allKeys.forEach(key => {
    const value = localStorage.getItem(key);
    
    if (value) {
      knownInvalidIds.forEach(invalidId => {
        if (value.includes(invalidId)) {
          console.log(`Found invalid ID ${invalidId} in key: ${key}, removing...`);
          localStorage.removeItem(key);
          itemsRemoved++;
        }
      });
    }
  });
  
  // Clear sessionStorage as well
  console.log('\n--- Clearing sessionStorage ---');
  const sessionItems = sessionStorage.length;
  sessionStorage.clear();
  console.log(`Cleared ${sessionItems} sessionStorage items`);
  
  console.log(`\n=== Cleanup complete (${itemsRemoved} items removed) ===`);
  console.log('Please refresh your application');
  
  // Generate a new valid user
  console.log('\n--- Generating new valid user ---');
  const generateValidConvexId = (table) => {
    const base32Chars = 'abcdefghijklmnopqrstuvwxyz234567';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += base32Chars.charAt(Math.floor(Math.random() * base32Chars.length));
    }
    return `${table}_${result}`;
  };
  
  const validUserId = generateValidConvexId('user');
  const now = Date.now();
  const newUserData = {
    _id: validUserId,
    email: 'test@example.com',
    displayName: 'Test User',
    fullName: 'Test User',
    createdAt: now,
    updatedAt: now
  };
  
  localStorage.setItem('convex_user', JSON.stringify(newUserData));
  console.log('New valid user created with ID:', validUserId);
})();