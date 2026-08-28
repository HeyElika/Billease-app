/**
 * Card flip — a pattern under Motion / Controls & interactions.
 *
 * Card face follows Financial Core (sMW3MOYkTVNijuFMZ0XVBm, node 49002:20602).
 * Motion values are from the cards animation handoff prototype.
 */

import { useEffect, useRef, useState } from 'react'
import BilleaseIcon from '../../assets/icons/BilleaseIcon'
import cardArt from '../../assets/cards/access-card.png'
import manageIcon from '../../assets/cards/manage.svg'
import { LockToggleGlyph } from './cardIcons'
import {
  DocSection, DocCard, P,
  DemoCard, RuleTable, UsageList, Note, LottieAsset,
} from './docs'

const LOTTIE_EYE = '/motion/eye-toggle.json'


// ─── Motion values ────────────────────────────────────────────────────────────

const FLIP_MS      = 450
const FLIP_EASE    = 'cubic-bezier(0.05, 0.7, 0.1, 1)'
const PERSPECTIVE  = 1200
const EYE_DOWN_MS  = 100   // squash down, scaleY 100% to 5%
const EYE_UP_MS    = 110   // squash back up
const EYE_TOTAL_MS = EYE_DOWN_MS + EYE_UP_MS

/**
 * Geometry read from Financial Core, node 53373:134934 (access-card/item) and
 * 14108:666 (access-card/menu/item). Not approximated.
 */
const CARD = { w: 300, h: 190, radius: 'var(--radius-lg)', pad: 'var(--space-300)' }

const MENU = { itemW: 100, itemH: 78, tile: 50, icon: 20 }

/** The revealed face fill, read from the node. Not a token in this repo. */
const BACK_BG = '#AE136D'

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
    border-radius: var(--radius-lg);
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

const faceStyle = {
  width: '100%', height: '100%', position: 'relative',
  fontFamily: 'var(--ds-font-family)',
}

const artStyle = {
  position: 'absolute', inset: 0, width: '100%', height: '100%',
  objectFit: 'cover', borderRadius: 'var(--radius-lg)', pointerEvents: 'none',
}

/** 8px box holding a 3.33px white circle, per the dot asset. */
function Dot() {
  return (
    <span style={{ width: 8, height: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden="true">
      <span style={{ width: 3.33, height: 3.33, borderRadius: '50%', backgroundColor: '#fff' }} />
    </span>
  )
}

function CardFront() {
  return (
    <div style={faceStyle}>
      <img src={cardArt} alt="" style={artStyle} />
      <div style={{
        position: 'absolute', inset: 0, padding: CARD.pad, boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-100)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center' }}><Dot /><Dot /></span>
          <span style={{
            fontSize: 'var(--text-md)', fontWeight: 600, lineHeight: 1.5,
            color: 'var(--text-on-dark)', whiteSpace: 'nowrap',
          }}>
            {DETAILS.last4}
          </span>
        </div>
      </div>
    </div>
  )
}

function BackField({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-100)', whiteSpace: 'nowrap' }}>
      <span style={{
        fontSize: 'var(--text-sm)', fontWeight: 400, lineHeight: 1.5,
        color: 'var(--text-on-dark-subtle)',
      }}>
        {label}
      </span>
      <span style={{
        fontSize: 'var(--text-lg)', fontWeight: 600, lineHeight: 1.5,
        color: 'var(--text-on-dark)',
      }}>
        {value}
      </span>
    </div>
  )
}

/**
 * The revealed face is a flat fill, not the printed artwork: access-card/item
 * in the revealed state (I49002:20665;14839:3523) drops the image entirely.
 * Content is bottom-aligned, same 12px padding as the front.
 */
function CardBack() {
  return (
    <div style={{
      ...faceStyle,
      backgroundColor: BACK_BG,
      padding: CARD.pad,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-end',
      gap: 'var(--space-300)',
    }}>
      <BackField label="Card number" value={DETAILS.number} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-800)' }}>
        <BackField label="Expiry date" value={DETAILS.expiry} />
        <BackField label="CVV" value={DETAILS.cvv} />
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

// ─── access-card/menu/item ────────────────────────────────────────────────────

/**
 * access-card/menu/item.
 *
 * With no onClick the tile renders as plain content rather than a button: it
 * looks exactly the same, it simply is not clickable or focusable. That is not
 * the disabled state, which greys out and belongs to a card that is locked.
 */
function MenuItem({ label, onClick, disabled, children }) {
  const interactive = Boolean(onClick) && !disabled
  const tile = {
    width: MENU.tile, height: MENU.tile, borderRadius: 12, border: 'none',
    color: disabled ? 'var(--icon-disabled)' : 'var(--icon-base)',
    backgroundColor: 'var(--bg-subtle)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 0,
    cursor: interactive ? 'pointer' : 'default',
    opacity: disabled ? 0.4 : 1,
  }
  return (
    <div style={{
      width: MENU.itemW, height: MENU.itemH,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 'var(--space-200)',
    }}>
      {interactive
        ? <button type="button" onClick={onClick} style={tile}>{children}</button>
        : <div style={tile} aria-hidden={!disabled || undefined}>{children}</div>}
      <span style={{
        width: MENU.itemW, textAlign: 'center',
        fontFamily: 'var(--ds-font-family)', fontSize: 'var(--text-md)', fontWeight: 400, lineHeight: 1.5,
        color: disabled ? 'var(--text-disabled)' : 'var(--text-base)',
      }}>
        {label}
      </span>
    </div>
  )
}

// ─── Demo ─────────────────────────────────────────────────────────────────────


function CardFlipDemo() {
  const [revealed, setRevealed] = useState(false)

  return (
    <DemoCard label="View details">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <style>{CSS}</style>

        <div style={{ position: 'relative', width: CARD.w, height: CARD.h }}>
          <div className={`be-flip${revealed ? ' is-revealed' : ''}`} style={{ width: '100%', height: '100%' }}>
            <div className="be-flip-inner">
              <div className="be-face"><CardFront /></div>
              <div className="be-face be-face--back"><CardBack /></div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex' }}>
          <MenuItem
            label={revealed ? 'Hide details' : 'View details'}
            onClick={() => setRevealed(v => !v)}
          >
            <EyeToggle revealed={revealed} color="var(--icon-base)" />
          </MenuItem>
          <MenuItem label="Lock">
            <LockToggleGlyph locked={false} />
          </MenuItem>
          <MenuItem label="Manage">
            <img src={manageIcon} alt="" width={MENU.icon} height={MENU.icon} style={{ display: 'block' }} />
          </MenuItem>
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
  ['Locked',           'The card blurs and carries a lock with Card locked. View details is disabled and any revealed state is dropped. The lock and label take the card\'s own on-surface colours: on-dark on the physical face, icon/base and text/base on the light virtual face. A dark scrim is not used, because it would force white on both.'],
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

const EYE_LOTTIE_ROWS = [
  ['One file, both directions',
   'Play it forward for view to hide, and in reverse for hide to view. The squash is symmetrical, so reversing is correct here, unlike the lock toggle.'],
  ['The flip stays native',
   'The file is the eye only. The card turning over is not in it.'],
  ['Override the colour',
   'The fill ships white. Use icon/base wherever the tile sits on a light surface.'],
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
          <Note title="What the demo leaves out.">
            The flip only. A real reveal is gated by biometrics first, and Lock
            is inert here, so both are described under Behavior rather than
            played.
          </Note>
        </div>
              <div style={{ marginTop: 16 }}>
          <LottieAsset name="eye-toggle.json" href={LOTTIE_EYE} rows={EYE_LOTTIE_ROWS} />
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
