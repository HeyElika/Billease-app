import { useState, useEffect, useRef } from 'react'
import OTPInput from '../../components/ds/OTPInput'
import InputField from '../../components/ds/InputField'
import Button from '../../components/ds/Button'
import Link from '../../components/ds/Link'
import BilleaseIcon from '../../assets/icons/BilleaseIcon'

const SCALE = 0.7
const CW = 390
const CH = 820

// ── Android status bar ────────────────────────────────────────────────────────
function StatusBar() {
  return (
    <div style={{
      height: 28, backgroundColor: '#fff', flexShrink: 0,
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: 20, paddingRight: 16,
    }}>
      <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-family)', color: '#1D2D40' }}>
        5:13
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        {/* Alarm */}
        <svg width="13" height="13" viewBox="0 0 24 24" fill="#1D2D40">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
        </svg>
        {/* Bluetooth */}
        <svg width="9" height="13" viewBox="0 0 14 20" fill="#1D2D40">
          <path d="M7 0L1 6l4 4-4 4 6 6v-7l3 3 1-1-4-4 4-4-1-1-3 3V0z"/>
        </svg>
        {/* WiFi */}
        <svg width="15" height="12" viewBox="0 0 24 20" fill="#1D2D40">
          <path d="M12 14.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
          <path d="M12 10c2.2 0 4.2.9 5.6 2.3l1.7-1.7C17.5 9 14.9 7.5 12 7.5s-5.5 1.5-7.3 3.1l1.7 1.7C7.8 10.9 9.8 10 12 10z"/>
          <path d="M12 5.5c3.3 0 6.3 1.3 8.4 3.5l1.7-1.7C19.6 4.8 16 3 12 3S4.4 4.8 1.9 7.3l1.7 1.7C5.7 6.8 8.7 5.5 12 5.5z"/>
        </svg>
        {/* Signal bars */}
        <svg width="16" height="12" viewBox="0 0 24 18" fill="#1D2D40">
          <rect x="0" y="13" width="4" height="5"/>
          <rect x="6" y="9" width="4" height="9"/>
          <rect x="12" y="5" width="4" height="13"/>
          <rect x="18" y="1" width="4" height="17"/>
        </svg>
        {/* Battery */}
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

// ── Nav header ────────────────────────────────────────────────────────────────
function NavHeader({ title }) {
  return (
    <div style={{
      height: 56, backgroundColor: '#fff', flexShrink: 0,
      display: 'flex', alignItems: 'center',
      borderBottom: '1px solid #EAEDF0',
    }}>
      <div style={{ width: 44, paddingLeft: 16, display: 'flex', alignItems: 'center' }}>
        <BilleaseIcon name="arrow-left" size="sm" color="#1D2D40" />
      </div>
      <span style={{
        flex: 1, textAlign: 'center', marginRight: 44,
        fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-family)', color: '#1D2D40',
      }}>{title}</span>
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

// ── Android numeric keyboard ──────────────────────────────────────────────────
const KEYPAD_ROWS = [
  ['1', '2', '3', '__dash'],
  ['4', '5', '6', '__enter'],
  ['7', '8', '9', '__back'],
  ['__sym', '0', '__dot', '__next'],
]
const SUB = { '2':'ABC','3':'DEF','4':'GHI','5':'JKL','6':'MNO','7':'PQRS','8':'TUV','9':'WXYZ','0':'+' }

function AndroidKeyboard({ onDigit, onBackspace, onNext, nextEnabled }) {
  function Key({ k }) {
    if (k === '__back') {
      return (
        <button onClick={onBackspace} style={{
          flex: 1, height: 55, background: '#B0B4BE', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="22" height="18" viewBox="0 0 24 20" fill="#1D2D40">
            <path d="M21 2H8c-.69 0-1.23.35-1.59.88L1 10l5.41 9.11c.36.53.9.89 1.59.89h13c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 16H8.07L3.4 10l4.66-8H21v16zm-8.59-2L16 12.41 19.59 16 21 14.59 17.41 12 21 9.41 19.59 8 16 11.59 12.41 8 11 9.41 14.59 12 11 14.59l1.41 1.41z"/>
          </svg>
        </button>
      )
    }
    if (k === '__next') {
      return (
        <button onClick={nextEnabled ? onNext : undefined} style={{
          flex: 1, height: 55,
          background: nextEnabled ? '#1652F0' : '#8AAAF4',
          border: 'none', cursor: nextEnabled ? 'pointer' : 'default',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: '#fff', fontSize: 22 }}>→</span>
        </button>
      )
    }
    if (['__dash','__enter','__sym','__dot'].includes(k)) {
      const label = k === '__dash' ? '—' : k === '__enter' ? '↵' : k === '__sym' ? '?123' : '.'
      return (
        <button style={{
          flex: 1, height: 55, background: '#B0B4BE', border: 'none', cursor: 'default',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: '#1D2D40', fontSize: 17 }}>{label}</span>
        </button>
      )
    }
    return (
      <button onClick={() => onDigit(k)} style={{
        flex: 1, height: 55, background: '#FEFEFE', border: 'none', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0,
      }}>
        <span style={{ fontSize: 26, fontWeight: 300, color: '#1D2D40', lineHeight: '28px' }}>{k}</span>
        {SUB[k] && <span style={{ fontSize: 8, color: '#666', letterSpacing: '1.5px' }}>{SUB[k]}</span>}
      </button>
    )
  }

  return (
    <div style={{ flexShrink: 0 }}>
      <div style={{ backgroundColor: '#9FA3AD', display: 'flex', flexDirection: 'column', gap: 1 }}>
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

// ── "Wrong email? Change email" row ───────────────────────────────────────────
function ChangeEmailLink({ onClick }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
      <span style={{ fontSize: 14, fontFamily: 'var(--font-family)', color: '#1D2D40' }}>Wrong email?</span>
      <Link label="Change email" size="sm" state="default" showIcon={false} onClick={onClick} />
    </div>
  )
}

// ── Entry / Error screen ──────────────────────────────────────────────────────
function EntryScreen({ values, focusedIndex, showError, resendSeconds, onDigit, onBackspace, onNext, onChangeEmail }) {
  const allFilled = values.every(v => v !== '')
  return (
    <>
      <StatusBar />
      <NavHeader title="Email verification" />
      <div style={{ flex: 1, padding: '24px 24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, overflow: 'hidden' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontFamily: 'var(--font-family)', color: '#1D2D40', lineHeight: '21px' }}>
            Enter 6-digit code we sent to
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-family)', color: '#1D2D40' }}>
            test@gmail.com
          </div>
        </div>
        <OTPInput
          type="OTP-email"
          values={values}
          focusedIndex={focusedIndex}
          showError={showError}
          errorMessage="Incorrect code. Try again."
        />
        <div style={{ textAlign: 'center', fontSize: 14, fontFamily: 'var(--font-family)', color: '#1D2D40' }}>
          {resendSeconds > 0 ? `Resend code in ${resendSeconds}s` : (
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontFamily: 'var(--font-family)', color: '#1D2D40', fontWeight: 600, padding: 0 }}>
              Resend code
            </button>
          )}
        </div>
        <ChangeEmailLink onClick={onChangeEmail} />
      </div>
      <AndroidKeyboard
        onDigit={onDigit}
        onBackspace={onBackspace}
        onNext={onNext}
        nextEnabled={allFilled}
      />
    </>
  )
}

// ── Blocked screen ────────────────────────────────────────────────────────────
function BlockedScreen({ onChangeEmail }) {
  return (
    <>
      <StatusBar />
      <NavHeader title="Email verification" />
      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, overflow: 'hidden' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontFamily: 'var(--font-family)', color: '#1D2D40', lineHeight: '21px' }}>
            Enter 6-digit code we sent to
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-family)', color: '#1D2D40' }}>
            test@gmail.com
          </div>
        </div>
        <OTPInput
          type="OTP-email"
          values={['5','8','2','1','3','7']}
          showError
          errorMessage="Too many incorrect attempts"
        />
        <div style={{ textAlign: 'center', fontSize: 14, fontFamily: 'var(--font-family)', color: '#1D2D40' }}>
          Request a new code in 15 minutes
        </div>
        <ChangeEmailLink onClick={onChangeEmail} />
      </div>
      <AndroidNavBar />
    </>
  )
}

// ── Change email screen ───────────────────────────────────────────────────────
function ChangeEmailScreen({ email, emailFocused, onEmailChange, onFocus, onBlur, onSubmit }) {
  const inputState = emailFocused
    ? (email ? 'typing' : 'focused')
    : (email ? 'filled' : 'default')

  return (
    <>
      <StatusBar />
      <NavHeader title="Change email" />
      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: 20, overflow: 'hidden' }}>
        <div style={{ fontSize: 14, fontFamily: 'var(--font-family)', color: '#5A6475', lineHeight: '21px' }}>
          Enter a different email address to receive a new verification code
        </div>
        <InputField
          variant="text"
          size="md"
          state={inputState}
          label="Email address"
          placeholder="Enter email address"
          value={email}
          onChange={onEmailChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onClear={() => onEmailChange('')}
        />
      </div>
      <div style={{ padding: '12px 24px 20px', borderTop: '1px solid #EAEDF0', flexShrink: 0 }}>
        <Button
          type="primary"
          size="lg"
          state={email ? 'default' : 'disabled'}
          label="Get verification code"
          fullWidth
          onClick={email ? onSubmit : undefined}
        />
      </div>
      <AndroidNavBar />
    </>
  )
}

// ── Phone mockup — Google Pixel 9 Pro (Obsidian) ─────────────────────────────
function PhoneMock({ children, scale = SCALE }) {
  const BORDER = 13
  const frameW = CW + BORDER * 2
  const frameH = CH + BORDER * 2
  const OUTER_R = 52
  const INNER_R = 40

  return (
    <div style={{ width: frameW * scale, height: frameH * scale, flexShrink: 0, position: 'relative' }}>
      {/* Right side buttons */}
      <div style={{ position: 'absolute', right: -3 * scale, top: (BORDER + 148) * scale, zIndex: 20 }}>
        {/* Volume up */}
        <div style={{
          width: 4 * scale, height: 58 * scale,
          backgroundColor: '#2A2A2A',
          borderRadius: `0 ${3 * scale}px ${3 * scale}px 0`,
          marginBottom: 8 * scale,
        }} />
        {/* Volume down */}
        <div style={{
          width: 4 * scale, height: 58 * scale,
          backgroundColor: '#2A2A2A',
          borderRadius: `0 ${3 * scale}px ${3 * scale}px 0`,
          marginBottom: 24 * scale,
        }} />
        {/* Power button */}
        <div style={{
          width: 4 * scale, height: 72 * scale,
          backgroundColor: '#2A2A2A',
          borderRadius: `0 ${3 * scale}px ${3 * scale}px 0`,
        }} />
      </div>

      <div style={{
        width: frameW, height: frameH,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        borderRadius: OUTER_R,
        backgroundColor: '#1C1C1E',
        boxShadow: '0 0 0 1px #333, 0 28px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Front camera hole-punch */}
        <div style={{
          position: 'absolute', top: 20, left: '50%',
          transform: 'translateX(-50%)',
          width: 11, height: 11, borderRadius: '50%',
          backgroundColor: '#0a0a0a', zIndex: 10,
          boxShadow: 'inset 0 0 3px rgba(0,0,0,0.8)',
        }} />
        {/* Screen */}
        <div style={{
          position: 'absolute', top: BORDER, left: BORDER,
          width: CW, height: CH,
          overflow: 'hidden', backgroundColor: '#fff',
          borderRadius: INNER_R,
          display: 'flex', flexDirection: 'column',
        }}>
          {children}
        </div>
      </div>
    </div>
  )
}

const TOOLBAR_H = 44
const FRAME_H = CH + 13 * 2  // CH + BORDER*2
const FRAME_W = CW + 13 * 2

// ── Main export ───────────────────────────────────────────────────────────────
export default function TooManyOTPAttempts() {
  const [screen, setScreen] = useState('entry')
  const [values, setValues] = useState(Array(6).fill(''))
  const [showError, setShowError] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [resendSeconds, setResendSeconds] = useState(59)
  const [email, setEmail] = useState('')
  const [emailFocused, setEmailFocused] = useState(false)
  const [visible, setVisible] = useState(true)
  const [scale, setScale] = useState(SCALE)
  const containerRef = useRef(null)

  useEffect(() => {
    function computeScale() {
      if (!containerRef.current) return
      const { height, width } = containerRef.current.getBoundingClientRect()
      const availH = height - TOOLBAR_H - 24  // gap between toolbar and phone
      const availW = width - 32
      const s = Math.min(availH / FRAME_H, availW / FRAME_W, 1)
      setScale(Math.max(s, 0.4))
    }
    computeScale()
    const ro = new ResizeObserver(computeScale)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (screen !== 'entry' || resendSeconds <= 0) return
    const t = setTimeout(() => setResendSeconds(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [resendSeconds, screen])

  function navigateTo(next) {
    setVisible(false)
    setTimeout(() => { setScreen(next); setVisible(true) }, 180)
  }

  function handleDigit(d) {
    const idx = values.findIndex(v => v === '')
    if (idx === -1) return
    const next = [...values]; next[idx] = d
    setValues(next)
    if (showError) setShowError(false)
  }

  function handleBackspace() {
    const next = [...values]
    for (let i = 5; i >= 0; i--) { if (next[i] !== '') { next[i] = ''; break } }
    setValues(next)
  }

  function handleNext() {
    const newAttempts = attempts + 1
    setAttempts(newAttempts)
    if (newAttempts >= 5) {
      navigateTo('blocked')
    } else {
      setValues(Array(6).fill(''))
      setShowError(true)
    }
  }

  function handleRestart() {
    setVisible(false)
    setTimeout(() => {
      setScreen('entry')
      setValues(Array(6).fill(''))
      setShowError(false)
      setAttempts(0)
      setResendSeconds(59)
      setEmail('')
      setEmailFocused(false)
      setVisible(true)
    }, 180)
  }

  const focusedIndex = values.findIndex(v => v === '')
  const SCREEN_LABELS = { entry: 'Enter code', blocked: 'Blocked', 'change-email': 'Change email' }

  return (
    <div ref={containerRef} style={{
      height: '100%',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: 16,
      backgroundColor: '#fff',
      gap: 8,
      overflow: 'hidden',
    }}>
      {/* Toolbar */}
      <div style={{
        height: TOOLBAR_H,
        display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
        borderBottom: '1px solid var(--border-subtle)',
        width: '100%', paddingLeft: 24, paddingRight: 24,
      }}>
        <BilleaseIcon name="activity-outline" size="xs" color="var(--bg-secondary)" />
        <span style={{ fontSize: 13, fontFamily: 'var(--font-family)', fontWeight: 600, color: 'var(--text-base)' }}>
          Interactive prototype
        </span>
        <span style={{ fontSize: 12, fontFamily: 'var(--font-family)', color: 'var(--text-subtle)' }}>
          {SCREEN_LABELS[screen]} · {attempts}/5 attempts
        </span>
        <button onClick={handleRestart} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 12, fontFamily: 'var(--font-family)', color: 'var(--text-subtle)',
        }}>
          <BilleaseIcon name="auto-renew" size="xs" color="var(--text-subtle)" />
          Restart
        </button>
      </div>

      {/* Phone */}
      <PhoneMock scale={scale}>
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          transition: 'opacity 0.18s ease',
          opacity: visible ? 1 : 0,
        }}>
          {screen === 'entry' && (
            <EntryScreen
              values={values}
              focusedIndex={focusedIndex === -1 ? undefined : focusedIndex}
              showError={showError}
              resendSeconds={resendSeconds}
              onDigit={handleDigit}
              onBackspace={handleBackspace}
              onNext={handleNext}
              onChangeEmail={() => navigateTo('change-email')}
            />
          )}
          {screen === 'blocked' && (
            <BlockedScreen onChangeEmail={() => navigateTo('change-email')} />
          )}
          {screen === 'change-email' && (
            <ChangeEmailScreen
              email={email}
              emailFocused={emailFocused}
              onEmailChange={setEmail}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              onSubmit={() => {
                setValues(Array(6).fill(''))
                setShowError(false)
                setAttempts(0)
                setResendSeconds(59)
                navigateTo('entry')
              }}
            />
          )}
        </div>
      </PhoneMock>
    </div>
  )
}
