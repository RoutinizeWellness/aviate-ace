// Convex courses functions
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get user courses
export const getUserCourses = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // In a real implementation, you would fetch courses from the database
    // For now, we'll return some sample data
    console.log("getUserCourses called with userId:", args.userId);
    
    // Return sample course data
    return [
      {
        id: "a320-course",
        title: "Airbus A320 Type Rating",
        description: "Complete preparation materials for Airbus A320 type rating",
        progress: 0,
        totalLessons: 25,
        completedLessons: 0,
        aircraftType: "A320_FAMILY",
        subscriptionRequired: true,
      },
      {
        id: "b737-course",
        title: "Boeing 737 Type Rating",
        description: "Complete preparation materials for Boeing 737 type rating",
        progress: 0,
        totalLessons: 25,
        completedLessons: 0,
        aircraftType: "B737_FAMILY",
        subscriptionRequired: true,
      }
    ];
  },
});

// Get course by ID
export const getCourseById = query({
  args: {
    courseId: v.string(),
  },
  handler: async (ctx, args) => {
    // In a real implementation, you would fetch the course from the database
    console.log("getCourseById called with courseId:", args.courseId);
    
    // Return sample course data based on ID
    if (args.courseId === "a320-course") {
      return {
        id: "a320-course",
        title: "Airbus A320 Type Rating",
        description: "Complete preparation materials for Airbus A320 type rating",
        progress: 0,
        totalLessons: 25,
        completedLessons: 0,
        aircraftType: "A320_FAMILY",
        subscriptionRequired: true,
        lessons: [
          { id: "a320-lesson-1", title: "A320 Systems Overview", duration: 45 },
          { id: "a320-lesson-2", title: "Flight Controls", duration: 30 },
          // Add more lessons as needed
        ]
      };
    } else if (args.courseId === "b737-course") {
      return {
        id: "b737-course",
        title: "Boeing 737 Type Rating",
        description: "Complete preparation materials for Boeing 737 type rating",
        progress: 0,
        totalLessons: 25,
        completedLessons: 0,
        aircraftType: "B737_FAMILY",
        subscriptionRequired: true,
        lessons: [
          { id: "b737-lesson-1", title: "B737 Systems Overview", duration: 45 },
          { id: "b737-lesson-2", title: "Flight Controls", duration: 30 },
          // Add more lessons as needed
        ]
      };
    }
    
    return null;
  },
});

// Update user course progress
export const updateUserCourseProgress = mutation({
  args: {
    userId: v.string(),
    courseId: v.string(),
    progress: v.number(),
    completedLessons: v.number(),
  },
  handler: async (ctx, args) => {
    // In a real implementation, you would update the user's course progress in the database
    console.log("updateUserCourseProgress called with:", args);
    
    // Return success
    return { success: true };
  },
});