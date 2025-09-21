import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { allRealAviationQuestions } from "../src/data/realAviationQuestions";

// Seed real aviation questions to Convex database
export const seedRealAviationQuestions = mutation({
  args: {},
  handler: async (ctx) => {
    try {
      // Check if we already have real aviation questions
      const existingQuestions = await ctx.db.query("examQuestions")
        .filter((q) => q.eq(q.field("aircraftType"), "A320_FAMILY"))
        .collect();
      
      if (existingQuestions.length > 70) {
        return { 
          message: "Real aviation questions already seeded", 
          count: existingQuestions.length,
          status: "success"
        };
      }

      // Insert all real aviation questions
      let insertedCount = 0;
      let errorCount = 0;
      
      for (const question of allRealAviationQuestions) {
        try {
          await ctx.db.insert("examQuestions", {
            question: question.question,
            options: question.options,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
            aircraftType: question.aircraftType,
            category: question.category,
            difficulty: question.difficulty,
            isActive: question.isActive,
            createdAt: question._creationTime,
            reference: question.reference,
            regulationCode: question.regulationCode,
          });
          insertedCount++;
        } catch (error) {
          console.error("Error inserting question:", question.question.substring(0, 50) + "...", error);
          errorCount++;
        }
      }

      return { 
        message: `Successfully seeded ${insertedCount} real aviation questions with ${errorCount} errors`, 
        count: insertedCount,
        errors: errorCount,
        status: "success"
      };
    } catch (error) {
      console.error("Error in seedRealAviationQuestions:", error);
      return { 
        message: "Failed to seed real aviation questions", 
        error: error.message,
        status: "error"
      };
    }
  },
});

// Clear all exam questions (useful for testing)
export const clearAllExamQuestions = mutation({
  args: {},
  handler: async (ctx) => {
    try {
      const questions = await ctx.db.query("examQuestions").collect();
      for (const question of questions) {
        await ctx.db.delete(question._id);
      }
      return { 
        message: `Deleted ${questions.length} questions`,
        count: questions.length,
        status: "success"
      };
    } catch (error) {
      console.error("Error clearing exam questions:", error);
      return { 
        message: "Failed to clear exam questions", 
        error: error.message,
        status: "error"
      };
    }
  },
});

// Get count of exam questions
export const getExamQuestionsCount = query({
  args: {},
  handler: async (ctx) => {
    try {
      const questions = await ctx.db.query("examQuestions").collect();
      return { 
        count: questions.length,
        status: "success"
      };
    } catch (error) {
      console.error("Error getting exam questions count:", error);
      return { 
        count: 0,
        error: error.message,
        status: "error"
      };
    }
  },
});