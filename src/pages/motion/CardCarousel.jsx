/**
 * Card carousel — a pattern under Motion / Navigation & transitions.
 *
 * Layout from Financial Core, access-card/carousel (I49002:20422;14839:3755).
 * Motion from the cards animation handoff prototype.
 *
 * The two agree exactly: the Figma row is 268 + 12 + 300 + 12 + 268 = 860
 * centred in 360, which puts the card left edges at -250, 30 and 342. Those are
 * the prototype's slot constants, unchanged.
 */

import { useRef, useState } from 'react'
import BilleaseIcon from '../../assets/icons/BilleaseIcon'
import cardArt from '../../assets/cards/access-card.png'
import virtualArt from '../../assets/cards/virtual-card.png'
import cloudIcon from '../../assets/cards/cloud.svg'
import manageIcon from '../../assets/cards/manage.svg'
import {
  DocSection, DocCard, P, DemoCard, RuleTable, UsageList, Note,
} from './docs'

// ─── Values ───────────────────────────────────────────────────────────────────

const SNAP_MS   = 300
const SNAP_EASE = 'cubic-bezier(0.05, 0.7, 0.1, 1)'
const THRESHOLD = 60   // px of travel before the carousel commits
const TAP_SLOP  = 4    // px under which a pointer move is a tap, not a drag

const CARD = { w: 300, h: 190 }
const PEEK = { w: 268, h: 170 }
const PEEK_SCALE = PEEK.w / CARD.w              // 0.8933
const PEEK_Y = (CARD.h - CARD.h * PEEK_SCALE) / 2  // 10.13, re-centres the shrunk card

const STAGE = { w: 360, h: 218 }   // card-row: 190 + 20 top + 8 bottom

// Left edges, from the Figma row. Scaling uses a top-left origin so these hold.
const SLOTS = {
  '-2': { x: -530, y: PEEK_Y, s: PEEK_SCALE },
  '-1': { x: -250, y: PEEK_Y, s: PEEK_SCALE },
  '0':  { x: 30,   y: 0,      s: 1 },
  '1':  { x: 342,  y: PEEK_Y, s: PEEK_SCALE },
  '2':  { x: 630,  y: PEEK_Y, s: PEEK_SCALE },
}

const CARDS = [
  {
    id: 'physical', kind: 'art', art: cardArt, last4: '3354',
    tx: [
      { merchant: 'Jollibee BGC Branch', meta: 'Credit line • Card 3354 • Purchase • 17:09', amount: '- ₱334.00' },
      { merchant: 'Mercury Drug',        meta: 'Credit line • Card 3354 • Purchase • 16:50', amount: '- ₱763.00' },
      { merchant: 'SM Supermarket',      meta: 'Credit line • Card 3354 • Purchase • 17:09', amount: '- ₱763.00', failed: true },
    ],
  },
  {
    id: 'virtual', kind: 'art', art: virtualArt, cloud: true,
    tx: [
      { merchant: 'FreshMart Grocery',    meta: 'Credit line • Card 5764 • Purchase • 16:29', amount: '- ₱200.00', failed: true },
      { merchant: 'Ace Hardware & Home',  meta: 'Credit line • Card 5764 • Purchase • 11:09', amount: '- ₱154.00' },
      { merchant: 'Netflix Subscription', meta: 'Credit line • Card 5764 • Purchase • 11:09', amount: '- ₱549.00' },
    ],
  },
  { id: 'add', kind: 'add' },
]

// ─── Card faces ───────────────────────────────────────────────────────────────

function Dot() {
  return (
    <span style={{ width: 8, height: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden="true">
      <span style={{ width: 3.33, height: 3.33, borderRadius: '50%', backgroundColor: '#fff' }} />
    </span>
  )
}

function ArtCard({ art, last4, cloud }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', fontFamily: 'var(--ds-font-family)' }}>
      <img
        src={art}
        alt=""
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', borderRadius: 'var(--radius-lg)', pointerEvents: 'none',
        }}
      />
      {cloud && (
        <span style={{
          position: 'absolute', left: 12, top: 12, width: 20, height: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 2,
          boxSizing: 'border-box',
        }}>
          <img src={cloudIcon} alt="" width={16} height={16} style={{ display: 'block' }} />
        </span>
      )}
      {last4 && (
        <div style={{
          position: 'absolute', inset: 0, padding: 'var(--space-300)', boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-100)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center' }}><Dot /><Dot /></span>
            <span style={{
              fontSize: 'var(--text-md)', fontWeight: 600, lineHeight: 1.5,
              color: 'var(--text-on-dark)', whiteSpace: 'nowrap',
            }}>
              {last4}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function AddCard() {
  return (
    <div style={{
      width: '100%', height: '100%', boxSizing: 'border-box',
      backgroundColor: 'var(--bg-subtle)',
      border: '2px dashed var(--border-bold)',
      borderRadius: 'var(--radius-lg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4, boxSizing: 'border-box' }}>
        <BilleaseIcon name="plus" size="md" color="var(--icon-base)" />
      </span>
    </div>
  )
}

// ─── Below the carousel ───────────────────────────────────────────────────────
// access-card/menu/item (14108:666) and transaction-widget (49002:20669).

function MenuItem({ icon, label }) {
  return (
    <div style={{
      width: 100, height: 78,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 'var(--space-200)',
    }}>
      <div style={{
        width: 50, height: 50, borderRadius: 12,
        backgroundColor: 'var(--bg-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <span style={{
        width: 100, textAlign: 'center', fontFamily: 'var(--ds-font-family)',
        fontSize: 'var(--text-md)', fontWeight: 400, lineHeight: 1.5, color: 'var(--text-base)',
      }}>
        {label}
      </span>
    </div>
  )
}

function TransactionItem({ tx }) {
  const amountColor = tx.failed ? 'var(--text-error)' : 'var(--text-base)'
  return (
    <div style={{ display: 'flex', gap: 'var(--space-300)', alignItems: 'center', padding: 'var(--space-300) 0', width: '100%' }}>
      <div style={{
        width: 40, height: 40, borderRadius: 'var(--radius-full)', flexShrink: 0,
        backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <BilleaseIcon name="cart" size="sm" color="var(--icon-base)" />
      </div>
      <div style={{ flex: '1 0 0', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1.5 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-base)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {tx.merchant}
        </span>
        <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-subtle)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {tx.meta}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: 'var(--text-lg)', fontWeight: 600, lineHeight: 1.5, color: amountColor, textAlign: 'right', whiteSpace: 'nowrap' }}>
          {tx.amount}
        </span>
        {tx.failed && (
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, lineHeight: 1.25, color: 'var(--text-error)', textAlign: 'right' }}>
            Failed
          </span>
        )}
      </div>
    </div>
  )
}

function TransactionWidget({ card }) {
  if (!card.tx) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-400)', width: '100%', fontFamily: 'var(--ds-font-family)' }}>
      <div style={{ height: 24, display: 'flex', alignItems: 'center', gap: 'var(--space-200)', width: '100%' }}>
        <span style={{ fontSize: 'var(--text-lg)', fontWeight: 600, lineHeight: 1.25, color: 'var(--text-base)', whiteSpace: 'nowrap' }}>
          Transactions for this card
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ height: 28, display: 'flex', alignItems: 'center', paddingTop: 'var(--space-300)', paddingBottom: 'var(--space-200)', width: '100%' }}>
          <span style={{ fontSize: 'var(--text-md)', fontWeight: 400, lineHeight: 1.5, color: 'var(--text-base)' }}>Today</span>
        </div>
        {card.tx.map(tx => <TransactionItem key={tx.merchant} tx={tx} />)}
        <div style={{ height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-200)', width: '100%' }}>
          <span style={{ fontSize: 'var(--text-md)', fontWeight: 600, lineHeight: 1.5, color: 'var(--text-subtle)' }}>View all</span>
        </div>
      </div>
    </div>
  )
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

function CardCarouselDemo() {
  const [active, setActive] = useState(1)
  const [drag, setDrag] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startX = useRef(0)
  const moved = useRef(0)

  const last = CARDS.length - 1

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId)
    startX.current = e.clientX
    moved.current = 0
    setDragging(true)
  }

  const onPointerMove = (e) => {
    if (!dragging) return
    const delta = e.clientX - startX.current
    if (Math.abs(delta) > TAP_SLOP) moved.current = delta
    setDrag(delta)
  }

  const onPointerUp = () => {
    if (!dragging) return
    setDragging(false)
    let next = active
    if (drag < -THRESHOLD && active < last) next = active + 1
    if (drag > THRESHOLD && active > 0) next = active - 1
    setActive(next)
    setDrag(0)
  }

  // A tap on a peeking card selects it. Movement under the slop is still a tap.
  const onCardClick = (index) => {
    if (Math.abs(moved.current) > TAP_SLOP) return
    setActive(index)
  }

  return (
    <DemoCard label="Card carousel" stageStyle={{ padding: '24px 0 32px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
            position: 'relative',
            width: STAGE.w,
            height: STAGE.h,
            overflow: 'hidden',
            cursor: dragging ? 'grabbing' : 'grab',
            touchAction: 'pan-y',
          }}
        >
          {CARDS.map((card, i) => {
            const offset = i - active
            const slot = SLOTS[String(offset)]
            if (!slot) return null
            return (
              <div
                key={card.id}
                onClick={() => onCardClick(i)}
                style={{
                  position: 'absolute',
                  top: 20,                     // pt-20 from card-row
                  left: 0,
                  width: CARD.w,
                  height: CARD.h,
                  transformOrigin: '0 0',
                  transform: `translate(${slot.x + drag}px, ${slot.y}px) scale(${slot.s})`,
                  transition: dragging ? 'none' : `transform ${SNAP_MS}ms ${SNAP_EASE}`,
                  willChange: 'transform',
                }}
              >
                {card.kind === 'add'
                  ? <AddCard />
                  : <ArtCard art={card.art} last4={card.last4} cloud={card.cloud} />}
              </div>
            )
          })}
        </div>

        {/* slider-dots-group, on-light */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-200)', paddingTop: 'var(--space-200)' }}>
          {CARDS.map((card, i) => (
            <span
              key={card.id}
              style={{
                width: i === active ? 8 : 6,
                height: i === active ? 8 : 6,
                borderRadius: 'var(--radius-full)',
                backgroundColor: i === active ? 'var(--bg-secondary)' : 'var(--bg-selected)',
              }}
            />
          ))}
        </div>

        {/* Everything below follows the centred card. */}
        <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 'var(--space-700)', marginTop: 'var(--space-700)' }}>
          {CARDS[active].kind !== 'add' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <MenuItem label="View details" icon={<BilleaseIcon name="show" size="sm" color="var(--icon-base)" />} />
                <MenuItem label="Lock" icon={<BilleaseIcon name="lock" size="sm" color="var(--icon-base)" />} />
                <MenuItem label="Manage" icon={<img src={manageIcon} alt="" width={20} height={20} style={{ display: 'block' }} />} />
              </div>
              <TransactionWidget card={CARDS[active]} />
            </>
          )}
        </div>
      </div>
    </DemoCard>
  )
}

// ─── Content ──────────────────────────────────────────────────────────────────

const USE_WHEN = [
  'A person holds several of the same object and picks one',
  'The set is small enough to scan, roughly two to five',
  'The chosen item drives the content below it',
]

const AVOID_WHEN = [
  'The list is long enough that scanning it becomes work',
  'Items are unlike each other and need comparing side by side',
  'Nothing below the carousel depends on which item is chosen',
]

const BEHAVIOR_RULES = [
  ['One card is the subject',
   'The centred card is the one everything below refers to. The dots, the action row and the transaction list all follow it, and the list changes contents as the card changes. On the add-card slot there is nothing to act on, so both disappear.'],
  ['The strip follows the finger',
   'While dragging, the row tracks the pointer one to one with no easing at all. The animation only takes over on release.'],
  ['Past the threshold it commits',
   'Beyond 60px of travel the carousel moves to the neighbouring card. Under that it returns to where it was. Release decides, not direction of travel.'],
  ['A small move is a tap',
   'Movement under 4px counts as a tap rather than a drag, so tapping a peeking card selects it. Both ways of changing card have to work.'],
  ['Neighbours peek, they never hide',
   'The adjacent card stays partly visible at 89.3% scale. That sliver is what tells someone there is more than one card, so it is not decoration and must not be trimmed away on narrow screens.'],
  ['Add card is a slot',
   'The add-card placeholder sits in the carousel like any other card, so reaching the end of the set and adding to it are the same gesture.'],
]

const SPEC_ROWS = [
  ['Snap duration',     '300ms'],
  ['Snap easing',       'cubic-bezier(0.05, 0.7, 0.1, 1)'],
  ['While dragging',    'No transition. The row maps to the pointer one to one.'],
  ['Commit threshold',  '60px'],
  ['Tap slop',          '4px'],
  ['Centred card',      '300 x 190, radius-lg'],
  ['Peeking card',      '268 x 170, which is the same card at 89.3%'],
  ['Gap',               '12px'],
  ['Slot left edges',   '-250 / 30 / 342 in a 360 stage'],
  ['Dots',              'Active 8px on bg/secondary, inactive 6px on bg/selected, 8px apart'],
  ['Reduced motion',    'Transitions off. The card changes instantly.'],
]

const STATE_ROWS = [
  ['Single card',    'One card and the add-card slot. The carousel still works, there is simply less to move through.'],
  ['Multiple cards', 'The chosen card centred, neighbours peeking either side.'],
  ['Dragging',       'The row is under the finger with no easing, and no card is settled yet.'],
  ['Add card',       'The dashed placeholder centred, treated as the active slot.'],
]

const ACCESSIBILITY_RULES = [
  ['Respect reduced motion',
   'Switch the transition off so the card changes instantly. Do not substitute a shorter slide.'],
  ['Never gesture-only',
   'Tapping a peeking card selects it, so the carousel is usable without a drag. Anything reachable by swipe has to be reachable another way.'],
  ['Announce the position',
   'The dots are decorative. The position in the set, and the change of card, need announcing separately.'],
  ['Motion is never required',
   'Which card is chosen is carried by the content below it, not by having seen the row move.'],
]

const ENGINEERING_ROWS = [
  ['Slot values are left edges',
   'The x values are the left edge of each card, and scaling uses a top-left origin so they stay true as the card shrinks. With a centre origin the peeks land in the wrong place.'],
  ['Re-centre the peek vertically',
   'Scaling from the top-left leaves the shorter card sitting high, so a peeking card is offset down by 10.13px, half the height it loses. Without it the row looks top-aligned rather than centred.'],
  ['Only animate on release',
   'Set the transition to none while a pointer is down and restore it on release. Leaving the transition on during a drag makes the row lag behind the finger by the full snap duration.'],
  ['Threshold and slop are separate',
   'The 60px threshold decides whether a release commits. The 4px slop decides whether the gesture was a tap at all. Conflating them either makes taps impossible or makes every small drag a selection.'],
  ['Reduced motion means off, not fast',
   'Set the transition to none rather than shortening it. A very fast slide is still motion.'],
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CardCarousel() {
  return (
    <>
      <DocSection id="demo" title="Demo">
        <CardCarouselDemo />
        <div style={{ marginTop: 12 }}>
          <Note title="Try it.">
            Drag the row, or tap a peeking card. A drag under 60px snaps back; past
            it the carousel commits, and nothing eases while the pointer is down.
            Watch the transaction list below: it belongs to whichever card is
            centred, and empties on the add-card slot.
          </Note>
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
        <DocCard>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {SPEC_ROWS.map((row, i, arr) => (
                <tr key={row[0]} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <td style={{ padding: '10px 16px', verticalAlign: 'top', width: 200, fontFamily: 'var(--font-family)', fontSize: 13, fontWeight: 600, color: 'var(--text-base)', whiteSpace: 'nowrap' }}>{row[0]}</td>
                  <td style={{ padding: '10px 16px', verticalAlign: 'top', fontFamily: 'var(--font-family)', fontSize: 13, lineHeight: 1.6, color: 'var(--text-subtle)' }}>{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DocCard>
        <div style={{ marginTop: 12 }}>
          <Note title="Layout and motion agree.">
            The Figma row is 268 + 12 + 300 + 12 + 268 centred in 360, which puts
            the card left edges at -250, 30 and 342. Those are the same numbers
            the prototype uses, so the two were not reconciled after the fact.
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
