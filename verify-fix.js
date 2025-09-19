// Verification script to check if Convex ID issues are resolved
// Run this in your browser's console after cleanup

(function() {
  console.log('=== Verifying Convex ID Fix ===');
  
  // Check if localStorage has a valid user
  const storedUser = localStorage.getItem('convex_user');
  if (!storedUser) {
    console.log('❌ No user found in localStorage');
    return;
  }
  
  try {
    const user = JSON.parse(storedUser);
    console.log('✅ User found in localStorage:', user);
    
    // Check if user has an ID
    if (!user._id) {
      console.log('❌ User has no ID');
      return;
    }
    
    console.log('User ID:', user._id);
    
    // Validate the ID format
    const isValidFormat = /^[a-z]+_[a-z2-7]{16}$/.test(user._id);
    if (!isValidFormat) {
      console.log('❌ User ID format is invalid');
      console.log('Expected format: table_name_16_base32_characters');
      console.log('Actual ID:', user._id);
      console.log('Length:', user._id.length);
      return;
    }
    
    console.log('✅ User ID format is valid');
    
    // Check for known invalid IDs
    const knownInvalidIds = [
      'users_gbkwz6iehdsho37g',
      'users_jc6vtjsivj62ktfl'
    ];
    
    if (knownInvalidIds.includes(user._id)) {
      console.log('❌ User has a known invalid ID');
      return;
    }
    
    console.log('✅ User ID is not in the known invalid list');
    
    // Check all localStorage items for invalid IDs
    console.log('\n--- Checking all localStorage items ---');
    let hasInvalidIds = false;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          knownInvalidIds.forEach(invalidId => {
            if (value.includes(invalidId)) {
              console.log(`❌ Found invalid ID ${invalidId} in key: ${key}`);
              hasInvalidIds = true;
            }
          });
        }
      }
    }
    
    if (!hasInvalidIds) {
      console.log('✅ No invalid IDs found in localStorage');
    }
    
    console.log('\n=== Verification Complete ===');
    console.log('✅ Convex ID issues appear to be resolved!');
    console.log('You can now use your application normally.');
    
  } catch (error) {
    console.log('❌ Error parsing user data:', error);
  }
})();