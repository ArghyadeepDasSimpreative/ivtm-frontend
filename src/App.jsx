import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import PublicRoute from './routes'

import HomePage from './pages/home'
import SignUp from './pages/auth/SignUp'
import Signin from './pages/auth/SignIn'
import RoadmapAnalysis from './pages/roadmap-analysis'
import Questionairre from './pages/questionairre/nist'
import NistAnalysisPreview from './pages/analysis-preview/nist'
import TargetMaturityPageNist from './pages/target-maturity/nist'
import TargetComparissonNist from './pages/target-comparison/nist'
import HipaaQuestionsPage from './pages/questionairre/hipaa'
import HipaaAnalysisPreview from './pages/analysis-preview/hipaa'
import TargetMaturityPageHipaa from './pages/target-maturity/hipaa'
import TargetComparisonHipaa from './pages/target-comparison/hipaa'
import VulnerabilityManagementLayout from './layout/VulnerabilityManagementLayout'
import VulnerabilityDashboard from './pages/dashboard'
import ProfilePage from './pages/profile'
import EvaluationsPage from './pages/evaluations'
import NotFoundPage from './pages/not-found'
import QuestionsFlow from './pages/home/QuestionsFlow'

function App() {
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

        <Route path="/roadmap-analysis" element={<RoadmapAnalysis />} />
        <Route path="/evaluations" element={<EvaluationsPage />} />
        <Route path="/questionnaire/nist" element={<Questionairre />} />
        <Route path="/questionnaire/hipaa" element={<HipaaQuestionsPage />} />
        <Route path="/analysis-preview/nist" element={<NistAnalysisPreview />} />
        <Route path="/analysis-preview/hipaa" element={<HipaaAnalysisPreview />} />
        <Route path="/target-maturity/nist" element={<TargetMaturityPageNist />} />
        <Route path="/target-maturity/hipaa" element={<TargetMaturityPageHipaa />} />
        <Route path="/target-comparison/nist" element={<TargetComparissonNist />} />
        <Route path="/target-comparison/hipaa" element={<TargetComparisonHipaa />} />
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

export default App;
