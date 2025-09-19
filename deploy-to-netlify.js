#!/usr/bin/env node

// Deployment script for Netlify that ensures Convex is properly connected
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Preparing deployment to Netlify with Convex integration');

try {
  // 1. Ensure Convex functions are deployed
  console.log('1. Deploying Convex functions...');
  execSync('npx convex deploy', { stdio: 'inherit' });
  
  // 2. Get the deployment URL
  console.log('2. Getting Convex deployment URL...');
  const envLocalContent = fs.readFileSync('.env.local', 'utf8');
  const convexUrlMatch = envLocalContent.match(/VITE_CONVEX_URL=(https:\/\/[^\s]+)/);
  
  if (!convexUrlMatch) {
    throw new Error('Could not find Convex URL in .env.local');
  }
  
  const convexUrl = convexUrlMatch[1];
  console.log(`   Convex URL: ${convexUrl}`);
  
  // 3. Update .env file with the deployment URL
  console.log('3. Updating .env file with Convex URL...');
  let envContent = fs.readFileSync('.env', 'utf8');
  
  // Replace the Convex URL line
  envContent = envContent.replace(
    /VITE_CONVEX_URL=.*/,
    `VITE_CONVEX_URL="${convexUrl}"`
  );
  
  fs.writeFileSync('.env', envContent);
  console.log('   .env file updated successfully');
  
  // 4. Build the application
  console.log('4. Building the application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Deployment preparation completed successfully!');
  console.log('📝 Next steps:');
  console.log('   1. Commit the changes to your repository');
  console.log('   2. Push to GitHub to trigger Netlify deployment');
  console.log('   3. Your app will automatically connect to Convex on Netlify');
  
} catch (error) {
  console.error('❌ Deployment preparation failed:', error.message);
  process.exit(1);
}