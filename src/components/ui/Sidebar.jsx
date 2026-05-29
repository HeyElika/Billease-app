import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/explorer', label: 'Component Explorer', icon: '◻' },
  { to: '/tokens', label: 'Design Tokens', icon: '◈' },
]

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 220,
        minHeight: '100vh',
        backgroundColor: 'var(--bg-base)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          padding: '24px 20px 20px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>B</span>
          </div>
          <div>
            <div
              style={{
                fontSize: 'var(--text-md)',
                fontWeight: 700,
                color: 'var(--text-base)',
                fontFamily: 'var(--font-family)',
                lineHeight: 1.2,
              }}
            >
              Billease DS
            </div>
            <div
              style={{
                fontSize: 'var(--text-xxs)',
                color: 'var(--text-subtle)',
                fontFamily: 'var(--font-family)',
              }}
            >
              Design Portal
            </div>
          </div>
        </div>
      </div>

      <nav style={{ padding: '12px 8px', flex: 1 }}>
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              marginBottom: 2,
              textDecoration: 'none',
              fontSize: 'var(--text-md)',
              fontFamily: 'var(--font-family)',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--text-primary)' : 'var(--text-subtle)',
              backgroundColor: isActive ? 'var(--bg-error-subtle)' : 'transparent',
              transition: 'background-color 0.15s, color 0.15s',
            })}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: 'var(--text-xxs)',
          color: 'var(--text-disabled)',
          fontFamily: 'var(--font-family)',
        }}
      >
        138 components · 857 variants
      </div>
    </aside>
  )
}
