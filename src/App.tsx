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
import Pricing from "./pages/Pricing";
import ExamMode from "./pages/ExamMode";
import Exams from "./pages/Exams";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import TypeRating from "./pages/TypeRating";
import B737TypeRating from "./pages/B737TypeRating";
import LessonDetail from "./pages/LessonDetail";
import Flashcards from "./pages/Flashcards";
import QuizDemo from "./pages/QuizDemo";
import AdvancedAnalytics from "./pages/AdvancedAnalytics";
import AdminPanel from "./pages/AdminPanel";
import AdminSetup from "./pages/AdminSetup";
import SubscriptionManagement from "./pages/SubscriptionManagement";
import IntegrationTest from "./pages/IntegrationTest";
import NotFound from "./pages/NotFound";

// Initialize Convex client with fallback
let convex: ConvexReactClient;
try {
  convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL || "");
} catch (error) {
  console.warn("Failed to initialize Convex client, using fallback");
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ConvexProvider client={convex}>
      <AuthProvider>
        <Elements stripe={stripePromise}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/pricing" element={<Pricing />} />
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
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
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
                <Route path="/admin-setup" element={<AdminSetup />} />
                <Route path="/subscription-management" element={
                  <ProtectedRoute>
                    <SubscriptionManagement />
                  </ProtectedRoute>
                } />
                <Route path="/integration-test" element={<IntegrationTest />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </Elements>
      </AuthProvider>
    </ConvexProvider>
  </QueryClientProvider>
);

export default App;              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </Elements>
      </AuthProvider>
    </ConvexProvider>
  </QueryClientProvider>
);

export default App;