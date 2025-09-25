import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/useConvexAuth";
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe';
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ExamMode from "./pages/ExamMode";
import Exams from "./pages/Exams";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import TypeRating from "./pages/TypeRating";
import B737TypeRating from "./pages/B737TypeRating";
import LessonDetail from "./pages/LessonDetail";
import Flashcards from "./pages/Flashcards";
import QuizDemo from "./pages/QuizDemo";
import AdvancedAnalytics from "./pages/AdvancedAnalytics";
import AdminPanel from "./pages/AdminPanel";
import SubscriptionManagement from "./pages/SubscriptionManagement";
import ConvexTest from "./pages/ConvexTest";
import IntegrationTest from "./pages/IntegrationTest";
import { ConvexTestPage } from "./pages/ConvexTestPage";
import { ComprehensiveConvexTest } from "./pages/ComprehensiveConvexTest";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { useLanguage } from "./contexts/LanguageContext";

// Initialize Convex client with better error handling
let convex: ConvexReactClient;
const convexUrl = import.meta.env.VITE_CONVEX_URL;

console.log("Initializing Convex client with URL:", convexUrl);

try {
  if (!convexUrl) {
    throw new Error("VITE_CONVEX_URL environment variable is not set");
  }
  
  if (convexUrl === "https://your-convex-url.convex.cloud" || 
      convexUrl === "https://your-actual-convex-url.convex.cloud") {
    throw new Error("VITE_CONVEX_URL is still set to placeholder value");
  }
  
  convex = new ConvexReactClient(convexUrl);
  console.log("✅ Convex client initialized successfully");
} catch (error) {
  console.error("❌ Failed to initialize Convex client:", error);
  console.warn("⚠️ Using fallback mode - some features may not work properly");
  
  // Create a mock client for fallback
  convex = {
    // Mock implementation for fallback
  } as unknown as ConvexReactClient;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Initialize Stripe
const stripePromise = getStripe();

const App = () => {
  const { language } = useLanguage();
  return (
  <QueryClientProvider client={queryClient}>
    <ConvexProvider client={convex}>
      <AuthProvider>
        <Elements stripe={stripePromise}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <a href="#main" className="skip-link">Saltar al contenido</a>
            <BrowserRouter key={language} future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}>
              <main id="main" role="main">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/exam" element={
                  <ProtectedRoute>
                    <ExamMode />
                  </ProtectedRoute>
                } />
                <Route path="/exams" element={
                  <ProtectedRoute>
                    <Exams />
                  </ProtectedRoute>
                } />
                <Route path="/type-rating" element={
                  <ProtectedRoute>
                    <TypeRating />
                  </ProtectedRoute>
                } />
                <Route path="/b737-type-rating" element={
                  <ProtectedRoute>
                    <B737TypeRating />
                  </ProtectedRoute>
                } />
                <Route path="/lesson/:lessonId" element={
                  <ProtectedRoute>
                    <LessonDetail />
                  </ProtectedRoute>
                } />
                <Route path="/flashcards/:aircraft" element={
                  <ProtectedRoute>
                    <Flashcards />
                  </ProtectedRoute>
                } />
                <Route path="/progress" element={
                  <ProtectedRoute>
                    <Progress />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/quiz-demo" element={<QuizDemo />} />
                <Route path="/analytics" element={
                  <ProtectedRoute>
                    <AdvancedAnalytics />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                } />
                <Route path="/convex-test" element={<ConvexTest />} />
                <Route path="/convex-test-page" element={<ConvexTestPage />} />
                <Route path="/comprehensive-convex-test" element={<ComprehensiveConvexTest />} />
                <Route path="/subscription-management" element={<SubscriptionManagement />} />
                <Route path="/integration-test" element={<IntegrationTest />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              </main>
            </BrowserRouter>
          </TooltipProvider>
        </Elements>
      </AuthProvider>
    </ConvexProvider>
  </QueryClientProvider>
);
};

export default App;
