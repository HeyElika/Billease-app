import { NavLink, useLocation } from 'react-router-dom'
import billy from '../../assets/billy.png'

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

      {/* Logo — billy, Billease Library node 13040:3607 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 40, flexShrink: 0 }}>
        <div style={{
          position: 'relative',
          width: 28,
          height: 28,
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          {/* Crop values from the node: the frame trims the asset's padding. */}
          <img
            src={billy}
            alt=""
            style={{
              position: 'absolute',
              width: '127.05%',
              height: '117.97%',
              left: '-9.93%',
              top: '-11.29%',
              maxWidth: 'none',
              objectFit: 'contain',
            }}
          />
        </div>
        <div style={{ fontFamily: 'var(--font-family)', fontSize: 13, fontWeight: 700, color: 'var(--text-base)', lineHeight: 1.2 }}>
          Billease DS
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
