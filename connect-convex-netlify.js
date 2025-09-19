#!/usr/bin/env node

// Simple command to ensure Convex is connected for Netlify deployment
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

console.log('🔌 Ensuring Convex connection for Netlify deployment...');

try {
  // Check if Convex CLI is installed
  console.log('1. Checking Convex CLI...');
  execSync('npx convex dev --help', { stdio: 'ignore' });
  console.log('   ✅ Convex CLI is available');
  
  // Deploy Convex functions
  console.log('2. Deploying Convex functions...');
  execSync('npx convex deploy', { stdio: 'inherit' });
  console.log('   ✅ Convex functions deployed');
  
  // Read Convex URL from .env.local
  console.log('3. Reading Convex URL...');
  const envLocalContent = readFileSync('.env.local', 'utf8');
  const convexUrlMatch = envLocalContent.match(/VITE_CONVEX_URL=(https:\/\/[^\s]+)/);
  
  if (!convexUrlMatch) {
    throw new Error('Could not find Convex URL in .env.local');
  }
  
  const convexUrl = convexUrlMatch[1];
  console.log(`   ✅ Convex URL: ${convexUrl}`);
  
  // Update .env file
  console.log('4. Updating .env file...');
  let envContent = readFileSync('.env', 'utf8');
  
  // Replace or add the Convex URL
  if (envContent.includes('VITE_CONVEX_URL=')) {
    envContent = envContent.replace(
      /VITE_CONVEX_URL=.*/,
      `VITE_CONVEX_URL="${convexUrl}"`
    );
  } else {
    envContent += `\nVITE_CONVEX_URL="${convexUrl}"`;
  }
  
  writeFileSync('.env', envContent);
  console.log('   ✅ .env file updated');
  
  // Verify the connection
  console.log('5. Verifying configuration...');
  const updatedEnvContent = readFileSync('.env', 'utf8');
  if (updatedEnvContent.includes(convexUrl)) {
    console.log('   ✅ Convex URL is properly configured in .env');
  } else {
    throw new Error('Failed to update .env file with Convex URL');
  }
  
  console.log('\n✅ Convex is now properly connected for Netlify deployment!');
  console.log('\n📝 Next steps:');
  console.log('   1. Commit and push to GitHub to trigger Netlify deployment');
  console.log('   2. The application will automatically connect to Convex when it starts');
  console.log('   3. No additional configuration is needed on Netlify');
  
} catch (error) {
  console.error('❌ Failed to connect Convex for Netlify deployment:', error.message);
  process.exit(1);
}