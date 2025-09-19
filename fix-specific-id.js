// Script to specifically fix the invalid Convex ID issue
(function() {
  console.log('=== Convex ID Fix Script ===');
  console.log('Looking for invalid Convex ID: users_gbkwz6iehdsho37g');
  
  // Check all localStorage items
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    
    // Check if this item contains the invalid ID
    if (value && value.includes('users_gbkwz6iehdsho37g')) {
      console.log(`Found invalid ID in key: ${key}`);
      
      try {
        // Try to parse as JSON
        const parsed = JSON.parse(value);
        console.log('Parsed object:', parsed);
        
        // If it's the user object, replace with a valid one
        if (parsed._id === 'users_gbkwz6iehdsho37g' || 
            parsed.userId === 'users_gbkwz6iehdsho37g' ||
            parsed.user?._id === 'users_gbkwz6iehdsho37g') {
          
          console.log('Found user object with invalid ID, replacing...');
          
          // Generate a valid Convex-style ID
          const generateValidConvexId = () => {
            const base32Chars = 'abcdefghijklmnopqrstuvwxyz234567';
            let result = '';
            for (let j = 0; j < 16; j++) {
              result += base32Chars.charAt(Math.floor(Math.random() * base32Chars.length));
            }
            return 'user_' + result;
          };
          
          const validId = generateValidConvexId();
          console.log('Generated valid ID:', validId);
          
          // Replace the invalid ID
          if (parsed._id) parsed._id = validId;
          if (parsed.userId) parsed.userId = validId;
          if (parsed.user?._id) parsed.user._id = validId;
          
          // Save back to localStorage
          localStorage.setItem(key, JSON.stringify(parsed));
          console.log('Updated item with valid ID');
        }
      } catch (e) {
        // Not JSON, just remove the item
        console.log('Removing non-JSON item with invalid ID');
        localStorage.removeItem(key);
      }
    }
  }
  
  console.log('=== Fix complete ===');
  console.log('Please refresh your application');
})();