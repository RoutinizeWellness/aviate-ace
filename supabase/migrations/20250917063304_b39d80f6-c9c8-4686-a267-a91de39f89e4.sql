-- Insertar logros del sistema
INSERT INTO public.achievements (title, description, icon, points, condition_type, condition_value) VALUES
('Primer Vuelo', 'Completa tu primera lección', 'trophy', 50, 'lessons_completed', 1),
('Estudiante Dedicado', 'Completa 10 lecciones', 'award', 200, 'lessons_completed', 10),
('Piloto en Formación', 'Completa 25 lecciones', 'star', 500, 'lessons_completed', 25),
('Experto del A320', 'Completa todos los módulos del A320', 'crown', 1000, 'course_completed', 1),
('Experto del B737', 'Completa todos los módulos del B737', 'crown', 1000, 'course_completed', 1),
('Quiz Master', 'Responde correctamente 100 preguntas de quiz', 'brain', 300, 'quizzes_passed', 100),
('Examinador', 'Aprueba tu primer examen oficial', 'graduation-cap', 800, 'exams_passed', 1),
('Perfeccionista', 'Obtén 100% en un examen', 'target', 1500, 'perfect_exam', 1);

-- Insertar cursos principales
INSERT INTO public.courses (title, description, aircraft_type, difficulty, duration_hours) VALUES
('Curso Completo Airbus A320', 'Preparación completa para habilitación en Airbus A320, incluyendo sistemas, procedimientos y regulaciones.', 'airbus_a320', 'intermediate', 120),
('Curso Completo Boeing 737', 'Preparación completa para habilitación en Boeing 737, incluyendo sistemas, procedimientos y regulaciones.', 'boeing_737', 'intermediate', 120),
('A320 Avanzado', 'Curso avanzado para pilotos experimentados en A320', 'airbus_a320', 'advanced', 80),
('B737 MAX Diferencias', 'Curso de diferencias para B737 MAX', 'boeing_737', 'advanced', 40);

-- Obtener IDs de los cursos insertados
DO $$
DECLARE
    course_a320_id UUID;
    course_b737_id UUID;
    course_a320_adv_id UUID;
    course_b737_max_id UUID;
    module_id UUID;
    lesson_id UUID;
BEGIN
    -- Obtener IDs de cursos
    SELECT id INTO course_a320_id FROM public.courses WHERE aircraft_type = 'airbus_a320' AND difficulty = 'intermediate';
    SELECT id INTO course_b737_id FROM public.courses WHERE aircraft_type = 'boeing_737' AND difficulty = 'intermediate';
    SELECT id INTO course_a320_adv_id FROM public.courses WHERE aircraft_type = 'airbus_a320' AND difficulty = 'advanced';
    SELECT id INTO course_b737_max_id FROM public.courses WHERE aircraft_type = 'boeing_737' AND difficulty = 'advanced';

    -- Módulos para A320
    INSERT INTO public.modules (title, description, course_id, order_index) VALUES
    ('Fundamentos', 'Conceptos básicos del Airbus A320', course_a320_id, 1),
    ('Sistemas', 'Sistemas de la aeronave A320', course_a320_id, 2),
    ('Procedimientos', 'Procedimientos operacionales', course_a320_id, 3),
    ('Emergencias', 'Procedimientos de emergencia', course_a320_id, 4);

    -- Módulos para B737
    INSERT INTO public.modules (title, description, course_id, order_index) VALUES
    ('Fundamentos', 'Conceptos básicos del Boeing 737', course_b737_id, 1),
    ('Sistemas', 'Sistemas de la aeronave B737', course_b737_id, 2),
    ('Procedimientos', 'Procedimientos operacionales', course_b737_id, 3),
    ('Emergencias', 'Procedimientos de emergencia', course_b737_id, 4);

    -- Lecciones para módulo Sistemas A320
    SELECT id INTO module_id FROM public.modules WHERE title = 'Sistemas' AND course_id = course_a320_id;
    
    INSERT INTO public.lessons (title, content, module_id, course_id, order_index) VALUES
    ('Sistema Hidráulico', 'El A320 cuenta con tres sistemas hidráulicos independientes...', module_id, course_a320_id, 1),
    ('Sistema Eléctrico', 'Sistema eléctrico del A320 con generadores y baterías...', module_id, course_a320_id, 2),
    ('Sistema de Combustible', 'Gestión y distribución de combustible en el A320...', module_id, course_a320_id, 3),
    ('Sistema de Presurización', 'Control de presión de cabina y sistemas de aire...', module_id, course_a320_id, 4),
    ('Sistema de Frenos', 'Sistema de frenos automático y manual...', module_id, course_a320_id, 5),
    ('Controles de Vuelo', 'Sistemas fly-by-wire y controles de vuelo...', module_id, course_a320_id, 6),
    ('Tren de Aterrizaje', 'Operación y sistemas del tren de aterrizaje...', module_id, course_a320_id, 7),
    ('Sistema de Oxígeno', 'Suministro de oxígeno para tripulación y pasajeros...', module_id, course_a320_id, 8);

    -- Lecciones para módulo Sistemas B737
    SELECT id INTO module_id FROM public.modules WHERE title = 'Sistemas' AND course_id = course_b737_id;
    
    INSERT INTO public.lessons (title, content, module_id, course_id, order_index) VALUES
    ('Sistema Hidráulico', 'El B737 utiliza dos sistemas hidráulicos principales...', module_id, course_b737_id, 1),
    ('Sistema Eléctrico', 'Configuración eléctrica del Boeing 737...', module_id, course_b737_id, 2),
    ('Sistema de Combustible', 'Tanques y distribución de combustible en B737...', module_id, course_b737_id, 3),
    ('Sistema de Presurización', 'Presurización de cabina en el Boeing 737...', module_id, course_b737_id, 4),
    ('Sistema de Frenos', 'Frenos y sistemas antiskid del B737...', module_id, course_b737_id, 5),
    ('Controles de Vuelo', 'Controles de vuelo manuales y asistidos...', module_id, course_b737_id, 6),
    ('Tren de Aterrizaje', 'Configuración del tren de aterrizaje B737...', module_id, course_b737_id, 7),
    ('Sistema de Oxígeno', 'Máscaras de oxígeno y sistemas de emergencia...', module_id, course_b737_id, 8);

END $$;

-- Insertar exámenes principales
INSERT INTO public.exams (title, slug, description, aircraft_type, duration_minutes, passing_score, total_questions) VALUES
('Examen Oficial Airbus A320', 'airbus-a320', 'Examen oficial para habilitación en Airbus A320', 'airbus_a320', 180, 70, 50),
('Examen Oficial Boeing 737', 'boeing-737', 'Examen oficial para habilitación en Boeing 737', 'boeing_737', 180, 70, 50);

-- Insertar preguntas de ejemplo para quiz (lecciones)
INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer, explanation, tier)
SELECT 
    l.id,
    'En el sistema hidráulico del ' || 
    CASE WHEN c.aircraft_type = 'airbus_a320' THEN 'A320' ELSE 'B737' END ||
    ', ¿cuántos sistemas independientes existen?',
    CASE 
        WHEN c.aircraft_type = 'airbus_a320' THEN '["1 sistema", "2 sistemas", "3 sistemas", "4 sistemas"]'::jsonb
        ELSE '["1 sistema", "2 sistemas", "3 sistemas", "4 sistemas"]'::jsonb
    END,
    CASE WHEN c.aircraft_type = 'airbus_a320' THEN 2 ELSE 1 END,
    CASE 
        WHEN c.aircraft_type = 'airbus_a320' THEN 'El A320 tiene 3 sistemas hidráulicos: Green, Blue y Yellow.'
        ELSE 'El B737 tiene 2 sistemas hidráulicos: A y B.'
    END,
    'free'
FROM public.lessons l
JOIN public.courses c ON l.course_id = c.id
WHERE l.title = 'Sistema Hidráulico';

-- Función para insertar preguntas de examen en lotes
CREATE OR REPLACE FUNCTION insert_exam_questions_batch()
RETURNS void AS $$
DECLARE
    exam_a320_id UUID;
    exam_b737_id UUID;
    i INTEGER;
BEGIN
    -- Obtener IDs de exámenes
    SELECT id INTO exam_a320_id FROM public.exams WHERE slug = 'airbus-a320';
    SELECT id INTO exam_b737_id FROM public.exams WHERE slug = 'boeing-737';

    -- Insertar 250 preguntas para A320
    FOR i IN 1..250 LOOP
        INSERT INTO public.exam_questions (exam_id, category, question, options, correct_answer, explanation, reference, tier)
        VALUES (
            exam_a320_id,
            CASE 
                WHEN i <= 31 THEN 'Sistema Hidráulico'
                WHEN i <= 62 THEN 'Sistema Eléctrico'
                WHEN i <= 93 THEN 'Sistema de Combustible'
                WHEN i <= 124 THEN 'Sistema de Presurización'
                WHEN i <= 155 THEN 'Sistema de Frenos'
                WHEN i <= 186 THEN 'Controles de Vuelo'
                WHEN i <= 217 THEN 'Tren de Aterrizaje'
                ELSE 'Sistema de Oxígeno'
            END,
            'Pregunta A320 #' || i || ': En condiciones normales, ¿cuál es el procedimiento estándar para este sistema?',
            '["Opción A", "Opción B", "Opción C", "Opción D"]'::jsonb,
            (i % 4),
            'Explicación detallada para la pregunta #' || i || ' del sistema correspondiente.',
            'A320 FCOM - Sistema correspondiente',
            CASE WHEN i <= 10 THEN 'free' ELSE 'premium' END
        );
    END LOOP;

    -- Insertar 250 preguntas adicionales premium para A320
    FOR i IN 251..500 LOOP
        INSERT INTO public.exam_questions (exam_id, category, question, options, correct_answer, explanation, reference, tier)
        VALUES (
            exam_a320_id,
            CASE 
                WHEN i <= 281 THEN 'Sistema Hidráulico'
                WHEN i <= 312 THEN 'Sistema Eléctrico'
                WHEN i <= 343 THEN 'Sistema de Combustible'
                WHEN i <= 374 THEN 'Sistema de Presurización'
                WHEN i <= 405 THEN 'Sistema de Frenos'
                WHEN i <= 436 THEN 'Controles de Vuelo'
                WHEN i <= 467 THEN 'Tren de Aterrizaje'
                ELSE 'Sistema de Oxígeno'
            END,
            'Pregunta Avanzada A320 #' || i || ': En situaciones de emergencia, ¿cuál es la respuesta correcta para este escenario?',
            '["Opción A", "Opción B", "Opción C", "Opción D"]'::jsonb,
            (i % 4),
            'Explicación avanzada para la pregunta #' || i || ' con procedimientos de emergencia.',
            'A320 FCOM - Procedimientos de Emergencia',
            'premium'
        );
    END LOOP;

    -- Insertar 250 preguntas para B737
    FOR i IN 1..250 LOOP
        INSERT INTO public.exam_questions (exam_id, category, question, options, correct_answer, explanation, reference, tier)
        VALUES (
            exam_b737_id,
            CASE 
                WHEN i <= 31 THEN 'Sistema Hidráulico'
                WHEN i <= 62 THEN 'Sistema Eléctrico'
                WHEN i <= 93 THEN 'Sistema de Combustible'
                WHEN i <= 124 THEN 'Sistema de Presurización'
                WHEN i <= 155 THEN 'Sistema de Frenos'
                WHEN i <= 186 THEN 'Controles de Vuelo'
                WHEN i <= 217 THEN 'Tren de Aterrizaje'
                ELSE 'Sistema de Oxígeno'
            END,
            'Pregunta B737 #' || i || ': ¿Cuál es el procedimiento estándar para operar este sistema?',
            '["Opción A", "Opción B", "Opción C", "Opción D"]'::jsonb,
            (i % 4),
            'Explicación detallada para la pregunta #' || i || ' del Boeing 737.',
            'B737 FCOM - Sistema correspondiente',
            CASE WHEN i <= 10 THEN 'free' ELSE 'premium' END
        );
    END LOOP;

    -- Insertar 250 preguntas adicionales premium para B737
    FOR i IN 251..500 LOOP
        INSERT INTO public.exam_questions (exam_id, category, question, options, correct_answer, explanation, reference, tier)
        VALUES (
            exam_b737_id,
            CASE 
                WHEN i <= 281 THEN 'Sistema Hidráulico'
                WHEN i <= 312 THEN 'Sistema Eléctrico'
                WHEN i <= 343 THEN 'Sistema de Combustible'
                WHEN i <= 374 THEN 'Sistema de Presurización'
                WHEN i <= 405 THEN 'Sistema de Frenos'
                WHEN i <= 436 THEN 'Controles de Vuelo'
                WHEN i <= 467 THEN 'Tren de Aterrizaje'
                ELSE 'Sistema de Oxígeno'
            END,
            'Pregunta Avanzada B737 #' || i || ': En condiciones anormales, ¿cuál es la acción correcta?',
            '["Opción A", "Opción B", "Opción C", "Opción D"]'::jsonb,
            (i % 4),
            'Explicación avanzada para la pregunta #' || i || ' con casos especiales.',
            'B737 FCOM - Procedimientos Anormales',
            'premium'
        );
    END LOOP;

END;
$$ LANGUAGE plpgsql;

-- Ejecutar la función para insertar todas las preguntas
SELECT insert_exam_questions_batch();

-- Eliminar la función temporal
DROP FUNCTION insert_exam_questions_batch();