-- Create comprehensive data setup for aviation training platform

-- First, ensure we have sample exams if they don't exist
DO $$
BEGIN
  -- Insert A320 exam if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM public.exams WHERE slug = 'a320-type-rating') THEN
    INSERT INTO public.exams (title, slug, description, aircraft_type, total_questions, duration_minutes, passing_score, is_active)
    VALUES (
      'A320 Type Rating Exam',
      'a320-type-rating', 
      'Complete type rating examination for Airbus A320 aircraft covering all systems and procedures',
      'A320',
      50,
      180,
      70,
      true
    );
  END IF;

  -- Insert B737 exam if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM public.exams WHERE slug = 'b737-type-rating') THEN
    INSERT INTO public.exams (title, slug, description, aircraft_type, total_questions, duration_minutes, passing_score, is_active)
    VALUES (
      'B737 Type Rating Exam',
      'b737-type-rating',
      'Complete type rating examination for Boeing 737 aircraft covering all systems and procedures', 
      'B737',
      50,
      180,
      70,
      true
    );
  END IF;
END $$;

-- Create sample courses for both aircraft types
INSERT INTO public.courses (title, description, aircraft_type, difficulty, duration_hours, is_active)
VALUES 
  ('A320 Ground School', 'Comprehensive ground training for A320 aircraft systems', 'A320', 'intermediate', 40, true),
  ('A320 Advanced Systems', 'Advanced A320 systems training including ECAM procedures', 'A320', 'advanced', 30, true),
  ('B737 Ground School', 'Comprehensive ground training for B737 aircraft systems', 'B737', 'intermediate', 35, true),
  ('B737 MAX Differences', 'B737 MAX specific training and differences course', 'B737', 'advanced', 20, true)
ON CONFLICT DO NOTHING;

-- Create modules for the courses
DO $$
DECLARE
  a320_course_id uuid;
  a320_advanced_id uuid;
  b737_course_id uuid;
  b737_max_id uuid;
BEGIN
  -- Get course IDs
  SELECT id INTO a320_course_id FROM public.courses WHERE title = 'A320 Ground School' LIMIT 1;
  SELECT id INTO a320_advanced_id FROM public.courses WHERE title = 'A320 Advanced Systems' LIMIT 1;
  SELECT id INTO b737_course_id FROM public.courses WHERE title = 'B737 Ground School' LIMIT 1;
  SELECT id INTO b737_max_id FROM public.courses WHERE title = 'B737 MAX Differences' LIMIT 1;

  -- Insert modules for A320 Ground School
  IF a320_course_id IS NOT NULL THEN
    INSERT INTO public.modules (course_id, title, description, order_index)
    VALUES 
      (a320_course_id, 'Aircraft Systems Overview', 'Introduction to A320 systems architecture', 1),
      (a320_course_id, 'Flight Controls', 'Fly-by-wire system and flight control laws', 2),
      (a320_course_id, 'Powerplant', 'Engine systems and fuel management', 3),
      (a320_course_id, 'Hydraulics & Landing Gear', 'Hydraulic systems and landing gear operation', 4),
      (a320_course_id, 'Electrical Systems', 'AC/DC electrical systems and emergency power', 5),
      (a320_course_id, 'Air Conditioning & Pressurization', 'Environmental control systems', 6),
      (a320_course_id, 'Avionics & Navigation', 'FMGS, MCDU, and navigation systems', 7)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Insert modules for A320 Advanced Systems
  IF a320_advanced_id IS NOT NULL THEN
    INSERT INTO public.modules (course_id, title, description, order_index)
    VALUES 
      (a320_advanced_id, 'ECAM System', 'Electronic Centralized Aircraft Monitoring', 1),
      (a320_advanced_id, 'Abnormal Procedures', 'Non-normal and emergency procedures', 2),
      (a320_advanced_id, 'Performance & Weight Balance', 'Aircraft performance calculations', 3)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Insert modules for B737 Ground School
  IF b737_course_id IS NOT NULL THEN
    INSERT INTO public.modules (course_id, title, description, order_index)
    VALUES 
      (b737_course_id, 'Aircraft Systems Overview', 'Introduction to B737 systems', 1),
      (b737_course_id, 'Flight Controls', 'Manual flight controls and trim systems', 2),
      (b737_course_id, 'Powerplant', 'CFM56/LEAP engine systems', 3),
      (b737_course_id, 'Hydraulics & Landing Gear', 'Hydraulic systems A & B', 4),
      (b737_course_id, 'Electrical Systems', 'AC/DC systems and batteries', 5),
      (b737_course_id, 'Environmental Systems', 'Bleed air and pressurization', 6)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Insert modules for B737 MAX Differences
  IF b737_max_id IS NOT NULL THEN
    INSERT INTO public.modules (course_id, title, description, order_index)
    VALUES 
      (b737_max_id, 'LEAP Engine Differences', 'New engine technology and systems', 1),
      (b737_max_id, 'MCAS System', 'Maneuvering Characteristics Augmentation System', 2),
      (b737_max_id, 'Cockpit Differences', 'Updated displays and controls', 3)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Create sample achievements
INSERT INTO public.achievements (title, description, condition_type, condition_value, points, icon)
VALUES 
  ('First Steps', 'Complete your first lesson', 'lessons_completed', 1, 50, '🎯'),
  ('Quick Learner', 'Complete 5 lessons', 'lessons_completed', 5, 100, '⚡'),
  ('Dedicated Student', 'Complete 10 lessons', 'lessons_completed', 10, 200, '📚'),
  ('Exam Ready', 'Pass your first exam', 'exams_passed', 1, 300, '✅'),
  ('High Achiever', 'Score 90% or higher on an exam', 'high_score', 90, 250, '🌟'),
  ('Perfect Score', 'Score 100% on an exam', 'perfect_score', 100, 500, '💯'),
  ('Streak Master', 'Study for 7 consecutive days', 'study_streak', 7, 400, '🔥'),
  ('Course Completion', 'Complete your first course', 'courses_completed', 1, 600, '🏆'),
  ('Knowledge Seeker', 'Answer 100 questions correctly', 'correct_answers', 100, 300, '🧠'),
  ('Expert Level', 'Reach level 10', 'level_reached', 10, 1000, '👑')
ON CONFLICT DO NOTHING;

-- Create sample forum thread categories and threads
INSERT INTO public.forum_threads (title, body, category_key, author_id)
SELECT 
  'Welcome to the Aviation Training Community',
  'Welcome pilots! This is your space to discuss training, share experiences, and help each other succeed in aviation. Please keep discussions professional and supportive.',
  'general',
  (SELECT user_id FROM public.profiles WHERE role = 'admin' LIMIT 1)
WHERE EXISTS (SELECT 1 FROM public.profiles WHERE role = 'admin')
ON CONFLICT DO NOTHING;

-- Create function to get random exam questions with proper tier filtering
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

-- Create function to calculate user level based on points
CREATE OR REPLACE FUNCTION public.calculate_user_level(points integer)
RETURNS integer
LANGUAGE plpgsql
IMMUTABLE
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

-- Create trigger to automatically update user level when points change
CREATE OR REPLACE FUNCTION public.update_user_level()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update level in profiles table
  UPDATE public.profiles 
  SET level = calculate_user_level(NEW.total_points)
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger for user stats updates
DROP TRIGGER IF EXISTS update_user_level_trigger ON public.user_stats;
CREATE TRIGGER update_user_level_trigger
  AFTER UPDATE OF total_points ON public.user_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_level();

-- Create function to award achievement
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

-- Update all existing profiles to have correct levels based on points
UPDATE public.profiles 
SET level = calculate_user_level(COALESCE(us.total_points, 0))
FROM public.user_stats us 
WHERE profiles.user_id = us.user_id;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.get_random_exam_questions TO authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_user_level TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_and_award_achievements TO authenticated;