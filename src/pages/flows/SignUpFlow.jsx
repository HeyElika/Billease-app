import { useState, useEffect, useRef } from 'react'
import OTPInput from '../../components/ds/OTPInput'
import InputField from '../../components/ds/InputField'
import Button from '../../components/ds/Button'
import Link from '../../components/ds/Link'
import NavHeader from '../../components/ds/NavHeader'
import Alert from '../../components/ds/Alert'
import { ScreenBanner } from '../../components/ds/Toast'
import BilleaseIcon from '../../assets/icons/BilleaseIcon'

// ── Figma source: sMW3MOYkTVNijuFMZ0XVBm, node 37375:82422
// ── Phone dimensions match EmailVerification.jsx
const CW = 390
const CH = 820
const P9_BORDER = 10
const P9_OUTER_R = 40
const P9_INNER_R = 30
const TOOLBAR_H = 44
const FRAME_H = CH + P9_BORDER * 2
const FRAME_W = CW + P9_BORDER * 2
const INSPECT_W = 264

// ── Android status bar ──────────────────────────────────────────────────────
function StatusBar() {
  return (
    <div style={{
      height: 42, backgroundColor: '#fff', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      paddingLeft: 20, paddingRight: 16,
    }}>
      <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-family)', color: '#1D2D40' }}>
        5:13
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
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

// ── Android nav bar ─────────────────────────────────────────────────────────
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

// ── Numeric keyboard (phone dialer, 3 col × 4 row) ──────────────────────────
const KEYPAD_ROWS = [['1','2','3'],['4','5','6'],['7','8','9'],['__back','0','__done']]
const SUB = {'2':'ABC','3':'DEF','4':'GHI','5':'JKL','6':'MNO','7':'PQRS','8':'TUV','9':'WXYZ','0':'+'}
const KEY_H = 56

function AndroidNumericKeyboard({ onDigit, onBackspace }) {
  function Key({ k }) {
    if (k === '__back') return (
      <button onClick={onBackspace} style={{
        flex:1, height:KEY_H, background:'#D1D3DA', border:'none', cursor:'pointer',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <svg width="24" height="18" viewBox="0 0 28 20" fill="none">
          <path d="M10.5 2L2 10l8.5 8H26V2H10.5z" stroke="#1D2D40" strokeWidth="1.8" strokeLinejoin="round"/>
          <path d="M15 7l6 6M21 7l-6 6" stroke="#1D2D40" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </button>
    )
    if (k === '__done') return (
      <button style={{
        flex:1, height:KEY_H, background:'#D1D3DA', border:'none', cursor:'default',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <svg width="20" height="16" viewBox="0 0 22 18" fill="none">
          <path d="M2 9l6 7L20 2" stroke="#1D2D40" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    )
    return (
      <button onClick={() => onDigit(k)} style={{
        flex:1, height:KEY_H, background:'#FAFAFA', border:'none', cursor:'pointer',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:1,
      }}>
        <span style={{ fontSize:28, fontWeight:300, color:'#1D2D40', lineHeight:'32px', fontFamily:'var(--font-family)' }}>{k}</span>
        {SUB[k] && <span style={{ fontSize:9, color:'#606C79', letterSpacing:'1.8px', fontFamily:'var(--font-family)' }}>{SUB[k]}</span>}
      </button>
    )
  }
  return (
    <div style={{ flexShrink:0 }}>
      <div style={{ backgroundColor:'#C8CAD0', display:'flex', flexDirection:'column', gap:1 }}>
        {KEYPAD_ROWS.map((row,ri) => (
          <div key={ri} style={{ display:'flex', gap:1 }}>
            {row.map(k => <Key key={k} k={k} />)}
          </div>
        ))}
      </div>
      <AndroidNavBar />
    </div>
  )
}

// ── QWERTY keyboard (GBoard style) ──────────────────────────────────────────
const Q_ROW1 = ['q','w','e','r','t','y','u','i','o','p']
const Q_ROW2 = ['a','s','d','f','g','h','j','k','l']
const Q_ROW3 = ['__shift','z','x','c','v','b','n','m','__back']
const Q_ROW4 = ['__123','__space','__return']

function AndroidQwertyKeyboard({ onKey, onBackspace, onDone }) {
  const [caps, setCaps] = useState(false)
  const S = '#B9BCC5'  // special key bg
  const W = '#FFFFFF'  // char key bg
  const KB = '#D0D3DC' // keyboard bg

  function Key({ k }) {
    if (k === '__back') return (
      <button onClick={onBackspace} style={{
        flex:1.5, height:46, background:S, border:'none', borderRadius:4, cursor:'pointer',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <svg width="20" height="15" viewBox="0 0 28 20" fill="none">
          <path d="M10.5 2L2 10l8.5 8H26V2H10.5z" stroke="#1D2D40" strokeWidth="1.8" strokeLinejoin="round"/>
          <path d="M15 7l6 6M21 7l-6 6" stroke="#1D2D40" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </button>
    )
    if (k === '__shift') return (
      <button onClick={() => setCaps(c => !c)} style={{
        flex:1.5, height:46, border:'none', borderRadius:4, cursor:'pointer',
        background: caps ? '#606C79' : S,
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill={caps ? '#fff' : '#1D2D40'}>
          <path d="M12 3L4 11h4v7h8v-7h4L12 3z"/>
        </svg>
      </button>
    )
    if (k === '__123') return (
      <button style={{
        flex:1.3, height:46, background:S, border:'none', borderRadius:4, cursor:'default',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <span style={{ fontSize:13, fontWeight:600, color:'#1D2D40', fontFamily:'var(--font-family)' }}>123</span>
      </button>
    )
    if (k === '__space') return (
      <button onClick={() => onKey(' ')} style={{
        flex:5, height:46, background:W, border:'none', borderRadius:4, cursor:'pointer',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <span style={{ fontSize:12, color:'#606C79', fontFamily:'var(--font-family)' }}>English (US)</span>
      </button>
    )
    if (k === '__return') return (
      <button onClick={onDone} style={{
        flex:1.8, height:46, background:S, border:'none', borderRadius:4, cursor:'pointer',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <svg width="18" height="14" viewBox="0 0 22 18" fill="none">
          <path d="M2 9l6 7L20 2" stroke="#1D2D40" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    )
    const char = caps ? k.toUpperCase() : k
    return (
      <button onClick={() => { onKey(char); if (caps) setCaps(false) }} style={{
        flex:1, height:46, background:W, border:'none', borderRadius:4, cursor:'pointer',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <span style={{ fontSize:19, fontWeight:300, color:'#1D2D40', fontFamily:'var(--font-family)', lineHeight:1 }}>
          {char}
        </span>
      </button>
    )
  }

  return (
    <div style={{ flexShrink:0, backgroundColor:KB, padding:'8px 4px 4px' }}>
      {/* Row 1 */}
      <div style={{ display:'flex', gap:6, marginBottom:8 }}>
        {Q_ROW1.map(k => <Key key={k} k={k} />)}
      </div>
      {/* Row 2 — slightly inset */}
      <div style={{ display:'flex', gap:6, marginBottom:8, paddingLeft:16, paddingRight:16 }}>
        {Q_ROW2.map(k => (
          <button key={k} onClick={() => { onKey(caps ? k.toUpperCase() : k); if (caps) setCaps(false) }} style={{
            flex:1, height:46, background:W, border:'none', borderRadius:4, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <span style={{ fontSize:19, fontWeight:300, color:'#1D2D40', fontFamily:'var(--font-family)', lineHeight:1 }}>
              {caps ? k.toUpperCase() : k}
            </span>
          </button>
        ))}
      </div>
      {/* Row 3 */}
      <div style={{ display:'flex', gap:6, marginBottom:8 }}>
        {Q_ROW3.map(k => <Key key={k} k={k} />)}
      </div>
      {/* Row 4 */}
      <div style={{ display:'flex', gap:6 }}>
        {Q_ROW4.map(k => <Key key={k} k={k} />)}
      </div>
      <AndroidNavBar />
    </div>
  )
}

// ── Billy mascot placeholder ─────────────────────────────────────────────────
// 170×170 as in Figma; actual artwork unavailable in static build
function BillyMascot() {
  return (
    <div style={{
      width: 170, height: 170, flexShrink: 0, alignSelf: 'center',
      borderRadius: 28,
      background: 'linear-gradient(145deg, #FF6B6B 0%, #E53935 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
      boxShadow: '0 8px 24px rgba(229,57,53,0.25)',
    }}>
      <BilleaseIcon name="user-hexagon" size="2xl" color="rgba(255,255,255,0.9)" />
      <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-family)', letterSpacing: 1 }}>
        BILLY
      </span>
    </div>
  )
}

// ── Inline checkbox (Figma: 24×24, borderRadius 8, 2px border) ──────────────
function Checkbox({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 24, height: 24, flexShrink: 0,
        border: `2px solid ${checked ? 'var(--bg-secondary)' : '#97a1ab'}`,
        borderRadius: 8,
        backgroundColor: checked ? 'var(--bg-secondary)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', padding: 0,
      }}
    >
      {checked && (
        <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
          <path d="M1 5.5L5 9.5L13 1.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  )
}

// ── Phone mockup — Google Pixel 9 Pro ────────────────────────────────────────
function PhoneMock({ children, scale }) {
  const frameW = CW + P9_BORDER * 2
  const frameH = CH + P9_BORDER * 2
  return (
    <div style={{ width: frameW * scale, height: frameH * scale, flexShrink: 0, position: 'relative' }}>
      <div style={{ position: 'absolute', right: -3 * scale, top: (P9_BORDER + 160) * scale, zIndex: 20 }}>
        <div style={{ width:3*scale, height:68*scale, backgroundColor:'#303030', borderRadius:`0 ${2*scale}px ${2*scale}px 0`, marginBottom:14*scale }} />
        <div style={{ width:3*scale, height:54*scale, backgroundColor:'#303030', borderRadius:`0 ${2*scale}px ${2*scale}px 0`, marginBottom:6*scale }} />
        <div style={{ width:3*scale, height:54*scale, backgroundColor:'#303030', borderRadius:`0 ${2*scale}px ${2*scale}px 0` }} />
      </div>
      <div style={{
        width: frameW, height: frameH,
        transform: `scale(${scale})`, transformOrigin: 'top left',
        borderRadius: P9_OUTER_R, backgroundColor: '#1A1A1A',
        boxShadow: '0 0 0 1px #2a2a2a', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: P9_BORDER + 13, left: '50%', transform: 'translateX(-50%)',
          width: 10, height: 10, borderRadius: '50%', backgroundColor: '#0a0a0a', zIndex: 10,
        }} />
        <div style={{
          position: 'absolute', top: P9_BORDER, left: P9_BORDER,
          width: CW, height: CH, overflow: 'hidden', backgroundColor: '#fff',
          borderRadius: P9_INNER_R, display: 'flex', flexDirection: 'column',
        }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ── DS registry for inspect panel ───────────────────────────────────────────
const ALL_COMPONENTS = {
  NavHeader:   { urlId: '50_3459',    desc: 'Top navigation bar with back arrow and title', category: 'Navigation'   },
  OTPInput:    { urlId: '188_2882',   desc: 'One-time code input cells (4 or 6 digits)',    category: 'Input'        },
  InputField:  { urlId: '109_1161',   desc: 'Text input field with label and states',       category: 'Input'        },
  Button:      { urlId: '16_182',     desc: 'Primary action button',                        category: 'Action'       },
  Link:        { urlId: '190_3261',   desc: 'Inline text link',                             category: 'Action'       },
  Alert:       { urlId: '11972_1657', desc: 'Inline alert banner with status icon',         category: 'Alert'        },
  Toast:       { urlId: '35_1200',    desc: 'Notification banner (ScreenBanner overlay)',   category: 'Notification' },
}

const SCREEN_COMPONENTS = {
  'sign-up':               ['NavHeader', 'InputField', 'Button'],
  'verify-email':          ['NavHeader', 'OTPInput', 'Link', 'Toast'],
  'email-delivery-error':  ['NavHeader', 'Alert', 'Link'],
  'change-email':          ['NavHeader', 'InputField', 'Button'],
  'verify-mobile':         ['NavHeader', 'OTPInput', 'Link'],
  'create-password':       ['NavHeader', 'InputField', 'Button'],
}

function InspectPanel({ screen }) {
  const names = SCREEN_COMPONENTS[screen] ?? []
  return (
    <div style={{
      width: INSPECT_W, flexShrink: 0,
      borderLeft: '1px solid var(--border-subtle)',
      backgroundColor: '#fff', display: 'flex', flexDirection: 'column', overflowY: 'auto',
    }}>
      <div style={{ padding:'10px 16px', borderBottom:'1px solid var(--border-subtle)', backgroundColor:'var(--bg-subtle)' }}>
        <span style={{ fontSize:11, fontWeight:700, fontFamily:'var(--font-family)', color:'var(--text-disabled)', textTransform:'uppercase', letterSpacing:'0.5px' }}>
          Components on this screen
        </span>
      </div>
      <div style={{ display:'flex', flexDirection:'column' }}>
        {names.map(name => {
          const c = ALL_COMPONENTS[name]
          return (
            <a key={name} href={`/explorer/${c.urlId}`}
              style={{ display:'flex', flexDirection:'column', gap:4, padding:'12px 16px', borderBottom:'1px solid var(--border-subtle)', textDecoration:'none', backgroundColor:'#fff', transition:'background 0.1s' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
            >
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:13, fontWeight:600, fontFamily:'var(--font-family)', color:'var(--text-base)' }}>{name}</span>
                <span style={{ fontSize:10, fontFamily:'var(--font-family)', color:'var(--text-subtle)', backgroundColor:'var(--bg-subtle)', border:'1px solid var(--border-subtle)', borderRadius:4, padding:'1px 6px' }}>{c.category}</span>
              </div>
              <span style={{ fontSize:12, fontFamily:'var(--font-family)', color:'var(--text-subtle)', lineHeight:1.4 }}>{c.desc}</span>
              <span style={{ fontSize:11, fontFamily:'var(--font-family)', color:'var(--text-primary)', fontWeight:600, marginTop:2 }}>View in DS →</span>
            </a>
          )
        })}
      </div>
    </div>
  )
}

// ── Bottom action area (button above keyboard / nav bar) ─────────────────────
function BottomAction({ label, disabled, onClick }) {
  return (
    <div style={{ flexShrink:0, padding:'12px 20px 20px', borderTop:'1px solid #EAEDF0' }}>
      <Button type="primary" size="lg" state={disabled ? 'disabled' : 'default'} label={label} fullWidth onClick={disabled ? undefined : onClick} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Screens ──────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

// Sign up (37375:82975)
function SignUpScreen({ mobile, email, mobileFocused, emailFocused, tcChecked,
  onMobileChange, onEmailChange, onMobileFocus, onMobileBlur, onEmailFocus, onEmailBlur,
  onTcChange, onSignUp }) {

  const mobileState = mobileFocused ? (mobile ? 'typing' : 'focused') : (mobile ? 'filled' : 'default')
  const emailState  = emailFocused  ? (email  ? 'typing' : 'focused') : (email  ? 'filled' : 'default')
  const canSignUp   = mobile.length > 0 && email.length > 0 && tcChecked

  return (
    <>
      <StatusBar />
      <NavHeader type="help" title="Let's get started" showBorder showWatermark={false} />
      <div style={{ flex:1, overflowY:'auto', padding:'24px 20px 0', display:'flex', flexDirection:'column', gap:20 }}>
        <BillyMascot />
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <InputField
            variant="text"
            size="md"
            state={mobileState}
            label="Mobile"
            placeholder="Mobile"
            value={mobile}
            onChange={onMobileChange}
            onFocus={onMobileFocus}
            onBlur={onMobileBlur}
            showLabel={false}
          />
          <InputField
            variant="text"
            size="md"
            state={emailState}
            label="Email"
            placeholder="Email"
            value={email}
            onChange={onEmailChange}
            onFocus={onEmailFocus}
            onBlur={onEmailBlur}
            showLabel={false}
          />
          {/* T&C row — Figma: checkbox 24×24 + body text 14px */}
          <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
            <Checkbox checked={tcChecked} onChange={onTcChange} />
            <p style={{
              margin:0, fontSize:14, fontFamily:'var(--font-family)',
              color:'var(--text-base)', lineHeight:1.5,
            }}>
              {'I have read and consented to the '}
              <span style={{ fontWeight:600 }}>Privacy Policy</span>
              {' / '}
              <span style={{ fontWeight:600 }}>Terms & Conditions.</span>
            </p>
          </div>
        </div>
      </div>
      <BottomAction label="Sign up" disabled={!canSignUp} onClick={onSignUp} />
      <AndroidNavBar />
    </>
  )
}

// Verify email — OTP entry (37375:82506)
function VerifyEmailScreen({ email, otpValues, focusedIdx, resendSecs, showBanner,
  onBannerClose, onDigit, onBackspace, onChangeEmail, onResend }) {

  const displayEmail = email || 'test@gmail.com'

  return (
    <>
      {showBanner && (
        <ScreenBanner
          type="success"
          message="Verification code has been sent"
          onClose={onBannerClose}
        />
      )}
      <StatusBar />
      <NavHeader type="icon-left" title="Email verification" showBorder showWatermark={false} />
      <div style={{ flex:1, padding:'24px 20px 0', display:'flex', flexDirection:'column', alignItems:'center', gap:28, overflowY:'auto' }}>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, textAlign:'center' }}>
          <span style={{ fontSize:16, fontWeight:400, fontFamily:'var(--font-family)', color:'var(--text-base)', lineHeight:1.5 }}>
            Enter 6-digit code we sent to
          </span>
          <span style={{ fontSize:16, fontWeight:600, fontFamily:'var(--font-family)', color:'var(--text-base)', lineHeight:1.5 }}>
            {displayEmail}
          </span>
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:24 }}>
          <OTPInput
            type="OTP-email"
            values={otpValues}
            focusedIndex={focusedIdx}
          />
          <div style={{ textAlign:'center', fontFamily:'var(--font-family)', color:'var(--text-base)', lineHeight:1.5 }}>
            {resendSecs > 0
              ? <span style={{ fontSize:16, fontWeight:400 }}>{`Resend code in ${resendSecs}s`}</span>
              : <Link label="Resend code" size="sm" state="default" showIcon={false} onClick={onResend} />
            }
          </div>
        </div>
        <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:4 }}>
          <span style={{ fontSize:14, fontFamily:'var(--font-family)', color:'var(--text-base)' }}>Wrong email?</span>
          <Link label="Change email" size="sm" state="default" showIcon={false} onClick={onChangeEmail} />
        </div>
      </div>
      <AndroidNumericKeyboard onDigit={onDigit} onBackspace={onBackspace} />
    </>
  )
}

// Email delivery error (37375:82498)
function EmailDeliveryErrorScreen({ onChangeEmail }) {
  return (
    <>
      <StatusBar />
      <NavHeader type="icon-left" title="Email verification" showBorder showWatermark={false} />
      <div style={{ flex:1, padding:'24px 20px 0', display:'flex', flexDirection:'column', gap:16 }}>
        <Alert
          type="warning"
          message="We're having trouble delivering emails to this address. Verify your email or try a different one."
        />
        <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:4 }}>
          <span style={{ fontSize:14, fontFamily:'var(--font-family)', color:'var(--text-base)' }}>Wrong email?</span>
          <Link label="Change email" size="sm" state="default" showIcon={false} onClick={onChangeEmail} />
        </div>
      </div>
      <AndroidNavBar />
    </>
  )
}

// Change email (37375:82458)
function ChangeEmailScreen({ newEmail, newEmailFocused, onEmailChange, onFocus, onBlur, onSubmit, onKey, onBackspace }) {
  const inputState = newEmailFocused
    ? (newEmail ? 'typing' : 'focused')
    : (newEmail ? 'filled' : 'default')

  return (
    <>
      <StatusBar />
      <NavHeader type="icon-left" title="Change email" showBorder showWatermark={false} />
      <div style={{ flex:1, padding:'24px 20px 0', display:'flex', flexDirection:'column', gap:20, overflow:'hidden' }}>
        <p style={{ margin:0, fontSize:16, fontFamily:'var(--font-family)', color:'var(--text-base)', lineHeight:1.5 }}>
          Enter a different email address to receive a new verification code
        </p>
        <InputField
          variant="text"
          size="md"
          state={inputState}
          label="Email address"
          placeholder="Enter new email"
          value={newEmail}
          onChange={onEmailChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onClear={() => onEmailChange('')}
          showLabel={false}
        />
      </div>
      <BottomAction label="Get verification code" disabled={!newEmail} onClick={newEmail ? onSubmit : undefined} />
      <AndroidQwertyKeyboard onKey={onKey} onBackspace={onBackspace} onDone={newEmail ? onSubmit : undefined} />
    </>
  )
}

// Verify mobile (37375:82919)
function VerifyMobileScreen({ otpValues, focusedIdx, resendSecs, onDigit, onBackspace, onResend, onChangeNumber }) {
  return (
    <>
      <StatusBar />
      <NavHeader type="icon-left" title="Mobile verification" showBorder showWatermark={false} />
      <div style={{ flex:1, padding:'24px 20px 0', display:'flex', flexDirection:'column', alignItems:'center', gap:28, overflowY:'auto' }}>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, textAlign:'center' }}>
          <span style={{ fontSize:16, fontWeight:400, fontFamily:'var(--font-family)', color:'var(--text-base)', lineHeight:1.5 }}>
            Enter 4-digit code we sent to
          </span>
          <span style={{ fontSize:16, fontWeight:600, fontFamily:'var(--font-family)', color:'var(--text-base)', lineHeight:1.5 }}>
            +63 912 345 6789
          </span>
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:24 }}>
          <OTPInput
            type="OTP-mobile"
            values={otpValues}
            focusedIndex={focusedIdx}
          />
          <div style={{ textAlign:'center', fontFamily:'var(--font-family)', color:'var(--text-base)', lineHeight:1.5 }}>
            {resendSecs > 0
              ? <span style={{ fontSize:16, fontWeight:400 }}>{`Resend code in ${resendSecs}s`}</span>
              : <Link label="Resend code" size="sm" state="default" showIcon={false} onClick={onResend} />
            }
          </div>
        </div>
        <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:4 }}>
          <span style={{ fontSize:14, fontFamily:'var(--font-family)', color:'var(--text-base)' }}>Wrong number?</span>
          <Link label="Change mobile number" size="sm" state="default" showIcon={false} onClick={onChangeNumber} />
        </div>
      </div>
      <AndroidNumericKeyboard onDigit={onDigit} onBackspace={onBackspace} />
    </>
  )
}

// Create password (37375:83105)
function CreatePasswordScreen({ createPwd, confirmPwd, activePwdField, onFieldFocus, onKey, onBackspace, onSave, onCreateChange, onConfirmChange }) {
  const REQUIREMENTS = [
    'Has at least 8 characters',
    'Contains upper and lower cases',
    'Contains numbers and characters (! @ # ? ])',
  ]

  const createState = activePwdField === 'create'
    ? (createPwd ? 'typing' : 'focused')
    : (createPwd ? 'filled' : 'default')
  const confirmState = activePwdField === 'confirm'
    ? (confirmPwd ? 'typing' : 'focused')
    : (confirmPwd ? 'filled' : 'default')
  const canSave = createPwd.length > 0 && confirmPwd.length > 0

  return (
    <>
      <StatusBar />
      <NavHeader type="title-only" title="Create password" showBorder showWatermark={false} />
      <div style={{ flex:1, padding:'24px 20px 0', display:'flex', flexDirection:'column', gap:20, overflow:'hidden' }}>
        {/* Requirements list — Figma: gap 8px, each row gap 8px */}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {REQUIREMENTS.map((req, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
              <BilleaseIcon name="info-outline" size="md" color="var(--icon-subtle)" />
              <span style={{ fontSize:16, fontFamily:'var(--font-family)', color:'var(--text-subtle)', lineHeight:1.5 }}>
                {req}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div onClick={() => onFieldFocus('create')}>
            <InputField
              variant="text"
              size="md"
              state={createState}
              label="Create password"
              placeholder="Create password"
              value={createPwd}
              onChange={onCreateChange}
              showLabel={false}
            />
          </div>
          <div onClick={() => onFieldFocus('confirm')}>
            <InputField
              variant="text"
              size="md"
              state={confirmState}
              label="Confirm password"
              placeholder="Confirm password"
              value={confirmPwd}
              onChange={onConfirmChange}
              showLabel={false}
            />
          </div>
        </div>
      </div>
      <BottomAction label="Save password" disabled={!canSave} onClick={canSave ? onSave : undefined} />
      <AndroidQwertyKeyboard onKey={onKey} onBackspace={onBackspace} onDone={canSave ? onSave : undefined} />
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Main export ───────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

const SCREEN_LABELS = {
  'sign-up':              'Sign up',
  'verify-email':         'Verify email',
  'email-delivery-error': 'Email delivery issue',
  'change-email':         'Change email',
  'verify-mobile':        'Verify mobile',
  'create-password':      'Create password',
}

export default function SignUpFlow({ scenarioId = 'happy-path' }) {
  const initialScreen = scenarioId === 'email-delivery-error' ? 'email-delivery-error' : 'sign-up'

  const [screen, setScreen] = useState(initialScreen)
  const [visible, setVisible] = useState(true)
  const [scale, setScale] = useState(0.7)
  const [inspect, setInspect] = useState(false)

  // Sign-up form
  const [mobile, setMobile] = useState('')
  const [signEmail, setSignEmail] = useState('')
  const [mobileFocused, setMobileFocused] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [tcChecked, setTcChecked] = useState(false)

  // Email OTP (6 cells)
  const [otp6, setOtp6] = useState(Array(6).fill(''))
  const [resend6, setResend6] = useState(59)

  // Mobile OTP (4 cells)
  const [otp4, setOtp4] = useState(Array(4).fill(''))
  const [resend4, setResend4] = useState(59)

  // ScreenBanner on verify-email
  const [showBanner, setShowBanner] = useState(false)

  // Change email
  const [newEmail, setNewEmail] = useState('')
  const [newEmailFocused, setNewEmailFocused] = useState(false)

  // Create password
  const [createPwd, setCreatePwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [activePwdField, setActivePwdField] = useState('create')

  const containerRef = useRef(null)
  const inspectRef   = useRef(false)

  // Dynamic phone scale
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

  // Resend countdowns
  useEffect(() => {
    if (screen !== 'verify-email' || resend6 <= 0) return
    const t = setTimeout(() => setResend6(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [screen, resend6])

  useEffect(() => {
    if (screen !== 'verify-mobile' || resend4 <= 0) return
    const t = setTimeout(() => setResend4(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [screen, resend4])

  // Auto-dismiss ScreenBanner after 3 s
  useEffect(() => {
    if (!showBanner) return
    const t = setTimeout(() => setShowBanner(false), 3000)
    return () => clearTimeout(t)
  }, [showBanner])

  function navigateTo(next) {
    setVisible(false)
    setTimeout(() => { setScreen(next); setVisible(true) }, 180)
  }

  function handleRestart() {
    setVisible(false)
    setTimeout(() => {
      setScreen(initialScreen)
      setMobile(''); setSignEmail(''); setMobileFocused(false); setEmailFocused(false); setTcChecked(false)
      setOtp6(Array(6).fill('')); setResend6(59)
      setOtp4(Array(4).fill('')); setResend4(59)
      setShowBanner(false)
      setNewEmail(''); setNewEmailFocused(false)
      setCreatePwd(''); setConfirmPwd(''); setActivePwdField('create')
      setVisible(true)
    }, 180)
  }

  // ── OTP helpers ──────────────────────────────────────────────────────────────
  function handleDigit6(d) {
    setOtp6(prev => {
      const idx = prev.findIndex(v => v === '')
      if (idx === -1) return prev
      const next = [...prev]
      next[idx] = d
      if (idx === 5) setTimeout(() => navigateTo('verify-mobile'), 400)
      return next
    })
  }
  function handleBackspace6() {
    setOtp6(prev => {
      const next = [...prev]
      for (let i = 5; i >= 0; i--) { if (next[i] !== '') { next[i] = ''; break } }
      return next
    })
  }

  function handleDigit4(d) {
    setOtp4(prev => {
      const idx = prev.findIndex(v => v === '')
      if (idx === -1) return prev
      const next = [...prev]
      next[idx] = d
      if (idx === 3) setTimeout(() => navigateTo('create-password'), 400)
      return next
    })
  }
  function handleBackspace4() {
    setOtp4(prev => {
      const next = [...prev]
      for (let i = 3; i >= 0; i--) { if (next[i] !== '') { next[i] = ''; break } }
      return next
    })
  }

  // ── QWERTY key handlers ──────────────────────────────────────────────────────
  function handleChangeEmailKey(char) { setNewEmail(p => p + char) }
  function handleChangeEmailBackspace() { setNewEmail(p => p.slice(0, -1)) }
  function handleChangeEmailSubmit() {
    setOtp6(Array(6).fill(''))
    setResend6(59)
    setShowBanner(true)
    navigateTo('verify-email')
  }

  function handlePwdKey(char) {
    if (activePwdField === 'create') setCreatePwd(p => p + char)
    else setConfirmPwd(p => p + char)
  }
  function handlePwdBackspace() {
    if (activePwdField === 'create') setCreatePwd(p => p.slice(0, -1))
    else setConfirmPwd(p => p.slice(0, -1))
  }

  const focusedIdx6 = otp6.findIndex(v => v === '')
  const focusedIdx4 = otp4.findIndex(v => v === '')

  return (
    <div ref={containerRef} style={{ height:'100%', display:'flex', flexDirection:'column', backgroundColor:'#fff', overflow:'hidden' }}>

      {/* Toolbar */}
      <div style={{
        height: TOOLBAR_H, flexShrink:0,
        display:'flex', alignItems:'center', gap:12,
        borderBottom:'1px solid var(--border-subtle)',
        paddingLeft:24, paddingRight:24,
      }}>
        <span style={{ fontSize:13, fontFamily:'var(--font-family)', fontWeight:600, color:'var(--text-base)' }}>
          {inspect ? 'Inspect mode' : 'Interactive prototype'}
        </span>
        {!inspect && (
          <span style={{ fontSize:12, fontFamily:'var(--font-family)', color:'var(--text-subtle)' }}>
            {SCREEN_LABELS[screen]}
          </span>
        )}
        {!inspect && (
          <button onClick={handleRestart} style={{
            background:'none', border:'none', cursor:'pointer',
            display:'flex', alignItems:'center', gap:4,
            fontSize:12, fontFamily:'var(--font-family)', color:'var(--text-subtle)',
          }}>
            <BilleaseIcon name="auto-renew" size="xs" color="var(--text-subtle)" />
            Restart
          </button>
        )}
        <button
          onClick={() => setInspect(v => !v)}
          style={{
            marginLeft:'auto', display:'flex', alignItems:'center', gap:8,
            background:'none', border:'none', padding:0, cursor:'pointer',
            fontFamily:'var(--font-family)', fontSize:12,
            color: inspect ? 'var(--text-base)' : 'var(--text-subtle)',
            fontWeight: inspect ? 600 : 400,
          }}
        >
          Inspect
          <div style={{ width:36, height:20, borderRadius:10, flexShrink:0, position:'relative', transition:'background-color 0.2s', backgroundColor: inspect ? 'var(--bg-secondary)' : 'var(--bg-sunken)' }}>
            <div style={{ position:'absolute', top:2, left: inspect ? 16 : 2, width:16, height:16, borderRadius:'50%', backgroundColor:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,0.25)', transition:'left 0.2s' }} />
          </div>
        </button>
      </div>

      {/* Stage */}
      <div style={{ flex:1, display:'flex', flexDirection:'row', overflow:'hidden' }}>
        <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
          <PhoneMock scale={scale}>
            <div style={{
              flex:1, display:'flex', flexDirection:'column',
              transition:'opacity 0.18s ease', opacity: visible ? 1 : 0,
              pointerEvents: inspect ? 'none' : undefined,
            }}>
              {screen === 'sign-up' && (
                <SignUpScreen
                  mobile={mobile} email={signEmail}
                  mobileFocused={mobileFocused} emailFocused={emailFocused}
                  tcChecked={tcChecked}
                  onMobileChange={setMobile}
                  onEmailChange={setSignEmail}
                  onMobileFocus={() => setMobileFocused(true)}
                  onMobileBlur={() => setMobileFocused(false)}
                  onEmailFocus={() => setEmailFocused(true)}
                  onEmailBlur={() => setEmailFocused(false)}
                  onTcChange={setTcChecked}
                  onSignUp={() => { setShowBanner(true); navigateTo('verify-email') }}
                />
              )}
              {screen === 'verify-email' && (
                <VerifyEmailScreen
                  email={signEmail}
                  otpValues={otp6}
                  focusedIdx={focusedIdx6 === -1 ? undefined : focusedIdx6}
                  resendSecs={resend6}
                  showBanner={showBanner}
                  onBannerClose={() => setShowBanner(false)}
                  onDigit={handleDigit6}
                  onBackspace={handleBackspace6}
                  onChangeEmail={() => navigateTo('change-email')}
                  onResend={() => setResend6(59)}
                />
              )}
              {screen === 'email-delivery-error' && (
                <EmailDeliveryErrorScreen
                  onChangeEmail={() => navigateTo('change-email')}
                />
              )}
              {screen === 'change-email' && (
                <ChangeEmailScreen
                  newEmail={newEmail}
                  newEmailFocused={newEmailFocused}
                  onEmailChange={setNewEmail}
                  onFocus={() => setNewEmailFocused(true)}
                  onBlur={() => setNewEmailFocused(false)}
                  onSubmit={handleChangeEmailSubmit}
                  onKey={handleChangeEmailKey}
                  onBackspace={handleChangeEmailBackspace}
                />
              )}
              {screen === 'verify-mobile' && (
                <VerifyMobileScreen
                  otpValues={otp4}
                  focusedIdx={focusedIdx4 === -1 ? undefined : focusedIdx4}
                  resendSecs={resend4}
                  onDigit={handleDigit4}
                  onBackspace={handleBackspace4}
                  onResend={() => setResend4(59)}
                  onChangeNumber={() => {}}
                />
              )}
              {screen === 'create-password' && (
                <CreatePasswordScreen
                  createPwd={createPwd}
                  confirmPwd={confirmPwd}
                  activePwdField={activePwdField}
                  onFieldFocus={setActivePwdField}
                  onKey={handlePwdKey}
                  onBackspace={handlePwdBackspace}
                  onSave={handleRestart}
                  onCreateChange={setCreatePwd}
                  onConfirmChange={setConfirmPwd}
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
