/**
 * Dialog — a pattern under Motion / Overlays.
 *
 * Read from the Motion system file, node 1:4263:
 *
 *   Total duration   400ms
 *   Easing           0.9, 0, 0.1, 1
 *   Dialog scale     80% to 100%
 *   Dialog opacity   0% to 100%
 *   Scrim            #000000, opacity 0 to 50%
 *
 * There is no Dialog component in src/components/ds, so the demo below builds
 * the shape from tokens to carry the motion. Logged as a missing component
 * rather than treated as one that exists.
 */

import { useState } from 'react'
import Button from '../../components/ds/Button'
import { PhoneMock, StatusBar, AndroidNavBar } from '../flows/PhoneMockShared'
import { DocSection, P, DemoCard, RuleTable, UsageList, Note } from './docs'

// ─── Values, from node 1:4263 ────────────────────────────────────────────────

const DIALOG_MS   = 400
const DIALOG_EASE = 'cubic-bezier(0.9, 0, 0.1, 1)'
const SCALE_FROM  = 0.8
const SCRIM_COLOR = '#000000'
const SCRIM_MAX   = 0.5

const PHONE_SCALE = 0.46

const CSS = `
  .dlg, .dlg-scrim { transition-duration: ${DIALOG_MS}ms; transition-timing-function: ${DIALOG_EASE}; }
  .dlg { transition-property: transform, opacity; }
  .dlg-scrim { transition-property: opacity; }
  @media (prefers-reduced-motion: reduce) {
    /* The scale goes; appearing and leaving do not. */
    .dlg { transition-property: opacity; transform: none !important; }
    .dlg, .dlg-scrim { transition-duration: 1ms; }
  }
`

// ─── Demo ─────────────────────────────────────────────────────────────────────

function DialogDemo() {
  const [open, setOpen] = useState(false)

  return (
    <DemoCard label="Asking for a decision" stageStyle={{ padding: '28px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <style>{CSS}</style>
        <PhoneMock scale={PHONE_SCALE}>
          <StatusBar />
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: 'var(--canvas-default)' }}>
            <div style={{ padding: 'var(--space-500)', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ marginTop: 'auto' }}>
                <Button type="ghost-destructive" size="lg" label="Close my account" fullWidth onClick={() => setOpen(true)} />
              </div>
            </div>

            <div
              className="dlg-scrim"
              style={{
                position: 'absolute', inset: 0, backgroundColor: SCRIM_COLOR,
                opacity: open ? SCRIM_MAX : 0, pointerEvents: open ? 'auto' : 'none',
              }}
            />

            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
              justifyContent: 'center', padding: 'var(--space-500)',
              pointerEvents: open ? 'auto' : 'none',
            }}>
              <div
                className="dlg"
                role="dialog"
                aria-modal="true"
                aria-label="Close my account"
                style={{
                  width: '100%', backgroundColor: 'var(--bg-base)',
                  borderRadius: 'var(--radius-xl)', padding: 'var(--space-500)',
                  display: 'flex', flexDirection: 'column', gap: 'var(--space-400)',
                  fontFamily: 'var(--ds-font-family)',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.18)',
                  transform: open ? 'scale(1)' : `scale(${SCALE_FROM})`,
                  opacity: open ? 1 : 0,
                }}
              >
                <span style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-base)' }}>
                  Close my account?
                </span>
                <span style={{ fontSize: 'var(--text-md)', color: 'var(--text-subtle)', lineHeight: 1.5 }}>
                  Your remaining balance is transferred out first. This cannot be undone.
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-200)' }}>
                  <Button type="primary" size="lg" label="Keep my account" fullWidth onClick={() => setOpen(false)} />
                  <Button type="ghost-destructive" size="lg" label="Close it" fullWidth onClick={() => setOpen(false)} />
                </div>
              </div>
            </div>
          </div>
          <AndroidNavBar />
        </PhoneMock>
        <span style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: 'var(--text-subtle)', textAlign: 'center', maxWidth: '48ch' }}>
          It grows from {SCALE_FROM * 100}% as it fades in, centred, over a screen that
          does not move. Either answer closes it the same way.
        </span>
      </div>
    </DemoCard>
  )
}

// ─── Content ──────────────────────────────────────────────────────────────────

const USE_WHEN = [
  'A decision is needed before anything else can happen',
  'The consequence is worth stopping for: destructive, irreversible or costly',
  'The question is short enough to answer without leaving the screen',
]

const AVOID_WHEN = [
  'The message only needs saying, which is a toast',
  'The content is long enough to scroll, which is a sheet',
  'The user could reasonably carry on without answering, in which case do not interrupt',
]

const BEHAVIOR_RULES = [
  ['It grows into place, centred',
   `The dialog goes from ${SCALE_FROM * 100}% to full size while it fades from nothing, over ${DIALOG_MS}ms. It arrives where it will stay: it does not travel across the screen.`],
  ['The scrim arrives with it',
   `${SCRIM_COLOR} to ${SCRIM_MAX * 100}% on the same duration and curve. Half the screen's light is what says the rest of it is unavailable.`],
  ['The screen behind does not move',
   'No push, no scale, no blur. It stays exactly as it was, because the user is coming straight back to it.'],
  ['It waits for an answer',
   'A dialog exists to ask something, so it stays until one of its actions is chosen. Nothing dismisses it on a timer.'],
  ['Leaving is the arrival reversed',
   `${DIALOG_MS}ms back to ${SCALE_FROM * 100}% and nothing, with the scrim clearing at the same time.`],
]

const SPEC_ROWS = [
  ['Total duration',  `${DIALOG_MS}ms`],
  ['Easing',          DIALOG_EASE],
  ['Scale',           `${SCALE_FROM * 100}% to 100%, from the centre`],
  ['Opacity',         '0% to 100%'],
  ['Scrim',           `${SCRIM_COLOR}, opacity 0 to ${SCRIM_MAX * 100}%`],
  ['Exit',            'The entrance reversed, same duration and curve'],
  ['Reduced motion',  'No scale. It appears and goes without growing.'],
  ['Source',          'Motion system, node 1:4263'],
]

const STATE_ROWS = [
  ['Closed',   'No dialog, no scrim.'],
  ['Opening',  `Growing from ${SCALE_FROM * 100}% and fading in as the scrim reaches ${SCRIM_MAX * 100}%.`],
  ['Open',     'Centred over a dimmed screen that has not moved. Waiting for an answer.'],
  ['Closing',  `Back to ${SCALE_FROM * 100}% and nothing, scrim clearing with it.`],
]

const ACCESSIBILITY_RULES = [
  ['The screen behind is not reachable',
   'While the dialog is open, everything under the scrim is out of the tab order and focus stays inside the dialog.'],
  ['Focus moves in and comes back',
   'Focus enters the dialog when it opens and returns to the control that opened it when it closes.'],
  ['Answering must not depend on the motion',
   'The actions are reachable the moment the dialog is open. Nothing waits for the animation to finish.'],
  ['Reduced motion drops the scale only',
   'The dialog still appears, the scrim still dims, the question is still asked.'],
]

const ENGINEERING_ROWS = [
  ['Scale from the centre, and only the transform',
   'transform-origin at the centre, and animate transform and opacity. Animating width and height instead reflows the text inside it on every frame and reads as the dialog assembling itself.'],
  ['Bind the scrim to the dialog',
   'One state drives both, so they can never disagree about whether the dialog is open.'],
  ['Do not touch the screen behind',
   'Blurring or scaling it is a different pattern, and it costs a full-screen repaint on every frame of a 400ms animation.'],
  ['Keep it above everything',
   'A dialog that renders inside a scrolling or clipping container can be cut off. Render it at the top of the tree.'],
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DialogDocs() {
  return (
    <>
      <DocSection id="demo" title="Demo">
        <DialogDemo />
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
        <P>Read from the Motion system file.</P>
        <RuleTable rows={SPEC_ROWS} labelWidth={200} />
        <div style={{ marginTop: 12 }}>
          <Note title="Not settled in the file.">
            Whether tapping the scrim dismisses a dialog is not specified. The
            demo leaves it inert, since a dialog is asking a question and a tap
            outside is not an answer, but that is a reading rather than a rule.
          </Note>
        </div>
        <div style={{ marginTop: 12 }}>
          <Note title="Missing component: Dialog.">
            There is no Dialog in the design system. The demo builds the shape
            from tokens to carry the motion, and the two DS buttons in it are
            real. The component itself still needs designing and building.
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
