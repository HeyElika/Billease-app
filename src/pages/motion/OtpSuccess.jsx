/**
 * OTP success — a pattern under Motion / Feedback & status.
 *
 * Read from the Motion system file, node 1:4432, and confirmed again in the
 * amplitude note on the error shake frame:
 *
 *   Total duration   400ms
 *   Easing           0.9, 0, 0.1, 1
 *   Scale            100% to 102%
 *   Fill             BG/Sunken to BG/Base
 *   Stroke           #13BD85, opacity 0% to 100%
 *
 * Two per cent is the whole movement. It is a confirmation, not a celebration:
 * the code was right and the screen is about to move on.
 */

import { useState } from 'react'
import OTPInput from '../../components/ds/OTPInput'
import { DocSection, P, DemoCard, RuleTable, UsageList, Note, ReplayButton } from './docs'

// ─── Values, from node 1:4432 ────────────────────────────────────────────────

const OK_MS     = 400
const OK_EASE   = 'cubic-bezier(0.9, 0, 0.1, 1)'
const SCALE_TO  = 1.02
const STROKE    = '#13BD85'      // border/success

const CSS = `
  @keyframes otp-ok { from { transform: none; } to { transform: scale(${SCALE_TO}); } }
  .otp-ok { animation: otp-ok ${OK_MS}ms ${OK_EASE} both; }
  @media (prefers-reduced-motion: reduce) {
    .otp-ok { animation: none; }
  }
`

// ─── Demo ─────────────────────────────────────────────────────────────────────

function SuccessDemo() {
  const [run, setRun] = useState(0)

  return (
    <DemoCard
      label="Code accepted"
      action={<ReplayButton onClick={() => setRun(n => n + 1)} label="Accept" />}
      stageStyle={{ padding: '40px 28px' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <style>{CSS}</style>
        <div key={run} className={run ? 'otp-ok' : undefined}>
          <OTPInput type="OTP-mobile" values={['8', '5', '5', '6', '9', '4']} />
        </div>
        <span style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: 'var(--text-subtle)', textAlign: 'center', maxWidth: '48ch' }}>
          The field grows two per cent over {OK_MS}ms. The fill and the green stroke
          are the other half of the state, and the component cannot show them yet.
        </span>
      </div>
    </DemoCard>
  )
}

// ─── Content ──────────────────────────────────────────────────────────────────

const USE_WHEN = [
  'A code has been accepted and the screen is about to move on',
  'The confirmation is worth half a second before the next screen',
  'The field itself is what succeeded, so the field is what reacts',
]

const AVOID_WHEN = [
  'The code was accepted but something else then failed',
  'The screen changes immediately, where the animation is never seen',
  'Anything larger than the field is being confirmed, which is a screen-level pattern',
]

const BEHAVIOR_RULES = [
  ['It grows two per cent',
   `Scale 100% to ${SCALE_TO * 100}% over ${OK_MS}ms. Enough to register as a reaction, far too little to read as a celebration.`],
  ['The cells fill and take a green stroke',
   `Fill goes from BG/Sunken to BG/Base and a ${STROKE} stroke comes up from nothing to full. The field brightens and outlines itself: that is the confirmation.`],
  ['The whole field reacts as one',
   'The group scales together. Cells never animate individually, and nothing is staggered across them.'],
  ['It plays once, then the screen moves on',
   'This is the last thing the field does. It is not a resting state to sit in.'],
  ['The colour carries it, the movement supports it',
   'Under reduced motion the fill and the stroke still happen. Two per cent of scale is the part that can go.'],
]

const SPEC_ROWS = [
  ['Total duration',  `${OK_MS}ms`],
  ['Easing',          OK_EASE],
  ['Scale',           `100% to ${SCALE_TO * 100}%`],
  ['Fill',            'BG/Sunken to BG/Base'],
  ['Stroke',          `${STROKE}, opacity 0% to 100%`],
  ['Reduced motion',  'No scale. The fill and the stroke still change.'],
  ['Source',          'Motion system, node 1:4432, and restated in the note on node 1:4385'],
]

const STATE_ROWS = [
  ['Complete',  'The last digit is entered and the code is being checked.'],
  ['Accepted',  `The field grows to ${SCALE_TO * 100}%, fills to BG/Base and takes the green stroke, over ${OK_MS}ms.`],
  ['After',     'It holds the accepted look until the screen changes.'],
]

const ACCESSIBILITY_RULES = [
  ['Announce acceptance',
   'The success is a status change, announced as text. A green stroke and 2% of scale are not available to everyone.'],
  ['Never colour alone',
   'The fill and the stroke are the visual half. What happens next, or a message, is the other half.'],
]

const ENGINEERING_ROWS = [
  ['Scale the group, not the cells',
   'One transform on the field so the gaps between cells scale with it. Scaling each cell separately changes the spacing between them.'],
  ['Two per cent is small enough to look like a bug if it is wrong',
   'At this size, an easing with overshoot or a longer duration turns a confirmation into a bounce. Keep the standard curve.'],
  ['The fill and the stroke are the state, not the animation',
   'They persist after the movement finishes. The field stays accepted until the screen changes.'],
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OtpSuccess() {
  return (
    <>
      <DocSection id="demo" title="Demo">
        <SuccessDemo />
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
          <Note title="Missing variant: otp-input/success.">
            The OTP component already carries the success cell styling, BG/Base
            with a {STROKE} border, but no prop reaches it: the group derives
            each cell from focus, value, error and disabled only. The demo can
            therefore show the scale but not the fill and the stroke. The
            component needs a success state exposed before this can be built as
            specified.
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
