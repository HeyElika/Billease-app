import { OTPCell } from '../../components/ds/OTPInput'
import InputField from '../../components/ds/InputField'
import Button from '../../components/ds/Button'
import BilleaseIcon from '../../assets/icons/BilleaseIcon'

// ─── Layout constants ─────────────────────────────────────────────────────────
const SCALE = 0.74
const CONTENT_W = 360
const CONTENT_H = 720

// ─── Phone mockup shell ───────────────────────────────────────────────────────

function PhoneMock({ children, label, step }) {
  const innerW = Math.round(CONTENT_W * SCALE)
  const innerH = Math.round(CONTENT_H * SCALE)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, flexShrink: 0 }}>
      <div style={{
        width: innerW + 16,
        height: innerH + 16,
        borderRadius: 40,
        border: '8px solid #1D2D40',
        overflow: 'hidden',
        backgroundColor: '#fff',
        boxShadow: '0 24px 56px rgba(0,0,0,0.13), 0 4px 16px rgba(0,0,0,0.08)',
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
        }} />
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

      <div style={{ textAlign: 'center', maxWidth: innerW + 16 }}>
        <div style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.8px',
          textTransform: 'uppercase',
          color: 'var(--text-disabled)',
          fontFamily: 'var(--font-family)',
          marginBottom: 6,
        }}>
          Step {String(step).padStart(2, '0')}
        </div>
        <div style={{
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--text-base)',
          fontFamily: 'var(--font-family)',
          lineHeight: 1.4,
        }}>
          {label}
        </div>
      </div>
    </div>
  )
}

// ─── Screen primitives ────────────────────────────────────────────────────────

function StatusBar({ bg = '#fff' }) {
  return (
    <div style={{
      height: 44,
      backgroundColor: bg,
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        {/* Signal bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
          {[6, 9, 12, 15].map((h, i) => (
            <div key={i} style={{ width: 3, height: h, backgroundColor: '#000', borderRadius: 1.5, opacity: i === 3 ? 0.3 : 1 }} />
          ))}
        </div>
        {/* WiFi arc */}
        <div style={{ width: 16, height: 9, border: '2px solid #000', borderBottom: 'none', borderRadius: '12px 12px 0 0', marginBottom: -3 }} />
        {/* Battery */}
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

// ─── Flow arrow connector ─────────────────────────────────────────────────────

function FlowArrow({ label }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: 80,
      paddingBottom: 90,
      flexShrink: 0,
      gap: 10,
    }}>
      <span style={{
        fontSize: 11,
        color: 'var(--text-subtle)',
        textAlign: 'center',
        fontFamily: 'var(--font-family)',
        lineHeight: 1.5,
        maxWidth: 68,
      }}>
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ width: 36, height: 1.5, backgroundColor: 'var(--border-default)' }} />
        <div style={{
          width: 0,
          height: 0,
          borderTop: '5px solid transparent',
          borderBottom: '5px solid transparent',
          borderLeft: '7px solid var(--border-default)',
        }} />
      </div>
    </div>
  )
}

// ─── Screen 1: Code sent — awaiting entry ─────────────────────────────────────

function Screen1() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: CONTENT_H, backgroundColor: '#fff' }}>
      <StatusBar />
      <NavHeader title="Verify your email" />

      <div style={{ flex: 1, padding: '32px 20px 16px', display: 'flex', flexDirection: 'column' }}>
        <p style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 400, color: 'var(--text-subtle)', fontFamily: 'var(--font-family)', lineHeight: 1.5 }}>
          Enter the 6-digit code sent to
        </p>
        <p style={{ margin: '0 0 32px', fontSize: 16, fontWeight: 600, color: 'var(--text-base)', fontFamily: 'var(--font-family)', lineHeight: 1.5 }}>
          j***@gmail.com
        </p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <OTPCell key={i} state={i === 0 ? 'focused' : 'default'} value="" />
          ))}
        </div>

        <div style={{ marginTop: 'auto', textAlign: 'center' }}>
          <span style={{ fontSize: 14, color: 'var(--text-disabled)', fontFamily: 'var(--font-family)' }}>
            Didn't receive the code?{' '}
          </span>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-disabled)', fontFamily: 'var(--font-family)' }}>
            Resend (0:59)
          </span>
        </div>
      </div>

      <ActionBar>
        <Button type="primary" size="lg" state="disabled" label="Verify" platform="android" fullWidth />
      </ActionBar>
    </div>
  )
}

// ─── Screen 2: Wrong code entered — 2 attempts remaining ─────────────────────

function Screen2() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: CONTENT_H, backgroundColor: '#fff' }}>
      <StatusBar />
      <NavHeader title="Verify your email" />

      <div style={{ flex: 1, padding: '32px 20px 16px', display: 'flex', flexDirection: 'column' }}>
        <p style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 400, color: 'var(--text-subtle)', fontFamily: 'var(--font-family)', lineHeight: 1.5 }}>
          Enter the 6-digit code sent to
        </p>
        <p style={{ margin: '0 0 32px', fontSize: 16, fontWeight: 600, color: 'var(--text-base)', fontFamily: 'var(--font-family)', lineHeight: 1.5 }}>
          j***@gmail.com
        </p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {['5', '8', '2', '1', '3', '7'].map((v, i) => (
            <OTPCell key={i} state="error" value={v} />
          ))}
        </div>

        <p style={{ margin: '0 0 24px', fontSize: 14, color: 'var(--text-primary)', fontFamily: 'var(--font-family)', lineHeight: 1.5 }}>
          The code is incorrect. 2 attempts remaining.
        </p>

        <div style={{ marginTop: 'auto', textAlign: 'center' }}>
          <span style={{ fontSize: 14, color: 'var(--text-disabled)', fontFamily: 'var(--font-family)' }}>
            Didn't receive the code?{' '}
          </span>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-disabled)', fontFamily: 'var(--font-family)' }}>
            Resend (0:32)
          </span>
        </div>
      </div>

      <ActionBar>
        <Button type="primary" size="lg" state="default" label="Verify" platform="android" fullWidth />
      </ActionBar>
    </div>
  )
}

// ─── Screen 3: Too many wrong attempts — account locked ───────────────────────

function Screen3() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: CONTENT_H, backgroundColor: '#fff' }}>
      <StatusBar />
      <NavHeader title="Verify your email" />

      {/* Error banner */}
      <div style={{
        margin: '12px 20px 0',
        padding: '12px 16px',
        backgroundColor: 'var(--bg-error-subtle)',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexShrink: 0,
      }}>
        <BilleaseIcon name="alert" size="sm" color="var(--text-primary)" />
        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', fontFamily: 'var(--font-family)' }}>
          Too many wrong attempts
        </span>
      </div>

      <div style={{ flex: 1, padding: '24px 20px 16px', display: 'flex', flexDirection: 'column' }}>
        <p style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 400, color: 'var(--text-subtle)', fontFamily: 'var(--font-family)', lineHeight: 1.5 }}>
          Enter the 6-digit code sent to
        </p>
        <p style={{ margin: '0 0 24px', fontSize: 16, fontWeight: 600, color: 'var(--text-base)', fontFamily: 'var(--font-family)', lineHeight: 1.5 }}>
          j***@gmail.com
        </p>

        {/* OTP cells — masked-error (blocked/locked) */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <OTPCell key={i} state="masked-error" value="" />
          ))}
        </div>

        <p style={{ margin: '0 0 20px', fontSize: 14, color: 'var(--text-primary)', fontFamily: 'var(--font-family)', lineHeight: 1.5 }}>
          Access blocked. You can try again in:
        </p>

        {/* Countdown */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px 0',
          marginBottom: 20,
        }}>
          <span style={{
            fontSize: 52,
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-family)',
            letterSpacing: '-2px',
            lineHeight: 1,
          }}>
            04:59
          </span>
        </div>

        <div style={{ marginTop: 'auto', textAlign: 'center' }}>
          <span style={{ fontSize: 14, color: 'var(--text-subtle)', fontFamily: 'var(--font-family)' }}>
            or{' '}
          </span>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--bg-secondary)', fontFamily: 'var(--font-family)', cursor: 'pointer' }}>
            change email address
          </span>
        </div>
      </div>

      <ActionBar>
        <Button type="secondary" size="lg" state="default" label="Change email address" platform="android" fullWidth />
        <Button type="primary" size="lg" state="disabled" label="Verify" platform="android" fullWidth />
      </ActionBar>
    </div>
  )
}

// ─── Screen 4: Change email — recovery ────────────────────────────────────────

function Screen4() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: CONTENT_H, backgroundColor: '#fff' }}>
      <StatusBar />
      <NavHeader title="Change email" />

      <div style={{ flex: 1, padding: '32px 20px 16px', display: 'flex', flexDirection: 'column' }}>
        <p style={{ margin: '0 0 28px', fontSize: 16, fontWeight: 400, color: 'var(--text-subtle)', fontFamily: 'var(--font-family)', lineHeight: 1.6 }}>
          Enter a different email address to receive a new verification code
        </p>

        <InputField
          variant="text"
          size="lg"
          state="focused"
          label="New email address"
          placeholder="Enter new email"
          showLabel
          showOptional={false}
          showIcon={false}
        />
      </div>

      <ActionBar>
        <Button type="primary" size="lg" state="default" label="Get verification code" platform="android" fullWidth />
      </ActionBar>
    </div>
  )
}

// ─── Scenario export ──────────────────────────────────────────────────────────

export default function TooManyOTPAttempts() {
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
          fontFamily: 'var(--font-family)',
        }}>
          Email Verification
        </span>
        <BilleaseIcon name="chevron-right" size="xs" color="var(--text-disabled)" />
        <span style={{ fontSize: 13, color: 'var(--text-subtle)', fontFamily: 'var(--font-family)' }}>
          Too many wrong OTP attempts
        </span>
      </div>

      <h1 style={{ margin: '0 0 12px', fontSize: 32, fontWeight: 700, color: 'var(--text-base)', lineHeight: 1.2 }}>
        Too many wrong OTP attempts
      </h1>
      <p style={{ margin: '0 0 40px', fontSize: 15, color: 'var(--text-subtle)', lineHeight: 1.6, maxWidth: 560 }}>
        What happens when a user fails email verification too many times — entry screen, per-attempt error, lockout state with countdown, and the recovery flow.
      </p>

      {/* Canvas */}
      <div style={{
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)',
      }}>
        {/* Canvas header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          backgroundColor: '#fff',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'var(--font-family)' }}>
            Prototype canvas · 4 screens
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#F84040' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#FBBF24' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#13BD85' }} />
          </div>
        </div>

        {/* Scrollable canvas area */}
        <div style={{
          overflowX: 'auto',
          backgroundColor: '#F2F3F5',
          backgroundImage: `
            linear-gradient(45deg, #e8e9eb 25%, transparent 25%),
            linear-gradient(-45deg, #e8e9eb 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #e8e9eb 75%),
            linear-gradient(-45deg, transparent 75%, #e8e9eb 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0',
          padding: '48px 40px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', width: 'max-content' }}>

            <PhoneMock step={1} label="Code sent — awaiting entry">
              <Screen1 />
            </PhoneMock>

            <FlowArrow label="Wrong code entered" />

            <PhoneMock step={2} label="Wrong OTP — 2 attempts left">
              <Screen2 />
            </PhoneMock>

            <FlowArrow label="Wrong again — limit reached" />

            <PhoneMock step={3} label="Blocked — 5 min lockout">
              <Screen3 />
            </PhoneMock>

            <FlowArrow label="Taps 'Change email address'" />

            <PhoneMock step={4} label="Recovery — enter new email">
              <Screen4 />
            </PhoneMock>

          </div>
        </div>
      </div>

      <div style={{ height: 48 }} />
    </div>
  )
}
