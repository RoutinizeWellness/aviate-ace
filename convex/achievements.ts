import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create achievement
export const createAchievement = mutation({
  args: {
    achievementId: v.string(),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    type: v.string(),
    difficulty: v.string(),
    icon: v.string(),
    points: v.number(),
    requirements: v.object({
      type: v.string(),
      target: v.number(),
      timeframe: v.optional(v.string()),
      conditions: v.optional(v.object({})),
    }),
    rewards: v.object({
      points: v.number(),
      badges: v.optional(v.array(v.string())),
      unlocks: v.optional(v.array(v.string())),
      title: v.optional(v.string()),
    }),
    isHidden: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("achievements", {
      ...args,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

// Get all achievements
export const getAchievements = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("achievements")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

// Get user achievements
export const getUserAchievements = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const userAchievements = await ctx.db
      .query("userAchievements")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Get achievement details
    const achievementsWithDetails = await Promise.all(
      userAchievements.map(async (userAchievement) => {
        const achievement = await ctx.db
          .query("achievements")
          .filter((q) => q.eq(q.field("achievementId"), userAchievement.achievementId))
          .first();
        
        return {
          ...achievement,
          progress: userAchievement.progress,
          unlockedAt: userAchievement.unlockedAt,
        };
      })
    );

    return achievementsWithDetails.filter(a => a !== null);
  },
});

// Update achievement progress
export const updateAchievementProgress = mutation({
  args: {
    userId: v.id("users"),
    achievementId: v.string(),
    progress: v.number(),
    unlocked: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existingProgress = await ctx.db
      .query("userAchievements")
      .withIndex("by_user_achievement", (q) => 
        q.eq("userId", args.userId).eq("achievementId", args.achievementId)
      )
      .first();

    const now = Date.now();

    if (existingProgress) {
      const updateData: any = {
        progress: args.progress,
      };
      
      if (args.unlocked && !existingProgress.unlockedAt) {
        updateData.unlockedAt = now;
      }

      await ctx.db.patch(existingProgress._id, updateData);
    } else {
      await ctx.db.insert("userAchievements", {
        userId: args.userId,
        achievementId: args.achievementId,
        progress: args.progress,
        unlockedAt: args.unlocked ? now : undefined,
        createdAt: now,
      });
    }

    return { success: true };
  },
});

// Get user badges
export const getUserBadges = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userBadges")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

// Award badge to user
export const awardBadge = mutation({
  args: {
    userId: v.id("users"),
    badgeId: v.string(),
    badgeName: v.string(),
    badgeDescription: v.string(),
    badgeIcon: v.string(),
    rarity: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already has this badge
    const existingBadge = await ctx.db
      .query("userBadges")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("badgeId"), args.badgeId))
      .first();

    if (existingBadge) {
      return { success: false, message: "Badge already earned" };
    }

    await ctx.db.insert("userBadges", {
      ...args,
      earnedAt: Date.now(),
    });

    return { success: true };
  },
});

// Record user progress activity
export const recordUserProgress = mutation({
  args: {
    userId: v.id("users"),
    activityType: v.string(),
    referenceId: v.optional(v.string()),
    pointsEarned: v.optional(v.number()),
    metadata: v.optional(v.object({})),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("userProgress", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Get user progress history
export const getUserProgressHistory = query({
  args: { 
    userId: v.id("users"),
    activityType: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", args.userId));

    if (args.activityType) {
      query = query.filter((q) => q.eq(q.field("activityType"), args.activityType));
    }

    let results = await query.order("desc").collect();

    if (args.limit) {
      results = results.slice(0, args.limit);
    }

    return results;
  },
});