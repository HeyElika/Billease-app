import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/ui/Sidebar'
import TOC from './components/ui/TOC'
import Explorer from './pages/Explorer'
import Tokens from './pages/Tokens'
import Iconography from './pages/Iconography'
import { TocProvider } from './context/TocContext'

function Layout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', minHeight: '100vh' }}>
      <Sidebar />
      {/* Page wrapper: offset for fixed sidebar */}
      <div style={{
        marginLeft: 220,
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        minHeight: '100vh',
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
            <Route path="/icons" element={<Iconography />} />
            <Route path="*" element={<Navigate to="/explorer/16_182" replace />} />
          </Routes>
        </main>
        <TOC />
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
