import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/ui/Sidebar'
import Explorer from './pages/Explorer'
import Tokens from './pages/Tokens'

function Layout() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--canvas-default)' }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto', backgroundColor: 'var(--canvas-default)' }}>
        <Routes>
          <Route path="/explorer" element={<Navigate to="/explorer/16_182" replace />} />
          <Route path="/explorer/:nodeId" element={<Explorer />} />
          <Route path="/tokens" element={<Tokens />} />
          <Route path="*" element={<Navigate to="/explorer/16_182" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
