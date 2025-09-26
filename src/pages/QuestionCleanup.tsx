import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Search,
  Trash2,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Loader2,
  FileText,
  Database,
  Settings
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DuplicateQuestionService, type DuplicateAnalysis } from '@/services/DuplicateQuestionService';
import { useAuth } from '@/hooks/useConvexAuth';
import { useNavigate } from 'react-router-dom';
import type { RealAviationQuestion } from '@/data/realAviationQuestions';

const QuestionCleanup = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [analysis, setAnalysis] = useState<DuplicateAnalysis | null>(null);
  const [cleanedQuestions, setCleanedQuestions] = useState<RealAviationQuestion[]>([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');

  // Check admin access
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
  }, [user, navigate]);

  const handleAnalyzeQuestions = async () => {
    setIsAnalyzing(true);
    setError('');
    setProgressPercent(0);
    setStatusMessage(t('duplicates.analyzingQuestions') || 'Analyzing questions...');

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgressPercent(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await DuplicateQuestionService.cleanAllQuestionSources();
      
      clearInterval(progressInterval);
      setProgressPercent(100);
      
      // Create analysis from the result
      const analysisResult: DuplicateAnalysis = {
        totalQuestions: result.cleanedQuestions.length + result.totalCleaned,
        duplicateGroups: [], // We'll populate this if needed
        duplicateCount: result.totalCleaned,
        uniqueQuestions: result.cleanedQuestions.length,
        duplicatesRemoved: result.totalCleaned,
      };
      
      setAnalysis(analysisResult);
      setCleanedQuestions(result.cleanedQuestions);
      setStatusMessage(t('duplicates.analysisComplete') || 'Analysis complete!');
      
      console.log(result.report);
      
    } catch (error) {
      console.error('Error analyzing questions:', error);
      setError(t('errors.questionCleaningFailed') || 'Failed to analyze questions');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadCleanQuestions = () => {
    if (cleanedQuestions.length === 0) return;

    const dataStr = JSON.stringify(cleanedQuestions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clean-questions-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadReport = () => {
    if (!analysis) return;

    const report = DuplicateQuestionService.generateDuplicateReport(analysis);
    const dataBlob = new Blob([report], { type: 'text/plain' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `duplicate-analysis-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Database className="w-8 h-8" />
              {t('duplicates.analysisTitle')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('duplicates.description') || 'Analyze and clean duplicate questions from the question bank'}
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin')}
          >
            {t('common.back')}
          </Button>
        </div>

        {/* Analysis Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              {t('duplicates.analysisControls') || 'Analysis Controls'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleAnalyzeQuestions}
                disabled={isAnalyzing}
                className="flex-1"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('duplicates.analyzing') || 'Analyzing...'}
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    {t('duplicates.startAnalysis') || 'Start Analysis'}
                  </>
                )}
              </Button>
            </div>

            {/* Progress */}
            {isAnalyzing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{statusMessage}</span>
                  <span>{progressPercent}%</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
            )}

            {/* Error */}
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysis && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {t('duplicates.results') || 'Analysis Results'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {analysis.totalQuestions}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t('duplicates.totalQuestions')}
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {analysis.uniqueQuestions}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t('duplicates.uniqueQuestions')}
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {analysis.duplicateCount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t('duplicates.duplicatesFound')}
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {((analysis.duplicatesRemoved / analysis.totalQuestions) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t('duplicates.cleanupRate') || 'Cleanup Rate'}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Status */}
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium text-green-800">
                    {t('duplicates.cleanupSuccess')}
                  </div>
                  <div className="text-sm text-green-600">
                    {analysis.duplicateCount === 0 
                      ? t('duplicates.noDuplicatesFound')
                      : `${analysis.duplicatesRemoved} ${t('duplicates.duplicatesRemoved')}`
                    }
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleDownloadCleanQuestions}
                  disabled={cleanedQuestions.length === 0}
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t('duplicates.downloadClean') || 'Download Clean Questions'}
                </Button>
                <Button
                  onClick={handleDownloadReport}
                  variant="outline"
                  className="flex-1"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {t('duplicates.downloadReport') || 'Download Report'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              {t('duplicates.instructions') || 'Instructions'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <h4>{t('duplicates.howItWorks') || 'How it works:'}</h4>
              <ul>
                <li>{t('duplicates.step1') || 'Analyzes all question data files for duplicates'}</li>
                <li>{t('duplicates.step2') || 'Compares questions by normalized text (ignoring case, punctuation, variants)'}</li>
                <li>{t('duplicates.step3') || 'Keeps the best version of each duplicate (with complete explanation/reference)'}</li>
                <li>{t('duplicates.step4') || 'Generates a clean question set ready for use'}</li>
              </ul>
              
              <h4>{t('duplicates.afterCleanup') || 'After cleanup:'}</h4>
              <ul>
                <li>{t('duplicates.implementation1') || 'Download the clean questions JSON file'}</li>
                <li>{t('duplicates.implementation2') || 'Replace your question data files with the clean version'}</li>
                <li>{t('duplicates.implementation3') || 'Update your question loading services to use the new data'}</li>
                <li>{t('duplicates.implementation4') || 'Test the application to ensure all exams work correctly'}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuestionCleanup;