// Convex wrapper with fallback for environments where Convex is not available
let useMutation: any;
let api: any;

try {
  // Try to import Convex modules
  useMutation = require('convex/react').useMutation;
  api = require('@/convex/_generated/api').api;
} catch (e) {
  // Fallback when Convex is not available
  console.warn('Convex not available, using fallback');
  
  useMutation = () => {
    return async (params: any) => {
      console.log('Mock Convex mutation called with params:', params);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    };
  };
  
  api = {
    auth: {
      registerUser: "auth:registerUser",
      loginUser: "auth:loginUser",
      getUser: "auth:getUser",
      getUserProfile: "auth:getUserProfile",
      getUserStats: "auth:getUserStats",
      recordIncorrectQuestion: "auth:recordIncorrectQuestion",
      markQuestionResolved: "auth:markQuestionResolved",
      isUserAdmin: "auth:isUserAdmin",
      getAllUsers: "auth:getAllUsers",
      updateUserRole: "auth:updateUserRole",
      deleteUser: "auth:deleteUser",
      forceGrantAdminAccess: "auth:forceGrantAdminAccess",
      updateUserSubscription: "auth:updateUserSubscription",
    },
    courses: {
      getUserCourses: "courses:getUserCourses",
    },
    exams: {
      getExams: "exams:getExams",
      getExamById: "exams:getExamById",
      submitExam: "exams:submitExam",
      getUserExamSessions: "exams:getUserExamSessions",
      getExam: "exams:getExam",
      getExamQuestions: "exams:getExamQuestions",
      startExamSession: "exams:startExamSession",
      completeExamSession: "exams:completeExamSession",
    }
  };
}

export { useMutation, api };