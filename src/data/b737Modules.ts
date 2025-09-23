import type { B737Module } from '@/types/b737';

export const B737_MODULE_TEMPLATES: Omit<B737Module, 'progress' | 'completedLessons' | 'isUnlocked'>[] = [
  {
    id: 1,
    title: "Boeing 737 Fundamentals & Aircraft General",
    description: "Essential Boeing 737 knowledge including aircraft variants, specifications, and general systems overview",
    totalLessons: 3,
    category: "foundation",
    estimatedTime: "3.5 hours",
    difficulty: "Basic",
    lessons: [
      {
        id: 1,
        title: "Boeing 737 Aircraft General Knowledge",
        description: "Comprehensive overview of Boeing 737 family: variants (700/800/900), dimensions, weights, and basic specifications per EASA/FAA standards.",
        duration: "75m",
        isCompleted: false,
        isUnlocked: true,
        hasTheory: true,
        hasFlashcards: true,
        hasQuiz: true,
        difficulty: "Basic",
        topics: ["Aircraft Variants", "Dimensions & Weights", "Performance Specifications", "Certification Standards"]
      },
      {
        id: 2,
        title: "Boeing 737 Cockpit Layout & Systems Overview",
        description: "Detailed cockpit familiarization including primary flight displays, engine indications, and system panels layout.",
        duration: "60m",
        isCompleted: false,
        isUnlocked: true,
        hasTheory: true,
        hasFlashcards: true,
        hasQuiz: true,
        difficulty: "Basic",
        topics: ["Cockpit Layout", "Primary Displays", "System Panels", "Control Interfaces"]
      },
      {
        id: 3,
        title: "Boeing 737 Limitations & Operating Envelopes",
        description: "Critical operating limitations including speed limits, altitude restrictions, weight limitations, and environmental constraints.",
        duration: "45m",
        isCompleted: false,
        isUnlocked: true,
        hasTheory: true,
        hasFlashcards: true,
        hasQuiz: true,
        difficulty: "Intermediate",
        topics: ["Speed Limitations", "Weight Limits", "Altitude Restrictions", "Environmental Limits"]
      }
    ]
  },
  {
    id: 2,
    title: "Boeing 737 Aircraft Systems",
    description: "Comprehensive study of all Boeing 737 aircraft systems including normal operations, abnormal procedures, and emergency configurations",
    totalLessons: 12,
    category: "systems",
    estimatedTime: "18 hours",
    difficulty: "Advanced",
    lessons: [
      {
        id: 2,
        title: "Boeing 737 Air Conditioning & Pressurization",
        description: "Boeing 737 cabin air conditioning, pressurization, and environmental control systems.",
        duration: "60m",
        isCompleted: false,
        isUnlocked: false,
        hasTheory: true,
        hasFlashcards: true,
        hasQuiz: true
      },
      {
        id: 3,
        title: "Boeing 737 Anti-ice and Rain Protection",
        description: "Boeing 737 ice protection systems, engine anti-ice, and wing anti-ice systems.",
        duration: "50m",
        isCompleted: false,
        isUnlocked: false,
        hasTheory: true,
        hasFlashcards: true,
        hasQuiz: true
      },
      // ... rest of the lessons
    ]
  }
];

export const createB737ModulesWithProgress = (
  moduleProgress: any[],
  lessonProgress: any[],
  progressHelpers: any
): B737Module[] => {
  return B737_MODULE_TEMPLATES.map(template => {
    const moduleProgressData = progressHelpers.getModuleProgressById(
      template.id === 1 ? 'fundamentos' : 'sistemas'
    );
    
    return {
      ...template,
      progress: moduleProgressData ? 
        Math.round((moduleProgressData.completedLessons / moduleProgressData.totalLessons) * 100) : 0,
      completedLessons: moduleProgressData?.completedLessons || 0,
      isUnlocked: moduleProgressData?.isUnlocked || true,
      lessons: template.lessons.map(lesson => ({
        ...lesson,
        isCompleted: progressHelpers.isLessonCompleted(lesson.id),
        isUnlocked: progressHelpers.isLessonUnlocked(lesson.id)
      }))
    };
  });
};