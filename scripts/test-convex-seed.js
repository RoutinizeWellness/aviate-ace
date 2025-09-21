#!/usr/bin/env node
// Test script to verify Convex database seeding

import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

async function testConvexSeeding() {
  console.log("Testing Convex database seeding...");
  
  try {
    // First, check the current count of questions
    console.log("Checking current question count...");
    let result;
    try {
      result = await execPromise('npx convex run seedQuestions:getExamQuestionsCount');
      console.log("Current question count result:", result.stdout);
    } catch (error) {
      console.log("Could not get current count, proceeding with seeding...");
    }
    
    // Run the seeding
    console.log("Running seeding process...");
    try {
      result = await execPromise('npx convex run seedQuestions:seedRealAviationQuestions');
      console.log("Seeding result:", result.stdout);
    } catch (error) {
      console.error("Error during seeding:", error.message);
      if (error.stderr) {
        console.error("Error details:", error.stderr);
      }
    }
    
    // Check the count again
    console.log("Checking question count after seeding...");
    try {
      result = await execPromise('npx convex run seedQuestions:getExamQuestionsCount');
      console.log("Question count after seeding:", result.stdout);
    } catch (error) {
      console.log("Could not get count after seeding");
    }
    
    console.log("Test completed!");
  } catch (error) {
    console.error("Error in test:", error.message);
  }
}

// Run the test
testConvexSeeding().catch(console.error);