-- Fix security warning: Set proper search_path for all functions

-- Update get_random_exam_questions function with proper search_path
CREATE OR REPLACE FUNCTION public.get_random_exam_questions(
  p_exam_id uuid,
  p_user_id uuid DEFAULT NULL,
  p_limit integer DEFAULT 50
)
RETURNS TABLE (
  id uuid,
  question text,
  options jsonb,
  correct_answer integer,
  explanation text,
  reference text,
  category text,
  tier question_tier
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN
  -- If user is premium or no user specified, return all questions
  IF p_user_id IS NULL OR is_premium(p_user_id) THEN
    RETURN QUERY
    SELECT 
      eq.id,
      eq.question,
      eq.options,
      eq.correct_answer,
      eq.explanation,
      eq.reference,
      eq.category,
      eq.tier
    FROM public.exam_questions eq
    WHERE eq.exam_id = p_exam_id
    ORDER BY RANDOM()
    LIMIT p_limit;
  ELSE
    -- For free users, only return free tier questions
    RETURN QUERY
    SELECT 
      eq.id,
      eq.question,
      eq.options,
      eq.correct_answer,
      eq.explanation,
      eq.reference,
      eq.category,
      eq.tier
    FROM public.exam_questions eq
    WHERE eq.exam_id = p_exam_id 
      AND eq.tier = 'free'::question_tier
    ORDER BY RANDOM()
    LIMIT LEAST(p_limit, 10); -- Limit free users to 10 questions max
  END IF;
END;
$$;

-- Update calculate_user_level function with proper search_path
CREATE OR REPLACE FUNCTION public.calculate_user_level(points integer)
RETURNS integer
LANGUAGE plpgsql
IMMUTABLE
STABLE
SET search_path = public
AS $$
BEGIN
  -- Level progression: 100 points per level up to level 10, then 200 points per level
  IF points < 1000 THEN
    RETURN GREATEST(1, points / 100);
  ELSE
    RETURN GREATEST(10, 10 + (points - 1000) / 200);
  END IF;
END;
$$;

-- Update check_and_award_achievements function with proper search_path
CREATE OR REPLACE FUNCTION public.check_and_award_achievements(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  achievement_record RECORD;
  user_stats_record RECORD;
BEGIN
  -- Get current user stats
  SELECT * INTO user_stats_record 
  FROM public.user_stats 
  WHERE user_id = p_user_id;
  
  -- Check each achievement condition
  FOR achievement_record IN 
    SELECT a.* FROM public.achievements a
    WHERE NOT EXISTS (
      SELECT 1 FROM public.user_achievements ua 
      WHERE ua.user_id = p_user_id AND ua.achievement_id = a.id
    )
  LOOP
    -- Check if user meets achievement criteria
    IF (achievement_record.condition_type = 'lessons_completed' AND 
        user_stats_record.total_lessons_completed >= achievement_record.condition_value) OR
       (achievement_record.condition_type = 'exams_passed' AND 
        user_stats_record.total_exams_taken >= achievement_record.condition_value) OR
       (achievement_record.condition_type = 'courses_completed' AND 
        user_stats_record.total_lessons_completed >= achievement_record.condition_value * 10) -- Assume 10 lessons per course
    THEN
      -- Award the achievement
      INSERT INTO public.user_achievements (user_id, achievement_id)
      VALUES (p_user_id, achievement_record.id)
      ON CONFLICT DO NOTHING;
      
      -- Add points to user stats
      UPDATE public.user_stats 
      SET total_points = total_points + achievement_record.points
      WHERE user_id = p_user_id;
    END IF;
  END LOOP;
END;
$$;