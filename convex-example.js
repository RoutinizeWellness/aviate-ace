// Example of how to work directly with Convex functions
// This demonstrates the proper way to handle Convex IDs and authentication

// Function to generate a valid Convex ID (for testing purposes)
export function generateValidConvexId(table) {
  const chars = 'abcdefghijklmnopqrstuvwxyz234567';
  let result = '';
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return table + '_' + result;
}

// Function to validate Convex ID format
export function isValidConvexId(id) {
  return /^[a-z]+_[a-z2-7]{16}$/.test(id);
}

// Example of how to use Convex functions properly
async function exampleConvexUsage() {
  console.log('=== Convex Usage Example ===');
  
  // 1. Generate a valid user ID
  const userId = generateValidConvexId('users');
  console.log('Generated valid user ID:', userId);
  console.log('Is valid ID:', isValidConvexId(userId));
  
  // 2. Example of how you would call Convex functions in a real app
  // (This is just for demonstration - in a real app, you would use the Convex client)
  
  // Example mutation call (register user)
  /*
  const registerResult = await convex.mutation('auth:registerUser', {
    email: 'user@example.com',
    fullName: 'Test User',
    password: 'securepassword'
  });
  console.log('Registration result:', registerResult);
  */
  
  // Example query call (get user)
  /*
  const user = await convex.query('auth:getUser', {
    userId: userId
  });
  console.log('User data:', user);
  */
  
  console.log('=== End of Example ===');
}

// Run the example
exampleConvexUsage().catch(console.error);