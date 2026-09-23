import { useState, useEffect, useRef } from 'react'
import OTPInput from '../../components/ds/OTPInput'
import InputField from '../../components/ds/InputField'
import Button from '../../components/ds/Button'
import Link from '../../components/ds/Link'
import NavHeader from '../../components/ds/NavHeader'
import Alert from '../../components/ds/Alert'
import { CheckboxParagraph } from '../../components/ds/Checkbox'
import BilleaseIcon from '../../assets/icons/BilleaseIcon'
import billyHero from '../../assets/illustrations/billy-hero-happy.png'
import { StatusBar, AndroidKeyboard, AndroidQWERTY, PhoneMock, TOOLBAR_H, FRAME_W, FRAME_H } from './PhoneMockShared'

// Figma: sMW3MOYkTVNijuFMZ0XVBm (branch y299MX8Y964DPhMkar7GLq), row "Sign up" + "Verify mobile" at y=-5162

// ── Constants ─────────────────────────────────────────────────────────────────
const INSPECT_W    = 264
const COUNTDOWN    = 30
const TICK_MS      = 1000 / 3   // countdown runs 3x faster than real time
const MAX_RETRIES  = 2          // 2nd "Call me again" / "Use Viber" tap lands on the blocked screen
const SIGNUP_MS    = 900        // Sign up button loading state
const CODE_LEN     = 4
const DEMO_NUMBER  = '912 345 6789'

const bodyText = {
  margin: 0,
  fontFamily: 'var(--ds-font-family)',
  fontSize: 'var(--text-lg)',
  fontWeight: 400,
  lineHeight: 1.5,
  color: 'var(--text-base)',
  textAlign: 'center',
}
const smallText = { ...bodyText, fontSize: 'var(--text-md)' }

function formatPhone(digits) {
  return [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 10)].filter(Boolean).join(' ')
}

function fieldState(focused, value) {
  if (focused) return value ? 'typing' : 'focused'
  return value ? 'filled' : 'default'
}

// ── "Already have account? Login" row ─────────────────────────────────────────
function LoginRow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-100)' }}>
      <span style={{ ...smallText, color: 'var(--text-subtle)' }}>Already have account?</span>
      <Link label="Login" size="sm" state="default" showIcon={false} />
    </div>
  )
}

// ── Sign up screen ────────────────────────────────────────────────────────────
function SignUpScreen({ phone, email, consent, field, signingUp, setPhone, setEmail, setConsent, setField, onSignUp, onBack }) {
  const wrapRef = useRef(null)

  // Keep the native input focused so the cursor blinks while its keyboard is up
  useEffect(() => {
    if (!field) return
    const inputs = wrapRef.current?.querySelectorAll('input')
    inputs?.[field === 'phone' ? 0 : 1]?.focus()
  }, [field])

  const showPhoneFormat = field === 'phone' || phone.length > 0
  const keepFocus = e => { if (field) e.preventDefault() }

  return (
    <div ref={wrapRef} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />
      <NavHeader type="help" title="Let’s get started" showBorder={false} showWatermark={false} onBack={onBack} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-600)', padding: 'var(--space-600) var(--space-500) 0', overflow: 'hidden' }}>
        {!field && (
          <img src={billyHero} alt="" style={{ width: 170, height: 170, flexShrink: 0 }} />
        )}
        <InputField
          variant={showPhoneFormat ? 'phone' : 'text'}
          size="md"
          state={fieldState(field === 'phone', phone)}
          showLabel={false}
          showIcon={false}
          placeholder="Mobile"
          phonePlaceholder="XXX XXX XXXX"
          value={formatPhone(phone)}
          onChange={v => setPhone(v.replace(/\D/g, '').slice(0, 10))}
          onFocus={() => setField('phone')}
        />
        <InputField
          variant="text"
          size="md"
          state={fieldState(field === 'email', email)}
          showLabel={false}
          showIcon={false}
          placeholder="Email"
          value={email}
          onChange={setEmail}
          onFocus={() => setField('email')}
        />
        <div onMouseDown={keepFocus} style={{ width: '100%' }}>
          <CheckboxParagraph
            state={consent ? 'checked' : 'default'}
            onChange={setConsent}
            text={<>
              I have read and consented to the processing of my personal data, including any personal and sensitive personal information, in accordance with Billease’s{' '}
              <span style={{ fontWeight: 600, textDecoration: 'underline' }}>Privacy Policy</span>
              <span style={{ fontWeight: 600 }}> / </span>
              <span style={{ fontWeight: 600, textDecoration: 'underline' }}>Terms &amp; Conditions.</span>
            </>}
          />
        </div>
      </div>

      <div onMouseDown={keepFocus} style={{ padding: 'var(--space-300) var(--space-500) var(--space-500)', flexShrink: 0 }}>
        <Button type="primary" size="lg" state={signingUp ? 'loading' : 'default'} label="Sign up" fullWidth onClick={onSignUp} />
      </div>

      {field === 'phone' && (
        <AndroidKeyboard
          onDigit={d => setPhone(p => (p + d).slice(0, 10))}
          onBackspace={() => setPhone(p => p.slice(0, -1))}
        />
      )}
      {field === 'email' && (
        <AndroidQWERTY
          onChar={c => setEmail(e => e + c)}
          onBackspace={() => setEmail(e => e.slice(0, -1))}
        />
      )}
    </div>
  )
}

// ── Verify mobile screen (call + Viber) ───────────────────────────────────────
function VerifyMobileScreen({ channel, number, values, timer, error, onDigit, onBackspace, onRetry, onChangeNumber, onBack }) {
  const expired = timer === 0
  const isCall  = channel === 'call'
  const focused = values.findIndex(v => v === '')

  const heading = isCall
    ? (expired ? ['We called your number'] : ['Billease is calling you now.', 'Answer the call to hear your 4-digit code'])
    : ['We sent the code on Viber.', 'Look in your Business Inbox in Viber']
  const countdown = isCall
    ? ['Didn’t get the call?', `Request another one or use Viber in ${timer}s`]
    : ['Didn’t get the code?', `Request another Viber message or call in ${timer}s`]

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />
      <NavHeader type="icon-left" title="Mobile verification" showBorder={false} showWatermark={false} onBack={onBack} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-700)', padding: 'var(--space-600) var(--space-500) 0', overflow: 'hidden' }}>
        {/* Top section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-300)', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-100)' }}>
            <p style={bodyText}>{heading.map((l, i) => <span key={i} style={{ display: 'block' }}>{l}</span>)}</p>
            <p style={{ ...bodyText, fontWeight: 600 }}>+63 {number}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-100)' }}>
            <span style={smallText}>Wrong number?</span>
            <Link label="Change mobile number" size="sm" state="default" showIcon={false} onClick={onChangeNumber} />
          </div>
        </div>

        {/* OTP + countdown */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-600)' }}>
          <OTPInput
            type="OTP-mobile"
            values={values}
            focusedIndex={focused === -1 ? undefined : focused}
            showError={error}
            errorMessage="Incorrect code. Try again."
          />
          {!expired && (
            <p style={bodyText}>{countdown.map((l, i) => <span key={i} style={{ display: 'block' }}>{l}</span>)}</p>
          )}
        </div>
      </div>

      {expired && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-300)', padding: 'var(--space-300) var(--space-500) var(--space-500)', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 'var(--space-400)' }}>
            <div style={{ flex: 1, display: 'flex' }}>
              <Button type="secondary" size="lg" state="default" label="Call me again" fullWidth onClick={() => onRetry('call')} />
            </div>
            <div style={{ flex: 1, display: 'flex' }}>
              <Button type="secondary" size="lg" state="default" label="Use Viber" fullWidth onClick={() => onRetry('viber')} />
            </div>
          </div>
          <LoginRow />
        </div>
      )}

      <AndroidKeyboard onDigit={onDigit} onBackspace={onBackspace} />
    </div>
  )
}

// ── Blocked screen: we couldn't verify the number ─────────────────────────────
function BlockedScreen({ number, onChangeNumber, onBack }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />
      <NavHeader type="help" title="Mobile verification" showBorder={false} onBack={onBack} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-700)', padding: 'var(--space-600) var(--space-500) 0', overflow: 'hidden' }}>
        <div style={{ width: '100%' }}>
          <Alert type="warning" message="We’re having trouble delivering emails to this address. Verify your email or try a different one." />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-100)' }}>
          <p style={bodyText}>We called your number</p>
          <p style={{ ...bodyText, fontWeight: 600 }}>+63 {number}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-600)' }}>
          <OTPInput type="OTP-mobile" values={[]} disabled />
          <p style={bodyText}>Request a new code in 30 minutes</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-300)', padding: 'var(--space-300) var(--space-500) var(--space-500)', flexShrink: 0 }}>
        <Button type="primary" size="lg" state="default" label="Change mobile number" fullWidth onClick={onChangeNumber} />
        <LoginRow />
      </div>
    </div>
  )
}

// ── Inspect panel ─────────────────────────────────────────────────────────────
const ALL_COMPS = {
  NavHeader:         { urlId: '50_3459',   desc: 'Top navigation bar with back arrow and title',    category: 'Navigation' },
  InputField:        { urlId: '109_1161',  desc: 'Mobile (+63) and email text inputs',              category: 'Input'      },
  CheckboxParagraph: { urlId: '183_2213',  desc: 'Personal data consent checkbox',                  category: 'Checkbox'   },
  OTPInput:          { urlId: '188_2882',  desc: '4-cell mobile verification code input',           category: 'Input'      },
  Link:              { urlId: '190_3261',  desc: 'Inline text link (Change mobile number, Login)',  category: 'Action'     },
  Button:            { urlId: '16_182',    desc: 'Sign up, Call me again, Use Viber actions',       category: 'Action'     },
  Alert:             { urlId: '228_11126', desc: 'Warning alert on the blocked screen',             category: 'Feedback'   },
}
const SCREEN_COMPS = {
  signup:  ['NavHeader', 'InputField', 'CheckboxParagraph', 'Button'],
  call:    ['NavHeader', 'OTPInput', 'Link', 'Button'],
  viber:   ['NavHeader', 'OTPInput', 'Link', 'Button'],
  blocked: ['NavHeader', 'Alert', 'OTPInput', 'Button', 'Link'],
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
const SCREEN_LABELS = { signup: 'Sign up', call: 'Verify via call', viber: 'Verify via Viber', blocked: 'Could not verify' }
const emptyCode = () => Array(CODE_LEN).fill('')

export default function MobileVerification() {
  const [history, setHistory]     = useState(['signup'])
  const [overlay, setOverlay]     = useState(null) // { screen, phase: 'enter'|'exit' }
  const [baseAnim, setBaseAnim]   = useState(false)
  const [phone, setPhone]         = useState('')
  const [email, setEmail]         = useState('')
  const [consent, setConsent]     = useState(false)
  const [field, setField]         = useState(null) // 'phone' | 'email' | null
  const [signingUp, setSigningUp] = useState(false)
  const [values, setValues]       = useState(emptyCode)
  const [error, setError]         = useState(false)
  const [timer, setTimer]         = useState(COUNTDOWN)
  const [retries, setRetries]     = useState(0)
  const [scale, setScale]         = useState(0.7)
  const [inspect, setInspect]     = useState(false)

  const containerRef = useRef(null)
  const inspectRef   = useRef(false)
  const timeouts     = useRef([])

  const screen = history[history.length - 1]
  const number = phone ? formatPhone(phone) : DEMO_NUMBER

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

  // Countdown on the call / Viber screens
  useEffect(() => {
    if ((screen !== 'call' && screen !== 'viber') || timer <= 0) return
    const t = setTimeout(() => setTimer(s => s - 1), TICK_MS)
    return () => clearTimeout(t)
  }, [timer, screen])

  useEffect(() => () => timeouts.current.forEach(clearTimeout), [])

  function later(fn, ms) { timeouts.current.push(setTimeout(fn, ms)) }

  function resetCode() {
    setValues(emptyCode())
    setError(false)
    setTimer(COUNTDOWN)
  }

  function navigateTo(next, dir = 'forward', nextHistory) {
    if (dir === 'forward') {
      setBaseAnim(true)
      setOverlay({ screen: next, phase: 'enter' })
      later(() => {
        setHistory(nextHistory ?? (h => [...h, next]))
        setOverlay(null); setBaseAnim(false)
      }, 320)
    } else {
      setHistory(nextHistory ?? (h => h.slice(0, -1)))
      setOverlay({ screen, phase: 'exit' })
      later(() => setOverlay(null), 320)
    }
  }

  function goBack() {
    if (history.length > 1) navigateTo(history[history.length - 2], 'back')
  }

  function handleSignUp() {
    if (signingUp) return
    setSigningUp(true)
    later(() => {
      setSigningUp(false)
      setField(null)
      resetCode()
      navigateTo('call')
    }, SIGNUP_MS)
  }

  function handleRetry(channel) {
    const next = retries + 1
    setRetries(next)
    if (next >= MAX_RETRIES) { navigateTo('blocked'); return }
    resetCode()
    if (channel !== screen) navigateTo(channel)
  }

  function handleChangeNumber() {
    setRetries(0)
    resetCode()
    setField('phone')
    navigateTo('signup', 'back', ['signup'])
  }

  function handleDigit(d) {
    if (values.every(Boolean)) return
    const next = [...values]
    next[next.indexOf('')] = d
    setValues(next)
    // Viber code is always rejected in this prototype; the countdown ends so the retry options show
    if (screen === 'viber' && next.every(Boolean)) { setError(true); setTimer(0) }
  }

  function handleBackspace() {
    const last = values.map(Boolean).lastIndexOf(true)
    if (last === -1) return
    const next = [...values]; next[last] = ''
    setValues(next)
    setError(false)
  }

  function handleRestart() {
    timeouts.current.forEach(clearTimeout)
    timeouts.current = []
    setBaseAnim(false)
    setOverlay(screen === 'signup' ? null : { screen, phase: 'exit' })
    if (screen !== 'signup') later(() => setOverlay(null), 320)
    setHistory(['signup'])
    setPhone(''); setEmail(''); setConsent(false); setField(null); setSigningUp(false)
    setRetries(0); resetCode()
  }

  function renderScreen(name) {
    if (name === 'signup') {
      return (
        <SignUpScreen
          phone={phone} email={email} consent={consent} field={field} signingUp={signingUp}
          setPhone={setPhone} setEmail={setEmail} setConsent={setConsent} setField={setField}
          onSignUp={handleSignUp} onBack={handleRestart}
        />
      )
    }
    if (name === 'blocked') {
      return <BlockedScreen number={number} onChangeNumber={handleChangeNumber} onBack={goBack} />
    }
    return (
      <VerifyMobileScreen
        channel={name} number={number} values={values} timer={timer} error={error}
        onDigit={handleDigit} onBackspace={handleBackspace} onRetry={handleRetry}
        onChangeNumber={handleChangeNumber} onBack={goBack}
      />
    )
  }

  return (
    <>
    <style>{`
      @keyframes slideInFromRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
      @keyframes slideOutToRight  { from { transform: translateX(0); } to { transform: translateX(100%); } }
      @keyframes pushLeft         { from { transform: translateX(0); } to { transform: translateX(-40px); } }
      @keyframes dimIn            { from { opacity: 0; } to { opacity: 0.3; } }
      @keyframes dimOut           { from { opacity: 0.3; } to { opacity: 0; } }
    `}</style>
    <div ref={containerRef} style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#fff', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{ height: TOOLBAR_H, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, borderBottom: '1px solid var(--border-subtle)', paddingLeft: 24, paddingRight: 24 }}>
        <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-family)', color: 'var(--text-base)' }}>
          {inspect ? 'Inspect mode' : 'Interactive prototype'}
        </span>
        {!inspect && (
          <span style={{ fontSize: 12, fontFamily: 'var(--font-family)', color: 'var(--text-subtle)' }}>
            {SCREEN_LABELS[screen]} · {retries}/{MAX_RETRIES} retries used
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
            <div style={{ position: 'relative', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', pointerEvents: inspect ? 'none' : undefined }}>
              {/* Base (settled) screen */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', animation: baseAnim ? 'pushLeft 320ms cubic-bezier(0.4, 0, 0.2, 1) forwards' : undefined }}>
                {renderScreen(screen)}
              </div>
              {/* Dim overlay */}
              {overlay && (
                <div style={{
                  position: 'absolute', inset: 0, zIndex: 1,
                  backgroundColor: '#000',
                  animation: `${overlay.phase === 'enter' ? 'dimIn' : 'dimOut'} 320ms ease forwards`,
                }} />
              )}
              {/* Transitioning screen */}
              {overlay && (
                <div style={{
                  position: 'absolute', inset: 0, zIndex: 2,
                  display: 'flex', flexDirection: 'column',
                  animation: `${overlay.phase === 'enter' ? 'slideInFromRight' : 'slideOutToRight'} 320ms cubic-bezier(0.4, 0, 0.2, 1) forwards`,
                  pointerEvents: overlay.phase === 'exit' ? 'none' : undefined,
                }}>
                  {renderScreen(overlay.screen)}
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
