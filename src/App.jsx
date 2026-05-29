import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/ui/Sidebar'
import Header from './components/ui/Header'
import Explorer from './pages/Explorer'
import Tokens from './pages/Tokens'
import Prototype from './pages/Prototype'

function Layout() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header />
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            backgroundColor: 'var(--canvas-default)',
          }}
        >
          <Routes>
            <Route path="/explorer" element={<Explorer />} />
            <Route path="/tokens" element={<Tokens />} />
            <Route path="/prototype" element={<Prototype />} />
            <Route path="*" element={<Navigate to="/explorer" replace />} />
          </Routes>
        </main>
      </div>
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
