#!/usr/bin/env node
// Script to seed Convex database with real aviation questions

import { api } from "../convex/_generated/api";
import { allRealAviationQuestions } from "../src/data/realAviationQuestions";
import { convex } from "../src/lib/convex";

async function seedQuestions() {
  console.log("Starting to seed Convex database with real aviation questions...");
  console.log(`Total questions to seed: ${allRealAviationQuestions.length}`);

  try {
    // Call the Convex mutation to seed questions
    const result = await convex.mutation(api.seedQuestions.seedRealAviationQuestions, {});
    console.log("Seed result:", result);
    
    console.log("Successfully seeded Convex database with real aviation questions!");
  } catch (error) {
    console.error("Error seeding Convex database:", error);
    
    // Fallback: Try to create questions one by one
    console.log("Trying fallback method - creating questions individually...");
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const question of allRealAviationQuestions) {
      try {
        await convex.mutation(api.exams.createExamQuestion, {
          question: question.question,
          options: question.options,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
          aircraftType: question.aircraftType,
          category: question.category,
          difficulty: question.difficulty,
          reference: question.reference,
          regulationCode: question.regulationCode,
        });
        successCount++;
        console.log(`Successfully created question: ${question.question.substring(0, 50)}...`);
      } catch (questionError) {
        errorCount++;
        console.error(`Error creating question: ${question.question.substring(0, 50)}...`, questionError);
      }
    }
    
    console.log(`Finished seeding with ${successCount} successes and ${errorCount} errors.`);
  }
}

// Run the seed function
seedQuestions().catch(console.error);