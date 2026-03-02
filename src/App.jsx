import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { DashboardPage } from './pages/DashboardPage'
import { ApplicationPage } from './pages/ApplicationPage'
import { StageManagerPage } from './pages/StageManagerPage'
import { CandidateProfilePage } from './pages/CandidateProfilePage'
import { ScorecardPage } from './pages/ScorecardPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public: application form (no sidebar) */}
        <Route path="/apply" element={<ApplicationPage />} />

        {/* Recruiter-facing: all wrapped in Layout with sidebar */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <DashboardPage />
            </Layout>
          }
        />
        <Route
          path="/stages"
          element={
            <Layout>
              <StageManagerPage />
            </Layout>
          }
        />
        <Route
          path="/candidates/:id"
          element={
            <Layout>
              <CandidateProfilePage />
            </Layout>
          }
        />
        <Route
          path="/candidates/:candidateId/scorecard"
          element={
            <Layout>
              <ScorecardPage />
            </Layout>
          }
        />

        {/* Default */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
