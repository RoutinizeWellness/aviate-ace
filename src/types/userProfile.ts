// User profile types that match the Supabase schema structure
export interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string;
  avatar_url?: string;
  experience_level?: string;
  current_aircraft?: 'A320' | 'B737' | 'GENERAL';
  plan_type?: 'free' | 'premium' | 'enterprise';
  role?: 'user' | 'admin' | 'premium';
  level?: number;
  points?: number;
  created_at: string;
  updated_at: string;
}

// Convex-style user profile (camelCase)
export interface ConvexUserProfile {
  id: string;
  email: string;
  fullName?: string;
  displayName?: string;
  avatarUrl?: string;
  role?: 'user' | 'admin' | 'premium';
  accountType?: 'free' | 'premium' | 'enterprise';
  subscription?: string;
  isActive?: boolean;
  createdAt: number;
  updatedAt: number;
}

// User stats from Supabase
export interface UserStats {
  id: string;
  user_id: string;
  current_level?: number;
  total_points?: number;
  total_exams_taken?: number;
  total_quizzes_taken?: number;
  total_lessons_completed?: number;
  created_at: string;
  updated_at: string;
}

// Achievement type
export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}