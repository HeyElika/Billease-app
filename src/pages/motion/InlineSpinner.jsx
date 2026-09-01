/**
 * Inline spinner — a pattern under Motion / Loader.
 *
 * Read out of public/motion/spinner.json, the file this page offers for
 * download. The demo plays that file rather than a rebuild of it.
 *
 * The file draws at a base of 48 x 48 scaled 800% inside a 1500 x 1125
 * composition, so the ring covers 25.6% of the composition width. Everything
 * below is quoted against the ring rather than against the box, since the ring
 * is what the user sees.
 */

import { useState } from 'react'
import { LOTTIE_SPINNER } from '../../data/motion'
import LottiePlayer from './LottiePlayer'
import {
  DocSection, P, DemoCard, RuleTable, UsageList, Note,
  ReplayButton, LottieAsset,
} from './docs'

// ─── Values, all read from the file ──────────────────────────────────────────

const FPS         = 30
const FRAMES      = 33
const LOOP_MS     = Math.round((FRAMES / FPS) * 1000)          // 1100
const TURN_FRAMES = 32
const TURN_MS     = Math.round((TURN_FRAMES / FPS) * 1000)     // 1067
const RING_PCT    = 25.6                                        // ring width as a share of the composition
const BOX_FACTOR  = 3.9                                         // composition box per unit of ring
const ARC_DEG     = 90

/** A ring of `d` pixels needs a composition box this wide. */
const boxFor = (d) => Math.round(d * BOX_FACTOR)

const SIZES = [16, 24, 32]

// ─── Demo ─────────────────────────────────────────────────────────────────────

/**
 * The ring only covers a quarter of the composition it ships in, so the player
 * is sized against the composition and cropped back to the ring. This is the
 * same arithmetic a screen has to do, which is why it is in the demo rather
 * than hidden behind a hand-picked box size.
 */
function Spinner({ ring }) {
  const box = boxFor(ring)
  return (
    <div style={{ width: ring, height: ring, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
        <LottiePlayer src={LOTTIE_SPINNER} width={box} height={box * 0.75} label="Loading" />
      </div>
    </div>
  )
}

function InlineSpinnerDemo() {
  const [run, setRun] = useState(0)

  return (
    <DemoCard
      label="Working"
      action={<ReplayButton onClick={() => setRun(n => n + 1)} />}
      stageStyle={{ padding: '32px 28px' }}
    >
      <div key={run} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          {SIZES.map(ring => (
            <div key={ring} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <Spinner ring={ring} />
              <span style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: 'var(--text-subtle)' }}>
                {ring}px
              </span>
            </div>
          ))}
        </div>

        <span style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: 'var(--text-subtle)', textAlign: 'center', maxWidth: '48ch' }}>
          One turn every {TURN_MS}ms at a constant speed. The stroke scales with
          the ring, so the weight reads the same at every size.
        </span>
      </div>
    </DemoCard>
  )
}

// ─── Content ──────────────────────────────────────────────────────────────────

const USE_WHEN = [
  'One component is working while the rest of the screen stays usable',
  'The wait is attached to a specific control or region',
  'There is no content shape to stand in for, so a skeleton would be guesswork',
  'The space is too small for anything else to fit',
]

const AVOID_WHEN = [
  'A whole screen is waiting, which is the page loader',
  'The shape of the incoming content is known, which is the skeleton loader',
  'The wait has a measurable percentage, which needs a progress indicator',
  'Several spinners would end up running on one screen at once',
]

const BEHAVIOR_RULES = [
  ['It stays inside its component',
   'The spinner sits in the control or region that is working. The rest of the screen keeps its content and stays readable.'],
  ['Nothing moves around it',
   'The component holds its size while the spinner runs. If a label is replaced by a spinner, the box does not resize, so the layout stays still.'],
  ['It turns at a constant speed',
   'The rotation is linear from start to finish. It never accelerates into the turn or slows out of it.'],
  ['The track stays put',
   'Only the arc moves. The full circle behind it is static and shows the path the arc travels.'],
  ['It loops until the work finishes',
   'There is no fixed duration. It is removed by the work completing, never by a timer.'],
  ['It never reports progress',
   'A quarter of the ring, always. The arc length does not grow with completion.'],
  ['The stroke scales with the ring',
   'The weight is 1/24 of the ring, so a 16px and a 32px spinner read as the same object at two sizes rather than as two different weights.'],
  ['A failure removes it',
   'When the work fails the spinner goes and the component shows its result. It must never keep turning over a request that has come back.'],
]

const SPEC_ROWS = [
  ['Rotation',        `${TURN_MS}ms per turn, 0 to 360 degrees over ${TURN_FRAMES} frames`],
  ['Easing',          'Linear. The control points sit on the diagonal, so there is no ease at either end.'],
  ['Loop length',     `${LOOP_MS}ms, ${FRAMES} frames at ${FPS}fps`],
  ['Dismissal',       'On the work completing. Not timed.'],
  ['Arc',             `${ARC_DEG} degrees, a quarter of the ring, with a round cap`],
  ['Arc colour',      'bg/secondary, #265CE5'],
  ['Track',           'The full circle, static, #535353 at 20% opacity'],
  ['Stroke',          'Drawn as 2 at a base of 48, so it stays 1/24 of the ring at any size'],
  ['Base geometry',   'Radius 23 at a base of 48, centred in the composition'],
  ['Reduced motion',  'The spinner keeps turning. It is the only signal the component is working, and one turn per second is nowhere near a flash risk.'],
]

const STATE_ROWS = [
  ['Idle',      'No spinner. The component shows its normal content.'],
  ['Working',   `The spinner appears in place and turns at ${TURN_MS}ms per revolution for as long as the work is open.`],
  ['Resolved',  'The spinner is removed and the result takes its place. The turn is not allowed to finish first.'],
  ['Failed',    'The spinner is removed and the component shows its error state.'],
  ['Cancelled', 'Leaving the screen destroys the animation. It must not be left turning off screen.'],
]

const ACCESSIBILITY_RULES = [
  ['Announce the wait, not the ring',
   'The component carries a live status with a text label such as Loading. The ring itself is decorative and is hidden from assistive technology.'],
  ['Mark the component busy',
   'Set the busy state on the component that is working and clear it when the result arrives, so the change is announced once rather than on every turn.'],
  ['Keep the control blocked while it runs',
   'A control showing a spinner has already been used. It must not accept a second press until the work comes back.'],
]

const ENGINEERING_ROWS = [
  ['The box is 3.9x the ring',
   `The ring covers ${RING_PCT}% of the composition width, so a ${24}px spinner needs a ${boxFor(24)}px composition box. Size the box, then check the ring, not the other way round.`],
  ['One frame stalls at the seam',
   `The rotation key lands on frame ${TURN_FRAMES} while the composition runs to ${FRAMES}, so the arc holds for one frame, 33ms, at every repeat. It is slight, and it is a fault in the file rather than something to reproduce.`],
  ['Loop the player, do not remount it',
   'Set the player to loop and leave it alone. Restarting it on every render resets the angle and shows as a jump.'],
  ['Destroy it on unmount',
   'An animation left running after its component has gone keeps a timer alive. Destroy it when the spinner is removed.'],
  ['A CSS fallback is legitimate here',
   `Unlike the page loader, this motion is one linear rotation, so a ${TURN_MS}ms linear infinite rotate is a faithful fallback where a player cannot be used. The geometry and the colours still have to match the file.`],
  ['Reserve the space before it appears',
   'Swapping a label for a spinner inside a control has to keep the control the same size, or the layout jumps at the exact moment the user is waiting.'],
]

const LOTTIE_ROWS = [
  ['File',         'spinner.json'],
  ['Loop',         `${LOOP_MS}ms`],
  ['Renderer',     'SVG. No expressions, so the light build of the player is enough.'],
  ['Colours',      'Arc bg/secondary #265CE5. Track #535353 at 20%, which is not a token.'],
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InlineSpinner() {
  return (
    <>
      <DocSection id="demo" title="Demo">
        <InlineSpinnerDemo />
              <div style={{ marginTop: 16 }}>
          <LottieAsset name="spinner.json" href={LOTTIE_SPINNER} rows={LOTTIE_ROWS} />
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
          Read out of the file. Geometry is quoted against the ring, since the
          ring is what the user sees and the composition it ships in is
          considerably larger.
        </P>
        <RuleTable rows={SPEC_ROWS} labelWidth={200} />
        <div style={{ marginTop: 12 }}>
          <Note title="The track grey is not a token.">
            The file paints the track #535353 at 20%. The nearest neutrals are
            #606C79 and #97A1AB, so this belongs to no token in the set. Logged
            as a missing token rather than added to the palette.
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

        
        <div style={{ marginTop: 12 }}>
          <Note title="Worth tightening at source.">
            Two things would make the file easier to use: cropping the
            composition to the ring, so the box and the artwork are the same
            size, and moving the rotation key one frame later, so the turn fills
            the loop and the stall at the seam goes.
          </Note>
        </div>
      </DocSection>
    </>
  )
}
