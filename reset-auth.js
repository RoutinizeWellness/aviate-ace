// Reset authentication data script
// Run this in your browser's console to clear all auth data and start fresh

(function() {
  console.log('=== Resetting Authentication Data ===');
  
  // Clear all auth-related localStorage items
  const authKeys = [
    'convex_user',
    'convex_auth_token',
    'convex-auth-dev-user',
    'user',
    'auth',
    'profile',
    'user_profile',
    'current_user'
  ];
  
  authKeys.forEach(key => {
    if (localStorage.getItem(key)) {
      console.log(`Removing localStorage item: ${key}`);
      localStorage.removeItem(key);
    }
  });
  
  // Clear sessionStorage
  console.log('Clearing sessionStorage...');
  sessionStorage.clear();
  
  // Also check for any items containing user IDs
  console.log('Checking for other items with user data...');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    
    if (value && (value.includes('users_') || value.includes('user'))) {
      console.log(`Found potential user data in key: ${key}`);
      // Only remove if it looks like auth data
      if (value.includes('_id') || value.includes('email')) {
        console.log(`Removing key: ${key}`);
        localStorage.removeItem(key);
      }
    }
  }
  
  console.log('=== Authentication data reset complete ===');
  console.log('Please refresh your application to start fresh');
  console.log('You will need to sign up or sign in again');
})();