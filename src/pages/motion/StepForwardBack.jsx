/**
 * Step forward and back — a pattern under Motion / Navigation & transitions.
 *
 * Read from the Motion system file, node 1:4182 ("Modal - Step Forward/back"),
 * which is the whole of the specification:
 *
 *   Total duration            600ms
 *   Easing                    0.9, 0, 0.1, 1
 *   Existing modal            X position 0 to -40
 *   Background between them   #000000, opacity 0 to 30%
 *   New modal                 X position 400 to 0
 *
 * 400 is the width of the frame the values were written against, so the
 * incoming screen travels one screen width. The file specifies forward; back
 * is the same movement reversed, which is the only part of this page not taken
 * literally from it.
 */

import { useState } from 'react'
import BilleaseIcon from '../../assets/icons/BilleaseIcon'
import Button from '../../components/ds/Button'
import { PhoneMock, StatusBar, AndroidNavBar } from '../flows/PhoneMockShared'
import { DocSection, P, DemoCard, RuleTable, UsageList, Note } from './docs'

// ─── Values, from node 1:4182 ────────────────────────────────────────────────

const STEP_MS     = 600
const STEP_EASE   = 'cubic-bezier(0.9, 0, 0.1, 1)'
const BASE_SHIFT  = 40          // px the screen underneath gives way by
const DIM_COLOR   = '#000000'
const DIM_OPACITY = 0.3
const ENTER_FROM  = 400         // px in the source frame: one screen width

const PHONE_SCALE = 0.46

const CSS = `
  /* One movement in three parts: the arriving screen, the screen it covers,
     and the dim between them. They share a duration and a curve, so they read
     as one thing moving rather than three. */
  @keyframes sf-enter { from { transform: translateX(100%); } to { transform: none; } }
  @keyframes sf-leave { from { transform: none; } to { transform: translateX(100%); } }
  @keyframes sf-push  { from { transform: none; } to { transform: translateX(-${BASE_SHIFT}px); } }
  @keyframes sf-pull  { from { transform: translateX(-${BASE_SHIFT}px); } to { transform: none; } }
  @keyframes sf-dim   { from { opacity: 0; } to { opacity: ${DIM_OPACITY}; } }
  @keyframes sf-undim { from { opacity: ${DIM_OPACITY}; } to { opacity: 0; } }

  .sf-layer { animation-duration: ${STEP_MS}ms; animation-timing-function: ${STEP_EASE}; animation-fill-mode: both; }
  .sf-enter { animation-name: sf-enter; }
  .sf-leave { animation-name: sf-leave; }
  .sf-push  { animation-name: sf-push;  }
  .sf-pull  { animation-name: sf-pull;  }
  .sf-dim   { animation-name: sf-dim;   }
  .sf-undim { animation-name: sf-undim; }

  /* Reduced motion: the destination arrives, nothing travels to it. */
  @media (prefers-reduced-motion: reduce) {
    .sf-layer { animation-duration: 1ms; }
    .sf-push, .sf-pull { animation-name: none; }
  }
`

// ─── Demo ─────────────────────────────────────────────────────────────────────

function Header({ title, onBack }) {
  return (
    <div style={{
      height: 44, flexShrink: 0, display: 'flex', alignItems: 'center', padding: '0 16px',
      backgroundColor: 'var(--bg-base)', fontFamily: 'var(--ds-font-family)',
    }}>
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}
          aria-label="Back"
        >
          <BilleaseIcon name="arrow-left" size="md" color="var(--icon-base)" />
        </button>
      ) : <span style={{ width: 24 }} />}
      <span style={{
        flex: 1, textAlign: 'center', fontSize: 'var(--text-lg)', fontWeight: 600,
        color: 'var(--text-base)', marginRight: 24,
      }}>
        {title}
      </span>
    </div>
  )
}

function Row({ label, value, strong }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: 'var(--space-300) 0', fontFamily: 'var(--ds-font-family)', fontSize: 'var(--text-md)',
    }}>
      <span style={{ color: 'var(--text-subtle)' }}>{label}</span>
      <span style={{ color: 'var(--text-base)', fontWeight: strong ? 600 : 400 }}>{value}</span>
    </div>
  )
}

function ScreenA({ onForward }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-base)' }}>
      <Header title="Send" />
      <div style={{ flex: 1, padding: 'var(--space-400)', display: 'flex', flexDirection: 'column', gap: 'var(--space-400)' }}>
        <div style={{ fontFamily: 'var(--ds-font-family)', textAlign: 'center', marginTop: 'var(--space-600)' }}>
          <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-base)' }}>Enter amount</div>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--text-base)', marginTop: 'var(--space-300)' }}>
            ₱1,034.00
          </div>
        </div>
        <div style={{ marginTop: 'auto' }}>
          <Button type="primary" size="lg" label="Continue" fullWidth onClick={onForward} />
        </div>
      </div>
    </div>
  )
}

function ScreenB({ onBack }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-base)' }}>
      <Header title="Confirm send" onBack={onBack} />
      <div style={{ flex: 1, padding: 'var(--space-400)', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
          padding: '0 var(--space-400)', marginTop: 'var(--space-300)',
        }}>
          <Row label="Pay with" value="Savings" strong />
          <Row label="Fee" value="Free" />
          <Row label="Send amount" value="₱1,034.00" strong />
        </div>
        <div style={{ marginTop: 'auto' }}>
          <Button type="primary" size="lg" label="Send ₱1,034.00" fullWidth />
        </div>
      </div>
    </div>
  )
}

function StepDemo() {
  const [at, setAt] = useState(0)          // 0 = Send, 1 = Confirm send
  const [phase, setPhase] = useState(null) // forward | back | null

  const go = (next) => {
    if (phase) return
    setPhase(next === 1 ? 'forward' : 'back')
    if (next === 1) setAt(1)
  }

  const onDone = (e) => {
    if (e.target !== e.currentTarget) return
    if (phase === 'back') setAt(0)
    setPhase(null)
  }

  const forward = phase === 'forward'
  const back = phase === 'back'
  const showOverlay = at === 1 || back

  return (
    <DemoCard label="Screen to screen" stageStyle={{ padding: '28px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <style>{CSS}</style>
        <PhoneMock scale={PHONE_SCALE}>
          <StatusBar />
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: 'var(--bg-base)' }}>
            {/* The screen underneath gives way; it never leaves. */}
            <div className={`sf-layer ${forward ? 'sf-push' : back ? 'sf-pull' : ''}`} style={{ position: 'absolute', inset: 0 }}>
              <ScreenA onForward={() => go(1)} />
            </div>

            {/* The dim belongs between the two, not to either one. */}
            {(showOverlay || forward) && (
              <div
                className={`sf-layer ${forward ? 'sf-dim' : back ? 'sf-undim' : ''}`}
                style={{
                  position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
                  backgroundColor: DIM_COLOR, opacity: phase ? undefined : DIM_OPACITY,
                }}
              />
            )}

            {showOverlay && (
              <div
                className={`sf-layer ${forward ? 'sf-enter' : back ? 'sf-leave' : ''}`}
                style={{ position: 'absolute', inset: 0, zIndex: 2 }}
                onAnimationEnd={onDone}
              >
                <ScreenB onBack={() => go(0)} />
              </div>
            )}
          </div>
          <AndroidNavBar />
        </PhoneMock>
        <span style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: 'var(--text-subtle)', textAlign: 'center', maxWidth: '46ch' }}>
          Continue steps forward, the back arrow steps back. The screen underneath
          gives way by {BASE_SHIFT}px and dims; it is still there when you return.
        </span>
      </div>
    </DemoCard>
  )
}

// ─── Content ──────────────────────────────────────────────────────────────────

const USE_WHEN = [
  'Moving between steps of the same task, forward or back',
  'The new screen replaces the current one and can be returned from',
  'The two screens are peers in a sequence, not a parent and a detail overlay',
]

const AVOID_WHEN = [
  'Entering a different flow altogether, which is New flow entry',
  'Switching between destinations that are not a sequence, which is Tab switch',
  'Showing something over the current screen without leaving it, which is a bottom sheet or a dialog',
]

const BEHAVIOR_RULES = [
  ['The new screen arrives, the old one gives way',
   `The incoming screen travels one screen width from the right to nothing. The screen it covers moves ${BASE_SHIFT}px in the same direction, a fifteenth of the distance, so it reads as being pushed rather than as leaving.`],
  ['Back is the same movement reversed',
   'The screen on top returns to the right and the one underneath comes back to its place. Nothing new is introduced going back, which is what makes it feel like a step rather than another arrival.'],
  ['The dim belongs between the two',
   `A ${DIM_OPACITY * 100}% black layer sits over the screen underneath and fades in with the movement. It separates the two screens by depth, so the one behind reads as further away rather than as part of the same surface.`],
  ['One duration, one curve',
   `All three parts run for ${STEP_MS}ms on ${STEP_EASE}. Staggering them, or giving the dim its own timing, breaks the illusion that a single thing moved.`],
  ['The screen underneath is kept',
   'It is not unmounted and not rebuilt on the way back. Scroll position, entered values and any in-progress state survive the step, because the user has not left it.'],
  ['The screens do not fade',
   'Neither screen changes opacity. The only thing that fades is the scrim between them, which is what gives the two screens their order in depth.'],
]

const SPEC_ROWS = [
  ['Total duration',   `${STEP_MS}ms`],
  ['Easing',           STEP_EASE],
  ['Incoming screen',  `X ${ENTER_FROM} to 0, one screen width`],
  ['Screen underneath', `X 0 to -${BASE_SHIFT}`],
  ['Dim colour',       `${DIM_COLOR}, over the screen underneath`],
  ['Dim opacity',      `0 to ${DIM_OPACITY * 100}%`],
  ['Back',             'The same values reversed. Nothing is faded and nothing new enters.'],
  ['Reduced motion',   'No travel. The destination is shown, and the screen underneath does not move.'],
  ['Source',           'Motion system, node 1:4182, and the Android team answers on node 1:4121, item 4'],
]

const STATE_ROWS = [
  ['At rest',    'One screen, no dim.'],
  ['Forward',    `The new screen crosses in as the old one gives way ${BASE_SHIFT}px and the dim reaches ${DIM_OPACITY * 100}%.`],
  ['Settled',    'The new screen is in place, the old one is still mounted underneath it, dimmed.'],
  ['Back',       'The top screen returns to the right, the dim clears and the screen underneath comes back to its place.'],
  ['Interrupted', 'A second step during a step is not queued. It replaces what is running and resolves to the screen the user asked for last.'],
]

const ACCESSIBILITY_RULES = [
  ['Focus follows the step',
   'Focus moves to the arriving screen, and back to where it was on return. The animation is decoration and must not be what tells a screen reader the screen changed.'],
  ['The dimmed screen is not reachable',
   'While a screen sits under another, it is out of the tab order. Being visible through a 30% dim is not the same as being available.'],
]

const ENGINEERING_ROWS = [
  ['Three layers, one animation',
   'The screen underneath, the dim above it, the arriving screen on top. Each gets one transform or opacity animation with the same duration and curve. Animating a shared container instead loses the parallax between the two screens.'],
  ['Do not unmount the screen underneath',
   'It has to be there to give way, to be dimmed, and to come back with its state intact. Replacing the route on the way forward and rebuilding it on the way back is the usual cause of lost scroll position and re-fetched data.'],
  ['The dim is a layer, not an overlay colour',
   'Give a black layer an animated opacity rather than tweening a background colour towards black. Two screens with different backgrounds otherwise dim by different amounts.'],
  ['One screen width, not a fixed 400',
   'The 400 in the file is the width of the frame it was drawn on. Use the width of the screen so the step behaves the same on every device.'],
  ['The prototypes disagree with the file',
   'The prototype flows in this repo run the step at 320ms on cubic-bezier(0.4, 0, 0.2, 1). The Motion system says 600ms on the standard curve, and the file is the source of truth. Worth correcting in the flows so the two stop disagreeing.'],
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StepForwardBack() {
  return (
    <>
      <DocSection id="demo" title="Demo">
        <StepDemo />
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
        <P>
          Read from the Motion system file. The file specifies the forward
          direction; back is the same movement reversed.
        </P>
        <RuleTable rows={SPEC_ROWS} labelWidth={200} />
        <div style={{ marginTop: 12 }}>
          <Note title="Two sources, two answers.">
            The prototype flows here run this step at 320ms on
            cubic-bezier(0.4, 0, 0.2, 1). The Motion system file says {STEP_MS}ms
            on {STEP_EASE}. This page follows the file, which is the source of
            truth, and the flows should be brought in line with it.
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
      </DocSection>
    </>
  )
}
