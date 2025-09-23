import { useState, useEffect } from 'react';
import type { LessonData, FlashCard } from '@/types/lesson';

// Mock data service - in production, this would be replaced with API calls
const getLessonData = async (lessonId: string): Promise<LessonData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    id: lessonId,
    title: "Boeing 737 Air Conditioning & Pressurization Systems",
    description: "Learn about the Boeing 737 cabin air conditioning, pressurization, and environmental control systems.",
    category: "Systems",
    aircraft: "Boeing 737",
    duration: "60 minutes",
    difficulty: "Advanced",
    content: `
      <h2>Boeing 737 Air Conditioning & Pressurization Systems</h2>
      
      <h3>Overview</h3>
      <p>The Boeing 737 air conditioning and pressurization system maintains a comfortable and safe environment for passengers and crew. The system provides:</p>
      <ul>
        <li>Temperature control</li>
        <li>Cabin pressurization</li>
        <li>Air quality management</li>
        <li>Smoke detection and removal</li>
      </ul>
      
      <h3>Air Conditioning System Components</h3>
      <p>The Boeing 737 air conditioning system consists of:</p>
      <ol>
        <li><strong>Air Conditioning Packs (PACKs)</strong> - Two packs provide conditioned air to the cabin</li>
        <li><strong>Mixing Manifold</strong> - Combines conditioned air with recirculated air</li>
        <li><strong>Distribution Ducts</strong> - Distribute air throughout the cabin</li>
        <li><strong>Recirculation System</strong> - Recirculates filtered cabin air to reduce engine bleed air demand</li>
        <li><strong>Temperature Control System</strong> - Maintains desired cabin temperature</li>
      </ol>
      
      <h3>Pressurization System</h3>
      <p>The pressurization system maintains cabin pressure at a comfortable level:</p>
      <ul>
        <li><strong>Cabin Pressure Controller (CPC)</strong> - Automatic control of cabin pressure</li>
        <li><strong>Outflow Valves</strong> - Control cabin pressure by regulating air outflow</li>
        <li><strong>Safety Valves</strong> - Provide overpressure and negative pressure protection</li>
        <li><strong>Pressure Relief Valves</strong> - Emergency pressure relief</li>
      </ul>
      
      <h3>Key Operating Principles</h3>
      <p>Understanding the system operation is crucial for pilots:</p>
      <ul>
        <li>Air is typically supplied from engine bleed air or APU</li>
        <li>PACKs cool and condition the bleed air</li>
        <li>Pressurization is maintained by controlling outflow</li>
        <li>Automatic systems can be overridden manually if needed</li>
      </ul>
      
      <h3>Emergency Procedures</h3>
      <p>In case of system failure:</p>
      <ol>
        <li>Identify the failed component</li>
        <li>Follow QRH procedures for the specific failure</li>
        <li>Consider diverting if pressurization cannot be maintained</li>
        <li>Monitor cabin altitude and rate of change</li>
      </ol>
    `,
    objectives: [
      "Understand air conditioning system components",
      "Explain pressurization system operation",
      "Identify key system controls and indicators",
      "Know emergency procedures for system failures"
    ],
    prerequisites: [
      "Basic aircraft systems knowledge",
      "Understanding of pneumatic systems"
    ]
  };
};

const getFlashcards = async (lessonId: string): Promise<FlashCard[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return [
    {
      id: '1',
      term: 'PACK (Pneumatic Air Cycle Kit)',
      definition: 'Air conditioning unit that cools and conditions bleed air from the engines or APU for cabin use.'
    },
    {
      id: '2',
      term: 'Cabin Pressure Controller (CPC)',
      definition: 'Automatic system that maintains cabin pressure by controlling outflow valves.'
    },
    {
      id: '3',
      term: 'Outflow Valve',
      definition: 'Valve that controls the rate of air leaving the cabin to maintain proper pressurization.'
    },
    {
      id: '4',
      term: 'Bleed Air',
      definition: 'Hot, high-pressure air taken from the engine compressor stages, used for cabin air conditioning and pressurization.'
    },
    {
      id: '5',
      term: 'Mixing Manifold',
      definition: 'Component that combines conditioned air from PACKs with recirculated cabin air.'
    }
  ];
};

export const useLessonData = (lessonId: string | undefined) => {
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [flashcards, setFlashcards] = useState<FlashCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lessonId) {
      setError('Lesson ID is required');
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [lesson, cards] = await Promise.all([
          getLessonData(lessonId),
          getFlashcards(lessonId)
        ]);
        
        setLessonData(lesson);
        setFlashcards(cards);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load lesson data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [lessonId]);

  return {
    lessonData,
    flashcards,
    isLoading,
    error
  };
};