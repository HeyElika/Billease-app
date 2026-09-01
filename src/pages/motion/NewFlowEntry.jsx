/**
 * New flow entry — a pattern under Motion / Overlays.
 *
 * Read from the Motion system file, node 1:4201, including the dismissal rule
 * on the frame and the confirmation sticky beside it:
 *
 *   Total duration   600ms
 *   Easing           0.9, 0, 0.1, 1
 *   Modal Y          740 to 0, the full height of the screen
 *   Scrim            #000000, opacity 0 to 50%
 *   Dismissal        Swipe down is disabled. Back or an explicit control only.
 *
 * The entrance is the same as a standard bottom sheet. The dismissal is not,
 * and that is the whole reason this is a separate pattern: these sheets carry
 * a flow with user input in it, so an accidental drag must not discard it.
 */

import { useState } from 'react'
import BilleaseIcon from '../../assets/icons/BilleaseIcon'
import Button from '../../components/ds/Button'
import { PhoneMock, StatusBar, AndroidNavBar } from '../flows/PhoneMockShared'
import { DocSection, P, DemoCard, RuleTable, UsageList, Note } from './docs'

// ─── Values, from node 1:4201 ────────────────────────────────────────────────

const FLOW_MS     = 600
const FLOW_EASE   = 'cubic-bezier(0.9, 0, 0.1, 1)'
const SCREEN_H    = 740         // the screen the values were written against
const SCRIM_COLOR = '#000000'
const SCRIM_MAX   = 0.5

const PHONE_SCALE = 0.46

const CSS = `
  .nf-sheet { transition: transform ${FLOW_MS}ms ${FLOW_EASE}; }
  .nf-scrim { transition: opacity ${FLOW_MS}ms ${FLOW_EASE}; }
  @media (prefers-reduced-motion: reduce) {
    .nf-sheet, .nf-scrim { transition-duration: 1ms; }
  }
`

// ─── Demo ─────────────────────────────────────────────────────────────────────

function NewFlowEntryDemo() {
  const [open, setOpen] = useState(false)
  const [dragged, setDragged] = useState(false)

  // Drag is deliberately inert here: the gesture is recognised only so the demo
  // can say what it does, which is nothing.
  const onPointerDown = () => { if (open) setDragged(true) }

  return (
    <DemoCard label="Entering a flow" stageStyle={{ padding: '28px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <style>{CSS}</style>
        <PhoneMock scale={PHONE_SCALE}>
          <StatusBar />
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: 'var(--canvas-default)' }}>
            <div style={{ padding: 'var(--space-500)' }}>
              <div style={{
                backgroundColor: 'var(--bg-base)', borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-400)', display: 'flex', flexDirection: 'column', gap: 'var(--space-300)',
                fontFamily: 'var(--ds-font-family)',
              }}>
                <span style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-base)' }}>
                  Complete your account setup
                </span>
                <span style={{ fontSize: 'var(--text-md)', color: 'var(--text-subtle)' }}>
                  Have your personal details, valid ID, and selfie ready
                </span>
                <div style={{ alignSelf: 'flex-start' }}>
                  <Button type="primary" size="sm" label="Activate account" onClick={() => { setOpen(true); setDragged(false) }} />
                </div>
              </div>
            </div>

            <div
              className="nf-scrim"
              style={{
                position: 'absolute', inset: 0, backgroundColor: SCRIM_COLOR,
                opacity: open ? SCRIM_MAX : 0, pointerEvents: open ? 'auto' : 'none',
              }}
            />

            {/* Full height: the sheet is the screen once it has arrived. */}
            <div
              className="nf-sheet"
              onPointerDown={onPointerDown}
              style={{
                position: 'absolute', inset: 0,
                transform: open ? 'none' : 'translateY(100%)',
                backgroundColor: 'var(--bg-base)',
                display: 'flex', flexDirection: 'column',
                touchAction: 'none', fontFamily: 'var(--ds-font-family)',
              }}
            >
              <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 var(--space-400)', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}
                >
                  <BilleaseIcon name="close" size="md" color="var(--icon-base)" />
                </button>
                <span style={{ flex: 1, textAlign: 'center', marginRight: 24, fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-base)' }}>
                  Activate account
                </span>
              </div>

              <div style={{ flex: 1, padding: 'var(--space-400)', display: 'flex', flexDirection: 'column', gap: 'var(--space-400)' }}>
                <span style={{ fontSize: 'var(--text-md)', color: 'var(--text-subtle)', lineHeight: 1.5 }}>
                  Step 1 of 4. Your details, then your ID, then a selfie.
                </span>
                <div style={{
                  border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-300) var(--space-400)', color: 'var(--text-disabled)', fontSize: 'var(--text-md)',
                }}>
                  Full name
                </div>
                <div style={{
                  border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-300) var(--space-400)', color: 'var(--text-disabled)', fontSize: 'var(--text-md)',
                }}>
                  Date of birth
                </div>
                {dragged && (
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-subtle)' }}>
                    Dragging does nothing here. Close it with the control or with back.
                  </span>
                )}
                <div style={{ marginTop: 'auto' }}>
                  <Button type="primary" size="lg" label="Continue" fullWidth />
                </div>
              </div>
            </div>
          </div>
          <AndroidNavBar />
        </PhoneMock>
        <span style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: 'var(--text-subtle)', textAlign: 'center', maxWidth: '48ch' }}>
          Activate account brings the sheet up the full height of the screen. Try
          to drag it down and nothing happens: there is a form inside it.
        </span>
      </div>
    </DemoCard>
  )
}

// ─── Content ──────────────────────────────────────────────────────────────────

const USE_WHEN = [
  'The user is entering a flow rather than reading something',
  'There is input inside it that would be lost if it closed by accident',
  'The flow is a detour from the screen behind, which is waited on and returned to',
]

const AVOID_WHEN = [
  'The content is short and disposable, which is a standard bottom sheet',
  'A single decision is being asked for, which is a dialog',
  'The destination is a place in the app rather than a task, which is navigation',
]

const BEHAVIOR_RULES = [
  ['It comes up the full height of the screen',
   `The sheet travels from ${SCREEN_H} to 0, the whole screen, over ${FLOW_MS}ms. Once it has arrived it is what the user is looking at; the screen behind is only a place to come back to.`],
  ['The scrim goes with it',
   `${SCRIM_COLOR} to ${SCRIM_MAX * 100}%, the same as a standard sheet. It is behind a full-height surface, so it is barely seen, but it is what the screen behind is left under.`],
  ['Swipe down to dismiss is disabled',
   'Deliberately, and this is the whole difference from a standard bottom sheet. These sheets carry a flow with user input, and an accidental drag must never discard it.'],
  ['It closes by back or by a control',
   'A close control in the sheet, or the platform back gesture. Both are explicit, and both can be given a confirmation when there is something to lose.'],
  ['The entrance is unchanged from a bottom sheet',
   `Same ${FLOW_MS}ms, same curve, same scrim. Only the height and the dismissal differ, which keeps the two patterns feeling like one family.`],
  ['The screen behind is kept',
   'It is not rebuilt when the flow closes. The user returns to what they left, in the state they left it.'],
]

const SPEC_ROWS = [
  ['Total duration',  `${FLOW_MS}ms`],
  ['Easing',          FLOW_EASE],
  ['Sheet Y',         `${SCREEN_H} to 0, the full height of the screen`],
  ['Scrim',           `${SCRIM_COLOR}, opacity 0 to ${SCRIM_MAX * 100}%`],
  ['Dismissal',       'Back navigation or an explicit close control. Swipe down is disabled.'],
  ['Exit',            'The entrance reversed, on the same duration and curve.'],
  ['Reduced motion',  'The sheet and the scrim change state without travelling.'],
  ['Rollout',         'New features only. Existing full-height sheets are not retrofitted.'],
  ['Source',          'Motion system, node 1:4201, with the sticky on that frame and the team answers on nodes 1:4107 and 1:4121, item 3'],
]

const STATE_ROWS = [
  ['Closed',     'No sheet, no scrim. The screen behind is untouched.'],
  ['Entering',   `The sheet rises the full ${SCREEN_H} as the scrim reaches ${SCRIM_MAX * 100}%.`],
  ['In the flow', 'The sheet is the screen. What is behind it is out of reach until it closes.'],
  ['Dragged',    'Nothing. The gesture is not a dismissal here.'],
  ['Closing',    'By back or by the close control: the sheet leaves downward and the scrim clears.'],
]

const ACCESSIBILITY_RULES = [
  ['The screen behind is not reachable',
   'While the flow is open, everything under it is out of the tab order.'],
  ['Closing is always available',
   'The close control is in the sheet, not only in a gesture. Since drag is disabled here, a visible control is the only route and must always be present.'],
  ['Focus moves in and comes back',
   'Focus enters the flow when it opens and returns to the control that opened it when it closes.'],
]

const ENGINEERING_ROWS = [
  ['Turn the platform gesture off, do not just ignore it',
   'Both platforms give a sheet swipe-to-dismiss by default. It has to be disabled on this variant, not left enabled and handled: a half-dismissed sheet that springs back still looks like the flow is about to be thrown away.'],
  ['Confirm before discarding',
   'Back and the close control are explicit, but they can still lose work. Where there is input, ask before discarding it. The gesture is disabled precisely because it cannot ask.'],
  ['Keep the screen behind mounted',
   'The flow is a detour. Rebuilding what was behind it on close is what loses scroll position and re-runs requests the user already waited for.'],
  ['The entrance is shared with the bottom sheet',
   'Same duration, curve and scrim. Implement them once for both variants and vary only the height and the dismissal, or the two drift apart over time.'],
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NewFlowEntry() {
  return (
    <>
      <DocSection id="demo" title="Demo">
        <NewFlowEntryDemo />
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
          Read from the Motion system file. The entrance is the same as a
          standard bottom sheet; the dismissal is what makes this its own
          pattern.
        </P>
        <RuleTable rows={SPEC_ROWS} labelWidth={200} />
        <div style={{ marginTop: 12 }}>
          <Note title="Why the gesture is off.">
            These sheets contain flows with user input. A swipe down is easy to
            trigger by accident and cannot ask whether you meant it, so it is
            disabled here and kept on standard bottom sheets, which hold nothing
            worth losing.
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
