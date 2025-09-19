// Script to clear invalid Convex ID data and generate new valid user data
(function() {
  console.log('Starting cleanup of invalid Convex ID data...');
  
  // Helper function to check if an ID looks like a Convex ID
  const isValidConvexId = (id) => {
    // Convex IDs have format: table_name_ followed by 16 base32 characters
    return /^[a-z]+_[a-z2-7]{16}$/.test(id);
  };
  
  // Helper function to generate proper Convex IDs
  const generateConvexId = (table) => {
    // Generate a proper Convex-like ID with base32-like encoding
    const base32Chars = 'abcdefghijklmnopqrstuvwxyz234567';
    let result = '';
    
    // Generate 16 random characters from the base32 charset
    for (let i = 0; i < 16; i++) {
      const randomIndex = Math.floor(Math.random() * base32Chars.length);
      result += base32Chars[randomIndex];
    }
    
    return `${table}_${result}`;
  };
  
  // Check localStorage for invalid user data
  const storedUser = localStorage.getItem('convex_user');
  console.log('Stored user data:', storedUser);
  
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      console.log('Parsed user:', parsedUser);
      
      if (parsedUser._id) {
        console.log('User ID:', parsedUser._id);
        console.log('ID is valid:', isValidConvexId(parsedUser._id));
        
        if (!isValidConvexId(parsedUser._id)) {
          console.log('Invalid ID found, clearing localStorage...');
          localStorage.removeItem('convex_user');
          
          // Generate new valid user data
          const newUserId = generateConvexId('users');
          const newUser = {
            _id: newUserId,
            email: 'user@example.com',
            fullName: 'Usuario de Ejemplo',
            displayName: 'Usuario',
            createdAt: Date.now(),
            updatedAt: Date.now()
          };
          
          console.log('Generated new user with valid ID:', newUser);
          localStorage.setItem('convex_user', JSON.stringify(newUser));
          console.log('New user data saved to localStorage');
        } else {
          console.log('User ID is already valid');
        }
      }
    } catch (error) {
      console.error('Error parsing stored user:', error);
      localStorage.removeItem('convex_user');
    }
  } else {
    console.log('No stored user data found');
    
    // Generate new valid user data
    const newUserId = generateConvexId('users');
    const newUser = {
      _id: newUserId,
      email: 'user@example.com',
      fullName: 'Usuario de Ejemplo',
      displayName: 'Usuario',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    console.log('Generated new user with valid ID:', newUser);
    localStorage.setItem('convex_user', JSON.stringify(newUser));
    console.log('New user data saved to localStorage');
  }
  
  console.log('Cleanup completed. Please refresh the page.');
})();