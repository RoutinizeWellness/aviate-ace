import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Query to identify duplicate questions
export const identifyDuplicates = query({
  args: {},
  handler: async (ctx) => {
    console.log("Identifying duplicate questions...");
    
    const allQuestions = await ctx.db
      .query("examQuestions")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    
    console.log(`Found ${allQuestions.length} active questions`);
    
    // Group questions by normalized text and options
    const questionGroups = new Map<string, any[]>();
    
    allQuestions.forEach(question => {
      // Create a normalized key from question text and options
      const normalizedQuestion = question.question.trim().toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .replace(/\s+/g, ' '); // Normalize spaces
      
      const normalizedOptions = question.options
        .map(opt => opt.trim().toLowerCase())
        .sort()
        .join('|');
      
      const key = `${normalizedQuestion}__${normalizedOptions}`;
      
      if (!questionGroups.has(key)) {
        questionGroups.set(key, []);
      }
      questionGroups.get(key)!.push(question);
    });
    
    // Find groups with duplicates
    const duplicateGroups = Array.from(questionGroups.entries())
      .filter(([_, questions]) => questions.length > 1)
      .map(([key, questions]) => ({
        key,
        count: questions.length,
        questions: questions.map(q => ({
          _id: q._id,
          question: q.question.substring(0, 100) + '...',
          aircraftType: q.aircraftType,
          category: q.category,
          difficulty: q.difficulty,
          _creationTime: q._creationTime
        }))
      }));
    
    console.log(`Found ${duplicateGroups.length} groups with duplicates`);
    console.log(`Total duplicate questions: ${duplicateGroups.reduce((sum, group) => sum + group.count - 1, 0)}`);
    
    return {
      totalQuestions: allQuestions.length,
      duplicateGroups: duplicateGroups,
      duplicateCount: duplicateGroups.reduce((sum, group) => sum + group.count - 1, 0),
    };
  },
});

// Mutation to remove duplicate questions (keeping the oldest one in each group)
export const removeDuplicates = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("Starting duplicate removal...");
    
    const allQuestions = await ctx.db
      .query("examQuestions")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    
    console.log(`Processing ${allQuestions.length} active questions`);
    
    // Group questions by normalized text and options
    const questionGroups = new Map<string, any[]>();
    
    allQuestions.forEach(question => {
      // Create a normalized key from question text and options
      const normalizedQuestion = question.question.trim().toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .replace(/\s+/g, ' '); // Normalize spaces
      
      const normalizedOptions = question.options
        .map(opt => opt.trim().toLowerCase())
        .sort()
        .join('|');
      
      const key = `${normalizedQuestion}__${normalizedOptions}`;
      
      if (!questionGroups.has(key)) {
        questionGroups.set(key, []);
      }
      questionGroups.get(key)!.push(question);
    });
    
    let removedCount = 0;
    let processedGroups = 0;
    
    // Process each group with duplicates
    for (const [key, questions] of questionGroups.entries()) {
      if (questions.length > 1) {
        processedGroups++;
        
        // Sort by creation time to keep the oldest one
        const sortedQuestions = questions.sort((a, b) => a._creationTime - b._creationTime);
        const keepQuestion = sortedQuestions[0];
        const questionsToRemove = sortedQuestions.slice(1);
        
        console.log(`Group ${processedGroups}: Keeping question ${keepQuestion._id}, removing ${questionsToRemove.length} duplicates`);
        
        // Remove duplicate questions
        for (const questionToRemove of questionsToRemove) {
          try {
            await ctx.db.delete(questionToRemove._id);
            removedCount++;
            console.log(`Removed duplicate question ${questionToRemove._id}`);
          } catch (error) {
            console.error(`Failed to remove question ${questionToRemove._id}:`, error);
          }
        }
      }
    }
    
    console.log(`Cleanup complete. Removed ${removedCount} duplicate questions from ${processedGroups} groups.`);
    
    return {
      processedGroups,
      removedCount,
      message: `Successfully removed ${removedCount} duplicate questions from ${processedGroups} groups.`
    };
  },
});

// Mutation to remove duplicates with dry run option
export const removeDuplicatesDryRun = query({
  args: {},
  handler: async (ctx) => {
    console.log("Dry run: Simulating duplicate removal...");
    
    const allQuestions = await ctx.db
      .query("examQuestions")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    
    // Group questions by normalized text and options
    const questionGroups = new Map<string, any[]>();
    
    allQuestions.forEach(question => {
      // Create a normalized key from question text and options
      const normalizedQuestion = question.question.trim().toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .replace(/\s+/g, ' '); // Normalize spaces
      
      const normalizedOptions = question.options
        .map(opt => opt.trim().toLowerCase())
        .sort()
        .join('|');
      
      const key = `${normalizedQuestion}__${normalizedOptions}`;
      
      if (!questionGroups.has(key)) {
        questionGroups.set(key, []);
      }
      questionGroups.get(key)!.push(question);
    });
    
    let wouldRemoveCount = 0;
    let groupsWithDuplicates = 0;
    const actions = [];
    
    // Simulate processing each group with duplicates
    for (const [key, questions] of questionGroups.entries()) {
      if (questions.length > 1) {
        groupsWithDuplicates++;
        
        // Sort by creation time to identify what would be kept
        const sortedQuestions = questions.sort((a, b) => a._creationTime - b._creationTime);
        const keepQuestion = sortedQuestions[0];
        const questionsToRemove = sortedQuestions.slice(1);
        
        wouldRemoveCount += questionsToRemove.length;
        
        actions.push({
          group: groupsWithDuplicates,
          keep: {
            _id: keepQuestion._id,
            question: keepQuestion.question.substring(0, 60) + '...',
            createdAt: new Date(keepQuestion._creationTime).toISOString(),
          },
          remove: questionsToRemove.map(q => ({
            _id: q._id,
            createdAt: new Date(q._creationTime).toISOString(),
          }))
        });
      }
    }
    
    return {
      totalQuestions: allQuestions.length,
      groupsWithDuplicates,
      wouldRemoveCount,
      actions: actions.slice(0, 10), // Show first 10 groups as example
      message: `DRY RUN: Would remove ${wouldRemoveCount} duplicate questions from ${groupsWithDuplicates} groups.`
    };
  },
});