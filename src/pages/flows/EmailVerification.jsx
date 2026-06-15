import { useState, useEffect, useRef } from 'react'
import OTPInput from '../../components/ds/OTPInput'
import InputField from '../../components/ds/InputField'
import Button from '../../components/ds/Button'
import BilleaseIcon from '../../assets/icons/BilleaseIcon'

// ─── Layout constants ─────────────────────────────────────────────────────────
const SCALE = 0.78
const CONTENT_W = 360
const CONTENT_H = 720

// ─── Phone mockup shell ───────────────────────────────────────────────────────

function PhoneMock({ children }) {
  const innerW = Math.round(CONTENT_W * SCALE)
  const innerH = Math.round(CONTENT_H * SCALE)

  return (
    <div style={{
      width: innerW + 16,
      height: innerH + 16,
      borderRadius: 40,
      border: '8px solid #1D2D40',
      overflow: 'hidden',
      backgroundColor: '#fff',
      boxShadow: '0 32px 80px rgba(0,0,0,0.16), 0 8px 24px rgba(0,0,0,0.08)',
      position: 'relative',
      flexShrink: 0,
    }}>
      {/* Dynamic island */}
      <div style={{
        position: 'absolute',
        top: 9,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 68,
        height: 18,
        backgroundColor: '#1D2D40',
        borderRadius: 12,
        zIndex: 20,
        pointerEvents: 'none',
      }} />

      {/* Scaled viewport */}
      <div style={{ width: innerW, height: innerH, overflow: 'hidden', position: 'relative' }}>
        <div style={{
          width: CONTENT_W,
          height: CONTENT_H,
          transform: `scale(${SCALE})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0,
        }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── Shared screen primitives ─────────────────────────────────────────────────

function StatusBar() {
  return (
    <div style={{
      height: 44,
      backgroundColor: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: 24,
      paddingRight: 24,
      flexShrink: 0,
    }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: '#000', fontFamily: 'var(--font-family)', letterSpacing: '-0.3px' }}>
        9:41
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
          {[6, 9, 12, 15].map((h, i) => (
            <div key={i} style={{ width: 3, height: h, backgroundColor: '#000', borderRadius: 1.5, opacity: i === 3 ? 0.3 : 1 }} />
          ))}
        </div>
        <div style={{ width: 16, height: 9, border: '2px solid #000', borderBottom: 'none', borderRadius: '12px 12px 0 0', marginBottom: -3 }} />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 22, height: 11, border: '1.5px solid #000', borderRadius: 3, padding: '1.5px', boxSizing: 'border-box', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '78%', height: '100%', backgroundColor: '#000', borderRadius: 1 }} />
          </div>
          <div style={{ width: 2, height: 5, backgroundColor: '#000', borderRadius: '0 1px 1px 0', opacity: 0.4 }} />
        </div>
      </div>
    </div>
  )
}

function NavHeader({ title }) {
  return (
    <div style={{
      height: 44,
      backgroundColor: '#fff',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: 20,
      paddingRight: 20,
      position: 'relative',
      flexShrink: 0,
    }}>
      <div style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <BilleaseIcon name="arrow-left" size="md" color="var(--text-base)" />
      </div>
      <span style={{
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 600,
        color: 'var(--text-base)',
        fontFamily: 'var(--font-family)',
        pointerEvents: 'none',
      }}>
        {title}
      </span>
    </div>
  )
}

function ActionBar({ children }) {
  return (
    <div style={{
      padding: '14px 20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      backgroundColor: '#fff',
      borderTop: '1px solid var(--border-subtle)',
      flexShrink: 0,
    }}>
      {children}
    </div>
  )
}

// ─── Screen 1: OTP entry — interactive ───────────────────────────────────────
// Source: Figma canvas "↳ Sign up/Email verification" — entry state

function EntryScreen({ values, onValuesChange, onVerify }) {
  const inputRef = useRef(null)
  const allFilled = values.every(v => v !== '')
  const focusedIndex = values.findIndex(v => v === '')

  useEffect(() => {
    // Small delay so the phone animation settles before focus
    const t = setTimeout(() => inputRef.current?.focus(), 120)
    return () => clearTimeout(t)
  }, [])

  function handleKeyDown(e) {
    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault()
      const idx = values.findIndex(v => v === '')
      if (idx !== -1) {
        const next = [...values]
        next[idx] = e.key
        onValuesChange(next)
      }
    } else if (e.key === 'Backspace') {
      e.preventDefault()
      const next = [...values]
      for (let i = 5; i >= 0; i--) {
        if (next[i] !== '') { next[i] = ''; break }
      }
      onValuesChange(next)
    }
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', height: CONTENT_H, backgroundColor: '#fff', cursor: 'text' }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Hidden input captures real keyboard input */}
      <input
        ref={inputRef}
        type="tel"
        inputMode="numeric"
        value=""
        onChange={() => {}}
        onKeyDown={handleKeyDown}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 1, height: 1, top: -100 }}
      />

      <StatusBar />
      <NavHeader title="Email verification" />

      <div style={{ flex: 1, padding: '32px 20px 16px', display: 'flex', flexDirection: 'column' }}>
        <p style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 400, color: 'var(--text-base)', fontFamily: 'var(--font-family)', lineHeight: 1.5 }}>
          Enter 6-digit code we sent to
        </p>
        <p style={{ margin: '0 0 32px', fontSize: 16, fontWeight: 600, color: 'var(--text-base)', fontFamily: 'var(--font-family)', lineHeight: 1.5 }}>
          test@gmail.com
        </p>

        {/* Use OTPInput component directly — no individual OTPCell */}
        <OTPInput
          type="OTP-email"
          values={values}
          focusedIndex={focusedIndex !== -1 ? focusedIndex : undefined}
        />

        <p style={{ marginTop: 24, fontSize: 14, color: 'var(--text-disabled)', fontFamily: 'var(--font-family)', textAlign: 'center', margin: 'auto 0 0' }}>
          Request a new code in 0:59
        </p>
      </div>

      <ActionBar>
        <Button
          type="primary"
          size="lg"
          state={allFilled ? 'default' : 'disabled'}
          label="Verify"
          platform="android"
          fullWidth
          onClick={allFilled ? onVerify : undefined}
        />
      </ActionBar>
    </div>
  )
}

// ─── Screen 2: Too many incorrect attempts ────────────────────────────────────
// Source: Figma node 37375:82864
// — OTP cells: filled state (component default), NOT error/pink
// — Error text: "Too many incorrect attempts" (14px/400 #f84040)
// — Below OTP: "Request a new code in 15 minutes" (16px/400 #1d2d40)
// — Link: "Wrong email? Change email ›"

function BlockedScreen({ onChangeEmail }) {
  const wrongValues = ['5', '8', '2', '1', '3', '7']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: CONTENT_H, backgroundColor: '#fff' }}>
      <StatusBar />
      <NavHeader title="Email verification" />

      <div style={{ flex: 1, padding: '32px 20px 24px', display: 'flex', flexDirection: 'column' }}>
        <p style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 400, color: 'var(--text-base)', fontFamily: 'var(--font-family)', lineHeight: 1.5 }}>
          Enter 6-digit code we sent to
        </p>
        <p style={{ margin: '0 0 32px', fontSize: 16, fontWeight: 600, color: 'var(--text-base)', fontFamily: 'var(--font-family)', lineHeight: 1.5 }}>
          test@gmail.com
        </p>

        {/* OTPInput with showError — cells stay in filled state, error message shown below */}
        <OTPInput
          type="OTP-email"
          values={wrongValues}
          showError
          errorMessage="Too many incorrect attempts"
        />

        {/* Figma: "Request a new code in 15 minutes" — 16px/400 #1d2d40 */}
        <p style={{ margin: '24px 0 16px', fontSize: 16, fontWeight: 400, color: 'var(--text-base)', fontFamily: 'var(--font-family)', lineHeight: 1.5 }}>
          Request a new code in 15 minutes
        </p>

        {/* Figma: "Wrong email?" + "Change email" link with chevron-down */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-base)', fontFamily: 'var(--font-family)' }}>
            Wrong email?
          </span>
          <button
            onClick={onChangeEmail}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--text-base)',
              fontFamily: 'var(--font-family)',
            }}
          >
            Change email
            <BilleaseIcon name="chevron-down" size="xs" color="var(--text-base)" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Screen 3: Change email ───────────────────────────────────────────────────
// Source: Figma node 37375:82458
// — Title: "Change email"
// — Description: "Enter a different email address to receive a new verification code"
// — InputField: size=md, state=focused, placeholder="Enter new email"
// — Button: "Get verification code" primary

function ChangeEmailScreen({ email, onEmailChange }) {
  const [focused, setFocused] = useState(true)
  const inputState = focused
    ? (email ? 'typing' : 'focused')
    : (email ? 'filled' : 'default')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: CONTENT_H, backgroundColor: '#fff' }}>
      <StatusBar />
      <NavHeader title="Change email" />

      <div style={{ flex: 1, padding: '32px 20px 16px', display: 'flex', flexDirection: 'column' }}>
        {/* Figma: "Enter a different email address to receive a new verification code" */}
        <p style={{ margin: '0 0 24px', fontSize: 16, fontWeight: 400, color: 'var(--text-base)', fontFamily: 'var(--font-family)', lineHeight: 1.6 }}>
          Enter a different email address to receive a new verification code
        </p>

        {/* Use InputField component — size=md matches Figma "Input-field/md/focused" */}
        <InputField
          variant="text"
          size="md"
          state={inputState}
          label="Email address"
          placeholder="Enter new email"
          showLabel
          showOptional={false}
          showIcon={false}
          value={email}
          onChange={onEmailChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>

      <ActionBar>
        {/* Figma: "Get verification code" primary button */}
        <Button
          type="primary"
          size="lg"
          state="default"
          label="Get verification code"
          platform="android"
          fullWidth
        />
      </ActionBar>
    </div>
  )
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepDots({ current, total }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 24 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 20 : 8,
            height: 8,
            borderRadius: 9999,
            backgroundColor: i === current ? '#1D2D40' : '#D1D5DB',
            transition: 'all 0.2s ease',
          }}
        />
      ))}
    </div>
  )
}

// ─── Scenario export ──────────────────────────────────────────────────────────

export default function TooManyOTPAttempts() {
  const [screen, setScreen] = useState('entry')
  const [otpValues, setOtpValues] = useState(Array(6).fill(''))
  const [email, setEmail] = useState('')

  const screens = ['entry', 'blocked', 'change-email']
  const screenIndex = screens.indexOf(screen)

  return (
    <div style={{ fontFamily: 'var(--font-family)' }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '3px 10px',
          borderRadius: 9999,
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-subtle)',
          fontSize: 12,
          fontWeight: 500,
          color: 'var(--text-subtle)',
        }}>
          Email Verification
        </span>
        <BilleaseIcon name="chevron-right" size="xs" color="var(--text-disabled)" />
        <span style={{ fontSize: 13, color: 'var(--text-subtle)' }}>
          Too many wrong OTP attempts
        </span>
      </div>

      <h1 style={{ margin: '0 0 12px', fontSize: 32, fontWeight: 700, color: 'var(--text-base)', lineHeight: 1.2 }}>
        Too many wrong OTP attempts
      </h1>
      <p style={{ margin: '0 0 40px', fontSize: 15, color: 'var(--text-subtle)', lineHeight: 1.6, maxWidth: 520 }}>
        Type a 6-digit code and tap Verify to walk through the flow. Each screen is interactive.
      </p>

      {/* Canvas */}
      <div style={{
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)',
      }}>
        {/* Canvas toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          backgroundColor: '#fff',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Interactive prototype
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-disabled)', fontFamily: 'monospace' }}>
              {screenIndex + 1} / {screens.length}
            </span>
          </div>
          <button
            onClick={() => { setScreen('entry'); setOtpValues(Array(6).fill('')); setEmail('') }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 6,
              border: '1px solid var(--border-subtle)',
              background: 'none',
              cursor: 'pointer',
              fontSize: 12,
              fontFamily: 'var(--font-family)',
              color: 'var(--text-subtle)',
            }}
          >
            <BilleaseIcon name="retry" size="xs" color="var(--text-subtle)" />
            Restart
          </button>
        </div>

        {/* Canvas body */}
        <div style={{
          backgroundColor: '#F2F3F5',
          backgroundImage: `
            linear-gradient(45deg, #e8e9eb 25%, transparent 25%),
            linear-gradient(-45deg, #e8e9eb 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #e8e9eb 75%),
            linear-gradient(-45deg, transparent 75%, #e8e9eb 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0',
          padding: '56px 40px 48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <PhoneMock>
            {screen === 'entry' && (
              <EntryScreen
                values={otpValues}
                onValuesChange={setOtpValues}
                onVerify={() => setScreen('blocked')}
              />
            )}
            {screen === 'blocked' && (
              <BlockedScreen
                onChangeEmail={() => setScreen('change-email')}
              />
            )}
            {screen === 'change-email' && (
              <ChangeEmailScreen
                email={email}
                onEmailChange={setEmail}
              />
            )}
          </PhoneMock>

          <StepDots current={screenIndex} total={screens.length} />
        </div>
      </div>

      <div style={{ height: 48 }} />
    </div>
  )
}
