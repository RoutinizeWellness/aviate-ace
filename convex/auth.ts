import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Register a new user
export const registerUser = mutation({
  args: {
    email: v.string(),
    fullName: v.optional(v.string()),
    password: v.string(), // In a real app, you'd hash this
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    const now = Date.now();
    
    // Create user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      fullName: args.fullName,
      displayName: args.fullName || args.email.split("@")[0],
      createdAt: now,
      updatedAt: now,
    });

    // Create user profile
    await ctx.db.insert("profiles", {
      userId,
      displayName: args.fullName || args.email.split("@")[0],
      updatedAt: now,
    });

    // Create initial user stats
    await ctx.db.insert("userStats", {
      userId,
      totalPoints: 0,
      currentLevel: 1,
      totalExamsTaken: 0,
      totalLessonsCompleted: 0,
      totalQuizzesTaken: 0,
      updatedAt: now,
    });

    return { userId, email: args.email };
  },
});

// Login user (simplified - in production use proper auth)
export const loginUser = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },
});

// Get user by ID
export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// Update user profile
export const updateUserProfile = mutation({
  args: {
    userId: v.id("users"),
    displayName: v.optional(v.string()),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    website: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...profileData } = args;
    
    // Update user table if displayName is provided
    if (args.displayName) {
      await ctx.db.patch(userId, {
        displayName: args.displayName,
        updatedAt: Date.now(),
      });
    }

    // Update or create profile
    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, {
        ...profileData,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("profiles", {
        userId,
        ...profileData,
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});

// Get user profile
export const getUserProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    return {
      user,
      profile,
    };
  },
});

// Get user stats
export const getUserStats = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  },
});

// Update user stats
export const updateUserStats = mutation({
  args: {
    userId: v.id("users"),
    totalPoints: v.optional(v.number()),
    currentLevel: v.optional(v.number()),
    totalExamsTaken: v.optional(v.number()),
    totalLessonsCompleted: v.optional(v.number()),
    totalQuizzesTaken: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    
    const existingStats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingStats) {
      await ctx.db.patch(existingStats._id, {
        ...updates,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("userStats", {
        userId,
        totalPoints: updates.totalPoints || 0,
        currentLevel: updates.currentLevel || 1,
        totalExamsTaken: updates.totalExamsTaken || 0,
        totalLessonsCompleted: updates.totalLessonsCompleted || 0,
        totalQuizzesTaken: updates.totalQuizzesTaken || 0,
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});