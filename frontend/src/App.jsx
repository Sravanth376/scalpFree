import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home       from './pages/Home.jsx'
import Scan       from './pages/Scan.jsx'
import Results    from './pages/Results.jsx'
import ActionPlan from './pages/ActionPlan.jsx'
import Learn      from './pages/Learn.jsx'
import Settings   from './pages/Settings.jsx'

export default function App() {
  const [result, setResult] = useState(null)

  return (
    <Routes>
      <Route path="/"            element={<Home />} />
      <Route path="/scan"        element={<Scan setResult={setResult} />} />
      <Route path="/results"     element={result ? <Results result={result} /> : <Navigate to="/scan" replace />} />
      <Route path="/action-plan" element={result ? <ActionPlan result={result} /> : <Navigate to="/scan" replace />} />
      <Route path="/learn"       element={<Learn />} />
      <Route path="/settings"    element={<Settings />} />
      <Route path="*"            element={<Navigate to="/" replace />} />
    </Routes>
  )
}
