#!/usr/bin/env node
// Simple script to seed Convex database with real aviation questions
// This script uses the Convex CLI to run a mutation directly

import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

async function seedConvexDatabase() {
  console.log("Starting to seed Convex database with real aviation questions...");
  
  try {
    // Run the Convex mutation to seed questions
    console.log("Running Convex mutation to seed real aviation questions...");
    const { stdout, stderr } = await execPromise('npx convex run seedQuestions:seedRealAviationQuestions');
    
    if (stderr) {
      console.error("Error output:", stderr);
    }
    
    console.log("Output:", stdout);
    console.log("Successfully seeded Convex database with real aviation questions!");
  } catch (error) {
    console.error("Error seeding Convex database:", error.message);
    console.log("Make sure Convex is properly set up and you're running this from the project root.");
  }
}

// Run the seed function
seedConvexDatabase().catch(console.error);