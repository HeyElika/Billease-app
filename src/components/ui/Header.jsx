import { NavLink, useLocation } from 'react-router-dom'

export const HEADER_HEIGHT = 52

const NAV_ITEMS = [
  { label: 'Foundation',  matches: ['/tokens', '/typography', '/icons', '/illustrations', '/grid'] },
  { label: 'Components',  matches: ['/explorer']           },
  { label: 'Motion',      matches: ['/motion']             },
  { label: 'Patterns',    matches: ['/patterns']           },
  { label: 'Prototypes',  matches: ['/prototypes']         },
]

export default function Header() {
  const { pathname } = useLocation()

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: HEADER_HEIGHT,
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: 24,
      paddingRight: 32,
      zIndex: 200,
      boxSizing: 'border-box',
    }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 40, flexShrink: 0 }}>
        <div style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          backgroundColor: 'var(--bg-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-family)' }}>B</span>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-family)', fontSize: 13, fontWeight: 700, color: 'var(--text-base)', lineHeight: 1.2 }}>
            Billease DS
          </div>
          <div style={{ fontFamily: 'var(--font-family)', fontSize: 10, color: 'var(--text-subtle)', lineHeight: 1 }}>
            Native App Library
          </div>
        </div>
      </div>

      {/* Navigation tabs — pushed to the right */}
      <nav style={{ display: 'flex', alignItems: 'stretch', height: '100%', marginLeft: 'auto' }}>
        {NAV_ITEMS.map(({ label, matches }) => {
          const active = matches.some(m => pathname === m || pathname.startsWith(m + '/'))
          const to = matches[0] === '/explorer'
            ? '/explorer/16_182'
            : matches[0] === '/prototypes'
              ? '/prototypes/email-verification/too-many-otp-attempts'
              : matches[0]
          return (
            <NavLink
              key={label}
              to={to}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                textDecoration: 'none',
                fontFamily: 'var(--font-family)',
                fontSize: 14,
                fontWeight: active ? 600 : 400,
                color: active ? 'var(--text-base)' : 'var(--text-subtle)',
                borderBottom: active ? '2px solid var(--bg-primary)' : '2px solid transparent',
                marginBottom: -1,
                transition: 'color 0.12s',
                whiteSpace: 'nowrap',
                boxSizing: 'border-box',
              }}
              onMouseEnter={e => {
                if (!active) e.currentTarget.style.color = 'var(--text-base)'
              }}
              onMouseLeave={e => {
                if (!active) e.currentTarget.style.color = 'var(--text-subtle)'
              }}
            >
              {label}
            </NavLink>
          )
        })}
      </nav>
    </header>
  )
}
