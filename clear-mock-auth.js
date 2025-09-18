// Script to clear old authentication data from localStorage
// Run this in the browser console or as a temporary script to fix ID validation issues

console.log('Clearing authentication data...');

// Clear the convex_user data
localStorage.removeItem('convex_user');

// Also clear any other related cached data
Object.keys(localStorage).forEach(key => {
  if (key.includes('user') || key.includes('auth') || key.includes('session')) {
    console.log('Removing localStorage key:', key);
    localStorage.removeItem(key);
  }
});

// Clear any stored user data that might have invalid IDs
const userData = localStorage.getItem('convex_user');
if (userData) {
  try {
    const parsed = JSON.parse(userData);
    if (parsed._id && !/^[a-z]+_[a-z2-7]{16}$/.test(parsed._id)) {
      console.log('Removing user data with invalid ID format:', parsed._id);
      localStorage.removeItem('convex_user');
    }
  } catch (e) {
    console.log('Error parsing user data, clearing it');
    localStorage.removeItem('convex_user');
  }
}

console.log('Authentication data cleared. Please refresh the page to generate a new valid user ID.');