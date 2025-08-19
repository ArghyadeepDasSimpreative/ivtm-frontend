import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import PublicRoute from './routes';

import HomePage from './pages/home';
import SignUp from './pages/auth/SignUp';
import Signin from './pages/auth/SignIn';
import RoadmapAnalysis from './pages/roadmap-analysis';
import Questionairre from './pages/questionairre/nist';
import NistAnalysisPreview from './pages/analysis-preview/nist';
import TargetMaturityPageNist from './pages/target-maturity/nist';
import TargetComparissonNist from './pages/target-comparison/nist';
import HipaaQuestionsPage from './pages/questionairre/hipaa';
import HipaaAnalysisPreview from './pages/analysis-preview/hipaa';
import TargetMaturityPageHipaa from './pages/target-maturity/hipaa';
import TargetComparisonHipaa from './pages/target-comparison/hipaa';
import VulnerabilityDashboard from './pages/dashboard';
import ProfilePage from './pages/profile';
import EvaluationsPage from './pages/evaluations';
import NotFoundPage from './pages/not-found';
import QuestionsFlow from './pages/home/QuestionsFlow';
import ForgotPassword from './pages/auth/ForgotPassword';
import { scrollToTop } from './lib/scroll';

import VulnerabilityManagementLayout from './layout/VulnerabilityManagementLayout';
import RoadmapAnalysisLayout from './layout/RoadmapAnalysisLayout';
import C2m2Questionnaire from './pages/questionairre/c2m2';
import C2m2AnalysisPreview from './pages/analysis-preview/c2m2';
import TargetMaturityPageC2m2 from './pages/target-maturity/c2m2';
import TargetComparisonC2m2 from './pages/target-comparison/c2m2';

function AppRoutes() {
  const location = useLocation();

  useEffect(() => {
    scrollToTop();
  }, [location.pathname]);

  return (
    <>
      <Toaster
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#fff',
          },
        }}
      />

      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <HomePage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <Signin />
            </PublicRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/roadmap-analysis" element={<RoadmapAnalysisLayout />}>
          <Route index element={<RoadmapAnalysis />} />
          <Route path="evaluations" element={<EvaluationsPage />} />
          <Route path="questionnaire/nist" element={<Questionairre />} />
          <Route path="questionnaire/hipaa" element={<HipaaQuestionsPage />} />
          <Route path="questionnaire/c2m2" element={<C2m2Questionnaire />} />
          <Route path="analysis-preview/nist" element={<NistAnalysisPreview />} />
          <Route path="analysis-preview/hipaa" element={<HipaaAnalysisPreview />} />
          <Route path="analysis-preview/c2m2" element={<C2m2AnalysisPreview />} />
          <Route path="target-maturity/nist" element={<TargetMaturityPageNist />} />
          <Route path="target-maturity/hipaa" element={<TargetMaturityPageHipaa />} />
          <Route path="target-maturity/c2m2" element={<TargetMaturityPageC2m2 />} />
          <Route path="target-comparison/nist" element={<TargetComparissonNist />} />
          <Route path="target-comparison/hipaa" element={<TargetComparisonHipaa />} />
          <Route path="target-comparison/c2m2" element={<TargetComparisonC2m2 />} />
        </Route>

        <Route path="/initial-questions" element={<QuestionsFlow />} />

        <Route path="/vulnerability-management" element={<VulnerabilityManagementLayout />}>
          <Route index element={<VulnerabilityDashboard />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default AppRoutes;
