import { useState, useEffect, useRef } from 'react'
import OTPInput from '../../components/ds/OTPInput'
import InputField from '../../components/ds/InputField'
import Button from '../../components/ds/Button'
import Link from '../../components/ds/Link'
import NavHeader from '../../components/ds/NavHeader'
import BilleaseIcon from '../../assets/icons/BilleaseIcon'
import { StatusBar, AndroidNavBar, AndroidKeyboard, PhoneMock, CW, CH, TOOLBAR_H, FRAME_W, FRAME_H } from './PhoneMockShared'

const SCALE = 0.7

// ── "Wrong email? Change email" row ───────────────────────────────────────────
function ChangeEmailLink({ onClick }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
      <span style={{ fontSize: 14, fontFamily: 'var(--ds-font-family)', color: 'var(--text-base)' }}>Wrong email?</span>
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
      <NavHeader type="icon-left" title="Email verification" showBorder={false} showWatermark={false} />
      <div style={{ flex: 1, padding: '24px 20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, overflowY: 'auto' }}>

        {/* Top section — gap 4px per Figma */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textAlign: 'center' }}>
          <span style={{ fontSize: 16, fontWeight: 400, fontFamily: 'var(--ds-font-family)', color: 'var(--text-base)', lineHeight: 1.5 }}>
            Enter 6-digit code we sent to
          </span>
          <span style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--ds-font-family)', color: 'var(--text-base)', lineHeight: 1.5 }}>
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
              <span style={{ fontSize: 14, fontWeight: 400, fontFamily: 'var(--ds-font-family)', color: 'var(--text-error)', lineHeight: '21px', textAlign: 'center' }}>
                Incorrect code. Try again.
              </span>
            )}
          </div>

          {/* Resend row */}
          <div style={{ textAlign: 'center', fontFamily: 'var(--ds-font-family)', color: 'var(--text-base)', lineHeight: 1.5 }}>
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
      <NavHeader type="icon-left" title="Email verification" showBorder={false} showWatermark={false} />
      <div style={{ flex: 1, padding: '24px 20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textAlign: 'center' }}>
          <span style={{ fontSize: 16, fontWeight: 400, fontFamily: 'var(--ds-font-family)', color: 'var(--text-base)', lineHeight: 1.5 }}>
            Enter 6-digit code we sent to
          </span>
          <span style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--ds-font-family)', color: 'var(--text-base)', lineHeight: 1.5 }}>
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
          <div style={{ textAlign: 'center', fontSize: 14, fontFamily: 'var(--ds-font-family)', color: 'var(--text-base)', lineHeight: '21px' }}>
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
      <NavHeader type="icon-left" title="Change email" showBorder={false} showWatermark={false} />
      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: 20, overflow: 'hidden' }}>
        <div style={{ fontSize: 14, fontFamily: 'var(--ds-font-family)', color: 'var(--text-subtle)', lineHeight: '21px' }}>
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

const INSPECT_W = 264

// ── DS component registry for inspect panel ───────────────────────────────────
const ALL_COMPONENTS = {
  NavHeader:  { urlId: '50_3459',   desc: 'Top navigation bar with back arrow and title', category: 'Navigation' },
  OTPInput:   { urlId: '188_2882',  desc: '6-cell email verification code input',          category: 'Input'      },
  Link:       { urlId: '190_3261',  desc: 'Inline text link (Resend code, Change email)',  category: 'Action'     },
  InputField: { urlId: '109_1161',  desc: 'Text input field for email address',            category: 'Input'      },
  Button:     { urlId: '16_182',    desc: 'Primary action button',                         category: 'Action'     },
}

const SCREEN_COMPONENTS = {
  entry:          ['NavHeader', 'OTPInput', 'Link'],
  blocked:        ['NavHeader', 'OTPInput'],
  'change-email': ['NavHeader', 'InputField', 'Button'],
}

// ── Inspect panel ─────────────────────────────────────────────────────────────
function InspectPanel({ screen }) {
  const names = SCREEN_COMPONENTS[screen] ?? []

  return (
    <div style={{
      width: INSPECT_W,
      flexShrink: 0,
      borderLeft: '1px solid var(--border-subtle)',
      backgroundColor: '#fff',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
    }}>
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-subtle)',
      }}>
        <span style={{
          fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-family)',
          color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.5px',
        }}>
          Components on this screen
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {names.map((name, i) => {
          const c = ALL_COMPONENTS[name]
          return (
            <a
              key={name}
              href={`/explorer/${c.urlId}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                padding: '12px 16px',
                borderBottom: '1px solid var(--border-subtle)',
                textDecoration: 'none',
                backgroundColor: '#fff',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-family)', color: 'var(--text-base)' }}>
                  {name}
                </span>
                <span style={{ fontSize: 10, fontFamily: 'var(--font-family)', color: 'var(--text-subtle)', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 4, padding: '1px 6px' }}>
                  {c.category}
                </span>
              </div>
              <span style={{ fontSize: 12, fontFamily: 'var(--font-family)', color: 'var(--text-subtle)', lineHeight: 1.4 }}>
                {c.desc}
              </span>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-family)', color: 'var(--text-primary)', fontWeight: 600, marginTop: 2 }}>
                View in DS →
              </span>
            </a>
          )
        })}
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function TooManyOTPAttempts({ scenarioId = 'too-many-otp-attempts' }) {
  const [screen, setScreen] = useState('entry')
  const [values, setValues] = useState(Array(6).fill(''))
  const [showError, setShowError] = useState(false)
  const [showErrorMsg, setShowErrorMsg] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [resendSeconds, setResendSeconds] = useState(scenarioId === 'expired-otp' ? 0 : 59)
  const [blockedValues, setBlockedValues] = useState(Array(6).fill(''))
  const [email, setEmail] = useState('')
  const [emailFocused, setEmailFocused] = useState(false)
  const [overlay, setOverlay] = useState(null) // { screen, phase: 'enter'|'exit' }
  const [scale, setScale] = useState(SCALE)
  const [inspect, setInspect] = useState(false)
  const containerRef = useRef(null)
  const attemptsRef = useRef(0)
  const inspectRef = useRef(false)

  // Dynamic phone scale — re-runs when inspect panel opens/closes
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

  // Resend countdown (entry screen)
  useEffect(() => {
    if (screen !== 'entry' || resendSeconds <= 0) return
    const t = setTimeout(() => setResendSeconds(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [resendSeconds, screen])


  function navigateTo(next, dir = 'forward') {
    if (dir === 'forward') {
      setOverlay({ screen: next, phase: 'enter' })
      setTimeout(() => { setScreen(next); setOverlay(null) }, 360)
    } else {
      const prev = screen
      setScreen(next)
      setOverlay({ screen: prev, phase: 'exit' })
      setTimeout(() => setOverlay(null), 360)
    }
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
    const prev = screen
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
    setOverlay({ screen: prev, phase: 'exit' })
    setTimeout(() => setOverlay(null), 360)
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
        @keyframes slideUpEnter  { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes slideDownExit { from { transform: translateY(0); } to { transform: translateY(100%); } }
        @keyframes dimIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes dimOut { from { opacity: 1; } to { opacity: 0; } }
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
          <span style={{ fontSize: 13, fontFamily: 'var(--font-family)', fontWeight: 600, color: 'var(--text-base)' }}>
            {inspect ? 'Inspect mode' : 'Interactive prototype'}
          </span>
          {!inspect && (
            <span style={{ fontSize: 12, fontFamily: 'var(--font-family)', color: 'var(--text-subtle)' }}>
              {SCREEN_LABELS[screen]} · {attempts}/5 attempts
            </span>
          )}
          {!inspect && (
            <button onClick={handleRestart} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 12, fontFamily: 'var(--font-family)', color: 'var(--text-subtle)',
            }}>
              <BilleaseIcon name="auto-renew" size="xs" color="var(--text-subtle)" />
              Restart
            </button>
          )}
          {/* Inspect toggle — pushed to right */}
          <button
            onClick={() => setInspect(v => !v)}
            style={{
              marginLeft: 'auto',
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'none', border: 'none', padding: 0,
              cursor: 'pointer', fontFamily: 'var(--font-family)',
              fontSize: 12, color: inspect ? 'var(--text-base)' : 'var(--text-subtle)',
              fontWeight: inspect ? 600 : 400,
            }}
          >
            Inspect
            {/* Toggle track */}
            <div style={{
              width: 36, height: 20, borderRadius: 10, flexShrink: 0,
              backgroundColor: inspect ? 'var(--bg-secondary)' : 'var(--bg-sunken)',
              position: 'relative', transition: 'background-color 0.2s',
            }}>
              {/* Toggle thumb */}
              <div style={{
                position: 'absolute',
                top: 2, left: inspect ? 16 : 2,
                width: 16, height: 16, borderRadius: '50%',
                backgroundColor: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
                transition: 'left 0.2s',
              }} />
            </div>
          </button>
        </div>

        {/* Stage — phone + optional inspect panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <PhoneMock scale={scale}>
          <div style={{ position: 'relative', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', pointerEvents: inspect ? 'none' : undefined }}>
            {/* Base (settled) screen */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
              {screen === 'entry' && <EntryScreen values={values} focusedIndex={focusedIndex === -1 ? undefined : focusedIndex} showError={showError} showErrorMsg={showErrorMsg} shaking={shaking} onShakeEnd={() => { setShaking(false); setShowError(false); setValues(Array(6).fill('')); setShowErrorMsg(true) }} resendSeconds={resendSeconds} onDigit={handleDigit} onBackspace={handleBackspace} onChangeEmail={() => navigateTo('change-email')} onResend={handleResend} />}
              {screen === 'blocked' && <BlockedScreen lastValues={blockedValues} onChangeEmail={() => navigateTo('change-email')} />}
              {screen === 'change-email' && <ChangeEmailScreen email={email} emailFocused={emailFocused} onEmailChange={setEmail} onFocus={() => setEmailFocused(true)} onBlur={() => setEmailFocused(false)} onSubmit={() => { attemptsRef.current = 0; setValues(Array(6).fill('')); setShowError(false); setShowErrorMsg(false); setAttempts(0); setResendSeconds(59); navigateTo('entry', 'back') }} />}
            </div>
            {/* Dim overlay */}
            {overlay && (
              <div style={{
                position: 'absolute', inset: 0, zIndex: 1,
                backgroundColor: 'rgba(0,0,0,0.4)',
                animation: `${overlay.phase === 'enter' ? 'dimIn' : 'dimOut'} 360ms ease forwards`,
              }} />
            )}
            {/* Transitioning screen */}
            {overlay && (
              <div style={{
                position: 'absolute', inset: 0, zIndex: 2,
                display: 'flex', flexDirection: 'column',
                animation: `${overlay.phase === 'enter' ? 'slideUpEnter' : 'slideDownExit'} 360ms cubic-bezier(0.4, 0, 0.2, 1) forwards`,
                pointerEvents: overlay.phase === 'exit' ? 'none' : undefined,
              }}>
                {overlay.screen === 'entry' && <EntryScreen values={values} focusedIndex={focusedIndex === -1 ? undefined : focusedIndex} showError={showError} showErrorMsg={showErrorMsg} shaking={shaking} onShakeEnd={() => { setShaking(false); setShowError(false); setValues(Array(6).fill('')); setShowErrorMsg(true) }} resendSeconds={resendSeconds} onDigit={handleDigit} onBackspace={handleBackspace} onChangeEmail={() => navigateTo('change-email')} onResend={handleResend} />}
                {overlay.screen === 'blocked' && <BlockedScreen lastValues={blockedValues} onChangeEmail={() => navigateTo('change-email')} />}
                {overlay.screen === 'change-email' && <ChangeEmailScreen email={email} emailFocused={emailFocused} onEmailChange={setEmail} onFocus={() => setEmailFocused(true)} onBlur={() => setEmailFocused(false)} onSubmit={() => { attemptsRef.current = 0; setValues(Array(6).fill('')); setShowError(false); setShowErrorMsg(false); setAttempts(0); setResendSeconds(59); navigateTo('entry', 'back') }} />}
              </div>
            )}
          </div>
        </PhoneMock>
        </div>
        {inspect && <InspectPanel screen={screen} />}
        </div>
      </div>
    </>
  )
}
