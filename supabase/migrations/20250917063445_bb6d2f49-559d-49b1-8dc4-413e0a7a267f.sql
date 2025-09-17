-- Función corregida para insertar preguntas de examen en lotes
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
            CASE WHEN i <= 10 THEN 'free'::question_tier ELSE 'premium'::question_tier END
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
            'premium'::question_tier
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
            CASE WHEN i <= 10 THEN 'free'::question_tier ELSE 'premium'::question_tier END
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
            'premium'::question_tier
        );
    END LOOP;

END;
$$ LANGUAGE plpgsql;

-- Ejecutar la función para insertar todas las preguntas
SELECT insert_exam_questions_batch();

-- Eliminar la función temporal
DROP FUNCTION insert_exam_questions_batch();

-- Crear función para obtener preguntas limitadas para usuarios free
CREATE OR REPLACE FUNCTION public.get_limited_exam_questions(
    exam_slug TEXT,
    user_id UUID DEFAULT NULL,
    question_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    category TEXT,
    question TEXT,
    options JSONB,
    correct_answer INTEGER,
    explanation TEXT,
    reference TEXT
) AS $$
BEGIN
    -- Si el usuario es premium o admin, devolver todas las preguntas
    IF user_id IS NOT NULL AND (public.is_premium(user_id) OR public.is_admin(user_id)) THEN
        RETURN QUERY
        SELECT eq.id, eq.category, eq.question, eq.options, eq.correct_answer, eq.explanation, eq.reference
        FROM public.exam_questions eq
        JOIN public.exams e ON eq.exam_id = e.id
        WHERE e.slug = exam_slug
        ORDER BY RANDOM();
    ELSE
        -- Para usuarios free, limitar a preguntas gratuitas y aplicar límite
        RETURN QUERY
        SELECT eq.id, eq.category, eq.question, eq.options, eq.correct_answer, eq.explanation, eq.reference
        FROM public.exam_questions eq
        JOIN public.exams e ON eq.exam_id = e.id
        WHERE e.slug = exam_slug 
        AND eq.tier = 'free'
        ORDER BY RANDOM()
        LIMIT question_limit;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;