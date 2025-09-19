#!/usr/bin/env node

// Script to verify Convex configuration during build process
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verifying Convex configuration...');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  No .env file found, checking environment variables...');
} else {
  console.log('✅ .env file found');
  
  // Read the .env file
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('VITE_CONVEX_URL')) {
    console.log('✅ VITE_CONVEX_URL found in .env file');
    
    // Check if it's set to the correct value
    const convexUrlMatch = envContent.match(/VITE_CONVEX_URL=(.*)/);
    if (convexUrlMatch && convexUrlMatch[1]) {
      const convexUrl = convexUrlMatch[1].replace(/["\s]/g, '');
      console.log(`🔗 Convex URL: ${convexUrl}`);
      
      if (convexUrl === 'https://accomplished-swordfish-668.convex.cloud') {
        console.log('✅ Convex URL is correctly configured for production');
      } else if (convexUrl.includes('your-convex-url') || convexUrl.includes('placeholder')) {
        console.log('❌ Error: Convex URL is still set to placeholder value');
        process.exit(1);
      } else {
        console.log('✅ Convex URL is configured (custom deployment)');
      }
    }
  } else {
    console.log('⚠️  VITE_CONVEX_URL not found in .env file');
  }
}

// Check if we're in a Netlify build environment
if (process.env.NETLIFY) {
  console.log('🌐 Running in Netlify environment');
  
  // Check Netlify environment variables
  if (process.env.VITE_CONVEX_URL) {
    console.log(`🔗 Netlify VITE_CONVEX_URL: ${process.env.VITE_CONVEX_URL}`);
    
    if (process.env.VITE_CONVEX_URL === 'https://accomplished-swordfish-668.convex.cloud') {
      console.log('✅ Convex URL is correctly configured for Netlify deployment');
    } else if (process.env.VITE_CONVEX_URL.includes('your-convex-url') || process.env.VITE_CONVEX_URL.includes('placeholder')) {
      console.log('❌ Error: Convex URL is still set to placeholder value in Netlify environment');
      process.exit(1);
    } else {
      console.log('✅ Convex URL is configured for Netlify (custom deployment)');
    }
  } else {
    console.log('⚠️  VITE_CONVEX_URL not set in Netlify environment variables');
  }
}

console.log('✅ Convex configuration verification completed');