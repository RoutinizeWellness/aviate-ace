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

    -- Insertar preguntas adicionales en inglés para las categorías del sistema de revisión
    -- Aircraft Systems
    FOR i IN 1..50 LOOP
        INSERT INTO public.exam_questions (exam_id, category, question, options, correct_answer, explanation, reference, tier)
        VALUES (
            exam_a320_id,
            'Aircraft Systems',
            'Aircraft Systems Question #' || i || ': What is the primary function of this system?',
            '["Option A", "Option B", "Option C", "Option D"]'::jsonb,
            (i % 4),
            'Detailed explanation for Aircraft Systems question #' || i || '.',
            'A320 FCOM - Aircraft Systems',
            CASE WHEN i <= 10 THEN 'free'::question_tier ELSE 'premium'::question_tier END
        );
    END LOOP;

    -- Flight Protection
    FOR i IN 1..50 LOOP
        INSERT INTO public.exam_questions (exam_id, category, question, options, correct_answer, explanation, reference, tier)
        VALUES (
            exam_a320_id,
            'Flight Protection',
            'Flight Protection Question #' || i || ': What protection prevents this condition?',
            '["Option A", "Option B", "Option C", "Option D"]'::jsonb,
            (i % 4),
            'Detailed explanation for Flight Protection question #' || i || '.',
            'A320 FCOM - Flight Protection',
            CASE WHEN i <= 10 THEN 'free'::question_tier ELSE 'premium'::question_tier END
        );
    END LOOP;

    -- Approach Procedures
    FOR i IN 1..50 LOOP
        INSERT INTO public.exam_questions (exam_id, category, question, options, correct_answer, explanation, reference, tier)
        VALUES (
            exam_a320_id,
            'Approach Procedures',
            'Approach Procedures Question #' || i || ': What is the correct procedure for this approach?',
            '["Option A", "Option B", "Option C", "Option D"]'::jsonb,
            (i % 4),
            'Detailed explanation for Approach Procedures question #' || i || '.',
            'A320 FCOM - Approach Procedures',
            CASE WHEN i <= 10 THEN 'free'::question_tier ELSE 'premium'::question_tier END
        );
    END LOOP;

    -- Emergency Procedures
    FOR i IN 1..50 LOOP
        INSERT INTO public.exam_questions (exam_id, category, question, options, correct_answer, explanation, reference, tier)
        VALUES (
            exam_a320_id,
            'Emergency Procedures',
            'Emergency Procedures Question #' || i || ': What is the immediate action for this emergency?',
            '["Option A", "Option B", "Option C", "Option D"]'::jsonb,
            (i % 4),
            'Detailed explanation for Emergency Procedures question #' || i || '.',
            'A320 QRH - Emergency Procedures',
            CASE WHEN i <= 10 THEN 'free'::question_tier ELSE 'premium'::question_tier END
        );
    END LOOP;

    -- Meteorology
    FOR i IN 1..50 LOOP
        INSERT INTO public.exam_questions (exam_id, category, question, options, correct_answer, explanation, reference, tier)
        VALUES (
            exam_a320_id,
            'Meteorology',
            'Meteorology Question #' || i || ': What weather condition is described?',
            '["Option A", "Option B", "Option C", "Option D"]'::jsonb,
            (i % 4),
            'Detailed explanation for Meteorology question #' || i || '.',
            'ICAO Meteorology Manual',
            CASE WHEN i <= 10 THEN 'free'::question_tier ELSE 'premium'::question_tier END
        );
    END LOOP;

    -- Regulations
    FOR i IN 1..50 LOOP
        INSERT INTO public.exam_questions (exam_id, category, question, options, correct_answer, explanation, reference, tier)
        VALUES (
            exam_a320_id,
            'Regulations',
            'Regulations Question #' || i || ': What regulation applies to this situation?',
            '["Option A", "Option B", "Option C", "Option D"]'::jsonb,
            (i % 4),
            'Detailed explanation for Regulations question #' || i || '.',
            'EASA Part-ORO',
            CASE WHEN i <= 10 THEN 'free'::question_tier ELSE 'premium'::question_tier END
        );
    END LOOP;

    -- Navigation
    FOR i IN 1..50 LOOP
        INSERT INTO public.exam_questions (exam_id, category, question, options, correct_answer, explanation, reference, tier)
        VALUES (
            exam_a320_id,
            'Navigation',
            'Navigation Question #' || i || ': What is the correct navigation procedure?',
            '["Option A", "Option B", "Option C", "Option D"]'::jsonb,
            (i % 4),
            'Detailed explanation for Navigation question #' || i || '.',
            'ICAO PBN Manual',
            CASE WHEN i <= 10 THEN 'free'::question_tier ELSE 'premium'::question_tier END
        );
    END LOOP;

    -- Performance
    FOR i IN 1..50 LOOP
        INSERT INTO public.exam_questions (exam_id, category, question, options, correct_answer, explanation, reference, tier)
        VALUES (
            exam_a320_id,
            'Performance',
            'Performance Question #' || i || ': What performance factor affects this parameter?',
            '["Option A", "Option B", "Option C", "Option D"]'::jsonb,
            (i % 4),
            'Detailed explanation for Performance question #' || i || '.',
            'A320 AFM - Performance Section',
            CASE WHEN i <= 10 THEN 'free'::question_tier ELSE 'premium'::question_tier END
        );
    END LOOP;

END;
$$ LANGUAGE plpgsql;

-- Ejecutar la función para insertar todas las preguntas
SELECT insert_exam_questions_batch();

-- Eliminar la función temporal
DROP FUNCTION insert_exam_questions_batch();

-- Crear un usuario admin de ejemplo (se activará cuando alguien se registre con este email)
-- Este perfil se creará automáticamente cuando el usuario se registre gracias al trigger