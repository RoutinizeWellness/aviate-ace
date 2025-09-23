import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Get user's lesson progress
export const getUserLessonProgress = query({
  args: { 
    userId: v.id("users"), 
    lessonId: v.id("lessons") 
  },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query("userLessonProgress")
      .withIndex("by_user_lesson", (q) => 
        q.eq("userId", args.userId).eq("lessonId", args.lessonId)
      )
      .first();

    if (!progress) {
      // Return default progress if none exists
      return {
        theoryCompleted: false,
        flashcardsCompleted: false,
        quizCompleted: false,
        overallProgress: 0,
        lastAccessedAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    }

    return progress;
  },
});

// Update lesson progress
export const updateLessonProgress = mutation({
  args: {
    userId: v.id("users"),
    lessonId: v.id("lessons"),
    theoryCompleted: v.optional(v.boolean()),
    flashcardsCompleted: v.optional(v.boolean()),
    quizCompleted: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userLessonProgress")
      .withIndex("by_user_lesson", (q) => 
        q.eq("userId", args.userId).eq("lessonId", args.lessonId)
      )
      .first();

    const now = Date.now();
    
    // Calculate new progress values
    const theoryCompleted = args.theoryCompleted ?? existing?.theoryCompleted ?? false;
    const flashcardsCompleted = args.flashcardsCompleted ?? existing?.flashcardsCompleted ?? false;
    const quizCompleted = args.quizCompleted ?? existing?.quizCompleted ?? false;
    
    // Calculate overall progress percentage
    let overallProgress = 0;
    if (theoryCompleted) overallProgress += 33;
    if (flashcardsCompleted) overallProgress += 33;
    if (quizCompleted) overallProgress += 34;
    
    const completedAt = overallProgress === 100 ? now : undefined;

    if (existing) {
      // Update existing progress
      await ctx.db.patch(existing._id, {
        theoryCompleted,
        flashcardsCompleted,
        quizCompleted,
        overallProgress,
        lastAccessedAt: now,
        completedAt,
        updatedAt: now,
      });
      return existing._id;
    } else {
      // Create new progress record
      return await ctx.db.insert("userLessonProgress", {
        userId: args.userId,
        lessonId: args.lessonId,
        theoryCompleted,
        flashcardsCompleted,
        quizCompleted,
        overallProgress,
        lastAccessedAt: now,
        completedAt,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// Reset lesson progress (for testing)
export const resetLessonProgress = mutation({
  args: {
    userId: v.id("users"),
    lessonId: v.id("lessons"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userLessonProgress")
      .withIndex("by_user_lesson", (q) => 
        q.eq("userId", args.userId).eq("lessonId", args.lessonId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        theoryCompleted: false,
        flashcardsCompleted: false,
        quizCompleted: false,
        overallProgress: 0,
        lastAccessedAt: Date.now(),
        completedAt: undefined,
        updatedAt: Date.now(),
      });
      return existing._id;
    }
    
    return null;
  },
});

// Get all lesson progress for a user
export const getUserAllLessonProgress = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userLessonProgress")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});