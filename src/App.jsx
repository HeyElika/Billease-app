import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/ui/Sidebar'
import TOC from './components/ui/TOC'
import Explorer from './pages/Explorer'
import Tokens from './pages/Tokens'
import { TocProvider, useToc } from './context/TocContext'

function Layout() {
  const { scrollRef } = useToc()

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--canvas-default)' }}>
      <Sidebar />
      <main
        ref={scrollRef}
        style={{ flex: 1, overflowY: 'auto', backgroundColor: 'var(--canvas-default)', minWidth: 0 }}
      >
        <Routes>
          <Route path="/explorer" element={<Navigate to="/explorer/16_182" replace />} />
          <Route path="/explorer/:nodeId" element={<Explorer />} />
          <Route path="/tokens" element={<Tokens />} />
          <Route path="*" element={<Navigate to="/explorer/16_182" replace />} />
        </Routes>
      </main>
      <TOC />
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
