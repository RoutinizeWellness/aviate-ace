import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { useAuth } from '@/hooks/useConvexAuth';

export interface TRLessonProgress {
  theoryCompleted: boolean;
  flashcardsCompleted: boolean;
  quizCompleted: boolean;
  overallProgress: number;
}

export const useTypeRatingProgress = (aircraftType: 'A320_FAMILY' | 'B737_FAMILY') => {
  const { user } = useAuth();

  const progressList = useQuery(
    api.typeRating.getUserTypeRatingProgress,
    user ? { userId: user._id as Id<'users'>, aircraftType } : 'skip'
  );

  const update = useMutation(api.typeRating.updateTypeRatingLessonProgress);

  const progressByLesson = new Map<number, TRLessonProgress>();
  (progressList || []).forEach((row: any) => {
    progressByLesson.set(row.lessonNumericId, {
      theoryCompleted: !!row.theoryCompleted,
      flashcardsCompleted: !!row.flashcardsCompleted,
      quizCompleted: !!row.quizCompleted,
      overallProgress: row.overallProgress ?? 0,
    });
  });

  const mark = async (
    lessonNumericId: number,
    step: 'theory' | 'flashcards' | 'quiz'
  ) => {
    if (!user) return;
    const payload: any = {
      userId: user._id as Id<'users'>,
      aircraftType,
      lessonNumericId,
    };
    if (step === 'theory') payload.theoryCompleted = true;
    if (step === 'flashcards') payload.flashcardsCompleted = true;
    if (step === 'quiz') payload.quizCompleted = true;
    await update(payload);
  };

  return {
    isLoading: user ? progressList === undefined : false,
    progressList: progressList || [],
    progressByLesson,
    mark,
  };
};
