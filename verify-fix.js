// Verification script to check if the Convex ID fix is working
console.log('=== Convex ID Verification ===');

// Function to validate Convex ID format
function isValidConvexId(id) {
  const isValid = /^[a-z]+_[a-z2-7]{16}$/.test(id);
  console.log(`ID ${id} validation:`, isValid);
  return isValid;
}

// Check if there's a user in localStorage
const storedUser = localStorage.getItem('convex_user');
if (storedUser) {
  try {
    const user = JSON.parse(storedUser);
    console.log('Found user in localStorage:', user);
    
    if (user._id) {
      if (isValidConvexId(user._id)) {
        console.log('✅ SUCCESS: User has a valid Convex ID');
        console.log('User ID:', user._id);
        console.log('ID length after underscore:', user._id.split('_')[1].length);
      } else {
        console.log('❌ ERROR: User has an invalid Convex ID');
        console.log('Invalid ID:', user._id);
        console.log('ID length after underscore:', user._id.split('_')[1].length);
      }
    } else {
      console.log('❌ ERROR: User object missing _id field');
    }
  } catch (e) {
    console.log('❌ ERROR: Could not parse user data');
    console.log('Stored data:', storedUser);
  }
} else {
  console.log('⚠️ WARNING: No user found in localStorage');
  console.log('This is normal if you just ran the fix script and haven\'t refreshed the page yet');
}

console.log('=== Verification Complete ===');