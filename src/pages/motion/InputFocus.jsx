/**
 * Input focus — a pattern under Motion / Controls & interactions.
 *
 * Read from the Motion system file, node 1:4340:
 *
 *   Total duration   200ms
 *   Easing           0.9, 0, 0.1, 1
 *   Fill             BG/Sunken (EAEDF0) to BG/Base (FFFFFF)
 *   Stroke           Border/Active (265CE5), opacity 0% to 100%
 *
 * The same shape as the OTP success state: the field brightens and outlines
 * itself. Here it happens in 200ms and says "you are typing here" rather than
 * "that was accepted".
 */

import { useState } from 'react'
import InputField from '../../components/ds/InputField'
import { DocSection, P, DemoCard, RuleTable, UsageList, Note } from './docs'

// ─── Values, from node 1:4340 ────────────────────────────────────────────────

const FOCUS_MS    = 200
const FOCUS_EASE  = 'cubic-bezier(0.9, 0, 0.1, 1)'
const FILL_FROM   = 'BG/Sunken (EAEDF0)'
const FILL_TO     = 'BG/Base (FFFFFF)'
const STROKE      = 'Border/Active (265CE5)'

// What the component does today, which is not the same thing.
const BUILT_MS    = 120
const BUILT_EASE  = 'the browser default ease'

// ─── Demo ─────────────────────────────────────────────────────────────────────

function FocusDemo() {
  const [focused, setFocused] = useState(false)

  return (
    <DemoCard label="Tap the field" stageStyle={{ padding: '40px 28px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%' }}>
        <div
          style={{ width: 320, cursor: 'pointer' }}
          onClick={() => setFocused(v => !v)}
        >
          <InputField
            size="lg"
            state={focused ? 'focused' : 'default'}
            label="Account name"
            placeholder="Enter text"
            value=""
          />
        </div>
        <span style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: 'var(--text-subtle)', textAlign: 'center', maxWidth: '48ch' }}>
          The fill goes from sunken to base and the active border comes up from
          nothing. Tap again to let it go.
        </span>
      </div>
    </DemoCard>
  )
}

// ─── Content ──────────────────────────────────────────────────────────────────

const USE_WHEN = [
  'A field takes focus, by tap or by keyboard',
  'The user needs to know where their typing is going',
  'The field is editable: a disabled or read-only field does not do this',
]

const AVOID_WHEN = [
  'The field is rejecting its contents, which is the error state',
  'The change is a value being accepted, which is the success state',
  'Nothing is focused, such as a screen simply appearing with a field on it',
]

const BEHAVIOR_RULES = [
  ['The field brightens and outlines itself',
   `Fill goes from ${FILL_FROM} to ${FILL_TO} while a ${STROKE} stroke comes up from nothing to full. Two changes, one moment.`],
  ['It is fast enough to feel like a response',
   `${FOCUS_MS}ms. This runs on every field a user touches, so it has to be quick: anything slower reads as the interface thinking rather than responding.`],
  ['Nothing moves',
   'No scale, no lift, no travel. Focus is a change of state on a control that stays exactly where it is.'],
  ['Losing focus is the same in reverse',
   'The fill returns to sunken and the stroke fades out. A field left with a lit border is a field the user thinks they are still in.'],
  ['The stroke fades, it does not appear',
   'Opacity from 0 to 100, not a border switched on. A border that pops into existence at full strength reads as a jump at this duration.'],
]

const SPEC_ROWS = [
  ['Total duration',  `${FOCUS_MS}ms`],
  ['Easing',          FOCUS_EASE],
  ['Fill',            `${FILL_FROM} to ${FILL_TO}`],
  ['Stroke',          `${STROKE}, opacity 0% to 100%`],
  ['Movement',        'None'],
  ['Blur',            'The same values reversed'],
  ['Reduced motion',  'The state still changes. There is no movement to remove.'],
  ['Source',          'Motion system, node 1:4340'],
]

const STATE_ROWS = [
  ['Default',  'Sunken fill, no stroke.'],
  ['Focusing', `Fill lifting to base as the stroke comes up, over ${FOCUS_MS}ms.`],
  ['Focused',  'Base fill with the active stroke at full strength.'],
  ['Typing',   'Unchanged. Entering text does not re-run the animation.'],
  ['Blurred',  'Back to sunken with the stroke faded out.'],
]

const ACCESSIBILITY_RULES = [
  ['Focus must be visible for keyboard users too',
   'The same state applies whether focus came from a tap or from a keyboard. A field that only lights up on tap leaves keyboard users guessing.'],
  ['Contrast, not just colour',
   'The fill change carries the state as well as the stroke, so focus does not rest on one blue border alone.'],
  ['Reduced motion changes nothing here',
   'There is no movement to remove, and 200ms of colour is not a motion risk.'],
]

const ENGINEERING_ROWS = [
  ['Animate opacity, not the border itself',
   'Draw the stroke at full width with opacity 0 and fade it in. Transitioning border-width or switching border from none reflows the box and shifts the text inside it by a pixel.'],
  ['One transition for both properties',
   'The fill and the stroke are one state change, on one duration and one curve.'],
  ['Do not re-run it while typing',
   'Focus is entered once. Rerunning the animation on every keystroke is a common bug when the state is derived from the value rather than from focus.'],
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InputFocus() {
  return (
    <>
      <DocSection id="demo" title="Demo">
        <FocusDemo />
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
          <Note title="The component does not match this yet.">
            InputField transitions its background and border colour over
            {' '}{BUILT_MS}ms on {BUILT_EASE}, and switches the border on rather
            than fading its opacity. The file says {FOCUS_MS}ms on {FOCUS_EASE}
            with the stroke going 0 to 100%. The demo above is the component as
            it is built today, so what you see is {BUILT_MS}ms. Worth bringing
            the component in line.
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
