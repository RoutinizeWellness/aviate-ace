// Cleanup script to remove any invalid Convex IDs from localStorage
(function() {
  console.log('=== Cleaning up invalid Convex IDs ===');
  
  // Function to generate a valid Convex ID
  function generateConvexId(table) {
    const chars = 'abcdefghijklmnopqrstuvwxyz234567';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return table + '_' + result;
  }
  
  // Function to validate Convex ID format
  function isValidConvexId(id) {
    return /^[a-z]+_[a-z2-7]{16}$/.test(id);
  }
  
  // Clean up localStorage
  console.log('Cleaning localStorage...');
  Object.keys(localStorage).forEach(key => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        // Check if the item contains any invalid IDs
        if (typeof item === 'string' && item.includes('users_') && !isValidConvexId(item)) {
          console.log('Removing item with invalid ID from localStorage:', key);
          localStorage.removeItem(key);
        }
      }
    } catch (e) {
      // Ignore errors for items that can't be parsed
    }
  });
  
  // Clean up sessionStorage
  console.log('Cleaning sessionStorage...');
  Object.keys(sessionStorage).forEach(key => {
    try {
      const item = sessionStorage.getItem(key);
      if (item) {
        // Check if the item contains any invalid IDs
        if (typeof item === 'string' && item.includes('users_') && !isValidConvexId(item)) {
          console.log('Removing item with invalid ID from sessionStorage:', key);
          sessionStorage.removeItem(key);
        }
      }
    } catch (e) {
      // Ignore errors for items that can't be parsed
    }
  });
  
  console.log('=== Cleanup complete ===');
  console.log('Please refresh the page to start with clean data.');
})();