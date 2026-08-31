import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AssessmentPage from './pages/AssessmentPage';
import LearningRoadmapPage from './pages/LearningRoadmapPage';
import TopicDetailPage from './pages/TopicDetailPage';
import ProjectRecommendationsPage from './pages/ProjectRecommendationsPage';
import AIChatAssistantPage from './pages/AIChatAssistantPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SettingsPage from './pages/SettingsPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route path="/onboarding" element={
        <ProtectedRoute>
          <OnboardingPage />
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />

      <Route path="/assessment" element={
        <ProtectedRoute>
          <AssessmentPage />
        </ProtectedRoute>
      } />

      <Route path="/path" element={
        <ProtectedRoute>
          <LearningRoadmapPage />
        </ProtectedRoute>
      } />

      <Route path="/path/module/:topicId" element={
        <ProtectedRoute>
          <TopicDetailPage />
        </ProtectedRoute>
      } />

      <Route path="/path/topic/:topicId" element={
        <ProtectedRoute>
          <TopicDetailPage />
        </ProtectedRoute>
      } />

      <Route path="/roadmap/topic/:topicId" element={
        <ProtectedRoute>
          <TopicDetailPage />
        </ProtectedRoute>
      } />

      <Route path="/roadmap/module/:topicId" element={
        <ProtectedRoute>
          <TopicDetailPage />
        </ProtectedRoute>
      } />

      <Route path="/roadmap" element={<Navigate to="/path" replace />} />

      <Route path="/projects" element={
        <ProtectedRoute>
          <ProjectRecommendationsPage />
        </ProtectedRoute>
      } />

      <Route path="/chat" element={
        <ProtectedRoute>
          <AIChatAssistantPage />
        </ProtectedRoute>
      } />

      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminDashboardPage />
        </ProtectedRoute>
      } />

      <Route path="/settings" element={
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
