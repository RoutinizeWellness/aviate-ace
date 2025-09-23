import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface DebugQuestionLoaderProps {
  mode: string;
  category: string;
  aircraft: string;
  difficulty: string;
  questionCount: number;
}

export const DebugQuestionLoader: React.FC<DebugQuestionLoaderProps> = ({
  mode,
  category,
  aircraft,
  difficulty,
  questionCount
}) => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadDebugInfo = async () => {
    setIsLoading(true);
    try {
      // Load all available questions
      const { allAviationQuestions } = await import('@/data/cleanAviationQuestions');
      const { getAllMassiveQuestions } = await import('@/data/massiveQuestionSeeding');
      // Temporarily skip loading large B737 questions file to avoid import issues
      // const { allB737Questions } = await import('@/data/b737Questions');
      const allB737Questions = [];
      
      const allQuestions = [
        ...allAviationQuestions,
        ...getAllMassiveQuestions()
      ];

      // Analyze questions by aircraft type
      const aircraftStats = allQuestions.reduce((acc, q) => {
        const type = q.aircraftType || 'UNKNOWN';
        if (!acc[type]) {
          acc[type] = { count: 0, categories: new Set(), difficulties: new Set() };
        }
        acc[type].count++;
        acc[type].categories.add(q.category);
        acc[type].difficulties.add(q.difficulty);
        return acc;
      }, {} as any);

      // Convert sets to arrays for display
      Object.keys(aircraftStats).forEach(type => {
        aircraftStats[type].categories = Array.from(aircraftStats[type].categories);
        aircraftStats[type].difficulties = Array.from(aircraftStats[type].difficulties);
      });

      // Filter questions with current criteria
      const { QuestionFilterService } = await import('@/services/QuestionFilterService');
      const filterService = new QuestionFilterService(allQuestions);
      
      const filteredQuestions = filterService.filterQuestions({
        mode,
        categories: category ? [category] : [],
        aircraft,
        difficulty,
        questionCount
      });

      setDebugInfo({
        totalQuestions: allQuestions.length,
        aircraftStats,
        filteredCount: filteredQuestions.length,
        sampleFiltered: filteredQuestions.slice(0, 3),
        criteria: { mode, category, aircraft, difficulty, questionCount },
        b737QuestionsCount: allB737Questions.length
      });
    } catch (error) {
      console.error('Debug loading error:', error);
      setDebugInfo({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDebugInfo();
  }, [mode, category, aircraft, difficulty, questionCount]);

  if (isLoading) {
    return <div>Loading debug info...</div>;
  }

  if (!debugInfo) {
    return <div>No debug info available</div>;
  }

  if (debugInfo.error) {
    return <div className="text-red-500">Error: {debugInfo.error}</div>;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Question Loading Debug Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Criteria */}
        <div>
          <h3 className="font-semibold mb-2">Current Filter Criteria:</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Mode: {debugInfo.criteria.mode}</Badge>
            <Badge variant="outline">Category: {debugInfo.criteria.category || 'none'}</Badge>
            <Badge variant="outline">Aircraft: {debugInfo.criteria.aircraft}</Badge>
            <Badge variant="outline">Difficulty: {debugInfo.criteria.difficulty || 'all'}</Badge>
            <Badge variant="outline">Count: {debugInfo.criteria.questionCount}</Badge>
          </div>
        </div>

        <Separator />

        {/* Question Statistics */}
        <div>
          <h3 className="font-semibold mb-2">Question Database Statistics:</h3>
          <p>Total Questions Available: <strong>{debugInfo.totalQuestions}</strong></p>
          <p>B737 Questions: <strong>{debugInfo.b737QuestionsCount}</strong></p>
          <p>Filtered Questions: <strong>{debugInfo.filteredCount}</strong></p>
        </div>

        <Separator />

        {/* Aircraft Type Breakdown */}
        <div>
          <h3 className="font-semibold mb-2">Questions by Aircraft Type:</h3>
          {Object.entries(debugInfo.aircraftStats).map(([type, stats]: [string, any]) => (
            <div key={type} className="mb-3 p-3 border rounded">
              <h4 className="font-medium">{type}</h4>
              <p>Count: {stats.count}</p>
              <div className="mt-2">
                <p className="text-sm font-medium">Categories:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {stats.categories.map((cat: string) => (
                    <Badge key={cat} variant="secondary" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium">Difficulties:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {stats.difficulties.map((diff: string) => (
                    <Badge key={diff} variant="outline" className="text-xs">
                      {diff}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Sample Filtered Questions */}
        {debugInfo.sampleFiltered.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Sample Filtered Questions:</h3>
            {debugInfo.sampleFiltered.map((q: any, index: number) => (
              <div key={index} className="mb-3 p-3 border rounded">
                <p className="font-medium">{q.question}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">{q.aircraftType}</Badge>
                  <Badge variant="outline">{q.category}</Badge>
                  <Badge variant="outline">{q.difficulty}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        <Button onClick={loadDebugInfo} className="w-full">
          Refresh Debug Info
        </Button>
      </CardContent>
    </Card>
  );
};