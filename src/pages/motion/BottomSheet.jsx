/**
 * Bottom sheet — a pattern under Motion / Overlays.
 *
 * Read from the Motion system file, node 1:4231 ("Bottom Sheet -
 * Entrance/Dismiss"), including the implementation note and the resolution
 * sticky on that frame:
 *
 *   Total duration   600ms
 *   Easing           0.9, 0, 0.1, 1
 *   Sheet Y          0 to 416, its resting top in a 740 screen
 *   Scrim            #000000, opacity 0 to 50%
 *
 * The frame also carries an approved exception: because the sheet is
 * drag-dismissable, a native physics-based spring settle is correct platform
 * behaviour and is approved as-is. The duration and curve describe the
 * intended feel rather than a strict requirement. The scrim is not part of the
 * exception and always applies.
 */

import { useRef, useState } from 'react'
import Button from '../../components/ds/Button'
import { PhoneMock, StatusBar, AndroidNavBar } from '../flows/PhoneMockShared'
import { DocSection, P, DemoCard, RuleTable, UsageList, Note } from './docs'

// ─── Values, from node 1:4231 ────────────────────────────────────────────────

const SHEET_MS    = 600
const SHEET_EASE  = 'cubic-bezier(0.9, 0, 0.1, 1)'
const SHEET_TOP   = 416         // resting top in the 740 screen the values were written against
const SCREEN_H    = 740
const SHEET_H     = SCREEN_H - SHEET_TOP   // 324
const SCRIM_COLOR = '#000000'
const SCRIM_MAX   = 0.5
const DISMISS_AT  = 0.25        // fraction of the sheet's height, demo threshold

const PHONE_SCALE = 0.46

const CSS = `
  .bs-sheet { transition: transform ${SHEET_MS}ms ${SHEET_EASE}; }
  .bs-scrim { transition: opacity ${SHEET_MS}ms ${SHEET_EASE}; }
  .bs-dragging { transition: none; }
  @media (prefers-reduced-motion: reduce) {
    .bs-sheet, .bs-scrim { transition-duration: 1ms; }
  }
`

// ─── Demo ─────────────────────────────────────────────────────────────────────

function BottomSheetDemo() {
  const [open, setOpen] = useState(false)
  const [drag, setDrag] = useState(0)          // px pulled down from the resting position
  const [dragging, setDragging] = useState(false)
  const startY = useRef(0)

  const onPointerDown = (e) => {
    if (!open) return
    e.currentTarget.setPointerCapture?.(e.pointerId)
    setDragging(true)
    startY.current = e.clientY
  }

  const onPointerMove = (e) => {
    if (!dragging) return
    // Down only: a sheet does not follow the finger upward past its resting place.
    setDrag(Math.max(0, e.clientY - startY.current))
  }

  const onPointerUp = () => {
    if (!dragging) return
    setDragging(false)
    const dismissed = drag > SHEET_H * PHONE_SCALE * DISMISS_AT
    setDrag(0)
    if (dismissed) setOpen(false)
  }

  const offset = open ? drag : SHEET_H
  const scrim = open ? SCRIM_MAX * Math.max(0, 1 - drag / (SHEET_H * PHONE_SCALE)) : 0

  return (
    <DemoCard label="Entrance and dismissal" stageStyle={{ padding: '28px' }}>
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
                  Application under review
                </span>
                <span style={{ fontSize: 'var(--text-md)', color: 'var(--text-subtle)' }}>
                  You’ll be able to access loans once approved
                </span>
                <div style={{ alignSelf: 'flex-start' }}>
                  <Button type="secondary" size="sm" label="Learn more" onClick={() => setOpen(true)} />
                </div>
              </div>
            </div>

            {/* The scrim belongs to the sheet, not to the screen behind it. */}
            <div
              className={dragging ? 'bs-dragging' : 'bs-scrim'}
              style={{
                position: 'absolute', inset: 0, backgroundColor: SCRIM_COLOR, opacity: scrim,
                pointerEvents: open ? 'auto' : 'none',
              }}
            />

            <div
              className={dragging ? 'bs-dragging' : 'bs-sheet'}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              style={{
                position: 'absolute', left: 0, right: 0, bottom: 0, height: SHEET_H,
                transform: `translateY(${offset}px)`,
                backgroundColor: 'var(--bg-base)',
                borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
                boxShadow: '0 -8px 24px rgba(0, 0, 0, 0.12)',
                display: 'flex', flexDirection: 'column', gap: 'var(--space-400)',
                padding: 'var(--space-400)', boxSizing: 'border-box',
                touchAction: 'none', cursor: open ? 'grab' : 'default',
                fontFamily: 'var(--ds-font-family)',
              }}
            >
              <span style={{ width: 36, height: 4, borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-elevated)', alignSelf: 'center' }} />
              <span style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-base)' }}>
                While your application is reviewed
              </span>
              <span style={{ fontSize: 'var(--text-md)', color: 'var(--text-subtle)', lineHeight: 1.5 }}>
                We check your details against your submitted documents. It usually
                takes a day, and you can keep using everything else meanwhile.
              </span>
              <div style={{ marginTop: 'auto' }}>
                <Button type="primary" size="lg" label="Got it" fullWidth onClick={() => setOpen(false)} />
              </div>
            </div>
          </div>
          <AndroidNavBar />
        </PhoneMock>
        <span style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: 'var(--text-subtle)', textAlign: 'center', maxWidth: '48ch' }}>
          Learn more opens it. Drag the sheet down and the scrim thins with it;
          let go past a quarter of its height and it goes, otherwise it returns.
        </span>
      </div>
    </DemoCard>
  )
}

// ─── Content ──────────────────────────────────────────────────────────────────

const USE_WHEN = [
  'Showing something secondary without leaving the screen behind it',
  'The content is short enough to sit in part of the screen',
  'Dismissing it costs nothing: nothing is half-finished inside it',
]

const AVOID_WHEN = [
  'The user is entering a flow, which is a full-height sheet and does not drag away',
  'There is form input to lose, since a sheet can be dragged shut by accident',
  'A decision has to be made before continuing, which is a dialog',
]

const BEHAVIOR_RULES = [
  ['It rises to its resting place, over the screen',
   `The sheet comes up from the bottom edge and stops at ${SHEET_TOP} in the ${SCREEN_H} screen the values were written against, so part of the screen behind it stays visible. That screen does not move.`],
  ['The scrim is part of the sheet',
   `A black layer over the screen behind reaches ${SCRIM_MAX * 100}% as the sheet lands. It is what makes the sheet read as being in front rather than as part of the page.`],
  ['It is drag-dismissable',
   'The sheet follows the finger downward and closes if released far enough, which is why the settle is a spring rather than a curve. Standard bottom sheets keep this; full-height flow sheets deliberately do not.'],
  ['A partial drag returns',
   'Released before the threshold, the sheet goes back to its resting place and the scrim returns with it. Nothing about the screen behind changes in between.'],
  ['The scrim tracks the drag',
   'While the sheet is being dragged the scrim thins in proportion, so the two never disagree about how open the sheet is.'],
  ['Dismissal is the entrance reversed',
   'It leaves the way it came, downward, with the scrim clearing as it goes.'],
]

const SPEC_ROWS = [
  ['Total duration',  `${SHEET_MS}ms`],
  ['Easing',          SHEET_EASE],
  ['Sheet Y',         `Up from the bottom edge to ${SHEET_TOP}, its resting top in the ${SCREEN_H} screen the values were written against`],
  ['Scrim',           `${SCRIM_COLOR}, opacity 0 to ${SCRIM_MAX * 100}%`],
  ['Settle',          'A native physics-based spring, approved as an exception. The duration and curve describe the intended feel.'],
  ['Drag',            'Downward, 1:1 with the finger. Released past the threshold it dismisses, otherwise it returns.'],
  ['Reduced motion',  'The sheet and the scrim change state without travelling. Drag to dismiss still works.'],
  ['Source',          'Motion system, node 1:4231, with the implementation note and resolution sticky on that frame'],
]

const STATE_ROWS = [
  ['Closed',    'No sheet, no scrim. The screen behind is untouched.'],
  ['Opening',   `The sheet rises to ${SHEET_TOP} as the scrim reaches ${SCRIM_MAX * 100}%.`],
  ['Resting',   'Open, over a dimmed screen that has not moved.'],
  ['Dragging',  'The sheet follows the finger downward and the scrim thins with it.'],
  ['Returning', 'Released before the threshold: the sheet goes back up and the scrim fills back in.'],
  ['Dismissed', 'The sheet leaves downward, the scrim clears, and the screen behind is exactly as it was.'],
]

const ACCESSIBILITY_RULES = [
  ['The screen behind is not reachable',
   'While the sheet is open, what is under the scrim is out of the tab order. Being visible through 50% black is not the same as being available.'],
  ['Never gesture-only',
   'Drag to dismiss is an addition, not the route. There is always a control that closes the sheet, because a drag is not available to everyone.'],
  ['Focus moves in and comes back',
   'Focus enters the sheet when it opens and returns to whatever opened it when it closes.'],
]

const ENGINEERING_ROWS = [
  ['Keep the platform spring',
   'This component is the documented exception to the standard curve. Retuning a native sheet to 600ms on 0.9, 0, 0.1, 1 makes a drag-driven surface feel wrong: the settle has to continue the gesture, which a fixed curve cannot do. Match the feel, not the numbers.'],
  ['The scrim is not part of the exception',
   `${SCRIM_COLOR} at 0 to ${SCRIM_MAX * 100}% applies whatever the settle does, on both platforms.`],
  ['Bind the scrim to the sheet position',
   'Drive the scrim from how far open the sheet is rather than from a separate animation, or a slow drag leaves the two disagreeing.'],
  ['Do not move the screen behind',
   'It stays exactly where it is. Anything that shifts or scales it turns a sheet into a screen transition.'],
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BottomSheet() {
  return (
    <>
      <DocSection id="demo" title="Demo">
        <BottomSheetDemo />
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
          Read from the Motion system file. The frame carries an implementation
          note and a resolution sticky, and both are reflected here.
        </P>
        <RuleTable rows={SPEC_ROWS} labelWidth={200} />
        <div style={{ marginTop: 12 }}>
          <Note title="An approved exception.">
            The sheet is drag-dismissable, so a physics-based spring settle is
            the correct platform behaviour and the existing native animation is
            approved as-is. The {SHEET_MS}ms and {SHEET_EASE} describe the
            intended feel rather than a strict requirement. The scrim spec is
            not part of the exception.
          </Note>
        </div>
        <div style={{ marginTop: 12 }}>
          <Note title="How the travel is written.">
            The frame writes the sheet as “Y position: 0 to {SHEET_TOP}”, which
            taken literally would start it at the top of the screen. The
            flow-entry frame beside it writes the same movement as “Y 740 to 0”,
            from the bottom edge to its resting top. Read this one the same way:
            it comes up from the bottom edge and stops at {SHEET_TOP}.
          </Note>
        </div>
        <div style={{ marginTop: 12 }}>
          <Note title="Not settled in the file.">
            Whether tapping the scrim dismisses the sheet, and how far a drag has
            to go before it does, are not in the source. The demo uses a quarter
            of the sheet’s height as its threshold and leaves the scrim inert, so
            neither is presented as documented behaviour.
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
