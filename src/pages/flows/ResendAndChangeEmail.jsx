import { useState, useEffect, useRef } from 'react'
import OTPInput from '../../components/ds/OTPInput'
import InputField from '../../components/ds/InputField'
import Button from '../../components/ds/Button'
import Link from '../../components/ds/Link'
import NavHeader from '../../components/ds/NavHeader'
import BilleaseIcon from '../../assets/icons/BilleaseIcon'
import { ScreenBanner } from '../../components/ds/Toast'
import { StatusBar, AndroidNavBar, AndroidKeyboard, PhoneMock, TOOLBAR_H, FRAME_W, FRAME_H } from './PhoneMockShared'

// ── Constants ─────────────────────────────────────────────────────────────────
const SCALE      = 0.7
const INSPECT_W  = 264
const MAX_RESENDS = 3
const BANNER_TTL  = 3000  // ms banner stays visible after resend

// ── GBoard-style QWERTY keyboard (email entry) ────────────────────────────────
const QWERTY_ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['Z','X','C','V','B','N','M'],
]

// GBoard palette
const GB_BG   = '#d1d3d9'
const GB_KEY  = '#ffffff'
const GB_SPEC = '#adb5bd'
const GB_SHAD = '0 1px 0 rgba(0,0,0,0.35)'

function AndroidQWERTY({ onChar, onBackspace }) {
  const lk = {
    height: 43, background: GB_KEY, border: 'none',
    borderRadius: 5, boxShadow: GB_SHAD,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', flex: 1, padding: 0,
  }
  const sk = { ...lk, background: GB_SPEC, cursor: 'pointer', flex: 'none' }
  const txt = (t, size = 16) => (
    <span style={{ fontSize: size, fontWeight: 400, color: '#1D2D40', fontFamily: 'var(--font-family)', userSelect: 'none' }}>{t}</span>
  )
  // Prevent button clicks from stealing focus from the input
  const nd = (e) => e.preventDefault()

  return (
    <div style={{ flexShrink: 0 }}>
      <div style={{
        backgroundColor: GB_BG,
        display: 'flex', flexDirection: 'column', gap: 8,
        padding: '10px 4px 4px',
      }}>
        {/* Row 1: Q-P */}
        <div style={{ display: 'flex', gap: 6, paddingLeft: 2, paddingRight: 2 }}>
          {QWERTY_ROWS[0].map(k => (
            <button key={k} onMouseDown={nd} onClick={() => onChar(k.toLowerCase())} style={lk}>{txt(k)}</button>
          ))}
        </div>
        {/* Row 2: A-L (inset) */}
        <div style={{ display: 'flex', gap: 6, paddingLeft: 18, paddingRight: 18 }}>
          {QWERTY_ROWS[1].map(k => (
            <button key={k} onMouseDown={nd} onClick={() => onChar(k.toLowerCase())} style={lk}>{txt(k)}</button>
          ))}
        </div>
        {/* Row 3: shift + Z-M + backspace */}
        <div style={{ display: 'flex', gap: 6, paddingLeft: 2, paddingRight: 2 }}>
          <button onMouseDown={nd} style={{ ...sk, width: 42 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 3.5L1.5 14H8v6.5h8V14h6.5L12 3.5z" fill="#1D2D40"/>
            </svg>
          </button>
          {QWERTY_ROWS[2].map(k => (
            <button key={k} onMouseDown={nd} onClick={() => onChar(k.toLowerCase())} style={lk}>{txt(k)}</button>
          ))}
          <button onMouseDown={nd} onClick={onBackspace} style={{ ...sk, width: 42 }}>
            <svg width="22" height="17" viewBox="0 0 28 20" fill="none">
              <path d="M10.5 2L2 10l8.5 8H26V2H10.5z" stroke="#1D2D40" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M15 7l6 6M21 7l-6 6" stroke="#1D2D40" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        {/* Row 4 (email): ?123 | @ | space | . | done */}
        <div style={{ display: 'flex', gap: 6, paddingLeft: 2, paddingRight: 2 }}>
          <button onMouseDown={nd} style={{ ...sk, width: 42 }}>{txt('?123', 13)}</button>
          <button onMouseDown={nd} onClick={() => onChar('@')} style={{ ...lk, flex: 'none', width: 42 }}>{txt('@', 18)}</button>
          <button onMouseDown={nd} onClick={() => onChar(' ')} style={{ ...lk }}>
            {txt('space', 13)}
          </button>
          <button onMouseDown={nd} onClick={() => onChar('.')} style={{ ...lk, flex: 'none', width: 42 }}>{txt('.', 20)}</button>
          <button onMouseDown={nd} style={{ ...sk, width: 42 }}>
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
function ChangeEmailScreen({ email, onEmailChange, onSubmit, onBack }) {
  const inputState = email ? 'typing' : 'focused'
  const wrapRef = useRef(null)

  // Focus the native input on mount so cursor blinks immediately
  useEffect(() => {
    const input = wrapRef.current?.querySelector('input')
    if (input) input.focus()
  }, [])

  function handleChar(char) { onEmailChange(prev => prev + char) }
  function handleBackspace() { onEmailChange(prev => prev.slice(0, -1)) }

  return (
    <div ref={wrapRef} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />
      <NavHeader type="icon-left" title="Change email" showBorder={false} showWatermark={false} onBack={onBack} />

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
                  onBack={() => navigateTo('verify')}
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
