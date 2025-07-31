import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast' // ✅ import toaster

import HomePage from './pages/home'
import SignUp from './pages/auth/SignUp'
import RoadmapAnalysis from './pages/roadmap-analysis'
import Questionairre from './pages/questionairre/nist'
import NistAnalysisPreview from './pages/analysis-preview/nist'
import TargetMaturityPageNist from './pages/target-maturity/nist'
import TargetComparissonNist from './pages/target-comparison/nist'
import HipaaQuestionsPage from './pages/questionairre/hipaa'
import HipaaAnalysisPreview from './pages/analysis-preview/hipaa'
import TargetMaturityPageHipaa from './pages/target-maturity/hipaa'
import TargetComparisonHipaa from './pages/target-comparison/hipaa'
import Signin from './pages/auth/SignIn'
import VulnerabilityManagementLayout from './layout/VulnerabilityManagementLayout'
import VulnerabilityDashboard from './pages/dashboard'

function App() {
  return (
    <>
      <Toaster
        position="top-middle" // ✅ optional: change position
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937', // Tailwind slate-800
            color: '#fff',
          },
        }}
      />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/roadmap-analysis" element={<RoadmapAnalysis />} />
        <Route path="/questionnaire/nist" element={<Questionairre />} />
        <Route path="/questionnaire/hipaa" element={<HipaaQuestionsPage />} />
        <Route path="/analysis-preview/nist" element={<NistAnalysisPreview />} />
        <Route path="/analysis-preview/hipaa" element={<HipaaAnalysisPreview />} />
        <Route path="/target-maturity/nist" element={<TargetMaturityPageNist />} />
        <Route path="/target-maturity/hipaa" element={<TargetMaturityPageHipaa />} />
        <Route path="/target-comparison/nist" element={<TargetComparissonNist />} />
        <Route path="/target-comparison/hipaa" element={<TargetComparisonHipaa />} />
        <Route path="/vulnerability-management" element={<VulnerabilityManagementLayout />}>
          <Route index element={<VulnerabilityDashboard />} />
          {/* Add more routes for vulnerability management here */}
        </Route>
      </Routes>
    </>
  )
}

export default App
