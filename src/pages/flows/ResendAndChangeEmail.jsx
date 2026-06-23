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

// ── Android nav bar — white per Figma ─────────────────────────────────────────
function AndroidNavBar() {
  return (
    <div style={{
      height: 44, backgroundColor: 'var(--bg-base, #fff)', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 55, padding: 10,
    }}>
      {/* back */}
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="#444"/>
      </svg>
      {/* home circle */}
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#444" strokeWidth="1.6"/>
      </svg>
      {/* tasks square */}
      <div style={{ width: 14, height: 14, border: '1.6px solid #666', borderRadius: 1.5 }} />
    </div>
  )
}

// ── GBoard numeric keyboard (OTP entry) ───────────────────────────────────────
const KEY_BASE = {
  height: 42,
  border: 'none',
  cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  borderRadius: 5.76,
  flexShrink: 0,
}

function GBoardNumeric({ onDigit, onBackspace }) {
  const whiteKey = { ...KEY_BASE, flex: 1, backgroundColor: '#fff', boxShadow: '0 0.96px 0 rgba(0,0,0,0.27)' }
  const grayKey  = { ...KEY_BASE, flex: 1, backgroundColor: '#ccced5', boxShadow: '0 0.96px 0 rgba(0,0,0,0.27)' }
  const blueKey  = { ...KEY_BASE, flex: 1, backgroundColor: '#1a73e8', boxShadow: '0 0.96px 0 rgba(0,0,0,0.27)' }

  const numLabel = (d) => (
    <span style={{ fontSize: 22, fontWeight: 400, color: '#000', fontFamily: 'var(--font-family)' }}>{d}</span>
  )

  return (
    <div style={{ flexShrink: 0 }}>
      <div style={{ backgroundColor: '#e8eaed', padding: 4, display: 'flex', flexDirection: 'column', gap: 5 }}>
        {[['1','2','3'],['4','5','6'],['7','8','9']].map((row, ri) => (
          <div key={ri} style={{ display: 'flex', gap: 5 }}>
            {row.map(d => (
              <button key={d} onClick={() => onDigit(d)} style={whiteKey}>{numLabel(d)}</button>
            ))}
          </div>
        ))}
        <div style={{ display: 'flex', gap: 5 }}>
          <button onClick={onBackspace} style={grayKey}>
            <svg width="22" height="17" viewBox="0 0 28 20" fill="none">
              <path d="M10.5 2L2 10l8.5 8H26V2H10.5z" stroke="#555" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M15 7l6 6M21 7l-6 6" stroke="#555" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
          <button onClick={() => onDigit('0')} style={whiteKey}>{numLabel('0')}</button>
          <button style={blueKey}>
            <svg width="20" height="18" viewBox="0 0 24 22" fill="none">
              <path d="M20 9H7.83l5.59-5.59L12 2l-8 8 8 8 1.41-1.41L7.83 11H20V9z" fill="white"/>
            </svg>
          </button>
        </div>
      </div>
      <AndroidNavBar />
    </div>
  )
}

// ── GBoard QWERTY keyboard (email entry) ──────────────────────────────────────
function GBoardQWERTY() {
  const wk = { flex: 1, minWidth: 0, height: 39, backgroundColor: '#fff', border: 'none', borderRadius: 6, boxShadow: '0 0.96px 0 rgba(0,0,0,0.27)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'default' }
  const sp = { ...wk, backgroundColor: '#ccced5' }
  const label = (t, size = 20) => <span style={{ fontSize: size, color: '#000', fontFamily: 'var(--font-family)', userSelect: 'none', lineHeight: 1 }}>{t}</span>

  return (
    <div style={{ flexShrink: 0 }}>
      {/* Toolbar */}
      <div style={{ height: 42, backgroundColor: '#e8eaed', display: 'flex', alignItems: 'center', paddingLeft: 12, paddingRight: 7, gap: 4 }}>
        <div style={{ width: 29, height: 29, borderRadius: 30, backgroundColor: '#fff', boxShadow: '0 0.96px 1.92px rgba(0,0,0,0.27)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#444"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
        </div>
        {[
          <svg key="s" width="17" height="17" viewBox="0 0 24 24" fill="#555"><path d="M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v3c4.86-2.34 8-7 8-11.5C20 5.81 16.19 2 11.5 2z"/></svg>,
          <svg key="g" width="17" height="17" viewBox="0 0 24 24" fill="#555"><path d="M11.5 2.75c-4.83 0-8.75 3.92-8.75 8.75s3.92 8.75 8.75 8.75 8.75-3.92 8.75-8.75S16.33 2.75 11.5 2.75zM8 14.5h-1v-5h1v5zm1.5 0H8v-5h1.5c1.38 0 2.5 1.12 2.5 2.5S10.88 14.5 9.5 14.5zm7.5 0h-3v-5h3v1h-2v1h2v1h-2v1h2v1z"/></svg>,
          <svg key="c" width="17" height="17" viewBox="0 0 24 24" fill="#555"><path d="M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z"/></svg>,
          <svg key="st" width="17" height="17" viewBox="0 0 24 24" fill="#555"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>,
        ].map((icon, i) => (
          <div key={i} style={{ width: 29, height: 29, borderRadius: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
        ))}
        <div style={{ width: 0.5, height: 22, backgroundColor: '#aaa', margin: '0 2px' }} />
        {[
          <svg key="m" width="17" height="17" viewBox="0 0 24 24" fill="#555"><circle cx="6" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="18" cy="12" r="2"/></svg>,
          <svg key="mic" width="17" height="17" viewBox="0 0 24 24" fill="#555"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg>,
        ].map((icon, i) => (
          <div key={i} style={{ width: 29, height: 29, borderRadius: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
        ))}
      </div>

      {/* Keys */}
      <div style={{ backgroundColor: '#e8eaed', padding: 4, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Row 1: Q-P */}
        <div style={{ display: 'flex', gap: 4 }}>
          {['Q','W','E','R','T','Y','U','I','O','P'].map(k => (
            <div key={k} style={wk}>{label(k)}</div>
          ))}
        </div>
        {/* Row 2: A-L (centered) */}
        <div style={{ display: 'flex', gap: 4, paddingLeft: 17, paddingRight: 17 }}>
          {['A','S','D','F','G','H','J','K','L'].map(k => (
            <div key={k} style={wk}>{label(k)}</div>
          ))}
        </div>
        {/* Row 3: shift + Z-M + backspace */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <div style={{ ...sp, flex: 'none', width: 44 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#555"><path d="M12 3.5L1.5 14H8v6.5h8V14h6.5L12 3.5z"/></svg>
          </div>
          {['Z','X','C','V','B','N','M'].map(k => (
            <div key={k} style={wk}>{label(k)}</div>
          ))}
          <div style={{ ...sp, flex: 'none', width: 44 }}>
            <svg width="20" height="16" viewBox="0 0 28 20" fill="none">
              <path d="M10.5 2L2 10l8.5 8H26V2H10.5z" stroke="#555" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M15 7l6 6M21 7l-6 6" stroke="#555" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
        {/* Row 4: ?123 | , | globe | spacebar | . | done(blue) */}
        <div style={{ display: 'flex', gap: 4, height: 38 }}>
          <div style={{ ...sp, flex: 'none', width: 50 }}>
            <span style={{ fontSize: 14, color: '#3d3d3f', fontWeight: 500, fontFamily: 'var(--font-family)' }}>?123</span>
          </div>
          <div style={{ ...sp, flex: 'none', width: 29, position: 'relative' }}>
            <span style={{ fontSize: 18, color: '#000', position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)' }}>,</span>
            <svg style={{ position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)' }} width="12" height="12" viewBox="0 0 24 24" fill="#555"><path d="M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v3c4.86-2.34 8-7 8-11.5C20 5.81 16.19 2 11.5 2z"/></svg>
          </div>
          <div style={{ ...wk, flex: 'none', width: 29 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#555"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
          </div>
          <div style={{ ...wk, flex: 1 }}>{label('English', 12)}</div>
          <div style={{ ...sp, flex: 'none', width: 29 }}>{label('.', 22)}</div>
          <div style={{ ...sp, flex: 'none', width: 44, backgroundColor: '#1a73e8' }}>
            <svg width="22" height="18" viewBox="0 0 28 22" fill="none">
              <path d="M24 4H10v4H6l8 8 8-8h-4V6h6V4z" fill="white"/>
              <path d="M24 13v5H6v-5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
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
      <NavHeader type="icon-left" title="Verify email" showBorder={false} />

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

      <GBoardNumeric onDigit={onDigit} onBackspace={onBackspace} />
    </div>
  )
}

// ── Change email screen ───────────────────────────────────────────────────────
function ChangeEmailScreen({ email, onEmailChange, onSubmit }) {
  const inputState = email ? 'typing' : 'focused'

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <StatusBar />
      <NavHeader type="icon-left" title="Change email" showBorder={false} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24, padding: '24px 20px 0', overflow: 'hidden' }}>
        <p style={{ margin: 0, fontSize: 16, fontFamily: 'var(--ds-font-family)', color: 'var(--text-base)', lineHeight: 1.5 }}>
          Enter a different email address to receive a new verification code
        </p>
        <InputField
          variant="text"
          size="md"
          state={inputState}
          label=""
          placeholder="Enter new email"
          value={email}
          onChange={onEmailChange}
        />
      </div>

      {/* Action bar above keyboard */}
      <div style={{
        backgroundColor: 'var(--bg-base, #fff)',
        padding: '12px 20px 20px',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <Button
          type="primary"
          size="lg"
          state={email ? 'default' : 'disabled'}
          label="Get verification code"
          fullWidth
          onClick={email ? onSubmit : undefined}
        />
      </div>

      <GBoardQWERTY />
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
