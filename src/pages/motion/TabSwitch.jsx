/**
 * Tab switch — a pattern under Motion / Navigation & transitions.
 *
 * Read from the Motion system file, node 1:4144, with the interaction rules on
 * the frame and the Android confirmation sticky:
 *
 *   Total duration   600ms, easing 0.9, 0, 0.1, 1, for the tap
 *   Two drivers      A tap plays the animation start to finish. A horizontal
 *                    swipe maps progress to the gesture, linearly, and on
 *                    release either completes or snaps back.
 *   Swipe region     The top 300 of the screen only. Below that it is off.
 *   Tab labels       Opacity 100% to 10%, indicator width 100% to 0%
 *   Bodies           Loans X 16 to -344, Credit line X 376 to 16
 *   Background       Blue to green, on the same progress value
 *
 * One progress value drives all of it, which is the point of the frame: the
 * alpha, the cross-slide and the background lerp are the same number read three
 * ways, so they cannot fall out of step with each other or with the finger.
 */

import { useRef, useState } from 'react'
import { PhoneMock, StatusBar, AndroidNavBar } from '../flows/PhoneMockShared'
import { DocSection, P, DemoCard, RuleTable, UsageList, Note } from './docs'

// ─── Values, from node 1:4144 ────────────────────────────────────────────────

const TAB_MS       = 600
const TAB_EASE     = 'cubic-bezier(0.9, 0, 0.1, 1)'
const ALPHA_MIN    = 0.1        // 10%, the resting alpha of the tab not selected
const BODY_FROM    = 16         // the selected body's resting X
const BODY_TO      = -344       // where it goes
const BODY_TRAVEL  = BODY_FROM - BODY_TO   // 360
const SWIPE_REGION = 300        // top 300 of the screen, below which the swipe driver is off
const FROM_COLOR   = [0x26, 0x5C, 0xE5]    // bg/secondary
const TO_COLOR     = [0x12, 0xA4, 0x54]    // bg/saving

const PHONE_SCALE = 0.46

const lerp = (a, b, t) => Math.round(a + (b - a) * t)
const mix = (t) => `rgb(${lerp(FROM_COLOR[0], TO_COLOR[0], t)}, ${lerp(FROM_COLOR[1], TO_COLOR[1], t)}, ${lerp(FROM_COLOR[2], TO_COLOR[2], t)})`

const CSS = `
  .ts-anim { transition-duration: ${TAB_MS}ms; transition-timing-function: ${TAB_EASE}; }
  .ts-anim.ts-body      { transition-property: transform; }
  .ts-anim.ts-label     { transition-property: opacity; }
  .ts-anim.ts-indicator { transition-property: transform; }
  .ts-anim.ts-header    { transition-property: background-color; }
  /* While the finger is down there is no animation: the progress is the gesture. */
  .ts-live { transition: none; }
  @media (prefers-reduced-motion: reduce) {
    .ts-anim { transition-duration: 1ms; }
  }
`

const TABS = ['Loans', 'Credit line']

// ─── Demo ─────────────────────────────────────────────────────────────────────

function TabSwitchDemo() {
  const [p, setP] = useState(0)          // 0 = Loans, 1 = Credit line
  const [dragging, setDragging] = useState(false)
  const start = useRef({ x: 0, p: 0 })

  const cls = dragging ? 'ts-live' : 'ts-anim'

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId)
    setDragging(true)
    start.current = { x: e.clientX, p }
  }

  const onPointerMove = (e) => {
    if (!dragging) return
    // Linear along the swipe: the progress is the gesture fraction, nothing else.
    const dx = (e.clientX - start.current.x) / PHONE_SCALE
    setP(Math.min(1, Math.max(0, start.current.p - dx / BODY_TRAVEL)))
  }

  const onPointerUp = () => {
    if (!dragging) return
    setDragging(false)
    setP(v => (v > 0.5 ? 1 : 0))     // release completes or snaps back
  }

  const body = (i) => ({
    position: 'absolute', top: 0, left: 0, right: 0,
    transform: `translateX(${(i === 0 ? BODY_FROM : 376) - BODY_TRAVEL * p}px)`,
  })

  return (
    <DemoCard label="Two drivers, one progress" stageStyle={{ padding: '28px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <style>{CSS}</style>
        <PhoneMock scale={PHONE_SCALE}>
          <StatusBar />
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: 'var(--canvas-default)' }}>
            {/* Everything above y = 300 takes the swipe. Below it, nothing does. */}
            <div
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, height: SWIPE_REGION, touchAction: 'pan-y', zIndex: 2 }}
            />

            <div
              className={`${cls} ts-header`}
              style={{
                backgroundColor: mix(p), padding: 'var(--space-400) var(--space-400) 0',
                fontFamily: 'var(--ds-font-family)',
              }}
            >
              <span style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-on-dark)' }}>Welcome</span>
              <div style={{ display: 'flex', gap: 'var(--space-500)', marginTop: 'var(--space-400)' }}>
                {TABS.map((label, i) => {
                  const on = i === 0 ? 1 - p : p
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setP(i)}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', position: 'relative' }}
                    >
                      <span
                        className={`${cls} ts-label`}
                        style={{
                          display: 'block', fontFamily: 'var(--ds-font-family)', fontSize: 'var(--text-md)',
                          color: 'var(--text-on-dark)', paddingBottom: 'var(--space-200)',
                          opacity: ALPHA_MIN + (1 - ALPHA_MIN) * on,
                        }}
                      >
                        {label}
                      </span>
                      <span
                        className={`${cls} ts-indicator`}
                        style={{
                          display: 'block', height: 2, backgroundColor: 'var(--bg-base)',
                          transform: `scaleX(${on})`, transformOrigin: '0 50%',
                        }}
                      />
                    </button>
                  )
                })}
              </div>
            </div>

            <div style={{ position: 'relative', height: 220, marginTop: 'var(--space-400)' }}>
              {TABS.map((label, i) => (
                <div key={label} className={`${cls} ts-body`} style={body(i)}>
                  <div style={{
                    width: 328, backgroundColor: 'var(--bg-base)', borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-subtle)', padding: 'var(--space-400)',
                    display: 'flex', flexDirection: 'column', gap: 'var(--space-200)',
                    fontFamily: 'var(--ds-font-family)',
                  }}>
                    <span style={{ fontSize: 'var(--text-md)', color: 'var(--text-subtle)' }}>
                      {i === 0 ? 'Available limit' : 'Credit line'}
                    </span>
                    <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--text-base)' }}>
                      {i === 0 ? '₱25,000.00' : '₱30,000.00'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <AndroidNavBar />
        </PhoneMock>
        <span style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: 'var(--text-subtle)', textAlign: 'center', maxWidth: '50ch' }}>
          Tap a tab for the full {TAB_MS}ms, or drag across the top of the screen and
          watch everything follow the finger. Drag lower down and nothing happens.
        </span>
      </div>
    </DemoCard>
  )
}

// ─── Content ──────────────────────────────────────────────────────────────────

const USE_WHEN = [
  'Two views of the same thing sit side by side under one header',
  'The user moves between them often enough that a gesture earns its place',
  'The set is fixed and small: these are peers, not a list',
]

const AVOID_WHEN = [
  'The destinations are top-level places in the app, which is the bottom navigation',
  'Moving between them is a step in a task, which is step forward and back',
  'There are more than a handful, where a segmented control stops being scannable',
]

const BEHAVIOR_RULES = [
  ['One progress value drives everything',
   'The label alpha, the indicator width, the bodies crossing and the background colour are the same number read four ways. That is what keeps them in sync with each other and with the finger.'],
  ['A tap plays the whole thing',
   `${TAB_MS}ms on ${TAB_EASE}, start to finish. Nothing about a tap is interruptible by the gesture driver.`],
  ['A swipe is the animation, not a trigger',
   'Progress follows the gesture fraction in real time, and linearly: the eased curve belongs to the tap. On release it either completes or snaps back.'],
  ['The swipe only works up top',
   `Above ${SWIPE_REGION} the horizontal drag drives the switch: the header, the segmented control and the card under it. Below that the driver is off, so a horizontal drag in the content cannot switch tabs by accident.`],
  ['The tabs cross, they do not fade',
   `The body leaving goes from ${BODY_FROM} to ${BODY_TO} while the body arriving comes from 376 to ${BODY_FROM}: ${BODY_TRAVEL}px each, one after the other in the same direction.`],
  ['The tab not selected stays visible',
   `Its label rests at ${ALPHA_MIN * 100}% rather than disappearing, so both tabs are always readable and the switch reads as a change of emphasis.`],
]

const SPEC_ROWS = [
  ['Tap duration',    `${TAB_MS}ms`],
  ['Tap easing',      TAB_EASE],
  ['Swipe',           'Progress-mapped to the gesture, interpolated linearly'],
  ['Swipe region',    `The top ${SWIPE_REGION} of the screen. Below it the driver is disabled.`],
  ['Release',         'Completes or snaps back'],
  ['Label opacity',   `100% to ${ALPHA_MIN * 100}%`],
  ['Indicator width', '100% to 0%'],
  ['Body leaving',    `X ${BODY_FROM} to ${BODY_TO}`],
  ['Body arriving',   `X 376 to ${BODY_FROM}`],
  ['Background',      'Blue to green, on the same progress value'],
  ['Reduced motion',  'The tap changes tab without the cross-slide. The swipe driver is unaffected: it is direct manipulation, not animation.'],
  ['Source',          'Motion system, node 1:4144, with the interaction rules and the Android sticky on that frame'],
]

const STATE_ROWS = [
  ['At rest',    `One tab at full alpha with a full-width indicator, the other at ${ALPHA_MIN * 100}% with none.`],
  ['Tapped',     `The whole animation plays over ${TAB_MS}ms.`],
  ['Swiping',    'Everything tracks the finger, linearly, with no easing anywhere.'],
  ['Released past halfway', 'The switch completes on the tap curve.'],
  ['Released short', 'It returns to the tab it started on. Nothing changed.'],
  ['Swiping low', 'Nothing. The driver is off below the region.'],
]

const ACCESSIBILITY_RULES = [
  ['Never gesture-only',
   'The segmented control is the primary route. The swipe is an addition for people who like it, and the pattern works entirely without it.'],
  ['Announce the selected tab',
   'The control reports which tab is selected and announces the change. The cross-slide is decoration.'],
  ['The resting alpha is not a disabled state',
   `${ALPHA_MIN * 100}% is a de-emphasised tab that is still available. It must not be confused with, or styled as, a disabled control.`],
  ['Reduced motion keeps the switch',
   'Only the cross-slide goes. Tapping still changes tab, and dragging still works, because a gesture the user is driving is not an animation.'],
]

const ENGINEERING_ROWS = [
  ['One progress value, four bindings',
   'Alpha, indicator width, body positions and background colour all read the same 0 to 1. Animating them separately is how they end up disagreeing halfway through a slow swipe.'],
  ['The curve belongs to the tap only',
   'Along a swipe the interpolation is linear, or the content lags behind the finger and then catches up. The 600ms and the standard curve apply when the animation plays itself.'],
  ['Bound the swipe region deliberately',
   `The driver is attached to the top ${SWIPE_REGION} because below it a horizontal drag belongs to the content. Attaching it to the whole screen makes lists and carousels fight the tab switch.`],
  ['Lerp the background, do not cross-fade two headers',
   'It is one header interpolating between two colours on the same progress value, not two stacked headers changing opacity.'],
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TabSwitch() {
  return (
    <>
      <DocSection id="demo" title="Demo">
        <TabSwitchDemo />
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
          Read from the Motion system file. The duration and curve describe the
          tap; a swipe is mapped to the gesture instead.
        </P>
        <RuleTable rows={SPEC_ROWS} labelWidth={200} />
        <div style={{ marginTop: 12 }}>
          <Note title="Why linear along the swipe.">
            An eased curve applied to a gesture makes the content lag the finger
            and then rush to catch up. While the user is driving, progress is
            the gesture fraction; the curve is only for the part the interface
            plays by itself.
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
