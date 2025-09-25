import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getUserTypeRatingProgress = query({
  args: {
    userId: v.id("users"),
    aircraftType: v.string(),
  },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("userTypeRatingProgress")
      .withIndex("by_user_aircraft", (q) => q.eq("userId", args.userId).eq("aircraftType", args.aircraftType))
      .collect();
    return rows;
  },
});

export const getTypeRatingLessonProgress = query({
  args: {
    userId: v.id("users"),
    aircraftType: v.string(),
    lessonNumericId: v.number(),
  },
  handler: async (ctx, args) => {
    const row = await ctx.db
      .query("userTypeRatingProgress")
      .withIndex("by_user_lesson", (q) => q.eq("userId", args.userId).eq("lessonNumericId", args.lessonNumericId))
      .first();

    if (!row) {
      return {
        theoryCompleted: false,
        flashcardsCompleted: false,
        quizCompleted: false,
        overallProgress: 0,
      };
    }
    return row;
  },
});

export const updateTypeRatingLessonProgress = mutation({
  args: {
    userId: v.id("users"),
    aircraftType: v.string(),
    lessonNumericId: v.number(),
    theoryCompleted: v.optional(v.boolean()),
    flashcardsCompleted: v.optional(v.boolean()),
    quizCompleted: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userTypeRatingProgress")
      .withIndex("by_user_lesson", (q) => q.eq("userId", args.userId).eq("lessonNumericId", args.lessonNumericId))
      .first();

    const now = Date.now();

    const theory = args.theoryCompleted ?? existing?.theoryCompleted ?? false;
    const cards = args.flashcardsCompleted ?? existing?.flashcardsCompleted ?? false;
    const quiz = args.quizCompleted ?? existing?.quizCompleted ?? false;

    let overall = 0;
    if (theory) overall += 33;
    if (cards) overall += 33;
    if (quiz) overall += 34;

    if (existing) {
      await ctx.db.patch(existing._id, {
        theoryCompleted: theory,
        flashcardsCompleted: cards,
        quizCompleted: quiz,
        overallProgress: overall,
        updatedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert("userTypeRatingProgress", {
      userId: args.userId as Id<"users">,
      aircraftType: args.aircraftType,
      lessonNumericId: args.lessonNumericId,
      theoryCompleted: theory,
      flashcardsCompleted: cards,
      quizCompleted: quiz,
      overallProgress: overall,
      createdAt: now,
      updatedAt: now,
    });
  },
});
