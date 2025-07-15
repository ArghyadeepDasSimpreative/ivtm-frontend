import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/home'
import SignUp from './pages/auth/SignUp'
import RoadmapAnalysis from './pages/roadmap-analysis'
import Questionairre from './pages/questionairre'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path="/roadmap-analysis" element={<RoadmapAnalysis />} />
      <Route path="/questionnaire/:type" element={<Questionairre />} />
    </Routes>
  )
}

export default App
