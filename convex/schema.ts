import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table
  users: defineTable({
    email: v.string(),
    fullName: v.optional(v.string()),
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    role: v.optional(v.string()), // "user", "admin", "premium"
    accountType: v.optional(v.string()), // "free", "premium", "enterprise"
    subscription: v.optional(v.string()), // "A320", "BOEING_737", "ALL" (for admin)
    ipAddress: v.optional(v.string()), // Track IP for one account per IP restriction
    isActive: v.optional(v.boolean()),
    permissions: v.optional(v.array(v.string())), // ["manage_users", "view_analytics", etc.]
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"])
    .index("by_subscription", ["subscription"])
    .index("by_ip", ["ipAddress"]),

  // User Profiles table
  profiles: defineTable({
    userId: v.id("users"),
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    website: v.optional(v.string()),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),

  // User Stats table
  userStats: defineTable({
    userId: v.id("users"),
    totalPoints: v.number(),
    currentLevel: v.number(),
    totalExamsTaken: v.number(),
    totalLessonsCompleted: v.number(),
    totalQuizzesTaken: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),

  // Courses table
  courses: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    aircraftType: v.string(),
    category: v.string(),
    difficulty: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_aircraft", ["aircraftType"])
    .index("by_category", ["category"]),

  // User Courses (enrollment) table
  userCourses: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    enrolledAt: v.number(),
    completedAt: v.optional(v.number()),
    progress: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_course", ["courseId"])
    .index("by_user_course", ["userId", "courseId"]),

  // Lessons table
  lessons: defineTable({
    courseId: v.id("courses"),
    title: v.string(),
    description: v.optional(v.string()),
    module: v.string(),
    lessonOrder: v.number(),
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
    duration: v.string(),
    difficulty: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_course", ["courseId"])
    .index("by_module", ["module"])
    .index("by_order", ["courseId", "lessonOrder"]),

  // Exams table
  exams: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    aircraftType: v.string(),
    category: v.string(),
    difficulty: v.string(),
    timeLimit: v.number(),
    passingScore: v.number(),
    questionsCount: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_aircraft", ["aircraftType"])
    .index("by_category", ["category"]),

  // Exam Questions table - Updated to include new fields
  examQuestions: defineTable({
    examId: v.optional(v.id("exams")),
    question: v.string(),
    options: v.array(v.string()),
    correctAnswer: v.number(),
    explanation: v.optional(v.string()),
    aircraftType: v.string(),
    category: v.string(),
    difficulty: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
    reference: v.optional(v.string()), // Official reference documentation
    regulationCode: v.optional(v.string()), // Applicable regulation
  })
    .index("by_exam", ["examId"])
    .index("by_aircraft", ["aircraftType"])
    .index("by_category", ["category"])
    .index("by_difficulty", ["difficulty"]),

  // User Incorrect Questions table (for review mode)
  userIncorrectQuestions: defineTable({
    userId: v.id("users"),
    questionId: v.id("examQuestions"),
    incorrectAnswer: v.number(),
    correctAnswer: v.number(),
    sessionType: v.string(), // "practice", "timed", "exam"
    category: v.string(),
    difficulty: v.string(),
    aircraftType: v.string(),
    isResolved: v.optional(v.boolean()), // true when user answers correctly in review
    attemptCount: v.optional(v.number()), // how many times user got it wrong
    lastAttemptAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_category", ["userId", "category"])
    .index("by_user_unresolved", ["userId", "isResolved"])
    .index("by_question", ["questionId"]),

  // User Exam Sessions table
  userExamSessions: defineTable({
    userId: v.id("users"),
    examId: v.optional(v.id("exams")),
    sessionType: v.string(), // "practice", "exam", "quick"
    questionsCount: v.number(),
    correctAnswers: v.number(),
    score: v.number(),
    timeSpent: v.number(),
    completedAt: v.number(),
    answers: v.array(v.object({
      questionId: v.id("examQuestions"),
      selectedAnswer: v.number(),
      isCorrect: v.boolean(),
      timeSpent: v.number(),
    })),
  })
    .index("by_user", ["userId"])
    .index("by_exam", ["examId"])
    .index("by_session_type", ["sessionType"]),

  // User Progress table
  userProgress: defineTable({
    userId: v.id("users"),
    activityType: v.string(), // "lesson_completed", "exam_taken", etc.
    referenceId: v.optional(v.string()), // lesson ID, exam ID, etc.
    pointsEarned: v.optional(v.number()),
    metadata: v.optional(v.object({})),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_activity", ["activityType"])
    .index("by_user_activity", ["userId", "activityType"]),

  // Achievements table
  achievements: defineTable({
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
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_difficulty", ["difficulty"]),

  // User Achievements table
  userAchievements: defineTable({
    userId: v.id("users"),
    achievementId: v.string(),
    progress: v.number(),
    unlockedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_achievement", ["achievementId"])
    .index("by_user_achievement", ["userId", "achievementId"]),

  // User Badges table
  userBadges: defineTable({
    userId: v.id("users"),
    badgeId: v.string(),
    badgeName: v.string(),
    badgeDescription: v.string(),
    badgeIcon: v.string(),
    rarity: v.string(),
    earnedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_badge", ["badgeId"]),

  // Learning Sessions table (for analytics)
  learningSessions: defineTable({
    userId: v.id("users"),
    sessionId: v.string(),
    lessonId: v.optional(v.id("lessons")),
    sessionType: v.string(), // "theory", "flashcards", "quiz"
    startTime: v.number(),
    endTime: v.number(),
    duration: v.number(),
    performance: v.object({
      score: v.optional(v.number()),
      cardsStudied: v.optional(v.number()),
      correctAnswers: v.optional(v.number()),
      totalQuestions: v.optional(v.number()),
      timePerQuestion: v.optional(v.number()),
    }),
  })
    .index("by_user", ["userId"])
    .index("by_lesson", ["lessonId"])
    .index("by_session_type", ["sessionType"])
    .index("by_date", ["startTime"]),

  // User Lesson Progress table
  userLessonProgress: defineTable({
    userId: v.id("users"),
    lessonId: v.id("lessons"),
    theoryCompleted: v.boolean(),
    flashcardsCompleted: v.boolean(),
    quizCompleted: v.boolean(),
    overallProgress: v.number(), // 0-100
    lastAccessedAt: v.number(),
    completedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_lesson", ["lessonId"])
    .index("by_user_lesson", ["userId", "lessonId"]),

  // Question Suggestions table
  questionSuggestions: defineTable({
    userId: v.id("users"),
    question: v.string(),
    options: v.array(v.string()),
    correctAnswer: v.number(),
    explanation: v.string(),
    aircraftType: v.string(),
    category: v.string(),
    difficulty: v.string(),
    status: v.string(), // "pending", "approved", "rejected", "needs_review"
    adminNotes: v.optional(v.string()),
    reviewedBy: v.optional(v.id("users")),
    reviewedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_aircraft", ["aircraftType"])
    .index("by_category", ["category"])
    .index("by_created_at", ["createdAt"]),
});