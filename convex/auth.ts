import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Register a new user
export const registerUser = mutation({
  args: {
    email: v.string(),
    fullName: v.optional(v.string()),
    password: v.string(), // In a real app, you'd hash this
    subscription: v.optional(v.string()), // "A320", "BOEING_737"
    ipAddress: v.optional(v.string()),
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

    // Check IP restriction (one account per IP)
    if (args.ipAddress) {
      const existingIpUser = await ctx.db
        .query("users")
        .withIndex("by_ip", (q) => q.eq("ipAddress", args.ipAddress))
        .first();
      
      if (existingIpUser) {
        throw new Error("An account already exists from this IP address");
      }
    }

    const now = Date.now();
    
    // Determine if user should be admin
    const adminEmails = ["tiniboti@gmail.com"];
    const isAdmin = adminEmails.includes(args.email.toLowerCase());
    
    // Create user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      fullName: args.fullName,
      displayName: args.fullName || args.email.split("@")[0],
      role: isAdmin ? "admin" : "user",
      accountType: isAdmin ? "enterprise" : "free",
      subscription: isAdmin ? "ALL" : (args.subscription || "A320"), // Default to A320
      ipAddress: args.ipAddress,
      isActive: true,
      permissions: isAdmin ? ["manage_users", "view_analytics", "manage_content", "system_admin"] : [],
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

// Login user (proper implementation as a mutation)
export const loginUser = mutation({
  args: {
    email: v.string(),
    ipAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user exists
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      // Check IP restriction for new users
      if (args.ipAddress) {
        const existingIpUser = await ctx.db
          .query("users")
          .withIndex("by_ip", (q) => q.eq("ipAddress", args.ipAddress))
          .first();
        
        if (existingIpUser) {
          throw new Error("An account already exists from this IP address");
        }
      }

      // If user doesn't exist, create a new one (for demo purposes)
      const now = Date.now();
      
      // Determine if user should be admin
      const adminEmails = ["tiniboti@gmail.com"];
      const isAdmin = adminEmails.includes(args.email.toLowerCase());
      
      const userId = await ctx.db.insert("users", {
        email: args.email,
        displayName: args.email.split("@")[0],
        role: isAdmin ? "admin" : "user",
        accountType: isAdmin ? "enterprise" : "free",
        subscription: isAdmin ? "ALL" : "A320", // Default to A320 for new users
        ipAddress: args.ipAddress,
        isActive: true,
        permissions: isAdmin ? ["manage_users", "view_analytics", "manage_content", "system_admin"] : [],
        createdAt: now,
        updatedAt: now,
      });

      // Create user profile
      await ctx.db.insert("profiles", {
        userId,
        displayName: args.email.split("@")[0],
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

      return await ctx.db.get(userId);
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

// Update user subscription (deprecated - see updateUserSubscription below)
// export const updateUserSubscription = mutation({
//   args: {
//     userId: v.id("users"),
//     subscription: v.string(), // "A320", "BOEING_737", "ALL"
//   },
//   handler: async (ctx, args) => {
//     await ctx.db.patch(args.userId, {
//       subscription: args.subscription,
//       updatedAt: Date.now(),
//     });
//     return { success: true };
//   },
// });

// Admin Functions

// Get all users (admin only)
export const getAllUsers = query({
  args: { adminUserId: v.id("users") },
  handler: async (ctx, args) => {
    // Verify admin permission
    const adminUser = await ctx.db.get(args.adminUserId);
    if (!adminUser || adminUser.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    const users = await ctx.db.query("users").collect();
    
    // Get user stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const stats = await ctx.db
          .query("userStats")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .first();
        
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .first();

        return {
          ...user,
          stats,
          profile,
        };
      })
    );

    return usersWithStats;
  },
});

// Update user role and permissions (admin only)  
export const updateUserRole = mutation({
  args: {
    adminUserId: v.id("users"),
    targetUserId: v.id("users"),
    role: v.string(),
    accountType: v.optional(v.string()),
    permissions: v.optional(v.array(v.string())),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Verify admin permission
    const adminUser = await ctx.db.get(args.adminUserId);
    if (!adminUser || adminUser.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    // Prevent admins from changing other admin roles (protection)
    const targetUser = await ctx.db.get(args.targetUserId);
    const adminEmails = ["tiniboti@gmail.com"];
    if (targetUser && adminEmails.includes(targetUser.email.toLowerCase()) && args.role !== "admin") {
      throw new Error("Cannot modify super admin accounts");  
    }

    await ctx.db.patch(args.targetUserId, {
      role: args.role,
      accountType: args.accountType,
      permissions: args.permissions,
      isActive: args.isActive,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Delete user (admin only)
export const deleteUser = mutation({
  args: {
    adminUserId: v.id("users"),
    targetUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Verify admin permission
    const adminUser = await ctx.db.get(args.adminUserId);
    if (!adminUser || adminUser.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    // Prevent deletion of super admin accounts
    const targetUser = await ctx.db.get(args.targetUserId);
    const adminEmails = ["tiniboti@gmail.com"];
    if (targetUser && adminEmails.includes(targetUser.email.toLowerCase())) {
      throw new Error("Cannot delete super admin accounts");
    }

    // Delete user's related data first
    const userStats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", args.targetUserId))
      .first();
    if (userStats) {
      await ctx.db.delete(userStats._id);
    }

    const userProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", args.targetUserId))
      .first();
    if (userProfile) {
      await ctx.db.delete(userProfile._id);
    }

    // Delete incorrect questions
    const incorrectQuestions = await ctx.db
      .query("userIncorrectQuestions")
      .withIndex("by_user", (q) => q.eq("userId", args.targetUserId))
      .collect();
    for (const iq of incorrectQuestions) {
      await ctx.db.delete(iq._id);
    }

    // Delete exam sessions
    const examSessions = await ctx.db
      .query("userExamSessions")
      .withIndex("by_user", (q) => q.eq("userId", args.targetUserId))
      .collect();
    for (const session of examSessions) {
      await ctx.db.delete(session._id);
    }

    // Finally delete the user
    await ctx.db.delete(args.targetUserId);

    return { success: true };
  },
});

// Check if user is admin
export const isUserAdmin = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return {
      isAdmin: user?.role === "admin",
      permissions: user?.permissions || [],
      accountType: user?.accountType || "free",
    };
  },
});

// Force grant admin privileges to tiniboti@gmail.com (system function)
export const forceGrantAdminAccess = mutation({
  args: {},
  handler: async (ctx, args) => {
    // Find tiniboti@gmail.com user
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", "tiniboti@gmail.com"))
      .first();
    
    if (user) {
      // Update user to admin
      await ctx.db.patch(user._id, {
        role: "admin",
        accountType: "enterprise",
        subscription: "ALL",
        permissions: ["manage_users", "view_analytics", "manage_content", "system_admin"],
        updatedAt: Date.now(),
      });
      
      return { success: true, message: "Admin privileges granted to tiniboti@gmail.com" };
    }
    
    return { success: false, message: "User tiniboti@gmail.com not found" };
  },
});

// Record incorrect question for review
export const recordIncorrectQuestion = mutation({
  args: {
    userId: v.id("users"),
    questionId: v.id("examQuestions"),
    incorrectAnswer: v.number(),
    correctAnswer: v.number(),
    sessionType: v.string(),
    category: v.string(),
    difficulty: v.string(),
    aircraftType: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if question already exists for this user
    const existing = await ctx.db
      .query("userIncorrectQuestions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("questionId"), args.questionId))
      .first();

    if (existing) {
      // Update attempt count and last attempt time
      await ctx.db.patch(existing._id, {
        incorrectAnswer: args.incorrectAnswer,
        attemptCount: (existing.attemptCount || 1) + 1,
        lastAttemptAt: Date.now(),
        isResolved: false, // Reset resolution status
      });
    } else {
      // Create new incorrect question record
      await ctx.db.insert("userIncorrectQuestions", {
        userId: args.userId,
        questionId: args.questionId,
        incorrectAnswer: args.incorrectAnswer,
        correctAnswer: args.correctAnswer,
        sessionType: args.sessionType,
        category: args.category,
        difficulty: args.difficulty,
        aircraftType: args.aircraftType,
        isResolved: false,
        attemptCount: 1,
        lastAttemptAt: Date.now(),
        createdAt: Date.now(),
      });
    }

    return { success: true };
  },
});

// Mark incorrect question as resolved
export const markQuestionResolved = mutation({
  args: {
    userId: v.id("users"),
    questionId: v.id("examQuestions"),
  },
  handler: async (ctx, args) => {
    const incorrectQuestion = await ctx.db
      .query("userIncorrectQuestions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("questionId"), args.questionId))
      .first();

    if (incorrectQuestion) {
      await ctx.db.patch(incorrectQuestion._id, {
        isResolved: true,
        lastAttemptAt: Date.now(),
      });
    }

    return { success: true };
  },
});

// Get user's incorrect questions for review
export const getUserIncorrectQuestions = query({
  args: { 
    userId: v.id("users"),
    category: v.optional(v.string()),
    onlyUnresolved: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("userIncorrectQuestions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId));

    if (args.category) {
      query = query.filter((q) => q.eq(q.field("category"), args.category));
    }

    if (args.onlyUnresolved !== false) {
      query = query.filter((q) => q.eq(q.field("isResolved"), false));
    }

    const incorrectQuestions = await query.collect();
    
    // Get the actual question data
    const questionsWithData = await Promise.all(
      incorrectQuestions.map(async (iq) => {
        const question = await ctx.db.get(iq.questionId);
        return {
          ...iq,
          question,
        };
      })
    );

    return questionsWithData;
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

// Update user subscription after successful payment
export const updateUserSubscription = mutation({
  args: {
    userId: v.id("users"),
    subscription: v.string(), // "A320_FAMILY", "B737_FAMILY", "ALL"
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      subscription: args.subscription,
      accountType: args.subscription === "ALL" ? "premium" : "premium",
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});