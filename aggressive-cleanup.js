// Aggressive cleanup script for the specific invalid Convex ID
(function() {
  console.log('=== Aggressive Convex ID Cleanup ===');
  console.log('Target ID: users_gbkwz6iehdsho37g');
  
  // List of keys to check and clean
  const keysToCheck = [
    'convex_user',
    'convex-auth-dev-user',
    'user',
    'auth',
    'profile'
  ];
  
  // Check specific keys
  keysToCheck.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      console.log(`Checking key: ${key}`);
      if (value.includes('users_gbkwz6iehdsho37g')) {
        console.log(`  Found invalid ID in ${key}, removing...`);
        localStorage.removeItem(key);
      } else {
        console.log(`  No invalid ID found in ${key}`);
      }
    }
  });
  
  // Check all localStorage items
  console.log('\nChecking all localStorage items...');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    
    if (value && value.includes('users_gbkwz6iehdsho37g')) {
      console.log(`Found invalid ID in key: ${key}, removing...`);
      localStorage.removeItem(key);
    }
  }
  
  console.log('\n=== Cleanup complete ===');
  console.log('Please refresh your application');
  
  // Also clear sessionStorage just in case
  console.log('\nClearing sessionStorage...');
  sessionStorage.clear();
  console.log('sessionStorage cleared');
})();