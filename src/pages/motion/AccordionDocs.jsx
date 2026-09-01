/**
 * Accordion — a pattern under Motion / Controls & interactions.
 *
 * Read from the Motion system file, node 1:4356:
 *
 *   Total duration   300ms
 *   Easing           0.9, 0, 0.1, 1
 *   Arrow icon       Rotation 0 to -180
 *   List             Y position 0 to -224
 *
 * The Android answers slide, node 1:4121 item 10, adds the part the frame
 * leaves out: the body fades alongside the height animation.
 *
 * 224 is the height of the list in the frame, so the content travels its own
 * height behind the header. The two lines are written in opposite directions,
 * which is noted on the page rather than quietly reconciled.
 */

import { useState } from 'react'
import BilleaseIcon from '../../assets/icons/BilleaseIcon'
import { DocSection, P, DemoCard, RuleTable, UsageList, Note } from './docs'

// ─── Values, from node 1:4356 ────────────────────────────────────────────────

const ACC_MS     = 300
const ACC_EASE   = 'cubic-bezier(0.9, 0, 0.1, 1)'
const LIST_H     = 224          // the list's own height in the frame
const ROTATION   = 180

const MONTHS = ['December', 'November', 'October', 'September', 'August']

const CSS = `
  .acc-clip, .acc-list, .acc-arrow { transition-duration: ${ACC_MS}ms; transition-timing-function: ${ACC_EASE}; }
  .acc-clip  { transition-property: height; overflow: hidden; }
  .acc-list  { transition-property: transform; }
  .acc-arrow { transition-property: transform; }
  @media (prefers-reduced-motion: reduce) {
    .acc-clip, .acc-list, .acc-arrow { transition-duration: 1ms; }
  }
`

// ─── Demo ─────────────────────────────────────────────────────────────────────

function AccordionDemo() {
  const [open, setOpen] = useState(true)

  return (
    <DemoCard label="Opening a section" stageStyle={{ padding: '32px 28px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
        <style>{CSS}</style>
        <div style={{ backgroundColor: 'var(--bg-base)', fontFamily: 'var(--ds-font-family)' }}>
          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            aria-expanded={open}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'none', border: 'none', borderBottom: '1px solid var(--border-subtle)',
              padding: 'var(--space-300) 0', cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 'var(--text-md)', color: 'var(--text-base)' }}>2027</span>
            <span
              className="acc-arrow"
              style={{ display: 'flex', transform: open ? `rotate(-${ROTATION}deg)` : 'none' }}
            >
              <BilleaseIcon name="chevron-down" size="sm" color="var(--icon-base)" />
            </span>
          </button>

          <div className="acc-clip" style={{ height: open ? LIST_H : 0 }}>
            <div
              className="acc-list"
              style={{ transform: open ? 'none' : `translateY(-${LIST_H}px)` }}
            >
              {MONTHS.map(m => (
                <div key={m} style={{
                  height: LIST_H / MONTHS.length, display: 'flex', alignItems: 'center',
                  fontSize: 'var(--text-md)', color: 'var(--text-base)',
                }}>
                  {m}
                </div>
              ))}
            </div>
          </div>
        </div>

        <span style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: 'var(--text-subtle)', maxWidth: '48ch' }}>
          The list slides its own height behind the header while the chevron turns
          {' '}{ROTATION}°. Both take {ACC_MS}ms.
        </span>
      </div>
    </DemoCard>
  )
}

// ─── Content ──────────────────────────────────────────────────────────────────

const USE_WHEN = [
  'A section of a list can be collapsed to make the rest scannable',
  'The content belongs under its header and nowhere else',
  'The user chooses what to open, and can leave it open',
]

const AVOID_WHEN = [
  'Everything is worth seeing at once, where collapsing only adds a tap',
  'The content is a different destination, which is navigation',
  'Only one thing can be open and the sections are peers, which is a segmented control',
]

const BEHAVIOR_RULES = [
  ['The list slides behind its header',
   `It travels its own height, ${LIST_H}px in the frame this was drawn against, while the container clips it. Opening reveals it downward; closing takes it back up out of sight.`],
  ['The body fades as it moves',
   'The list fades alongside the height animation rather than only sliding. The Android team\u2019s answer names it, and it is the difference between content that arrives and content that is uncovered.'],
  ['The chevron turns with it',
   `${ROTATION}° over the same ${ACC_MS}ms on the same curve. The arrow and the list are one movement, so the arrow finishing early or late is immediately noticeable.`],
  ['Everything below moves with it',
   'The section takes the space it needs and gives it back. What follows on the page moves as a consequence, not as its own animation.'],
  ['The header stays put',
   'It is the thing the user pressed and the anchor they read from. It does not move while its content does.'],
  ['It is quick because it repeats',
   `${ACC_MS}ms, shorter than the sheets and the dialog. A list of these is opened and closed constantly and cannot feel laboured.`],
]

const SPEC_ROWS = [
  ['Total duration',  `${ACC_MS}ms`],
  ['Easing',          ACC_EASE],
  ['Arrow rotation',  `${ROTATION}°`],
  ['List travel',     `${LIST_H} in the frame, which is the list's own height`],
  ['Body opacity',    'Fades alongside the height animation'],
  ['Header',          'Does not move'],
  ['Reduced motion',  'The section opens and closes without the slide or the turn.'],
  ['Source',          'Motion system, node 1:4356, and the Android team answers on node 1:4121, item 10'],
]

const STATE_ROWS = [
  ['Closed',   'Header only, chevron at rest, list clipped out of sight.'],
  ['Opening',  `The list comes down its own height as the chevron turns ${ROTATION}°, over ${ACC_MS}ms.`],
  ['Open',     'The list at rest under its header, chevron turned.'],
  ['Closing',  'The same in reverse. The space is given back as it goes.'],
]

const ACCESSIBILITY_RULES = [
  ['The header is the control',
   'It reports whether the section is open and toggles it. The chevron is decoration on top of that, not the control itself.'],
  ['Collapsed content is not reachable',
   'What is clipped is out of the tab order, so tabbing does not land somewhere invisible.'],
  ['Reduced motion keeps the toggle',
   'Only the slide and the turn go. Opening and closing still work.'],
]

const ENGINEERING_ROWS = [
  ['Clip and translate, do not animate the content',
   'The container animates its height while the list translates inside it. Animating the list itself, or fading it, makes the text move at a different rate from the box around it.'],
  ['Measure the height, do not hard-code 224',
   'The 224 is the height of this particular list in the frame. Read the content height so a section with more rows still travels exactly its own height.'],
  ['One duration for the arrow and the list',
   'They are the same gesture. Giving the icon its own timing is the most common way this ends up feeling loose.'],
  ['Release the height when it lands',
   'Animate to an explicit height, then set it back to auto so a section whose content changes later is not stuck at its old size.'],
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AccordionDocs() {
  return (
    <>
      <DocSection id="demo" title="Demo">
        <AccordionDemo />
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
          <Note title="The two lines point opposite ways.">
            The frame gives the arrow as 0 to -180 and the list as 0 to -224. The
            first is the opening and the second is the closing, so one of them is
            written from the other end. The artwork settles it: closed is a
            chevron at rest with the list hidden, open is a turned chevron with
            the list in place. Worth writing both lines in the same direction.
          </Note>
        </div>
        <div style={{ marginTop: 12 }}>
          <Note title="Missing component: Accordion.">
            There is no accordion in the design system, so the demo is built from
            tokens to carry the motion.
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
