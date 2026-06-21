import { useState, useEffect, useRef } from 'react'
import OTPInput from '../../components/ds/OTPInput'
import InputField from '../../components/ds/InputField'
import Button from '../../components/ds/Button'
import Link from '../../components/ds/Link'
import NavHeader from '../../components/ds/NavHeader'
import BilleaseIcon from '../../assets/icons/BilleaseIcon'

const SCALE = 0.7
const CW = 390
const CH = 820

// ── Android status bar ────────────────────────────────────────────────────────
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
          {/* Standard Android backspace chevron */}
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
          {/* Done key — inert, submission is auto on 6th digit */}
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
function EntryScreen({ values, focusedIndex, showError, showErrorMsg, shaking, onShakeEnd, resendSeconds, onDigit, onBackspace, onChangeEmail, onResend }) {
  // When in error-cleared state: cells show as default (no focus, no red borders)
  const otpFocusedIndex = showErrorMsg ? undefined : focusedIndex

  return (
    <>
      <StatusBar />
      <NavHeader type="icon-left" title="Email verification" showBorder showWatermark={false} />
      <div style={{ flex: 1, padding: '24px 20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, overflowY: 'auto' }}>

        {/* Top section — gap 4px per Figma */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textAlign: 'center' }}>
          <span style={{ fontSize: 16, fontWeight: 400, fontFamily: 'var(--font-family)', color: 'var(--text-base)', lineHeight: 1.5 }}>
            Enter 6-digit code we sent to
          </span>
          <span style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--font-family)', color: 'var(--text-base)', lineHeight: 1.5 }}>
            test@gmail.com
          </span>
        </div>

        {/* OTP section — gap 24px between cells-group and resend */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          {/* Cells + error message (gap 16px inside, matches OTPInput's internal gap) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div
              className={shaking ? 'otp-shake' : ''}
              onAnimationEnd={onShakeEnd}
            >
              <OTPInput
                type="OTP-email"
                values={values}
                focusedIndex={otpFocusedIndex}
                showError={showError}
                errorMessage="Incorrect code. Try again."
              />
            </div>
            {/* After shake: cells go to default but error message persists here */}
            {showErrorMsg && !showError && (
              <span style={{ fontSize: 14, fontWeight: 400, fontFamily: 'var(--font-family)', color: 'var(--text-error)', lineHeight: '21px', textAlign: 'center' }}>
                Incorrect code. Try again.
              </span>
            )}
          </div>

          {/* Resend row */}
          <div style={{ textAlign: 'center', fontFamily: 'var(--font-family)', color: 'var(--text-base)', lineHeight: 1.5 }}>
            {resendSeconds > 0
              ? <span style={{ fontSize: 16, fontWeight: 400 }}>{`Resend code in ${resendSeconds}s`}</span>
              : <Link label="Resend code" size="sm" state="default" showIcon={false} onClick={onResend} />
            }
          </div>
        </div>

        {/* Change email */}
        <ChangeEmailLink onClick={onChangeEmail} />
      </div>
      <AndroidKeyboard onDigit={onDigit} onBackspace={onBackspace} />
    </>
  )
}

// ── Blocked screen ────────────────────────────────────────────────────────────
// Transition: error state (last digits, red borders) → disabled state (empty grey cells)
// Keyboard is already gone when this screen mounts. After 700ms the OTP clears to disabled.
function BlockedScreen({ lastValues, onChangeEmail }) {
  const [isDisabled, setIsDisabled] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setIsDisabled(true), 700)
    return () => clearTimeout(t)
  }, [])

  const displayValues = isDisabled ? Array(6).fill('') : lastValues

  return (
    <>
      <StatusBar />
      <NavHeader type="icon-left" title="Email verification" showBorder showWatermark={false} />
      <div style={{ flex: 1, padding: '24px 20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textAlign: 'center' }}>
          <span style={{ fontSize: 16, fontWeight: 400, fontFamily: 'var(--font-family)', color: 'var(--text-base)', lineHeight: 1.5 }}>
            Enter 6-digit code we sent to
          </span>
          <span style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--font-family)', color: 'var(--text-base)', lineHeight: 1.5 }}>
            test@gmail.com
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <OTPInput
            type="OTP-email"
            values={displayValues}
            showError={!isDisabled}
            disabled={isDisabled}
            errorMessage="Too many incorrect attempts"
          />
          <div style={{ textAlign: 'center', fontSize: 14, fontFamily: 'var(--font-family)', color: '#1D2D40', lineHeight: '21px' }}>
            Request a new code in 15 minutes
          </div>
        </div>
        <ChangeEmailLink onClick={onChangeEmail} />
      </div>
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
      <NavHeader type="icon-left" title="Change email" showBorder showWatermark={false} />
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
const P9_BORDER = 10   // ~2 mm bezels
const P9_OUTER_R = 40  // Pixel 9 Pro screen corner radius in dp ≈ 29, +bezel = ~40
const P9_INNER_R = 30  // screen corner

function PhoneMock({ children, scale = SCALE }) {
  const frameW = CW + P9_BORDER * 2
  const frameH = CH + P9_BORDER * 2

  return (
    <div style={{ width: frameW * scale, height: frameH * scale, flexShrink: 0, position: 'relative' }}>
      {/* Right side: power + volume (Pixel 9 Pro — all buttons on right) */}
      <div style={{ position: 'absolute', right: -3 * scale, top: (P9_BORDER + 160) * scale, zIndex: 20 }}>
        {/* Power */}
        <div style={{
          width: 3 * scale, height: 68 * scale,
          backgroundColor: '#303030',
          borderRadius: `0 ${2 * scale}px ${2 * scale}px 0`,
          marginBottom: 14 * scale,
        }} />
        {/* Volume up */}
        <div style={{
          width: 3 * scale, height: 54 * scale,
          backgroundColor: '#303030',
          borderRadius: `0 ${2 * scale}px ${2 * scale}px 0`,
          marginBottom: 6 * scale,
        }} />
        {/* Volume down */}
        <div style={{
          width: 3 * scale, height: 54 * scale,
          backgroundColor: '#303030',
          borderRadius: `0 ${2 * scale}px ${2 * scale}px 0`,
        }} />
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
        {/* Punch-hole camera — centered, 13 px from top of screen */}
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

const TOOLBAR_H = 44
const FRAME_H = CH + P9_BORDER * 2
const FRAME_W = CW + P9_BORDER * 2

// ── Main export ───────────────────────────────────────────────────────────────
export default function TooManyOTPAttempts() {
  const [screen, setScreen] = useState('entry')
  const [values, setValues] = useState(Array(6).fill(''))
  const [showError, setShowError] = useState(false)
  const [showErrorMsg, setShowErrorMsg] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [resendSeconds, setResendSeconds] = useState(59)
  const [blockedValues, setBlockedValues] = useState(Array(6).fill(''))
  const [email, setEmail] = useState('')
  const [emailFocused, setEmailFocused] = useState(false)
  const [visible, setVisible] = useState(true)
  const [scale, setScale] = useState(SCALE)
  const containerRef = useRef(null)
  const attemptsRef = useRef(0)

  // Dynamic phone scale
  useEffect(() => {
    function computeScale() {
      if (!containerRef.current) return
      const { height, width } = containerRef.current.getBoundingClientRect()
      const availH = height - TOOLBAR_H - 24
      const availW = width - 32
      setScale(Math.max(Math.min(availH / FRAME_H, availW / FRAME_W, 0.82), 0.4))
    }
    computeScale()
    const ro = new ResizeObserver(computeScale)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Resend countdown (entry screen)
  useEffect(() => {
    if (screen !== 'entry' || resendSeconds <= 0) return
    const t = setTimeout(() => setResendSeconds(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [resendSeconds, screen])


  function navigateTo(next) {
    setVisible(false)
    setTimeout(() => { setScreen(next); setVisible(true) }, 180)
  }

  function submitCode(filledValues) {
    const newAttempts = attemptsRef.current + 1
    attemptsRef.current = newAttempts
    setAttempts(newAttempts)
    if (newAttempts >= 5) {
      setBlockedValues(filledValues)
      navigateTo('blocked')
    } else {
      // Keep values visible (shown in error state) during shake, clear after
      setShowError(true)
      setShaking(true)
    }
  }

  function handleDigit(d) {
    if (showError) setShowError(false)
    if (showErrorMsg) setShowErrorMsg(false)
    setValues(prev => {
      const idx = prev.findIndex(v => v === '')
      if (idx === -1) return prev
      const next = [...prev]
      next[idx] = d
      // Auto-submit when last cell filled
      if (idx === 5) {
        setTimeout(() => submitCode(next), 300)
      }
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

  function handleResend() {
    setResendSeconds(59)
    setShowErrorMsg(false)
  }

  function handleRestart() {
    setVisible(false)
    setTimeout(() => {
      attemptsRef.current = 0
      setScreen('entry')
      setValues(Array(6).fill(''))
      setShowError(false)
      setShowErrorMsg(false)
      setShaking(false)
      setAttempts(0)
      setResendSeconds(59)
      setBlockedValues(Array(6).fill(''))
      setEmail('')
      setEmailFocused(false)
      setVisible(true)
    }, 180)
  }

  const focusedIndex = values.findIndex(v => v === '')
  const SCREEN_LABELS = { entry: 'Enter code', blocked: 'Blocked', 'change-email': 'Change email' }

  return (
    <>
      <style>{`
        @keyframes otpShake {
          0%,100% { transform: translateX(0); }
          12%      { transform: translateX(-7px); }
          25%      { transform: translateX(7px); }
          37%      { transform: translateX(-5px); }
          50%      { transform: translateX(5px); }
          62%      { transform: translateX(-3px); }
          75%      { transform: translateX(3px); }
        }
        .otp-shake { animation: otpShake 0.5s ease; }
      `}</style>

      <div ref={containerRef} style={{
        height: '100%',
        display: 'flex', flexDirection: 'column',
        backgroundColor: '#fff',
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

        {/* Phone — centered in remaining space */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
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
                showErrorMsg={showErrorMsg}
                shaking={shaking}
                onShakeEnd={() => {
                  setShaking(false)
                  setShowError(false)
                  setValues(Array(6).fill(''))
                  setShowErrorMsg(true)
                }}
                resendSeconds={resendSeconds}
                onDigit={handleDigit}
                onBackspace={handleBackspace}
                onChangeEmail={() => navigateTo('change-email')}
                onResend={handleResend}
              />
            )}
            {screen === 'blocked' && (
              <BlockedScreen
                lastValues={blockedValues}
                onChangeEmail={() => navigateTo('change-email')}
              />
            )}
            {screen === 'change-email' && (
              <ChangeEmailScreen
                email={email}
                emailFocused={emailFocused}
                onEmailChange={setEmail}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                onSubmit={() => {
                  attemptsRef.current = 0
                  setValues(Array(6).fill(''))
                  setShowError(false)
                  setShowErrorMsg(false)
                  setAttempts(0)
                  setResendSeconds(59)
                  navigateTo('entry')
                }}
              />
            )}
          </div>
        </PhoneMock>
        </div>
      </div>
    </>
  )
}
