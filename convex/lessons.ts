import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new lesson
export const createLesson = mutation({
  args: {
    courseId: v.id("courses"),
    title: v.string(),
    description: v.optional(v.string()),
    module: v.string(),
    lessonOrder: v.number(),
    duration: v.string(),
    difficulty: v.string(),
    content: v.object({
      theory: v.array(v.object({
        title: v.string(),
        content: v.string(),
        keyPoints: v.optional(v.array(v.string())),
        technicalSpecs: v.optional(v.object({})),
      })),
      flashcards: v.array(v.object({
        id: v.number(),
        front: v.string(),
        back: v.string(),
        difficulty: v.string(),
        category: v.string(),
      })),
      quiz: v.object({
        questions: v.array(v.object({
          id: v.number(),
          question: v.string(),
          options: v.array(v.string()),
          correctAnswer: v.number(),
          explanation: v.string(),
          difficulty: v.string(),
          category: v.string(),
        })),
        passingScore: v.number(),
        timeLimit: v.optional(v.number()),
      }),
    }),
    prerequisites: v.optional(v.array(v.id("lessons"))),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("lessons", {
      ...args,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Get lessons by course
export const getLessonsByCourse = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("lessons")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("asc")
      .collect();
  },
});

// Get lessons by module
export const getLessonsByModule = query({
  args: { module: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("lessons")
      .withIndex("by_module", (q) => q.eq("module", args.module))
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("asc")
      .collect();
  },
});

// Get single lesson
export const getLesson = query({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.lessonId);
  },
});

// Get user lesson progress
export const getUserLessonProgress = query({
  args: { 
    userId: v.id("users"),
    lessonId: v.id("lessons"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userLessonProgress")
      .withIndex("by_user_lesson", (q) => 
        q.eq("userId", args.userId).eq("lessonId", args.lessonId)
      )
      .first();
  },
});

// Get all user lesson progress
export const getAllUserLessonProgress = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userLessonProgress")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
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
    quizScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { userId, lessonId, ...progressUpdates } = args;
    
    const existingProgress = await ctx.db
      .query("userLessonProgress")
      .withIndex("by_user_lesson", (q) => 
        q.eq("userId", userId).eq("lessonId", lessonId)
      )
      .first();

    const now = Date.now();
    
    // Check if lesson is completed
    const isCompleted = progressUpdates.theoryCompleted && 
                       progressUpdates.flashcardsCompleted && 
                       progressUpdates.quizCompleted;

    if (existingProgress) {
      const updateData: any = {
        ...progressUpdates,
        lastAccessedAt: now,
      };
      
      if (isCompleted && !existingProgress.completedAt) {
        updateData.completedAt = now;
      }
      
      await ctx.db.patch(existingProgress._id, updateData);
    } else {
      await ctx.db.insert("userLessonProgress", {
        userId,
        lessonId,
        theoryCompleted: progressUpdates.theoryCompleted || false,
        flashcardsCompleted: progressUpdates.flashcardsCompleted || false,
        quizCompleted: progressUpdates.quizCompleted || false,
        quizScore: progressUpdates.quizScore,
        completedAt: isCompleted ? now : undefined,
        lastAccessedAt: now,
      });
    }

    return { success: true };
  },
});

// Record learning session
export const recordLearningSession = mutation({
  args: {
    userId: v.id("users"),
    sessionId: v.string(),
    lessonId: v.optional(v.id("lessons")),
    sessionType: v.string(),
    startTime: v.number(),
    endTime: v.number(),
    performance: v.object({
      score: v.optional(v.number()),
      cardsStudied: v.optional(v.number()),
      correctAnswers: v.optional(v.number()),
      totalQuestions: v.optional(v.number()),
      timePerQuestion: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    const duration = args.endTime - args.startTime;
    
    return await ctx.db.insert("learningSessions", {
      ...args,
      duration,
    });
  },
});