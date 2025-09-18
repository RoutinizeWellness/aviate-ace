import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new course
export const createCourse = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    aircraftType: v.string(),
    category: v.string(),
    difficulty: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("courses", {
      ...args,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Get all active courses
export const getCourses = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("courses")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

// Get courses by aircraft type
export const getCoursesByAircraft = query({
  args: { aircraftType: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("courses")
      .withIndex("by_aircraft", (q) => q.eq("aircraftType", args.aircraftType))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

// Get user courses (enrollments)
export const getUserCourses = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const userCourses = await ctx.db
      .query("userCourses")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Get course details for each enrollment
    const coursesWithDetails = await Promise.all(
      userCourses.map(async (userCourse) => {
        const course = await ctx.db.get(userCourse.courseId);
        return {
          ...userCourse,
          course,
        };
      })
    );

    return coursesWithDetails;
  },
});

// Enroll user in a course
export const enrollInCourse = mutation({
  args: {
    userId: v.id("users"),
    courseId: v.id("courses"),
  },
  handler: async (ctx, args) => {
    // Check if already enrolled
    const existingEnrollment = await ctx.db
      .query("userCourses")
      .withIndex("by_user_course", (q) => 
        q.eq("userId", args.userId).eq("courseId", args.courseId)
      )
      .first();

    if (existingEnrollment) {
      throw new Error("User is already enrolled in this course");
    }

    return await ctx.db.insert("userCourses", {
      userId: args.userId,
      courseId: args.courseId,
      enrolledAt: Date.now(),
      progress: 0,
    });
  },
});

// Update course progress
export const updateCourseProgress = mutation({
  args: {
    userId: v.id("users"),
    courseId: v.id("courses"),
    progress: v.number(),
    completed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const enrollment = await ctx.db
      .query("userCourses")
      .withIndex("by_user_course", (q) => 
        q.eq("userId", args.userId).eq("courseId", args.courseId)
      )
      .first();

    if (!enrollment) {
      throw new Error("User is not enrolled in this course");
    }

    const updateData: any = {
      progress: args.progress,
    };

    if (args.completed) {
      updateData.completedAt = Date.now();
    }

    await ctx.db.patch(enrollment._id, updateData);
    return { success: true };
  },
});