// This is a placeholder file for Convex API
// In a real Convex project, this file would be generated automatically

export const api = {
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