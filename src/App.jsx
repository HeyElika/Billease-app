import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/ui/Sidebar'
import Header, { HEADER_HEIGHT } from './components/ui/Header'
import TOC from './components/ui/TOC'
import Explorer from './pages/Explorer'
import Tokens from './pages/Tokens'
import Iconography from './pages/Iconography'
import Motion from './pages/Motion'
import Patterns from './pages/Patterns'
import Typography from './pages/Typography'
import Illustrations from './pages/Illustrations'
import Grid from './pages/Grid'
import PrototypesPage from './pages/PrototypesPage'
import { TocProvider } from './context/TocContext'

function Layout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Header />

      {/* Content area pushed below the fixed header */}
      <div style={{
        marginTop: HEADER_HEIGHT,
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
        backgroundColor: '#ffffff',
      }}>
        <Sidebar />

        {/* Page wrapper: offset for fixed sidebar */}
        <div style={{
          marginLeft: 220,
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          minHeight: '100%',
          backgroundColor: '#ffffff',
        }}>
          <main style={{
            flex: 1,
            minWidth: 0,
            padding: '48px 64px',
            backgroundColor: '#ffffff',
          }}>
            <Routes>
              <Route path="/explorer" element={<Navigate to="/explorer/16_182" replace />} />
              <Route path="/explorer/:nodeId" element={<Explorer />} />
              <Route path="/tokens" element={<Tokens />} />
              <Route path="/typography" element={<Typography />} />
              <Route path="/icons" element={<Iconography />} />
              <Route path="/illustrations" element={<Illustrations />} />
              <Route path="/grid" element={<Grid />} />
              <Route path="/motion" element={<Motion />} />
              <Route path="/patterns" element={<Patterns />} />
              <Route path="/prototypes" element={<Navigate to="/prototypes/email-verification/too-many-otp-attempts" replace />} />
              <Route path="/prototypes/:flowId/:scenarioId" element={<PrototypesPage />} />
              <Route path="*" element={<Navigate to="/explorer/16_182" replace />} />
            </Routes>
          </main>
          <TOC />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <TocProvider>
        <Layout />
      </TocProvider>
    </BrowserRouter>
  )
}
