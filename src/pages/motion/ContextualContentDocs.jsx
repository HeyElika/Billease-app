/**
 * Contextual content — a pattern under Motion / Navigation & transitions.
 *
 * The handover that runs when a selection changes and a region below it holds
 * the content belonging to that selection. Documented apart from the carousel
 * that first needed it, because the pattern is the same wherever a parent owns
 * a selection: card carousels, account pickers, segmented filters.
 *
 * The implementation is src/motion/ContextualContent.jsx, and the values quoted
 * here are read from src/motion/contextualMotion.js rather than restated.
 */

import { useState } from 'react'
import Button from '../../components/ds/Button'
import ContextualContent from '../../motion/ContextualContent'
import { DECELERATE, CONTEXTUAL_MOTION as M } from '../../motion/contextualMotion'
import { TransactionsHeading, TransactionsDate, TransactionRows, TransactionsSkeleton } from './transactionList'
import { DocSection, DocCard, P, DemoCard, RuleTable, UsageList } from './docs'

// ─── Demo ─────────────────────────────────────────────────────────────────────

const CONTEXTS = [
  {
    id: 0, label: 'Card 3354',
    tx: [
      { merchant: 'Jollibee BGC Branch', meta: 'Credit line • Card 3354 • Purchase • 17:09', amount: '- ₱334.00' },
      { merchant: 'Mercury Drug',        meta: 'Credit line • Card 3354 • Purchase • 16:50', amount: '- ₱763.00' },
      { merchant: 'SM Supermarket',      meta: 'Credit line • Card 3354 • Purchase • 17:09', amount: '- ₱763.00', failed: true },
    ],
  },
  {
    id: 1, label: 'Card 5764',
    tx: [
      { merchant: 'FreshMart Grocery',    meta: 'Credit line • Card 5764 • Purchase • 16:29', amount: '- ₱200.00', failed: true },
      { merchant: 'Ace Hardware & Home',  meta: 'Credit line • Card 5764 • Purchase • 11:09', amount: '- ₱154.00' },
    ],
  },
]

function ContextualDemo() {
  const [selected, setSelected] = useState(0)

  return (
    <DemoCard label="Selection and its content" stageStyle={{ padding: '28px' }}>
      <div style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 'var(--space-600)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-200)', justifyContent: 'center' }}>
          {CONTEXTS.map(c => (
            <Button
              key={c.id}
              type={selected === c.id ? 'primary' : 'secondary'}
              size="sm"
              label={c.label}
              onClick={() => setSelected(c.id)}
            />
          ))}
        </div>

        {/* The two lists are different lengths, so the section resizing is part
            of what this demo shows. */}
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 'var(--space-400)' }}>
          <TransactionsHeading />
          <div>
            <TransactionsDate />
            <ContextualContent value={selected} skeleton={<TransactionsSkeleton />}>
              {i => <TransactionRows card={CONTEXTS[i]} />}
            </ContextualContent>
          </div>
        </div>

        <span style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: 'var(--text-subtle)', textAlign: 'center' }}>
          The heading and the date hold their place. Only the rows are handed over.
        </span>
      </div>
    </DemoCard>
  )
}

// ─── Content ──────────────────────────────────────────────────────────────────

const USE_WHEN = [
  'A selection above decides what a region below shows',
  'The selection is committed, not dragged: a tab, a card, an account',
  'The region keeps its place and only its content changes',
]

const AVOID_WHEN = [
  'The content is what the user is navigating, not what follows from it',
  'The change is not caused by a selection, such as a background refresh',
  'The region itself moves or is replaced, which is a screen transition',
]

const BEHAVIOR_RULES = [
  ['The parent leads',
   `The selection moves first and the content follows ${M.holdMs}ms behind it. Starting both together makes the dependent region look like a competing one, and it is not: it is the answer to a question the parent just asked.`],
  ['Only committed selections reach it',
   'A gesture in progress changes nothing. Nothing is interpolated towards the incoming content, and a drag that is cancelled plays nothing at all, because there was never anything to undo.'],
  ['The content moves as one piece',
   `The region is a clipped viewport. The old content leaves by ${M.exitShift}px over ${M.exitMs}ms and the new one arrives ${M.enterShift}px over ${M.enterMs}ms, each of them whole and complete the entire time.`],
  ['Nothing inside the content is animated',
   'Not a row, not a label, not a value, not an icon. Anything applied across the content instead of to it as a whole cuts through its rows, and a row showing one selection’s label beside another’s value is worse than any transition is good. Seeing part of two sets is fine. Seeing a hybrid of them is not.'],
  ['The arrival waits a beat, and still overlaps',
   `The old set is already leaving when the new one starts ${M.enterDelay}ms later, so what you watch is the arrival. The beat is short enough that the two overlap: it is a beat, not a gap, and the region is never empty.`],
  ['Interruption cancels, it never queues',
   'A second change replaces the one in flight. Selecting A then B then C shows C’s content, and B’s is never drawn.'],
  ['Waiting for data keeps the shape',
   `Content that is not loaded yet holds the height the region already had and shows the skeleton loader in the shape of it, faded in over ${M.skeletonMs}ms, crossfading to the content over ${M.crossfadeMs}ms when it arrives. It never collapses, and it never shows a spinner: the shape of what is coming is already known.`],
]

const SPEC_ROWS = [
  ['Starts on',        'The commit, never the gesture'],
  ['Hold',             `${M.holdMs}ms before anything moves`],
  ['Content out',      `${M.exitMs}ms, translateX 0 to ${M.exitShift}px against the direction of travel, opacity 1 to 0`],
  ['Content in',       `${M.enterMs}ms starting ${M.enterDelay}ms later, translateX ${M.enterShift}px to 0 from the side the parent came from, opacity 0 to 1`],
  ['Easing',           `${DECELERATE}, no spring and no overshoot`],
  ['Overlap',          `${M.holdMs + M.exitMs - (M.holdMs + M.enterDelay)}ms, so the region is never empty`],
  ['What is animated', 'The content, as one element. Never a row, a label, a value or an icon.'],
  ['Height',           'Not animated. Held at the taller of the two while both are on screen.'],
  ['Not yet loaded',   `Skeleton in the shape of the content, ${M.skeletonMs}ms in, ${M.crossfadeMs}ms crossfade to the content on arrival`],
  ['Reduced motion',   `${M.reducedMs}ms opacity, no movement. The change, the skeleton and the height all still happen.`],
]

const STATE_ROWS = [
  ['Idle',      'One set of content, at rest.'],
  ['Committed', `The parent starts moving. ${M.holdMs}ms later the old content leaves and, ${M.enterDelay}ms after that, the new one arrives.`],
  ['Cancelled', 'Nothing. No movement, no data change, no loading, no opacity reset.'],
  ['Waiting',   'The region holds its height and shows the skeleton until the data arrives.'],
  ['Interrupted', 'Both halves are replaced by the newer change. Intermediate content is never drawn.'],
]

const ACCESSIBILITY_RULES = [
  ['Only the current content is read',
   'The set on its way out is hidden from assistive technology and taken out of the tab order while it leaves, so the page never reads two versions at once.'],
  ['Motion is never the explanation',
   'Under reduced motion the content changes with a 1ms opacity step and no movement. What is on screen is told by the selection and the content itself, never by the transition.'],
  ['Announce the change where it matters',
   'The movement is decoration. If the new content needs announcing, the region says so itself; the transition carries nothing an assistive technology can use.'],
]

const ENGINEERING_ROWS = [
  ['Use the pattern, do not rebuild it',
   'src/motion/ContextualContent takes the committed selection, a render function for the content, and optionally whether that content is loaded plus a skeleton to stand in for it. Reimplementing the choreography per surface is where the drift starts.'],
  ['Never drive it from gesture position',
   'It takes a committed selection. Wiring it to drag progress puts two datasets on screen at once and changes content for a gesture the user then cancels.'],
  ['Clip the region, never mask the content',
   'The clipped region is what constrains the movement, and the content is what travels through it. A gradient mask or a fade laid over the content is applied per pixel, so it cuts across a row: the label on the left has changed while the value on the right has not. One transform on the whole set cannot produce that.'],
  ['Both sets in the tree on one commit',
   'The incoming content is mounted alongside the outgoing one, each complete and in its own subtree, so the framework never reconciles one selection’s rows into another’s. Rendering them in sequence leaves a hole in the middle.'],
  ['Resolve at the end, not at the start',
   'What gets drawn is read when the exit finishes rather than captured when the change was made. That single decision is what makes A to B to C land on C.'],
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContextualContentDocs() {
  return (
    <>
      <DocSection id="demo" title="Demo">
        <ContextualDemo />
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
          Timings are measured from the commit. The parent settles over its own
          duration alongside them.
        </P>
        <RuleTable rows={SPEC_ROWS} labelWidth={200} />
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
          <DocCard>
            <div style={{ padding: '16px 20px', fontFamily: 'var(--font-family)', fontSize: 13, lineHeight: 1.6, color: 'var(--text-subtle)' }}>
              Used by <strong style={{ color: 'var(--text-base)' }}>Card carousel</strong>, for the transactions
              under the selected card.
            </div>
          </DocCard>
        </div>
      </DocSection>
    </>
  )
}
