/**
 * Card flip — a pattern under Motion / Controls & interactions.
 *
 * Card face follows Financial Core (sMW3MOYkTVNijuFMZ0XVBm, node 49002:20602).
 * Motion values are from the cards animation handoff prototype.
 */

import { useEffect, useRef, useState } from 'react'
import Button from '../../components/ds/Button'
import BilleaseIcon from '../../assets/icons/BilleaseIcon'
import {
  DocSection, DocCard, P,
  DemoCard, RuleTable, UsageList, Note,
} from './docs'

// ─── Motion values ────────────────────────────────────────────────────────────

const FLIP_MS      = 450
const FLIP_EASE    = 'cubic-bezier(0.05, 0.7, 0.1, 1)'
const PERSPECTIVE  = 1200
const EYE_DOWN_MS  = 100   // squash down, scaleY 100% to 5%
const EYE_UP_MS    = 110   // squash back up
const EYE_TOTAL_MS = EYE_DOWN_MS + EYE_UP_MS

// Card faces, from the prototype. Product colours, not design-system neutrals.
const PHYSICAL = { bg: 'rgb(230, 12, 150)', ink: '#FFFFFF' }
const VIRTUAL  = { bg: 'rgb(57, 255, 20)',  ink: '#1A1A1A' }

const CARD = { w: 300, h: 190, radius: 12 }

const DETAILS = {
  number: '1265 6653 9832 3354',
  expiry: '06/30',
  cvv: '344',
  last4: '3354',
}

const CSS = `
  .be-flip { perspective: ${PERSPECTIVE}px; }
  .be-flip-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform ${FLIP_MS}ms ${FLIP_EASE};
  }
  .be-flip.is-revealed .be-flip-inner { transform: rotateY(180deg); }
  .be-face {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    border-radius: ${CARD.radius}px;
    overflow: hidden;
  }
  /* Pre-rotated so it lands right way up rather than mirrored. */
  .be-face--back { transform: rotateY(180deg); }

  .be-eye { display: inline-flex; transition: transform ${EYE_DOWN_MS}ms ease-in-out; }
  .be-eye.is-squashed { transform: scaleY(0.05); }

  @media (prefers-reduced-motion: reduce) {
    .be-flip-inner { transition: none; }
    .be-eye { transition: none; }
  }
`

// ─── Card faces ───────────────────────────────────────────────────────────────

function Chip() {
  return (
    <div style={{
      width: 34, height: 26, borderRadius: 5,
      background: 'linear-gradient(150deg, #E8D9A8, #C9AE6B)',
      display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', gap: 3, padding: 4,
      boxSizing: 'border-box', opacity: 0.95,
    }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ background: 'rgba(0,0,0,0.16)', borderRadius: 1 }} />
      ))}
    </div>
  )
}

function Mastercard() {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }} aria-hidden="true">
      <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#EB001B' }} />
      <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#F79E1B', marginLeft: -10, mixBlendMode: 'multiply' }} />
    </div>
  )
}

function CardFront({ theme }) {
  return (
    <div style={{
      width: '100%', height: '100%', backgroundColor: theme.bg, color: theme.ink,
      padding: 18, boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      fontFamily: 'var(--ds-font-family)', position: 'relative',
    }}>
      {/* Watermark */}
      <div aria-hidden="true" style={{
        position: 'absolute', right: -30, top: 20, width: 200, height: 200,
        borderRadius: '46% 54% 40% 60%', background: 'rgba(255,255,255,0.07)',
      }} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
        <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', opacity: 0.92 }}>
          billease
        </span>
      </div>
      <div style={{ position: 'relative', marginTop: -8 }}><Chip /></div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', position: 'relative' }}>
        <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '0.06em' }}>
          •• {DETAILS.last4}
        </span>
        <Mastercard />
      </div>
    </div>
  )
}

function DetailRow({ label, value, theme, copyable, onCopy }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 10, opacity: 0.7, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '0.04em' }}>{value}</div>
      </div>
      {copyable && (
        <button
          type="button"
          onClick={onCopy}
          aria-label={`Copy ${label}`}
          style={{
            border: 'none', background: 'rgba(0,0,0,0.10)', borderRadius: 6,
            padding: '5px 7px', cursor: 'pointer', display: 'inline-flex',
            color: theme.ink, flexShrink: 0,
          }}
        >
          <BilleaseIcon name="copy" size="xs" color={theme.ink} />
        </button>
      )}
    </div>
  )
}

function CardBack({ theme, copyable, onCopy }) {
  return (
    <div style={{
      width: '100%', height: '100%', backgroundColor: theme.bg, color: theme.ink,
      padding: 18, boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12,
      fontFamily: 'var(--ds-font-family)',
    }}>
      <DetailRow label="Card number" value={DETAILS.number} theme={theme} copyable={copyable} onCopy={onCopy} />
      <div style={{ display: 'flex', gap: 28 }}>
        <div style={{ flex: 1 }}>
          <DetailRow label="Expiry date" value={DETAILS.expiry} theme={theme} copyable={copyable} onCopy={onCopy} />
        </div>
        <div style={{ flex: 1 }}>
          <DetailRow label="CVV" value={DETAILS.cvv} theme={theme} copyable={copyable} onCopy={onCopy} />
        </div>
      </div>
    </div>
  )
}

// ─── Eye toggle ───────────────────────────────────────────────────────────────

/**
 * Squashes to 5% of its height, swaps the glyph while flat, then springs back.
 * The swap is hidden inside the squash, so the two icons never cross-fade.
 */
function EyeToggle({ revealed, color }) {
  const [squashed, setSquashed] = useState(false)
  const [glyph, setGlyph] = useState(revealed)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) { first.current = false; setGlyph(revealed); return }
    setSquashed(true)
    const swap = setTimeout(() => { setGlyph(revealed); setSquashed(false) }, EYE_DOWN_MS)
    return () => clearTimeout(swap)
  }, [revealed])

  return (
    <span className={`be-eye${squashed ? ' is-squashed' : ''}`} aria-hidden="true">
      <BilleaseIcon name={glyph ? 'eye-off' : 'show'} size="sm" color={color} />
    </span>
  )
}

// ─── Action row ───────────────────────────────────────────────────────────────

function Action({ icon, label, onClick, disabled, custom }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 76 }}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        style={{
          width: 52, height: 52, borderRadius: 'var(--radius-lg)', border: 'none',
          backgroundColor: 'var(--bg-subtle)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.4 : 1,
        }}
      >
        {custom ?? <BilleaseIcon name={icon} size="sm" color="var(--icon-base)" />}
      </button>
      <span style={{
        fontFamily: 'var(--ds-font-family)', fontSize: 12,
        color: disabled ? 'var(--text-disabled)' : 'var(--text-base)', textAlign: 'center',
      }}>
        {label}
      </span>
    </div>
  )
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

function CardFlipDemo() {
  const [virtual, setVirtual]   = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [locked, setLocked]     = useState(false)
  const [asking, setAsking]     = useState(false)
  const [copied, setCopied]     = useState(false)

  const theme = virtual ? VIRTUAL : PHYSICAL

  // Revealed state is not persistent: locking or switching card drops it.
  const selectCard = (isVirtual) => {
    setVirtual(isVirtual)
    setRevealed(false)
    setAsking(false)
  }

  const toggleLock = () => {
    const next = !locked
    setLocked(next)
    if (next) { setRevealed(false); setAsking(false) }
  }

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(t)
  }, [copied])

  const onViewDetails = () => {
    if (locked) return
    if (revealed) { setRevealed(false); return }  // hiding needs no confirmation
    setAsking(true)                                // revealing does
  }

  return (
    <DemoCard
      label="View details"
      action={
        <div style={{ display: 'flex', gap: 6 }}>
          {[['Physical', false], ['Virtual', true]].map(([label, isV]) => (
            <button
              key={label}
              type="button"
              onClick={() => selectCard(isV)}
              style={{
                border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-full)',
                padding: '5px 12px', cursor: 'pointer',
                fontFamily: 'var(--font-family)', fontSize: 12,
                fontWeight: virtual === isV ? 600 : 400,
                backgroundColor: virtual === isV ? 'var(--bg-sunken)' : 'transparent',
                color: virtual === isV ? 'var(--text-base)' : 'var(--text-subtle)',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <style>{CSS}</style>

        <div style={{ position: 'relative', width: CARD.w, height: CARD.h }}>
          <div className={`be-flip${revealed ? ' is-revealed' : ''}`} style={{ width: '100%', height: '100%' }}>
            <div className="be-flip-inner">
              <div className="be-face"><CardFront theme={theme} /></div>
              <div className="be-face be-face--back">
                <CardBack theme={theme} copyable={virtual} onCopy={() => setCopied(true)} />
              </div>
            </div>
          </div>

          {locked && (
            <div style={{
              position: 'absolute', inset: 0, borderRadius: CARD.radius,
              backgroundColor: 'rgba(0,0,0,0.55)', color: '#fff',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: 'var(--ds-font-family)',
            }}>
              <BilleaseIcon name="lock" size="md" color="#fff" />
              <span style={{ fontSize: 14, fontWeight: 600 }}>Card locked</span>
            </div>
          )}

          {/* Biometric gate. Reveal only. */}
          {asking && (
            <div style={{
              position: 'absolute', inset: 0, borderRadius: CARD.radius,
              backgroundColor: 'rgba(0,0,0,0.55)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
            }}>
              <div style={{
                backgroundColor: 'var(--bg-base)', borderRadius: 'var(--radius-lg)',
                padding: 16, width: '100%', textAlign: 'center',
                fontFamily: 'var(--ds-font-family)',
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-base)' }}>Confirm your identity</div>
                <div style={{ fontSize: 12, color: 'var(--text-subtle)', margin: '4px 0 12px' }}>Verify with your face</div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  <Button type="secondary" size="sm" label="Cancel" onClick={() => setAsking(false)} />
                  <Button type="primary" size="sm" label="Confirm" onClick={() => { setAsking(false); setRevealed(true) }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <Action
            label={revealed ? 'Hide details' : 'View details'}
            onClick={onViewDetails}
            disabled={locked}
            custom={<EyeToggle revealed={revealed} color={locked ? 'var(--icon-disabled)' : 'var(--icon-base)'} />}
          />
          <Action icon="lock" label={locked ? 'Unlock' : 'Lock'} onClick={toggleLock} />
          <Action icon="filter" label="Manage" onClick={() => {}} />
        </div>

        <div style={{ height: 18, fontFamily: 'var(--font-family)', fontSize: 12, color: 'var(--text-subtle)' }}>
          {copied ? 'Copied to clipboard' : ''}
        </div>
      </div>
    </DemoCard>
  )
}

// ─── Content ──────────────────────────────────────────────────────────────────

const USE_WHEN = [
  'Revealing sensitive card data behind an explicit action',
  'The hidden content belongs to the same object, on its reverse',
  'The surface is a card the user already recognises',
]

const AVOID_WHEN = [
  'The content is not sensitive and needs no gate',
  'The hidden content is longer than the card can hold',
  'The two sides are unrelated, where a screen change is clearer',
]

const BEHAVIOR_RULES = [
  ['Revealing requires biometrics',
   'View details opens the same confirm-your-identity dialog as Unlock. The flip plays on success, never on tap.'],
  ['Hiding does not',
   'Hide details flips straight back with no confirmation. The gate is asymmetric on purpose: exposing the data is the risk, concealing it is not.'],
  ['It flips, it does not fade',
   'The branded front rotates away and the back rotates in. A cross-fade is not an acceptable substitute.'],
  ['The reveal does not persist',
   'Swiping to another card, or locking the card, hides the details automatically. This is the opposite of the lock state, which does persist.'],
  ['Blocked while locked',
   'View details is disabled on a locked card, and a card that locks while revealed hides immediately.'],
  ['Copy is virtual-card only',
   'The copy affordance appears on the virtual card and not on the physical one.'],
]

const SPEC_ROWS = [
  ['Transform',        'rotateY 0 to 180 degrees'],
  ['Duration',         '450ms'],
  ['Easing',           'cubic-bezier(0.05, 0.7, 0.1, 1)'],
  ['Perspective',      '1200px on the container'],
  ['Card filter',      '260ms, same curve'],
  ['Eye toggle total', `${EYE_TOTAL_MS}ms`],
  ['Eye squash down',  '0 to 100ms, scaleY 100% to 5%, ease-in-out'],
  ['Glyph swap',       'At 100ms, while fully squashed'],
  ['Eye squash up',    '100 to 210ms, ease-in-out'],
  ['Info alert',       'No transition. Instant swap, deliberately.'],
  ['Reduced motion',   'Faces swap without rotating'],
]

const STATE_ROWS = [
  ['Front',            'The branded face. View details is enabled.'],
  ['Confirm identity', 'The biometric dialog. The card has not moved yet.'],
  ['Revealed',         'The back face, showing card number, expiry and CVV. The action reads Hide details.'],
  ['Locked',           'Card locked. View details is disabled, and any revealed state is dropped.'],
]

const ACCESSIBILITY_RULES = [
  ['Respect reduced motion',
   'Swap the faces without rotating them. Do not substitute a shorter flip.'],
  ['Do not expose the hidden face',
   'While concealed, the back face must be out of the accessibility tree entirely, not merely visually hidden. Assistive technology must not be able to read a card number the screen is not showing.'],
  ['Announce the state change',
   'Reveal and conceal are state changes on the same control, so the button label carries the state and the change is announced.'],
  ['Motion is never required',
   'The label alone tells the user which state they are in. Nothing depends on having seen the card turn.'],
]

const ENGINEERING_ROWS = [
  ['Two faces, not one',
   'Use two faces inside a shared container with backface-visibility hidden, and pre-rotate the back face 180 degrees so it lands right way up rather than mirrored. Rotating a single face and swapping its content mid-way is not the same technique and will read as mirrored.'],
  ['iOS',
   'There is no native backface-visibility, but the two-face technique still applies. Set m34 on the container layer for perspective and drive a CABasicAnimation on transform.rotation.y, or in SwiftUI apply rotation3DEffect about the Y axis to both faces with the back offset by 180 degrees, swapping which face is visible and hit-testable at the halfway point.'],
  ['Eye icon',
   'Swap the glyph at the midpoint while it is fully squashed. Do not morph one shape into the other. On iOS this is a CGAffineTransform scaleY to 0.05 over 110ms with ease-in-out, or scaleEffect with a matching animation.'],
  ['Info alert',
   'No animation wrapper. Toggle isHidden, or the view presence in SwiftUI with no animation modifier attached. The instant swap keeps the reveal moment on the card.'],
  ['One set of values',
   'Android and iOS share the same curves and durations. The cubic-bezier control points map directly onto CAMediaTimingFunction and SwiftUI timingCurve, so nothing needs retiming per platform.'],
  ['Lottie alternative',
   'view-hide-details-eye-toggle.json covers the eye transition for teams that would rather import an asset than hand-code it. Markers at 0ms, 100ms and 210ms mark start, swap and end. Play it forward for view to hide and in reverse for hide to view; one file covers both directions. It works with lottie-android and lottie-ios from the same file.'],
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CardFlip() {
  return (
    <>
      <DocSection id="demo" title="Demo">
        <CardFlipDemo />
        <div style={{ marginTop: 12 }}>
          <Note title="Try it.">
            View details asks for confirmation before flipping. Hide details flips
            back without asking. Lock the card and the reveal is dropped and the
            action disabled. Switch to the virtual card for the copy affordance.
          </Note>
        </div>
      </DocSection>

      <DocSection id="usage" title="When to use">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <UsageList label="Use when" items={USE_WHEN} tone="use" />
          <UsageList label="Do not use when" items={AVOID_WHEN} tone="avoid" />
        </div>
      </DocSection>

      <DocSection id="behavior" title="Behavior">
        <RuleTable rows={BEHAVIOR_RULES} labelWidth={260} />
      </DocSection>

      <DocSection id="spec" title="Motion spec">
        <DocCard>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {SPEC_ROWS.map((row, i, arr) => (
                <tr key={row[0]} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <td style={{ padding: '10px 16px', verticalAlign: 'top', width: 200, fontFamily: 'var(--font-family)', fontSize: 13, fontWeight: 600, color: 'var(--text-base)', whiteSpace: 'nowrap' }}>{row[0]}</td>
                  <td style={{ padding: '10px 16px', verticalAlign: 'top', fontFamily: 'var(--font-family)', fontSize: 13, lineHeight: 1.6, color: 'var(--text-subtle)' }}>{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DocCard>
        <div style={{ marginTop: 12 }}>
          <Note title="Shared tokens.">
            The flip is a custom choreography, not a named Material 3 pattern.
            Its duration and easing are the same tokens used by the card carousel
            and by lock and unlock, so the three flows stay consistent.
          </Note>
        </div>
      </DocSection>

      <DocSection id="states" title="States">
        <RuleTable rows={STATE_ROWS} labelWidth={200} />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <RuleTable rows={ACCESSIBILITY_RULES} labelWidth={260} />
      </DocSection>

      <DocSection id="engineering" title="Engineering reference">
        <P>
          The values the spec table leaves out, and the two places an
          implementation is most likely to go wrong.
        </P>
        <RuleTable rows={ENGINEERING_ROWS} labelWidth={220} />
      </DocSection>
    </>
  )
}
