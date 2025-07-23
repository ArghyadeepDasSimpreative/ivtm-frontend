import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast' // ✅ import toaster

import HomePage from './pages/home'
import SignUp from './pages/auth/SignUp'
import RoadmapAnalysis from './pages/roadmap-analysis'
import Questionairre from './pages/questionairre/nist'
import AnalysisPreview from './pages/analysis-preview'
import TargetMaturityPage from './pages/target-maturity'
import TargetComparissonPage from './pages/target-comparison'
import HipaaQuestionsPage from './pages/questionairre/hipaa'

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
        <Route path="/roadmap-analysis" element={<RoadmapAnalysis />} />
        <Route path="/questionnaire/:type" element={<Questionairre />} />
        <Route path="/hipaa-questionnaire" element={<HipaaQuestionsPage />} />
        <Route path="/analysis-preview" element={<AnalysisPreview />} />
        <Route path="/target-maturity" element={<TargetMaturityPage />} />
        <Route path="/target-comparison" element={<TargetComparissonPage />} />
      </Routes>
    </>
  )
}

export default App
