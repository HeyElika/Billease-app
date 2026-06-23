import { useState, useEffect, useRef } from 'react'
import OTPInput from '../../components/ds/OTPInput'
import InputField from '../../components/ds/InputField'
import Button from '../../components/ds/Button'
import Link from '../../components/ds/Link'
import NavHeader from '../../components/ds/NavHeader'
import BilleaseIcon from '../../assets/icons/BilleaseIcon'
import { ScreenBanner } from '../../components/ds/Toast'

// ── Constants ─────────────────────────────────────────────────────────────────
const SCALE      = 0.7
const CW         = 390
const CH         = 820
const P9_BORDER  = 10
const P9_OUTER_R = 40
const P9_INNER_R = 30
const TOOLBAR_H  = 44
const FRAME_H    = CH + P9_BORDER * 2
const FRAME_W    = CW + P9_BORDER * 2
const INSPECT_W  = 264
const MAX_RESENDS = 3
const BANNER_TTL  = 3000  // ms banner stays visible after resend

// ── Status bar ────────────────────────────────────────────────────────────────
function StatusBar() {
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
function AndroidNavBar() {
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

// ── Android numeric keyboard (phone-dialer style, 3 cols × 4 rows) ────────────
const KEYPAD_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['__back', '0', '__done'],
]
const SUB = { '2':'ABC','3':'DEF','4':'GHI','5':'JKL','6':'MNO','7':'PQRS','8':'TUV','9':'WXYZ','0':'+' }
const KEY_H = 56

function AndroidKeyboard({ onDigit, onBackspace }) {
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

// ── Android QWERTY keyboard (email entry) ─────────────────────────────────────
const QWERTY_ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['Z','X','C','V','B','N','M'],
]

function AndroidQWERTY({ onChar, onBackspace }) {
  const lk = { height: 42, background: '#FAFAFA', border: 'none', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flex: 1, padding: 0 }
  const sk = { ...lk, background: '#D1D3DA', flex: 'none', cursor: 'default' }
  const label = (t) => <span style={{ fontSize: 16, fontWeight: 400, color: '#1D2D40', fontFamily: 'var(--font-family)', userSelect: 'none' }}>{t}</span>

  return (
    <div style={{ flexShrink: 0 }}>
      <div style={{ backgroundColor: '#C8CAD0', display: 'flex', flexDirection: 'column', gap: 1, paddingTop: 1 }}>
        {/* Row 1: Q-P */}
        <div style={{ display: 'flex', gap: 1, padding: '0 2px' }}>
          {QWERTY_ROWS[0].map(k => (
            <button key={k} onClick={() => onChar(k.toLowerCase())} style={lk}>{label(k)}</button>
          ))}
        </div>
        {/* Row 2: A-L (inset) */}
        <div style={{ display: 'flex', gap: 1, padding: '0 18px' }}>
          {QWERTY_ROWS[1].map(k => (
            <button key={k} onClick={() => onChar(k.toLowerCase())} style={lk}>{label(k)}</button>
          ))}
        </div>
        {/* Row 3: shift + Z-M + backspace */}
        <div style={{ display: 'flex', gap: 1, padding: '0 2px' }}>
          <button style={{ ...sk, width: 40 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3.5L1.5 14H8v6.5h8V14h6.5L12 3.5z" fill="#1D2D40"/></svg>
          </button>
          {QWERTY_ROWS[2].map(k => (
            <button key={k} onClick={() => onChar(k.toLowerCase())} style={lk}>{label(k)}</button>
          ))}
          <button onClick={onBackspace} style={{ ...sk, width: 40, cursor: 'pointer' }}>
            <svg width="20" height="15" viewBox="0 0 28 20" fill="none">
              <path d="M10.5 2L2 10l8.5 8H26V2H10.5z" stroke="#1D2D40" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M15 7l6 6M21 7l-6 6" stroke="#1D2D40" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        {/* Row 4: ?123 | space | done */}
        <div style={{ display: 'flex', gap: 1, padding: '0 2px' }}>
          <button style={{ ...sk, width: 50 }}>
            <span style={{ fontSize: 13, color: '#1D2D40', fontWeight: 500, fontFamily: 'var(--font-family)', userSelect: 'none' }}>?123</span>
          </button>
          <button onClick={() => onChar(' ')} style={lk}>
            <span style={{ fontSize: 13, color: '#606C79', fontFamily: 'var(--font-family)', userSelect: 'none' }}>space</span>
          </button>
          <button style={{ ...sk, width: 50 }}>
            <svg width="20" height="16" viewBox="0 0 22 18" fill="none">
              <path d="M2 9l6 7L20 2" stroke="#1D2D40" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      <AndroidNavBar />
    </div>
  )
}

// ── Verify email screen ───────────────────────────────────────────────────────
function VerifyScreen({
  showBanner, resendCount, timer, values, focusedIndex,
  onDigit, onBackspace, onResend, onChangeEmail,
}) {
  const canResend  = timer === 0 && resendCount < MAX_RESENDS
  const maxReached = timer === 0 && resendCount >= MAX_RESENDS

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {showBanner && (
        <ScreenBanner type="success" message="Verification code has been sent" />
      )}
      <StatusBar />
      <NavHeader type="icon-left" title="Verify email" showBorder={false} showWatermark={false} />

      <div style={{ flex: 1, padding: '24px 20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, overflowY: 'hidden' }}>
        {/* Heading */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textAlign: 'center' }}>
          <span style={{ fontSize: 16, fontFamily: 'var(--ds-font-family)', color: 'var(--text-base)', lineHeight: 1.5 }}>
            Enter 6-digit code we sent to
          </span>
          <span style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--ds-font-family)', color: 'var(--text-base)', lineHeight: 1.5 }}>
            test@gmail.com
          </span>
        </div>

        {/* OTP + resend */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <OTPInput
            type="OTP-email"
            values={values}
            focusedIndex={focusedIndex}
          />
          <div style={{ textAlign: 'center', fontFamily: 'var(--ds-font-family)', lineHeight: 1.5 }}>
            {maxReached
              ? <span style={{ fontSize: 14, color: 'var(--text-subtle)' }}>Maximum resend attempts reached</span>
              : canResend
                ? <Link label="Resend code" size="sm" state="default" showIcon={false} onClick={onResend} />
                : <span style={{ fontSize: 16, color: 'var(--text-base)' }}>{`Resend code in ${timer}s`}</span>
            }
          </div>
        </div>

        {/* Change email */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 14, fontFamily: 'var(--ds-font-family)', color: 'var(--text-base)' }}>Wrong email?</span>
          <Link label="Change email" size="sm" state="default" showIcon={false} onClick={onChangeEmail} />
        </div>
      </div>

      <AndroidKeyboard onDigit={onDigit} onBackspace={onBackspace} />
    </div>
  )
}

// ── Change email screen ───────────────────────────────────────────────────────
function ChangeEmailScreen({ email, onEmailChange, onSubmit }) {
  const inputState = email ? 'typing' : 'focused'

  function handleChar(char) { onEmailChange(prev => prev + char) }
  function handleBackspace() { onEmailChange(prev => prev.slice(0, -1)) }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />
      <NavHeader type="icon-left" title="Change email" showBorder={false} showWatermark={false} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24, padding: '24px 20px 0', overflow: 'hidden' }}>
        <p style={{ margin: 0, fontSize: 16, fontFamily: 'var(--ds-font-family)', color: 'var(--text-base)', lineHeight: 1.5 }}>
          Enter a different email address to receive a new verification code
        </p>
        <InputField
          variant="text"
          size="md"
          state={inputState}
          label=""
          showLabel={false}
          showIcon={false}
          placeholder="Enter new email"
          value={email}
          onChange={onEmailChange}
        />
      </div>

      <div style={{ padding: '12px 20px 16px', flexShrink: 0 }}>
        <Button
          type="primary"
          size="lg"
          state="default"
          label="Get verification code"
          fullWidth
          onClick={onSubmit}
        />
      </div>

      <AndroidQWERTY onChar={handleChar} onBackspace={handleBackspace} />
    </div>
  )
}

// ── Phone mockup ──────────────────────────────────────────────────────────────
function PhoneMock({ children, scale = SCALE }) {
  const frameW = CW + P9_BORDER * 2
  const frameH = CH + P9_BORDER * 2

  return (
    <div style={{ width: frameW * scale, height: frameH * scale, flexShrink: 0, position: 'relative' }}>
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
        position: 'relative', overflow: 'hidden',
      }}>
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

// ── Inspect panel ─────────────────────────────────────────────────────────────
const ALL_COMPS = {
  NavHeader:  { urlId: '50_3459',  desc: 'Top navigation bar with back arrow and title', category: 'Navigation' },
  OTPInput:   { urlId: '188_2882', desc: '6-cell email verification code input',          category: 'Input'      },
  Link:       { urlId: '190_3261', desc: 'Inline text link (Resend code, Change email)',  category: 'Action'     },
  ScreenBanner:{ urlId: '35_1200', desc: 'Success notification at top of phone screen',  category: 'Feedback'   },
  InputField: { urlId: '109_1161', desc: 'Email text input field',                        category: 'Input'      },
  Button:     { urlId: '16_182',   desc: '"Get verification code" primary action button', category: 'Action'     },
}
const SCREEN_COMPS = {
  verify:        ['NavHeader', 'ScreenBanner', 'OTPInput', 'Link'],
  'change-email':['NavHeader', 'InputField', 'Button'],
}

function InspectPanel({ screen }) {
  const names = SCREEN_COMPS[screen] ?? []
  return (
    <div style={{ width: INSPECT_W, flexShrink: 0, borderLeft: '1px solid var(--border-subtle)', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)' }}>
        <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-family)', color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Components on this screen
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {names.map(name => {
          const c = ALL_COMPS[name]
          return (
            <a key={name} href={`/explorer/${c.urlId}`} style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', textDecoration: 'none', backgroundColor: '#fff', transition: 'background 0.1s' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-family)', color: 'var(--text-base)' }}>{name}</span>
                <span style={{ fontSize: 10, fontFamily: 'var(--font-family)', color: 'var(--text-subtle)', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 4, padding: '1px 6px' }}>{c.category}</span>
              </div>
              <span style={{ fontSize: 12, fontFamily: 'var(--font-family)', color: 'var(--text-subtle)', lineHeight: 1.4 }}>{c.desc}</span>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-family)', color: 'var(--text-primary)', fontWeight: 600, marginTop: 2 }}>View in DS →</span>
            </a>
          )
        })}
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function ResendAndChangeEmail() {
  const [screen, setScreen]           = useState('verify')
  const [resendCount, setResendCount] = useState(0)
  const [timer, setTimer]             = useState(59)
  const [showBanner, setShowBanner]   = useState(false)
  const [values, setValues]           = useState(Array(6).fill(''))
  const [email, setEmail]             = useState('')
  const [visible, setVisible]         = useState(true)
  const [scale, setScale]             = useState(SCALE)
  const [inspect, setInspect]         = useState(false)

  const containerRef = useRef(null)
  const inspectRef   = useRef(false)
  const bannerTimer  = useRef(null)

  // Dynamic scale
  useEffect(() => {
    function computeScale() {
      if (!containerRef.current) return
      const { height, width } = containerRef.current.getBoundingClientRect()
      const availH = height - TOOLBAR_H - 24
      const availW = width - 32 - (inspectRef.current ? INSPECT_W : 0)
      setScale(Math.max(Math.min(availH / FRAME_H, availW / FRAME_W, 0.82), 0.4))
    }
    inspectRef.current = inspect
    computeScale()
    const ro = new ResizeObserver(computeScale)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [inspect])

  // Countdown timer (verify screen only)
  useEffect(() => {
    if (screen !== 'verify' || timer <= 0) return
    const t = setTimeout(() => setTimer(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [timer, screen])

  function navigateTo(next) {
    setVisible(false)
    setTimeout(() => { setScreen(next); setVisible(true) }, 180)
  }

  function handleResend() {
    const next = resendCount + 1
    setResendCount(next)
    setTimer(59)
    setValues(Array(6).fill(''))
    setShowBanner(true)
    clearTimeout(bannerTimer.current)
    bannerTimer.current = setTimeout(() => setShowBanner(false), BANNER_TTL)
  }

  function handleDigit(d) {
    setValues(prev => {
      const idx = prev.findIndex(v => v === '')
      if (idx === -1) return prev
      const next = [...prev]; next[idx] = d
      return next
    })
  }

  function handleBackspace() {
    setValues(prev => {
      const next = [...prev]
      for (let i = 5; i >= 0; i--) { if (next[i] !== '') { next[i] = ''; break } }
      return next
    })
  }

  function handleRestart() {
    clearTimeout(bannerTimer.current)
    setVisible(false)
    setTimeout(() => {
      setScreen('verify')
      setResendCount(0)
      setTimer(59)
      setShowBanner(false)
      setValues(Array(6).fill(''))
      setEmail('')
      setVisible(true)
    }, 180)
  }

  const focusedIndex = values.findIndex(v => v === '')
  const SCREEN_LABELS = { verify: 'Verify email', 'change-email': 'Change email' }

  return (
    <div ref={containerRef} style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#fff', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{ height: TOOLBAR_H, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, borderBottom: '1px solid var(--border-subtle)', paddingLeft: 24, paddingRight: 24 }}>
        <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-family)', color: 'var(--text-base)' }}>
          {inspect ? 'Inspect mode' : 'Interactive prototype'}
        </span>
        {!inspect && (
          <span style={{ fontSize: 12, fontFamily: 'var(--font-family)', color: 'var(--text-subtle)' }}>
            {SCREEN_LABELS[screen]} · {resendCount}/{MAX_RESENDS} resends used
          </span>
        )}
        {!inspect && (
          <button onClick={handleRestart} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontFamily: 'var(--font-family)', color: 'var(--text-subtle)' }}>
            <BilleaseIcon name="auto-renew" size="xs" color="var(--text-subtle)" />
            Restart
          </button>
        )}
        <button onClick={() => setInspect(v => !v)} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'var(--font-family)', fontSize: 12, color: inspect ? 'var(--text-base)' : 'var(--text-subtle)', fontWeight: inspect ? 600 : 400 }}>
          Inspect
          <div style={{ width: 36, height: 20, borderRadius: 10, flexShrink: 0, backgroundColor: inspect ? 'var(--bg-secondary)' : 'var(--bg-sunken)', position: 'relative', transition: 'background-color 0.2s' }}>
            <div style={{ position: 'absolute', top: 2, left: inspect ? 16 : 2, width: 16, height: 16, borderRadius: '50%', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.25)', transition: 'left 0.2s' }} />
          </div>
        </button>
      </div>

      {/* Stage */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <PhoneMock scale={scale}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', transition: 'opacity 0.18s ease', opacity: visible ? 1 : 0, pointerEvents: inspect ? 'none' : undefined }}>
              {screen === 'verify' && (
                <VerifyScreen
                  showBanner={showBanner}
                  resendCount={resendCount}
                  timer={timer}
                  values={values}
                  focusedIndex={focusedIndex === -1 ? undefined : focusedIndex}
                  onDigit={handleDigit}
                  onBackspace={handleBackspace}
                  onResend={handleResend}
                  onChangeEmail={() => navigateTo('change-email')}
                />
              )}
              {screen === 'change-email' && (
                <ChangeEmailScreen
                  email={email}
                  onEmailChange={setEmail}
                  onSubmit={() => {
                    setResendCount(0)
                    setTimer(59)
                    setValues(Array(6).fill(''))
                    setEmail('')
                    setShowBanner(true)
                    clearTimeout(bannerTimer.current)
                    bannerTimer.current = setTimeout(() => setShowBanner(false), BANNER_TTL)
                    navigateTo('verify')
                  }}
                />
              )}
            </div>
          </PhoneMock>
        </div>
        {inspect && <InspectPanel screen={screen} />}
      </div>
    </div>
  )
}
