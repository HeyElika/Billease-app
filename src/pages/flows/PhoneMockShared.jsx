// Shared phone mockup components — Google Pixel 9 Pro (Obsidian)
// ALL prototype flows must import from here. Never duplicate or re-implement.

export const CW = 390
export const CH = 820
export const P9_BORDER  = 10
export const P9_OUTER_R = 40
export const P9_INNER_R = 30
export const TOOLBAR_H  = 44
export const FRAME_W    = CW + P9_BORDER * 2
export const FRAME_H    = CH + P9_BORDER * 2

// ── Status bar ────────────────────────────────────────────────────────────────
export function StatusBar() {
  return (
    <div style={{
      height: 42, backgroundColor: '#fff', flexShrink: 0,
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: 20, paddingRight: 16,
    }}>
      <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-family)', color: '#1D2D40' }}>
        5:13
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="#1D2D40">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
        </svg>
        <svg width="9" height="13" viewBox="0 0 14 20" fill="#1D2D40">
          <path d="M7 0L1 6l4 4-4 4 6 6v-7l3 3 1-1-4-4 4-4-1-1-3 3V0z"/>
        </svg>
        <svg width="15" height="12" viewBox="0 0 24 20" fill="#1D2D40">
          <path d="M12 14.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
          <path d="M12 10c2.2 0 4.2.9 5.6 2.3l1.7-1.7C17.5 9 14.9 7.5 12 7.5s-5.5 1.5-7.3 3.1l1.7 1.7C7.8 10.9 9.8 10 12 10z"/>
          <path d="M12 5.5c3.3 0 6.3 1.3 8.4 3.5l1.7-1.7C19.6 4.8 16 3 12 3S4.4 4.8 1.9 7.3l1.7 1.7C5.7 6.8 8.7 5.5 12 5.5z"/>
        </svg>
        <svg width="16" height="12" viewBox="0 0 24 18" fill="#1D2D40">
          <rect x="0" y="13" width="4" height="5"/>
          <rect x="6" y="9" width="4" height="9"/>
          <rect x="12" y="5" width="4" height="13"/>
          <rect x="18" y="1" width="4" height="17"/>
        </svg>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: 20, height: 10, border: '1.5px solid #1D2D40', borderRadius: 2,
            padding: 1, display: 'flex', alignItems: 'center',
          }}>
            <div style={{ width: '78%', height: '100%', backgroundColor: '#1D2D40', borderRadius: 1 }} />
          </div>
          <div style={{ width: 2, height: 5, backgroundColor: '#1D2D40', marginLeft: -0.5 }} />
        </div>
      </div>
    </div>
  )
}

// ── Android nav bar ───────────────────────────────────────────────────────────
export function AndroidNavBar() {
  return (
    <div style={{
      height: 44, backgroundColor: '#000', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'space-evenly',
    }}>
      <span style={{ color: '#fff', fontSize: 14 }}>◄</span>
      <span style={{ color: '#fff', fontSize: 18 }}>⬤</span>
      <span style={{ color: '#fff', fontSize: 12 }}>■</span>
    </div>
  )
}

// ── Android numeric keyboard (phone-dialer, 3 cols × 4 rows) ─────────────────
const KEYPAD_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['__back', '0', '__done'],
]
const SUB = { '2':'ABC','3':'DEF','4':'GHI','5':'JKL','6':'MNO','7':'PQRS','8':'TUV','9':'WXYZ','0':'+' }
const KEY_H = 56

export function AndroidKeyboard({ onDigit, onBackspace }) {
  function Key({ k }) {
    if (k === '__back') {
      return (
        <button onClick={onBackspace} style={{
          flex: 1, height: KEY_H, background: '#D1D3DA', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="24" height="18" viewBox="0 0 28 20" fill="none">
            <path d="M10.5 2L2 10l8.5 8H26V2H10.5z" stroke="#1D2D40" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M15 7l6 6M21 7l-6 6" stroke="#1D2D40" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      )
    }
    if (k === '__done') {
      return (
        <button style={{
          flex: 1, height: KEY_H, background: '#D1D3DA', border: 'none', cursor: 'default',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="16" viewBox="0 0 22 18" fill="none">
            <path d="M2 9l6 7L20 2" stroke="#1D2D40" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )
    }
    return (
      <button onClick={() => onDigit(k)} style={{
        flex: 1, height: KEY_H, background: '#FAFAFA', border: 'none', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1,
      }}>
        <span style={{ fontSize: 28, fontWeight: 300, color: '#1D2D40', lineHeight: '32px', fontFamily: 'var(--font-family)' }}>{k}</span>
        {SUB[k] && <span style={{ fontSize: 9, color: '#606C79', letterSpacing: '1.8px', fontFamily: 'var(--font-family)' }}>{SUB[k]}</span>}
      </button>
    )
  }

  return (
    <div style={{ flexShrink: 0 }}>
      <div style={{ backgroundColor: '#C8CAD0', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {KEYPAD_ROWS.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', gap: 1 }}>
            {row.map(k => <Key key={k} k={k} />)}
          </div>
        ))}
      </div>
      <AndroidNavBar />
    </div>
  )
}

// ── Phone mockup — Google Pixel 9 Pro (Obsidian) ─────────────────────────────
export function PhoneMock({ children, scale }) {
  const frameW = FRAME_W
  const frameH = FRAME_H

  return (
    <div style={{ width: frameW * scale, height: frameH * scale, flexShrink: 0, position: 'relative' }}>
      {/* Right side buttons: power + volume up + volume down */}
      <div style={{ position: 'absolute', right: -3 * scale, top: (P9_BORDER + 160) * scale, zIndex: 20 }}>
        <div style={{ width: 3 * scale, height: 68 * scale, backgroundColor: '#303030', borderRadius: `0 ${2 * scale}px ${2 * scale}px 0`, marginBottom: 14 * scale }} />
        <div style={{ width: 3 * scale, height: 54 * scale, backgroundColor: '#303030', borderRadius: `0 ${2 * scale}px ${2 * scale}px 0`, marginBottom: 6 * scale }} />
        <div style={{ width: 3 * scale, height: 54 * scale, backgroundColor: '#303030', borderRadius: `0 ${2 * scale}px ${2 * scale}px 0` }} />
      </div>

      <div style={{
        width: frameW, height: frameH,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        borderRadius: P9_OUTER_R,
        backgroundColor: '#1A1A1A',
        boxShadow: '0 0 0 1px #2a2a2a',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Punch-hole camera — centered, 13px from top of bezel */}
        <div style={{
          position: 'absolute',
          top: P9_BORDER + 13,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 10, height: 10, borderRadius: '50%',
          backgroundColor: '#0a0a0a', zIndex: 10,
        }} />
        {/* Screen */}
        <div style={{
          position: 'absolute', top: P9_BORDER, left: P9_BORDER,
          width: CW, height: CH,
          overflow: 'hidden', backgroundColor: '#fff',
          borderRadius: P9_INNER_R,
          display: 'flex', flexDirection: 'column',
        }}>
          {children}
        </div>
      </div>
    </div>
  )
}
