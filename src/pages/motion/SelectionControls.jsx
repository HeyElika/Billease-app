/**
 * Radio and checkbox — a pattern under Motion / Controls & interactions.
 *
 * Read from the Motion system file, node 1:4371:
 *
 *   Total duration   400ms
 *   Easing           0.9, 0, 0.1, 1
 *
 * That is all the frame gives. It shows the two ends, an empty outline and a
 * filled control with its mark, but it does not say which properties travel
 * between them. What is animated below is a reading of those two states and is
 * marked as such, not quoted as specification.
 *
 * There is no Radio or Checkbox in src/components/ds either, so the demo is
 * built from tokens. Both gaps are logged rather than papered over.
 */

import { useState } from 'react'
import { DocSection, P, DemoCard, RuleTable, UsageList, Note } from './docs'

// ─── Values, from node 1:4371 ────────────────────────────────────────────────

const SELECT_MS   = 400
const SELECT_EASE = 'cubic-bezier(0.9, 0, 0.1, 1)'

const CSS = `
  .sel-box, .sel-mark { transition-duration: ${SELECT_MS}ms; transition-timing-function: ${SELECT_EASE}; }
  .sel-box  { transition-property: background-color, border-color; }
  .sel-mark { transition-property: transform, opacity; }
  @media (prefers-reduced-motion: reduce) {
    .sel-box, .sel-mark { transition-duration: 1ms; }
  }
`

// ─── Demo ─────────────────────────────────────────────────────────────────────

function Control({ kind, on, onClick }) {
  const round = kind === 'radio'
  return (
    <button
      type="button"
      onClick={onClick}
      role={round ? 'radio' : 'checkbox'}
      aria-checked={on}
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'var(--space-300)' }}
    >
      <span
        className="sel-box"
        style={{
          width: 24, height: 24, boxSizing: 'border-box',
          borderRadius: round ? '50%' : 'var(--radius-sm)',
          backgroundColor: on ? 'var(--bg-primary)' : 'transparent',
          border: `2px solid ${on ? 'var(--bg-primary)' : 'var(--border-strong)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <span
          className="sel-mark"
          style={{
            opacity: on ? 1 : 0,
            transform: on ? 'scale(1)' : 'scale(0.6)',
            ...(round
              ? { width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--bg-base)' }
              : { width: 12, height: 7, borderLeft: '2px solid var(--bg-base)', borderBottom: '2px solid var(--bg-base)', transformOrigin: 'center', rotate: '-45deg', marginTop: -2 }),
          }}
        />
      </span>
      <span style={{ fontFamily: 'var(--ds-font-family)', fontSize: 'var(--text-md)', color: 'var(--text-base)' }}>
        {round ? 'Pay with savings' : 'I agree to the terms'}
      </span>
    </button>
  )
}

function SelectionDemo() {
  const [radio, setRadio] = useState(false)
  const [check, setCheck] = useState(false)

  return (
    <DemoCard label="Choosing and confirming" stageStyle={{ padding: '40px 28px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--space-500)' }}>
        <style>{CSS}</style>
        <Control kind="radio" on={radio} onClick={() => setRadio(v => !v)} />
        <Control kind="checkbox" on={check} onClick={() => setCheck(v => !v)} />
        <span style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: 'var(--text-subtle)', maxWidth: '48ch' }}>
          The box fills and the mark comes up inside it, over {SELECT_MS}ms. Unselecting
          is the same in reverse.
        </span>
      </div>
    </DemoCard>
  )
}

// ─── Content ──────────────────────────────────────────────────────────────────

const USE_WHEN = [
  'A choice is being made in place, with no screen change',
  'The control is small enough that a state change is the whole feedback',
  'The selection is reversible by tapping again',
]

const AVOID_WHEN = [
  'The choice submits something, where the button carries the feedback',
  'A single tap has consequences that need confirming, which is a dialog',
  'The control is a switch between modes, which is a different component',
]

const BEHAVIOR_RULES = [
  ['The box fills, the mark arrives inside it',
   'The container takes its selected fill and border while the dot or the tick comes up inside. One is the state, the other is the confirmation of it.'],
  ['Nothing about it moves position',
   'The control stays where it is and the label does not shift. Only what is inside the box changes.'],
  ['Unselecting is the same in reverse',
   'A checkbox that clears instantly while it fills gradually feels like two different controls.'],
  ['Radio and checkbox behave identically',
   'The same duration, the same curve, the same shape of change. Only the geometry and the mark differ, which is what tells them apart.'],
  ['One tap, one change',
   'No lingering ripple, no bounce after it lands. This runs constantly in forms, so it stays quiet.'],
]

const SPEC_ROWS = [
  ['Total duration',  `${SELECT_MS}ms`],
  ['Easing',          SELECT_EASE],
  ['What animates',   'Not specified in the file. See the note below.'],
  ['Movement',        'None. The control stays in place.'],
  ['Reduced motion',  'The state still changes. There is no travel to remove.'],
  ['Source',          'Motion system, node 1:4371'],
]

const STATE_ROWS = [
  ['Unselected',  'Outline only, no fill, no mark.'],
  ['Selecting',   `Fill and border take the selected colour as the mark comes up, over ${SELECT_MS}ms.`],
  ['Selected',    'Filled, with the dot or the tick at full strength.'],
  ['Unselecting', 'The same, reversed.'],
]

const ACCESSIBILITY_RULES = [
  ['The state is not the animation',
   'Checked or unchecked is reported by the control itself. Someone who never sees the transition still knows what is selected.'],
  ['The whole row is the target',
   'The label is part of the control, so the tap target is the row rather than the 24px box.'],
  ['Never colour alone',
   'The mark inside the box carries the state as well as the fill, so selection does not rest on red against grey.'],
]

const ENGINEERING_ROWS = [
  ['Animate the mark, do not swap the icon',
   'Fading and scaling one mark keeps it centred. Replacing an empty icon with a filled one at 400ms shows the swap.'],
  ['Keep the box the same size',
   'The border thickens visually because it takes a fill, not because the box grows. Changing the border width moves everything beside it.'],
  ['Both controls, one implementation',
   'Radio and checkbox share the duration, the curve and the structure. Building them separately is how they drift apart.'],
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SelectionControls() {
  return (
    <>
      <DocSection id="demo" title="Demo">
        <SelectionDemo />
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
          <Note title="The frame gives timing, not properties.">
            Node 1:4371 specifies {SELECT_MS}ms and {SELECT_EASE} and shows the
            two ends, an empty outline and a filled control with its mark. It
            does not say what travels between them. The behaviour above, fill
            and border with the mark scaling up inside, is a reading of those two
            states rather than a documented list, and is worth confirming in the
            file.
          </Note>
        </div>
        <div style={{ marginTop: 12 }}>
          <Note title="Missing components: Radio, Checkbox.">
            Neither exists in the design system, so this demo is built from
            tokens to carry the motion. The components still need designing and
            building, and this page is not a substitute for them.
          </Note>
        </div>
        <div style={{ marginTop: 12 }}>
          <Note title="A slip in the file.">
            The frame is titled Radio and checkbox but its subtitle reads
            “generic Accordion animation”, copied from the neighbouring frame.
            Worth correcting so the two are not confused.
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
