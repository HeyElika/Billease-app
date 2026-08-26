/**
 * Lock and unlock — a pattern under Motion / Controls & interactions.
 *
 * Card faces from Financial Core, access-card/item. Motion values from the lock
 * and unlock handoff prototype.
 *
 * The choreography is deliberately asymmetric. Locking layers a veil, lands the
 * badge, then snaps the shackle. Unlocking takes the content away first and
 * clears the glass behind it.
 */

import { useState } from 'react'
import cardArt from '../../assets/cards/access-card.png'
import virtualArt from '../../assets/cards/virtual-card.png'
import { PadlockClosed, LockToggleGlyph } from './cardIcons'
import { DocSection, DocCard, CardHeader, P, DemoCard, RuleTable, UsageList, Note } from './docs'

/** Served from public/ so the files have stable URLs devs can share, not data URIs. */
const LOTTIE_BADGE  = '/motion/lock-badge.json'
const LOTTIE_TOGGLE = '/motion/lock-toggle.json'

// ─── Values ───────────────────────────────────────────────────────────────────

const DECEL    = 'cubic-bezier(0.05, 0.7, 0.1, 1)'
const ACCEL    = 'cubic-bezier(0.3, 0, 0.8, 0.15)'
const STANDARD = 'cubic-bezier(0.2, 0, 0, 1)'
const SPRING   = 'cubic-bezier(0.34, 1.4, 0.64, 1)'

const CARD = { w: 300, h: 190 }

const CSS = `
  /* ── the card settles under the change ── */
  @keyframes lu-settle-lock {
    0%   { transform: scale(1); }
    38%  { transform: scale(0.968); }
    100% { transform: scale(1); }
  }
  @keyframes lu-settle-unlock {
    0%   { transform: scale(0.984); }
    45%  { transform: scale(1.012); }
    100% { transform: scale(1); }
  }
  .lu-card.is-locking   { animation: lu-settle-lock 400ms ${STANDARD}; }
  .lu-card.is-unlocking { animation: lu-settle-unlock 340ms ${DECEL}; }

  /* ── the veil ── */
  .lu-overlay {
    position: absolute; inset: 0; z-index: 3;
    border-radius: var(--radius-lg);
    display: flex; align-items: center; justify-content: center;
    background: rgba(0, 0, 0, 0);
    backdrop-filter: blur(0px); -webkit-backdrop-filter: blur(0px);
    opacity: 0; visibility: hidden; pointer-events: none;
    /* exit: the content leaves first, then the glass clears */
    transition:
      opacity 150ms ${ACCEL} 60ms,
      backdrop-filter 210ms ${ACCEL} 40ms,
      -webkit-backdrop-filter 210ms ${ACCEL} 40ms,
      background-color 210ms ${ACCEL} 40ms,
      visibility 0s linear 220ms;
  }
  .lu-card.is-locked .lu-overlay {
    opacity: 1; visibility: visible; pointer-events: auto;
    background: rgba(0, 0, 0, 0.10);
    backdrop-filter: blur(2.25px); -webkit-backdrop-filter: blur(2.25px);
    /* enter: the tint snaps in, the blur ramps up under it */
    transition:
      opacity 120ms linear,
      backdrop-filter 380ms ${DECEL},
      -webkit-backdrop-filter 380ms ${DECEL},
      background-color 380ms ${DECEL};
  }

  /* ── badge and label ── */
  .lu-content {
    display: flex; flex-direction: column; align-items: center;
    gap: var(--space-100);
    opacity: 0; transform: translateY(6px) scale(0.9);
    transition: opacity 110ms ${ACCEL}, transform 110ms ${ACCEL};
  }
  .lu-card.is-locked .lu-content {
    opacity: 1; transform: none;
    transition: opacity 220ms ${DECEL} 120ms, transform 320ms ${SPRING} 120ms;
  }
  .lu-badge { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; }

  /* the shackle shuts once the badge has landed */
  .lu-shackle { transform-box: fill-box; transform-origin: 50% 100%; }
  @keyframes lu-shackle-snap {
    0%   { transform: translateY(-2px) scaleY(1.15); }
    60%  { transform: translateY(0.3px) scaleY(0.95); }
    100% { transform: translateY(0) scaleY(1); }
  }
  .lu-card.is-locked .lu-shackle { animation: lu-shackle-snap 240ms ${STANDARD} 250ms both; }

  @media (prefers-reduced-motion: reduce) {
    .lu-card, .lu-shackle { animation: none !important; }
    .lu-overlay, .lu-content { transition-duration: 1ms !important; transition-delay: 0s !important; }
  }
`

// ─── Demo ─────────────────────────────────────────────────────────────────────

const FACES = [
  { id: 'physical', art: cardArt,    surface: 'dark'  },
  { id: 'virtual',  art: virtualArt, surface: 'light' },
]

const TONE = {
  dark:  'var(--text-on-dark)',
  light: 'var(--text-base)',
}

function LockableCard({ face }) {
  const [locked, setLocked] = useState(false)
  const [phase, setPhase] = useState(null)   // drives the settle only

  const toggle = () => {
    const next = !locked
    setLocked(next)
    setPhase(next ? 'is-locking' : 'is-unlocking')
    setTimeout(() => setPhase(null), 420)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-400)' }}>
      <div
        className={`lu-card${locked ? ' is-locked' : ''}${phase ? ` ${phase}` : ''}`}
        style={{
          position: 'relative', width: CARD.w, height: CARD.h,
          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        }}
      >
        <img
          src={face.art}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }}
        />
        <div className="lu-overlay" style={{ color: TONE[face.surface], fontFamily: 'var(--ds-font-family)' }}>
          <div className="lu-content">
            <span className="lu-badge"><PadlockClosed size={40} shackleClass="lu-shackle" /></span>
            <span style={{ fontSize: 'var(--text-md)', fontWeight: 400, lineHeight: 1.5, color: 'inherit' }}>
              Card locked
            </span>
          </div>
        </div>
      </div>

      <div style={{ width: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-200)' }}>
        <button
          type="button"
          onClick={toggle}
          style={{
            width: 50, height: 50, borderRadius: 12, border: 'none', padding: 0,
            backgroundColor: 'var(--bg-subtle)', color: 'var(--icon-base)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}
        >
          <LockToggleGlyph locked={locked} size={20} />
        </button>
        <span style={{
          fontFamily: 'var(--ds-font-family)', fontSize: 'var(--text-md)',
          fontWeight: 400, lineHeight: 1.5, color: 'var(--text-base)',
        }}>
          {locked ? 'Unlock' : 'Lock'}
        </span>
      </div>
    </div>
  )
}

function LockUnlockDemo() {
  return (
    <DemoCard label="Lock and unlock">
      <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
        <style>{CSS}</style>
        {FACES.map(face => <LockableCard key={face.id} face={face} />)}
      </div>
    </DemoCard>
  )
}

// ─── Content ──────────────────────────────────────────────────────────────────

const USE_WHEN = [
  'A person suspends an object without deleting it',
  'The state persists until they change it back',
  'The object stays visible while it is out of use',
]

const AVOID_WHEN = [
  'The change is permanent, where a confirmation is needed instead',
  'The state is set by the system rather than the person',
  'The object should disappear once suspended',
]

const BEHAVIOR_RULES = [
  ['Locking is free, unlocking is gated',
   'Locking takes effect on tap. Unlocking raises the same confirm-your-identity step the card flip uses, because making a card usable again is the risky direction. This is the reverse of the flip, where revealing is gated and hiding is not.'],
  ['The state persists',
   'A locked card stays locked until it is unlocked. It survives swiping to another card and leaving the screen, unlike a revealed card, which is dropped as soon as focus moves.'],
  ['Locking blocks the other actions',
   'View details is disabled on a locked card, and a card that is locked while revealed hides immediately.'],
  ['Enter layers, exit peels',
   'Locking brings the veil in and lands the badge on top of it. Unlocking takes the badge away first and only then clears the glass. Playing either in reverse reads as the wrong direction.'],
  ['The card acknowledges the change',
   'The card itself settles, dipping slightly on lock and overshooting slightly on unlock. It is the only part of this pattern that overshoots.'],
  ['The label follows the card',
   'The badge and label take the card’s own on-surface colours: on-dark over the physical face, text/base over the light virtual face.'],
]

const SPEC_ROWS = [
  ['Veil',              'rgba(0, 0, 0, 0.10) over a 2.25px backdrop blur'],
  ['Veil in',           'Tint 120ms linear, blur and colour 380ms decelerate'],
  ['Veil out',          'Colour and blur 210ms accelerate, 40ms in'],
  ['Badge in',          'Opacity 220ms decelerate and transform 320ms spring, both 120ms in, from translateY(6px) scale(0.9)'],
  ['Badge out',         'Opacity and transform 110ms accelerate, leading the veil'],
  ['Shackle',           '240ms standard, 250ms in, once the badge has landed'],
  ['Card settle, lock', '400ms standard, scale 1 to 0.968 and back'],
  ['Card settle, unlock', '340ms decelerate, scale 0.984 to 1.012 and back'],
  ['Glyph swap',        'Outgoing 90ms linear with a 140ms accelerate rotate to 10 degrees at 0.78; incoming 110ms linear and 260ms spring, both 80ms in. Rotation about 50% by 65%.'],
  ['Badge size',        '48px box holding a 40px glyph, 4px above the label'],
  ['Label',             '14px regular, on the card’s own on-surface colour'],
  ['Reduced motion',    'No settle, no shackle, no spring. The state still changes.'],
]

const STATE_ROWS = [
  ['Unlocked',  'The card as normal. The control reads Lock and shows a closed padlock.'],
  ['Locking',   'The veil arrives, the badge lands, the shackle shuts, the card dips.'],
  ['Locked',    'Card locked over the veil. View details is disabled and the control reads Unlock.'],
  ['Unlocking', 'The confirm step first, then the badge leaves, the glass clears and the card lifts.'],
]

const ACCESSIBILITY_RULES = [
  ['Respect reduced motion',
   'Drop the settle, the shackle and the spring. The card still locks; it simply arrives without the flourish.'],
  ['Announce the state, not the motion',
   'Lock and unlock are a state change on one control, so the label carries the state and the change is announced.'],
  ['Do not rely on the veil alone',
   'The blur is a reinforcement. The label, the disabled View details and the warning all state the same thing in text.'],
  ['Motion is never required',
   'Nothing about the locked state depends on having seen it arrive.'],
]

const LOTTIE_ROWS = [
  ['What it covers',
   'The badge only: its entrance, and the shackle snapping shut. 370ms end to end at 60fps.'],
  ['What it does not cover',
   'The veil, the card settle and the Card locked label. Lottie cannot express a backdrop blur, the settle is on the card rather than the badge, and the label shares the badge\'s entrance but sits outside the glyph. All three stay native.'],
  ['The label',
   'It takes the same entrance as the badge, opacity 220ms decelerate and transform 320ms spring, both 120ms in. Run it alongside the file rather than inside it.'],
  ['When to start it',
   '120ms after the veil begins, which is where the badge starts in the full sequence. The shackle then fires 130ms into the file, landing at the 250ms the spec calls for.'],
  ['Sizing',
   'The composition is 48 by 48, the badge box, holding a 40px glyph. The 4px margin is deliberate: the shackle lifts above its own bounds as it snaps, and without that headroom it renders clipped flat.'],
  ['Colour',
   'The stroke ships white for the physical face. Override it to text/base for the light virtual face, through a KeyPath on lottie-android or a value provider on lottie-ios.'],
  ['Markers',
   'badge in at 0ms, shackle snap at 130ms, end at 370ms.'],
]

const TOGGLE_ROWS = [
  ['What it covers',
   'The menu icon swapping between the closed and open padlock, both ways. Two 340ms segments in one file, 680ms in total.'],
  ['Which segment',
   'Play 0 to 340ms for lock to unlock, and 340 to 680ms for unlock to lock. Two segments rather than one played in reverse, because reversing would swap which glyph gets the accelerate curve and which gets the spring.'],
  ['The stagger',
   'The leaving glyph snaps away over 90ms opacity and a 140ms accelerate rotate to 10 degrees at 78%. The arriving one waits 80ms, then fades over 110ms and springs back over 260ms. They are not symmetrical and that is the character of it.'],
  ['Sizing',
   'The composition is 20 by 20, the glyph as it sits in the 50px menu tile. Rotation happens about 50% by 65%, and the scale is downward, so nothing leaves the box.'],
  ['Colour',
   'Ships white. Override to icon/base wherever the tile sits on a light surface.'],
]

const ENGINEERING_ROWS = [
  ['Enter and exit are not mirrors',
   'They have different durations, different easings and opposite ordering. Implementing one and reversing it gives the wrong feel in the other direction.'],
  ['Delay the shackle',
   'The 250ms delay is what makes the padlock look like it shuts rather than appearing already shut. Animate the shackle path on its own, with a fill-box origin at the bottom of the shackle.'],
  ['Two glyphs, not a morph',
   'Cross-fade the closed and open padlocks with the rotate and scale above. Do not morph one path into the other.'],
  ['Overshoot is the card’s alone',
   'Only the card settle uses a spring past 1. The veil, the badge and the label all arrive without overshoot.'],
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LockUnlock() {
  return (
    <>
      <DocSection id="demo" title="Demo">
        <LockUnlockDemo />
        <div style={{ marginTop: 12 }}>
          <Note title="Try it.">
            Lock either card and watch the order: the veil arrives, the badge
            lands, then the shackle shuts. Unlock and it comes apart the other
            way round. The badge and label take their colour from the card
            underneath, which is why the green one is dark.
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
          <Note title="Easings.">
            Decelerate is cubic-bezier(0.05, 0.7, 0.1, 1), accelerate is
            cubic-bezier(0.3, 0, 0.8, 0.15), standard is
            cubic-bezier(0.2, 0, 0, 1) and the spring is
            cubic-bezier(0.34, 1.4, 0.64, 1). The first three are shared with the
            card flip and the carousel.
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
          The values the spec table leaves out, and the places this is most
          likely to be built wrong.
        </P>
        <RuleTable rows={ENGINEERING_ROWS} labelWidth={240} />

        <div style={{ height: 24 }} />
        <DocCard>
          <CardHeader
            label="Lottie asset"
            action={
              <a
                href={LOTTIE_BADGE}
                download="lock-badge.json"
                style={{
                  display: 'inline-flex', alignItems: 'center', height: 32,
                  padding: '0 12px', borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--bg-sunken)', color: 'var(--text-base)',
                  fontFamily: 'var(--ds-font-family)', fontSize: 14, fontWeight: 600,
                  textDecoration: 'none', flexShrink: 0,
                }}
              >
                Download lock-badge.json
              </a>
            }
          />
          <RuleTable rows={LOTTIE_ROWS} labelWidth={220} />
        </DocCard>
        <div style={{ height: 8 }} />
        <DocCard>
          <CardHeader
            label="Lottie asset"
            action={
              <a
                href={LOTTIE_TOGGLE}
                download="lock-toggle.json"
                style={{
                  display: 'inline-flex', alignItems: 'center', height: 32,
                  padding: '0 12px', borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--bg-sunken)', color: 'var(--text-base)',
                  fontFamily: 'var(--ds-font-family)', fontSize: 14, fontWeight: 600,
                  textDecoration: 'none', flexShrink: 0,
                }}
              >
                Download lock-toggle.json
              </a>
            }
          />
          <RuleTable rows={TOGGLE_ROWS} labelWidth={220} />
        </DocCard>

        <div style={{ marginTop: 12 }}>
          <Note title="Why the badge only.">
            The locked state is four things moving against each other and only
            the badge is self-contained. Exporting the whole choreography would
            mean a Lottie timeline and a native transition to keep in step,
            which is harder than writing the delays. Take the file for the
            badge, keep the veil and the settle native. The menu icon is the
            opposite case: it depends on nothing around it, so it exports whole.
          </Note>
        </div>
      </DocSection>
    </>
  )
}
