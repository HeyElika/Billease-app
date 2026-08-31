/**
 * Toast — a pattern under Motion / Feedback & status.
 *
 * Read from the Motion system file, node 1:4484, including the resolution
 * sticky on that frame:
 *
 *   Total duration   400ms
 *   Easing           0.9, 0, 0.1, 1
 *   Y position       -66 to 54
 *   Auto-dismiss     4s on screen after entry, then it goes
 *   Timer            fixed, no reset on interaction
 *   Exit             400ms, same easing, reversed
 *
 * 54 is where the banner rests, clearing the status bar, and is the same 54
 * the ScreenBanner component already uses. -66 puts it above the top edge, so
 * the travel is 120px.
 */

import { useEffect, useRef, useState } from 'react'
import Button from '../../components/ds/Button'
import { ScreenBanner } from '../../components/ds/Toast'
import { PhoneMock, StatusBar, AndroidNavBar } from '../flows/PhoneMockShared'
import { DocSection, P, DemoCard, RuleTable, UsageList, Note } from './docs'

// ─── Values, from node 1:4484 ────────────────────────────────────────────────

const TOAST_MS   = 400
const TOAST_EASE = 'cubic-bezier(0.9, 0, 0.1, 1)'
const Y_FROM     = -66          // above the top edge
const Y_TO       = 54           // resting inset, clears the status bar
const TRAVEL     = Y_TO - Y_FROM
const DWELL_MS   = 4000

const PHONE_SCALE = 0.46

const CSS = `
  @keyframes toast-in  { from { transform: translateY(-${TRAVEL}px); } to { transform: none; } }
  @keyframes toast-out { from { transform: none; } to { transform: translateY(-${TRAVEL}px); } }
  .toast-layer { animation-duration: ${TOAST_MS}ms; animation-timing-function: ${TOAST_EASE}; animation-fill-mode: both; }
  .toast-in  { animation-name: toast-in;  }
  .toast-out { animation-name: toast-out; }
  /* Reduced motion: it appears and goes without travelling. The dwell and the
     dismissal are unchanged, because they are what the pattern is for. */
  @media (prefers-reduced-motion: reduce) {
    .toast-layer { animation-duration: 1ms; }
  }
`

// ─── Demo ─────────────────────────────────────────────────────────────────────

function ToastDemo() {
  const [phase, setPhase] = useState(null)   // in | out | null
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const show = () => {
    clearTimeout(timer.current)
    setPhase('in')
    // The timer is fixed: it starts when the toast has landed and is never
    // extended, whatever the user does in the meantime.
    timer.current = setTimeout(() => setPhase('out'), TOAST_MS + DWELL_MS)
  }

  const onEnd = (e) => {
    if (e.target !== e.currentTarget) return
    if (phase === 'out') setPhase(null)
  }

  return (
    <DemoCard label="Message and dismissal" stageStyle={{ padding: '28px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <style>{CSS}</style>
        <PhoneMock scale={PHONE_SCALE}>
          <StatusBar />
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: 'var(--canvas-default)' }}>
            <div style={{ padding: 'var(--space-500)', display: 'flex', flexDirection: 'column', gap: 'var(--space-400)', height: '100%' }}>
              <div style={{ marginTop: 'auto' }}>
                <Button type="primary" size="lg" label="Send ₱1,034.00" fullWidth onClick={show} />
              </div>
            </div>

            {phase && (
              <div
                className={`toast-layer toast-${phase}`}
                style={{ position: 'absolute', top: -Y_TO, left: 0, right: 0 }}
                onAnimationEnd={onEnd}
              >
                <ScreenBanner type="success" message="₱1,034.00 sent to Maliya Clemente" />
              </div>
            )}
          </div>
          <AndroidNavBar />
        </PhoneMock>
        <span style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: 'var(--text-subtle)', textAlign: 'center', maxWidth: '46ch' }}>
          Send, and the toast drops in over {TOAST_MS}ms, stays {DWELL_MS / 1000}s and
          leaves the way it came. Tapping it changes nothing: the timer is fixed.
        </span>
      </div>
    </DemoCard>
  )
}

// ─── Content ──────────────────────────────────────────────────────────────────

const USE_WHEN = [
  'Confirming something the user just did, where the result is not in view',
  'The message is worth saying but not worth interrupting for',
  'Nothing needs to be decided: there is no action to take and nothing to lose by missing it',
]

const AVOID_WHEN = [
  'The user has to act on it, which is an alert or a dialog',
  'The message must not be missed, since a toast dismisses itself',
  'The result is already visible on screen, where a toast just repeats it',
]

const BEHAVIOR_RULES = [
  ['It drops in from above the screen',
   `The banner travels from ${Y_FROM} to ${Y_TO}, ${TRAVEL}px, over ${TOAST_MS}ms. ${Y_TO} is where it rests, clearing the status bar, and is the same inset the ScreenBanner component uses.`],
  ['It leaves the way it came',
   `The exit is the entry reversed: ${TOAST_MS}ms on the same curve, back above the top edge. Nothing about the dismissal is a different animation.`],
  ['The dwell is fixed at four seconds',
   `It stays ${DWELL_MS / 1000}s once it has landed, then goes on its own. The timer never resets, whatever the user does while it is on screen, so a toast cannot be kept alive by touching it.`],
  ['It is one-time, not a state',
   'A toast plays once and is gone. It does not persist, it cannot be returned to, and nothing about the screen behind it changes because of it.'],
  ['It sits over the screen, not in it',
   'The screen underneath keeps its layout and stays usable. The toast takes no space and pushes nothing down.'],
]

const SPEC_ROWS = [
  ['Entry duration',  `${TOAST_MS}ms`],
  ['Easing',          TOAST_EASE],
  ['Y position',      `${Y_FROM} to ${Y_TO}, ${TRAVEL}px of travel`],
  ['Dwell',           `${DWELL_MS / 1000}s after entry, fixed`],
  ['Timer',           'Never reset by interaction'],
  ['Exit',            `${TOAST_MS}ms, same easing, reversed`],
  ['End to end',      `${(TOAST_MS + DWELL_MS + TOAST_MS) / 1000}s from trigger to gone`],
  ['Reduced motion',  'No travel. The toast still appears, still dwells, still goes.'],
  ['Source',          'Motion system, node 1:4484, including the resolution sticky on that frame'],
]

const STATE_ROWS = [
  ['Triggered', 'The banner starts above the top edge and drops to its resting inset.'],
  ['Resting',   `On screen for ${DWELL_MS / 1000}s, over the screen and taking none of its space.`],
  ['Touched',   'Nothing changes. The timer keeps running.'],
  ['Dismissing', 'It returns above the top edge on the same curve, and is gone.'],
]

const ACCESSIBILITY_RULES = [
  ['Announce it, do not rely on seeing it',
   'The toast is a live status message. It has to be announced when it appears, because four seconds is not long enough to assume it was read.'],
  ['Never carry an action alone',
   'It dismisses itself, so anything the user might need to do has to exist somewhere else as well. A toast is not a place to put the only route to something.'],
  ['Reduced motion keeps the message',
   'Only the travel goes. The appearance, the dwell and the dismissal are the pattern, not decoration, so they stay.'],
]

const ENGINEERING_ROWS = [
  ['Start the timer when it lands, not when it is triggered',
   `The ${DWELL_MS / 1000}s is time on screen. Starting the clock at the trigger loses ${TOAST_MS}ms of it, which is most of a fifth of the dwell.`],
  ['Do not extend the timer',
   'The file is explicit: fixed, no reset on interaction. Resetting on touch or hover is the usual default in toast libraries and has to be turned off.'],
  ['Position it, do not insert it',
   'The banner is an overlay at the resting inset. Adding it to the layout pushes the screen down and back up again, which is a second animation nobody asked for.'],
  ['Clear the timer when it unmounts',
   'A toast whose screen has gone should not still be counting down, or it dismisses something that is no longer there.'],
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ToastDocs() {
  return (
    <>
      <DocSection id="demo" title="Demo">
        <ToastDemo />
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
          Read from the Motion system file. The frame carries a resolution
          sticky, and the values below are the resolved ones.
        </P>
        <RuleTable rows={SPEC_ROWS} labelWidth={200} />
        <div style={{ marginTop: 12 }}>
          <Note title="Not settled in the file.">
            Three things the source does not answer, left open rather than
            invented here: what happens when a second toast is triggered while
            one is on screen, whether a toast can be dismissed by tapping or
            swiping it, and whether the dwell lengthens for a longer message.
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
