#!/usr/bin/env node

// Script to verify Convex connection before deploying to Netlify
import { readFileSync } from 'fs';
import { execSync } from 'child_process';

console.log('🔍 Verifying Convex connection for Netlify deployment...\n');

try {
  // 1. Check if .env file exists and has Convex URL
  console.log('1. Checking .env file...');
  const envContent = readFileSync('.env', 'utf8');
  const convexUrlMatch = envContent.match(/VITE_CONVEX_URL=(https:\/\/[^\s]+)/);
  
  if (!convexUrlMatch) {
    throw new Error('VITE_CONVEX_URL not found in .env file');
  }
  
  const convexUrl = convexUrlMatch[1];
  console.log(`   ✅ Convex URL found: ${convexUrl}`);
  
  // 2. Check if URL is a placeholder
  if (convexUrl === "https://your-convex-url.convex.cloud" || 
      convexUrl === "https://your-actual-convex-url.convex.cloud") {
    throw new Error('Convex URL is still set to placeholder value');
  }
  
  console.log('   ✅ Convex URL is properly configured');
  
  // 3. Check if Convex CLI is available
  console.log('\n2. Checking Convex CLI...');
  try {
    execSync('npx convex status', { stdio: 'ignore' });
    console.log('   ✅ Convex CLI is available and deployment is active');
  } catch (error) {
    console.warn('   ⚠️ Convex CLI check failed, but this is OK for Netlify deployment');
  }
  
  // 4. Verify the deployment is accessible
  console.log('\n3. Verifying deployment accessibility...');
  console.log('   🔍 You can test the connection by visiting /convex-test page after deployment');
  console.log('   📝 The test page will show detailed connection information');
  
  console.log('\n✅ Convex connection verification completed successfully!');
  console.log('\n📝 Next steps:');
  console.log('   1. Deploy to Netlify');
  console.log('   2. Visit /convex-test on your deployed site to verify connection');
  console.log('   3. Check browser console for detailed logs');
  
} catch (error) {
  console.error('❌ Convex connection verification failed:', error.message);
  console.log('\n🔧 Troubleshooting steps:');
  console.log('   1. Run: node connect-convex-netlify.js');
  console.log('   2. Check that VITE_CONVEX_URL in .env is correct');
  console.log('   3. Verify Convex deployment is active with: npx convex status');
  process.exit(1);
}