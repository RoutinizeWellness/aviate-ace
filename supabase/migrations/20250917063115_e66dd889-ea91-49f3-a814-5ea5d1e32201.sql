-- Crear función para verificar si el usuario es admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = is_admin.user_id 
    AND profiles.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Crear función para verificar si el usuario es premium
CREATE OR REPLACE FUNCTION public.is_premium(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = is_premium.user_id 
    AND profiles.plan_type = 'premium'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Función para actualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Función para crear perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  
  -- Crear estadísticas iniciales
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Triggers para actualizar timestamps
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON public.modules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_quiz_questions_updated_at BEFORE UPDATE ON public.quiz_questions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON public.exams FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_exam_questions_updated_at BEFORE UPDATE ON public.exam_questions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON public.user_stats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_forum_threads_updated_at BEFORE UPDATE ON public.forum_threads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- POLÍTICAS RLS
-- ============================================

-- Políticas para profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- Políticas para courses (públicos para lectura)
CREATE POLICY "Anyone can view active courses" ON public.courses
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage courses" ON public.courses
  FOR ALL USING (public.is_admin(auth.uid()));

-- Políticas para modules (públicos para lectura)
CREATE POLICY "Anyone can view modules" ON public.modules
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage modules" ON public.modules
  FOR ALL USING (public.is_admin(auth.uid()));

-- Políticas para lessons (públicos para lectura)
CREATE POLICY "Anyone can view lessons" ON public.lessons
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage lessons" ON public.lessons
  FOR ALL USING (public.is_admin(auth.uid()));

-- Políticas para quiz_questions
CREATE POLICY "Users can view free quiz questions" ON public.quiz_questions
  FOR SELECT USING (tier = 'free');

CREATE POLICY "Premium users can view all quiz questions" ON public.quiz_questions
  FOR SELECT USING (tier = 'free' OR public.is_premium(auth.uid()));

CREATE POLICY "Admins can manage quiz questions" ON public.quiz_questions
  FOR ALL USING (public.is_admin(auth.uid()));

-- Políticas para exams (públicos para lectura)
CREATE POLICY "Anyone can view active exams" ON public.exams
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage exams" ON public.exams
  FOR ALL USING (public.is_admin(auth.uid()));

-- Políticas para exam_questions
CREATE POLICY "Users can view free exam questions" ON public.exam_questions
  FOR SELECT USING (tier = 'free');

CREATE POLICY "Premium users can view all exam questions" ON public.exam_questions
  FOR SELECT USING (tier = 'free' OR public.is_premium(auth.uid()));

CREATE POLICY "Admins can manage exam questions" ON public.exam_questions
  FOR ALL USING (public.is_admin(auth.uid()));

-- Políticas para user_courses
CREATE POLICY "Users can view their own course enrollments" ON public.user_courses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll in courses" ON public.user_courses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own course progress" ON public.user_courses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all course enrollments" ON public.user_courses
  FOR SELECT USING (public.is_admin(auth.uid()));

-- Políticas para user_progress
CREATE POLICY "Users can view their own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.user_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress" ON public.user_progress
  FOR SELECT USING (public.is_admin(auth.uid()));

-- Políticas para user_stats
CREATE POLICY "Users can view their own stats" ON public.user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" ON public.user_stats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all stats" ON public.user_stats
  FOR SELECT USING (public.is_admin(auth.uid()));

-- Políticas para progress_logs
CREATE POLICY "Users can view their own progress logs" ON public.progress_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress logs" ON public.progress_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress logs" ON public.progress_logs
  FOR SELECT USING (public.is_admin(auth.uid()));

-- Políticas para achievements (públicos para lectura)
CREATE POLICY "Anyone can view achievements" ON public.achievements
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage achievements" ON public.achievements
  FOR ALL USING (public.is_admin(auth.uid()));

-- Políticas para user_achievements
CREATE POLICY "Users can view their own achievements" ON public.user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can unlock achievements" ON public.user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all user achievements" ON public.user_achievements
  FOR SELECT USING (public.is_admin(auth.uid()));

-- Políticas para exam_sessions
CREATE POLICY "Users can view their own exam sessions" ON public.exam_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own exam sessions" ON public.exam_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exam sessions" ON public.exam_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all exam sessions" ON public.exam_sessions
  FOR SELECT USING (public.is_admin(auth.uid()));

-- Políticas para planner_events
CREATE POLICY "Users can view their own planner events" ON public.planner_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own planner events" ON public.planner_events
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all planner events" ON public.planner_events
  FOR SELECT USING (public.is_admin(auth.uid()));

-- Políticas para forum_threads
CREATE POLICY "Anyone can view forum threads" ON public.forum_threads
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create forum threads" ON public.forum_threads
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own forum threads" ON public.forum_threads
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all forum threads" ON public.forum_threads
  FOR ALL USING (public.is_admin(auth.uid()));

-- Políticas para forum_posts
CREATE POLICY "Anyone can view forum posts" ON public.forum_posts
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create forum posts" ON public.forum_posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own forum posts" ON public.forum_posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all forum posts" ON public.forum_posts
  FOR ALL USING (public.is_admin(auth.uid()));