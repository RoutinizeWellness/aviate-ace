import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Submit a new question suggestion
export const submitQuestionSuggestion = mutation({
  args: {
    userId: v.id("users"),
    question: v.string(),
    options: v.array(v.string()),
    correctAnswer: v.number(),
    explanation: v.string(),
    aircraftType: v.string(),
    category: v.string(),
    difficulty: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify user exists
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Validate options array has 4 elements
    if (args.options.length !== 4) {
      throw new Error("Debe proporcionar exactamente 4 opciones");
    }

    // Validate correct answer is within range
    if (args.correctAnswer < 0 || args.correctAnswer > 3) {
      throw new Error("La respuesta correcta debe estar entre 0 y 3");
    }

    // Validate required fields
    if (!args.question.trim() || !args.explanation.trim()) {
      throw new Error("La pregunta y explicación son obligatorias");
    }

    // Check if all options are filled
    if (args.options.some(option => !option.trim())) {
      throw new Error("Todas las opciones deben estar completas");
    }

    const now = Date.now();

    const suggestionId = await ctx.db.insert("questionSuggestions", {
      userId: args.userId,
      question: args.question.trim(),
      options: args.options.map(opt => opt.trim()),
      correctAnswer: args.correctAnswer,
      explanation: args.explanation.trim(),
      aircraftType: args.aircraftType,
      category: args.category,
      difficulty: args.difficulty,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    return suggestionId;
  },
});

// Get user's question suggestions
export const getUserQuestionSuggestions = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const suggestions = await ctx.db
      .query("questionSuggestions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return suggestions;
  },
});

// Get all question suggestions for admin (with pagination)
export const getAllQuestionSuggestions = query({
  args: {
    adminUserId: v.id("users"),
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Verify admin permissions
    const admin = await ctx.db.get(args.adminUserId);
    if (!admin || (admin as any).role !== "admin") {
      throw new Error("Acceso denegado: se requieren permisos de administrador");
    }

    let suggestions;
    
    if (args.status && args.status !== 'all') {
      suggestions = await ctx.db
        .query("questionSuggestions")
        .filter((q) => q.eq(q.field("status"), args.status!))
        .order("desc")
        .take(args.limit || 50);
    } else {
      // Use creation time for better performance
      suggestions = await ctx.db
        .query("questionSuggestions")
        .order("desc")
        .take(args.limit || 50);
    }

    // Get user information for each suggestion
    const suggestionsWithUsers = await Promise.all(
      suggestions.map(async (suggestion) => {
        const user = await ctx.db.get(suggestion.userId);
        return {
          ...suggestion,
          user: user ? {
            displayName: (user as any).displayName || (user as any).fullName || 'Unknown User',
            email: (user as any).email || 'No email',
          } : null,
        };
      })
    );

    return suggestionsWithUsers;
  },
});

// Update question suggestion status (admin only)
export const updateQuestionSuggestionStatus = mutation({
  args: {
    adminUserId: v.id("users"),
    suggestionId: v.id("questionSuggestions"),
    status: v.string(),
    adminNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Verify admin permissions
    const admin = await ctx.db.get(args.adminUserId);
    if (!admin || (admin as any).role !== "admin") {
      throw new Error("Acceso denegado: se requieren permisos de administrador");
    }

    // Validate status
    const validStatuses = ["pending", "approved", "rejected", "needs_review"];
    if (!validStatuses.includes(args.status)) {
      throw new Error("Estado inválido");
    }

    const suggestion = await ctx.db.get(args.suggestionId);
    if (!suggestion) {
      throw new Error("Sugerencia no encontrada");
    }

    await ctx.db.patch(args.suggestionId, {
      status: args.status,
      adminNotes: args.adminNotes,
      reviewedBy: args.adminUserId,
      reviewedAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Approve and convert suggestion to actual question
export const approveAndCreateQuestion = mutation({
  args: {
    adminUserId: v.id("users"),
    suggestionId: v.id("questionSuggestions"),
    adminNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Verify admin permissions
    const admin = await ctx.db.get(args.adminUserId);
    if (!admin || admin.role !== "admin") {
      throw new Error("Acceso denegado: se requieren permisos de administrador");
    }

    const suggestion = await ctx.db.get(args.suggestionId);
    if (!suggestion) {
      throw new Error("Sugerencia no encontrada");
    }

    const now = Date.now();

    // Create the actual exam question
    const questionId = await ctx.db.insert("examQuestions", {
      question: suggestion.question,
      options: suggestion.options,
      correctAnswer: suggestion.correctAnswer,
      explanation: suggestion.explanation,
      aircraftType: suggestion.aircraftType,
      category: suggestion.category,
      difficulty: suggestion.difficulty,
      isActive: true,
      createdAt: now,
    });

    // Update suggestion status
    await ctx.db.patch(args.suggestionId, {
      status: "approved",
      adminNotes: args.adminNotes,
      reviewedBy: args.adminUserId,
      reviewedAt: now,
      updatedAt: now,
    });

    return { questionId, success: true };
  },
});

// Get suggestion statistics
export const getSuggestionStats = query({
  args: {
    adminUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Verify admin permissions
    const admin = await ctx.db.get(args.adminUserId);
    if (!admin || admin.role !== "admin") {
      throw new Error("Acceso denegado: se requieren permisos de administrador");
    }

    const allSuggestions = await ctx.db.query("questionSuggestions").collect();

    const stats = {
      total: allSuggestions.length,
      pending: allSuggestions.filter(s => s.status === "pending").length,
      approved: allSuggestions.filter(s => s.status === "approved").length,
      rejected: allSuggestions.filter(s => s.status === "rejected").length,
      needsReview: allSuggestions.filter(s => s.status === "needs_review").length,
    };

    return stats;
  },
});