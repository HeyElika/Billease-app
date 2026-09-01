/**
 * Show and hide value — a pattern under Motion / Controls & interactions.
 *
 * This is the one pattern of the twenty-three with no frame in the Motion
 * system file. The ids there run from App launch (1:4060) to Toast (1:4484)
 * and nothing in between covers it, which is why the taxonomy entry carries no
 * node.
 *
 * What is specified, and what this page documents, is the control: the eye
 * toggle built for the card screens and shipped as eye-toggle.json.
 *
 *   Squash down   100ms, scaleY 100% to 5%
 *   Swap          at the bottom of the squash, while the glyph is invisible
 *   Squash up     110ms back to 100%
 *
 * How the value itself changes between masked and revealed is not specified
 * anywhere. It is left as a gap rather than filled in here.
 */

import { useRef, useState } from 'react'
import BilleaseIcon from '../../assets/icons/BilleaseIcon'
import { DocSection, P, DemoCard, RuleTable, UsageList, Note, LottieAsset } from './docs'

// ─── Values, from the card screens ───────────────────────────────────────────

const DOWN_MS  = 100
const UP_MS    = 110
const TOTAL_MS = DOWN_MS + UP_MS
const SQUASH   = 0.05          // scaleY at the bottom of the squash
const LOTTIE_EYE = '/motion/eye-toggle.json'

const CSS = `
  .sv-eye { display: inline-flex; transition: transform ${DOWN_MS}ms ease-in-out; }
  .sv-eye.is-squashed { transform: scaleY(${SQUASH}); }
  @media (prefers-reduced-motion: reduce) {
    .sv-eye { transition: none; }
  }
`

// ─── Demo ─────────────────────────────────────────────────────────────────────

function ShowHideDemo() {
  const [shown, setShown] = useState(false)
  const [squashed, setSquashed] = useState(false)
  const [glyph, setGlyph] = useState(false)     // which eye is drawn
  const timers = useRef([])

  const toggle = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    const next = !shown
    setShown(next)
    setSquashed(true)
    // The glyph changes while it is flat, so the swap is never seen.
    timers.current.push(setTimeout(() => { setGlyph(next); setSquashed(false) }, DOWN_MS))
  }

  return (
    <DemoCard label="Masked and revealed" stageStyle={{ padding: '40px 28px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <style>{CSS}</style>
        <div style={{
          width: 320, backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)', padding: 'var(--space-400)',
          display: 'flex', flexDirection: 'column', gap: 'var(--space-200)',
          fontFamily: 'var(--ds-font-family)',
        }}>
          <span style={{ fontSize: 'var(--text-md)', color: 'var(--text-subtle)' }}>Available limit</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--text-base)', letterSpacing: shown ? 0 : 2 }}>
              {shown ? '₱25,000.00' : '••••••••'}
            </span>
            <button
              type="button"
              onClick={toggle}
              aria-label={shown ? 'Hide amount' : 'Show amount'}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}
            >
              <span className={`sv-eye${squashed ? ' is-squashed' : ''}`} aria-hidden="true">
                <BilleaseIcon name={glyph ? 'eye-off' : 'show'} size="sm" color="var(--icon-base)" />
              </span>
            </button>
          </div>
        </div>
        <span style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: 'var(--text-subtle)', textAlign: 'center', maxWidth: '48ch' }}>
          The eye squashes flat, changes while nobody can see it, and opens again.
          The amount itself swaps without a transition, because none is specified.
        </span>
      </div>
    </DemoCard>
  )
}

// ─── Content ──────────────────────────────────────────────────────────────────

const USE_WHEN = [
  'A value is masked by default and the user chooses to see it',
  'The control sits beside the value it uncovers',
  'Hiding it again is one tap away, in the same place',
]

const AVOID_WHEN = [
  'Revealing needs authentication first, which is the card flip and its biometric gate',
  'The value is never sensitive, where masking is theatre',
  'The control is somewhere other than beside the value, where nothing connects the two',
]

const BEHAVIOR_RULES = [
  ['The eye squashes rather than swapping',
   `scaleY ${SQUASH * 100}% over ${DOWN_MS}ms, the glyph changes while it is flat, then ${UP_MS}ms back open. ${TOTAL_MS}ms in total, and the change of icon is never seen happening.`],
  ['Down is slightly faster than up',
   `${DOWN_MS}ms closing and ${UP_MS}ms opening. The asymmetry is what makes it read as an eye rather than as an icon being scaled.`],
  ['The control is the only thing that moves',
   'The value is uncovered, not animated in. Nothing about the amount slides, fades or counts up.'],
  ['Both directions are the same',
   'Hiding is the same movement as showing, which is why one Lottie file covers both when played in reverse.'],
]

const SPEC_ROWS = [
  ['Squash down',   `${DOWN_MS}ms, scaleY 100% to ${SQUASH * 100}%`],
  ['Swap',          'At the bottom, while the glyph is flat'],
  ['Squash up',     `${UP_MS}ms, back to 100%`],
  ['Total',         `${TOTAL_MS}ms`],
  ['The value',     'Not specified. See the note below.'],
  ['Reduced motion', 'The glyph changes without the squash. The value still toggles.'],
  ['Source',        'The card screens, and eye-toggle.json built from them. Not the Motion system file.'],
]

const STATE_ROWS = [
  ['Masked',    'Dots in place of the value, eye closed.'],
  ['Revealing', `The eye squashes, changes and opens over ${TOTAL_MS}ms as the value is uncovered.`],
  ['Revealed',  'The value in full, eye open.'],
  ['Hiding',    'The same, in the other direction.'],
]

const ACCESSIBILITY_RULES = [
  ['The control says what it does',
   'Show amount and Hide amount, changing with the state. An eye icon on its own does not say which way it goes.'],
  ['The masked value is masked for readers too',
   'What is announced matches what is on screen. A hidden value that is still readable by assistive technology is not hidden.'],
  ['Reduced motion keeps the toggle',
   'Only the squash goes.'],
]

const ENGINEERING_ROWS = [
  ['Swap at the bottom, not at either end',
   `The glyph changes at ${DOWN_MS}ms, while scaleY is ${SQUASH * 100}%. Swapping before or after that shows the change and turns a blink into a flicker.`],
  ['Scale the glyph, not the button',
   'The tap target keeps its size. Scaling the button moves everything beside it.'],
  ['Reversing the file is correct here',
   'The squash is symmetrical, so one Lottie played backwards covers hiding. That is not true of the lock toggle, whose shackle only shuts one way.'],
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ShowHideValue() {
  return (
    <>
      <DocSection id="demo" title="Demo">
        <ShowHideDemo />
        <div style={{ marginTop: 16 }}>
          <LottieAsset name="eye-toggle.json" href={LOTTIE_EYE} />
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
        <P>
          Read from the card screens rather than the Motion system file, which
          has no frame for this.
        </P>
        <RuleTable rows={SPEC_ROWS} labelWidth={200} />
        <div style={{ marginTop: 12 }}>
          <Note title="No frame in the Motion file.">
            This is the only pattern in the section without one. The slides run
            from App launch to Toast and none of them covers showing or hiding a
            value, so the values here come from the eye toggle built for the card
            screens and shipped as eye-toggle.json. It needs a frame of its own
            before it can be called specified.
          </Note>
        </div>
        <div style={{ marginTop: 12 }}>
          <Note title="The value's own change is undefined.">
            Nothing says how the amount goes from dots to digits: instantly, on a
            crossfade, or by counting. The demo swaps it with no transition,
            which is the smallest assumption available, and it is an assumption.
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
