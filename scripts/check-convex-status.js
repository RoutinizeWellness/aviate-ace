#!/usr/bin/env node
// Script to check the current status of the Convex database

import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

async function checkConvexStatus() {
  console.log("Checking Convex database status...");
  
  try {
    // Check question count
    console.log("\n--- Question Count ---");
    try {
      const countResult = await execPromise('npx convex run seedQuestions:getExamQuestionsCount');
      console.log("Question count:", countResult.stdout);
    } catch (error) {
      console.error("Error getting question count:", error.message);
    }
    
    // Check if seeding function exists
    console.log("\n--- Available Functions ---");
    try {
      const functionsResult = await execPromise('npx convex run --list');
      const functions = functionsResult.stdout.split('\n').filter(line => line.includes('seed') || line.includes('exam'));
      console.log("Relevant functions:");
      functions.forEach(func => console.log("  -", func));
    } catch (error) {
      console.error("Error listing functions:", error.message);
    }
    
    // Check recent exam questions (first 3)
    console.log("\n--- Sample Questions ---");
    try {
      const questionsResult = await execPromise('npx convex run exams:getExamQuestions -- --limit 3');
      console.log("Sample questions:", questionsResult.stdout);
    } catch (error) {
      console.error("Error getting sample questions:", error.message);
    }
    
    console.log("\nStatus check completed!");
  } catch (error) {
    console.error("Error in status check:", error.message);
  }
}

// Run the status check
checkConvexStatus().catch(console.error);