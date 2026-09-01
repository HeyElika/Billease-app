/**
 * OTP error shake — a pattern under Motion / Feedback & status.
 *
 * Read from the Motion system file, node 1:4385, with the amplitude note on the
 * frame and the Android confirmation sticky:
 *
 *   Total duration   400ms, four 100ms sub-moves
 *   Amplitude        ±4 from centre: X 28 → 24 → 28 → 24 → 28
 *   Easing           Bouncy, on each sub-move
 *   Haptics          At the start of the animation
 *   Platforms        Identical. Android retunes from its previous 8dp.
 *
 * The four parts are the specification, not an implementation detail: an 8px
 * shake and a 4px shake say different things, and the file is explicit that
 * both platforms land on the smaller one.
 */

import { useState } from 'react'
import OTPInput from '../../components/ds/OTPInput'
import { DocSection, P, DemoCard, RuleTable, UsageList, Note, ReplayButton } from './docs'

// ─── Values, from node 1:4385 ────────────────────────────────────────────────

const SHAKE_MS   = 400
const PARTS      = 4
const PART_MS    = SHAKE_MS / PARTS    // 100
const AMPLITUDE  = 4                   // ±4 from centre
const DEMO_EASE  = 'cubic-bezier(0.34, 1.4, 0.64, 1)'   // the demo's reading of "Bouncy"

const CSS = `
  @keyframes otp-shake {
    0%   { transform: none; }
    25%  { transform: translateX(-${AMPLITUDE}px); }
    50%  { transform: none; }
    75%  { transform: translateX(-${AMPLITUDE}px); }
    100% { transform: none; }
  }
  .otp-shake { animation: otp-shake ${SHAKE_MS}ms ${DEMO_EASE} both; }
  /* Reduced motion: the message stays, the movement goes. The error is carried
     by the colour and the text, never by the shake. */
  @media (prefers-reduced-motion: reduce) {
    .otp-shake { animation: none; }
  }
`

// ─── Demo ─────────────────────────────────────────────────────────────────────

function ShakeDemo() {
  const [run, setRun] = useState(0)

  return (
    <DemoCard
      label="Wrong code"
      action={<ReplayButton onClick={() => setRun(n => n + 1)} label="Shake" />}
      stageStyle={{ padding: '40px 28px' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <style>{CSS}</style>
        <div key={run} className={run ? 'otp-shake' : undefined}>
          <OTPInput
            type="OTP-mobile"
            values={['5', '5', '5', '5', '5', '5']}
            showError
            errorMessage="Incorrect code, please try again"
          />
        </div>
        <span style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: 'var(--text-subtle)', textAlign: 'center', maxWidth: '46ch' }}>
          Four {PART_MS}ms moves of {AMPLITUDE}px either side of centre. A haptic fires as it
          starts, not when it finishes.
        </span>
      </div>
    </DemoCard>
  )
}

// ─── Content ──────────────────────────────────────────────────────────────────

const USE_WHEN = [
  'A code was entered and rejected',
  'The field stays where it is and can be corrected immediately',
  'The failure is the user’s to fix, right now, in place',
]

const AVOID_WHEN = [
  'The failure is not about what was typed, such as a network error',
  'The user is out of attempts and the screen is changing',
  'Anything that is not an input rejecting its own contents',
]

const BEHAVIOR_RULES = [
  ['Four moves, not a wobble',
   `X goes 28 → 24 → 28 → 24 → 28: ${AMPLITUDE}px either side of centre, four ${PART_MS}ms parts, ${SHAKE_MS}ms in total. It ends exactly where it started.`],
  ['The haptic fires at the start',
   'At the beginning of the animation, not at the end and not on each pass. It is part of the same single event as the shake.'],
  ['It plays once',
   'One shake per rejection. It does not repeat while the code stays wrong, and a second attempt is a second shake.'],
  ['The whole field moves',
   'The group shakes as one object. Individual cells never move against each other: that reads as the component coming apart rather than as a rejection.'],
  ['The shake is not the message',
   'The field also turns to its error state and says what happened. The movement draws the eye; the colour and the text carry the meaning.'],
  ['Both platforms are identical',
   'The file is explicit: Android retunes from its previous 8dp to match. A shake at twice the amplitude reads as a different, angrier component.'],
]

const SPEC_ROWS = [
  ['Total duration',  `${SHAKE_MS}ms`],
  ['Parts',           `${PARTS} × ${PART_MS}ms`],
  ['Amplitude',       `±${AMPLITUDE} from centre, X 28 → 24 → 28 → 24 → 28`],
  ['Easing',          'Bouncy, on each sub-move'],
  ['Haptics',         'At the start of the animation'],
  ['Platforms',       'Identical on both. Android retunes from 8dp.'],
  ['Reduced motion',  'No movement. The error state and the message remain.'],
  ['Source',          'Motion system, node 1:4385, with the amplitude note and Android sticky on that frame'],
]

const STATE_ROWS = [
  ['Rejected',  `The field shakes once over ${SHAKE_MS}ms and takes its error styling, with a haptic at the start.`],
  ['After',     'It rests at centre, still in the error state, with the message under it.'],
  ['Corrected', 'The error state clears as the user edits. Nothing animates on the way out.'],
  ['Rejected again', 'A second shake, identical to the first.'],
]

const ACCESSIBILITY_RULES = [
  ['The message does the work',
   'The rejection is announced as text. Someone who cannot see the shake, or has it turned off, is told exactly the same thing.'],
  ['Never colour alone',
   'The field turns red and says what is wrong. Colour on its own is not a message.'],
]

const ENGINEERING_ROWS = [
  ['Animate the group, not the cells',
   'One transform on the field. Shaking each cell separately, or staggering them, turns a rejection into a malfunction.'],
  ['Fire the haptic once, at the start',
   'Not per sub-move. Four haptics in 400ms is a buzz, and it is a different signal entirely.'],
  ['Return to exactly centre',
   'The last part ends at the starting X. A shake that leaves the field a pixel off is visible on a field with a border.'],
  ['Retrigger by replaying, not by queueing',
   'A second rejection restarts the shake from the beginning rather than adding another one behind it.'],
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OtpErrorShake() {
  return (
    <>
      <DocSection id="demo" title="Demo">
        <ShakeDemo />
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
          <Note title="Bouncy is a name, not a curve.">
            The file says Bouncy and does not give control points. The demo reads
            it as {DEMO_EASE}, the same slight overshoot the carousel uses at its
            ends, but that is the demo’s choice and not documented. Worth pinning
            down in the file so both platforms shake the same way.
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
