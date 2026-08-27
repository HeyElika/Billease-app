/**
 * Card carousel — a pattern under Motion / Navigation & transitions.
 *
 * Layout from Financial Core, access-card/carousel (I49002:20422;14839:3755).
 * Release, settle and edge behaviour from the carousel motion spec.
 *
 * The Figma row is 268 + 12 + 300 + 12 + 268 = 860 centred in 360, which puts
 * the card left edges at -250, 30 and 342. Those are also the handoff
 * prototype's slot constants, so the layout was never reconciled after the fact.
 * The spec supersedes the prototype on velocity, spring settling, edge
 * resistance and interruption, none of which the prototype implemented.
 */

import { useLayoutEffect, useRef, useState } from 'react'
import BilleaseIcon from '../../assets/icons/BilleaseIcon'
import cardArt from '../../assets/cards/access-card.png'
import virtualArt from '../../assets/cards/virtual-card.png'
import cloudIcon from '../../assets/cards/cloud.svg'
import manageIcon from '../../assets/cards/manage.svg'
import { LockToggleGlyph } from './cardIcons'
import {
  DocSection, DocCard, CardHeader, P, DemoCard, RuleTable, UsageList, Note, DownloadButton,
} from './docs'

const LOTTIE_DOT = '/motion/slider-dot.json'


// ─── Values ───────────────────────────────────────────────────────────────────
// Layout from Figma. Release, settle and edge behaviour from the carousel spec.

const COMMIT_PX      = 60      // or ~18% of card width where sizing is relative
const COMMIT_PCT     = 0.18
const FLICK_VELOCITY = 500     // px/s on release
const TAP_SLOP       = 4       // px under which a pointer move is a tap
const MAX_STEP       = 1       // cards advanced per gesture

const SETTLE_COMMIT_MS = 280   // spring, damping ~0.85
const SETTLE_SNAP_MS   = 260
const SPRING_DAMPING   = 0.85

// CSS cannot carry release velocity into a spring, so the demo runs the
// documented duration-and-curve fallback. Native should use the spring.
const FALLBACK_MS   = 250
const FALLBACK_EASE = 'cubic-bezier(0.2, 0, 0, 1)'

// Returning from an overscroll bounces slightly, so the boundary reads as a
// boundary rather than a dead stop. The same spring the lock pattern uses.
const EDGE_SPRING_MS   = 260
const EDGE_SPRING_EASE = 'cubic-bezier(0.34, 1.4, 0.64, 1)'

// The transactions are dependent content, not part of the carousel: they answer
// the question the carousel asks. The section stays exactly where it is and the
// rows inside it refresh once the selection settles. Nothing here is a panel
// arriving: the heading, the date and the footer never move, a row the new card
// shares with the old one is not touched at all, and the area is never empty,
// so there is nothing to read as a page being loaded.
const CONTENT_INSET = 20         // the widget's own margin inside the screen
const ROW_MS        = 180
const ROW_STAGGER   = 20         // per row, so the last one lands at 220ms
const ROW_SHIFT     = 4          // px, the whole of the movement
const ROW_EASE      = 'cubic-bezier(0, 0, 0.2, 1)'   // ease-out
const ROW_DIM       = 0.4        // the two sets pass each other here
const HEIGHT_MS     = 200        // only when the lists differ in height
const ROW_REDUCED_MS = 60

// Dots grow and recolour rather than swapping. Same standard curve as the settle.
const DOT_MS   = 140
const DOT_EASE = 'cubic-bezier(0.2, 0, 0, 1)'
const DOT = { active: 8, inactive: 6 }
const REDUCED_MS    = 120      // within the 100 to 150ms reduced-motion range

const EDGE_RESIST    = 0.25    // displayed overscroll = drag x 0.25
const MAX_OVERSCROLL = 28      // px, within the 24 to 32 range

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

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const CARDS = [
  {
    id: 'physical', kind: 'art', art: cardArt, last4: '3354', surface: 'dark',
    tx: [
      { merchant: 'Jollibee BGC Branch', meta: 'Credit line • Card 3354 • Purchase • 17:09', amount: '- ₱334.00' },
      { merchant: 'Mercury Drug',        meta: 'Credit line • Card 3354 • Purchase • 16:50', amount: '- ₱763.00' },
      { merchant: 'SM Supermarket',      meta: 'Credit line • Card 3354 • Purchase • 17:09', amount: '- ₱763.00', failed: true },
    ],
  },
  {
    id: 'virtual', kind: 'art', art: virtualArt, cloud: true, surface: 'light', last4: '5764',
    tx: [
      { merchant: 'FreshMart Grocery',    meta: 'Credit line • Card 5764 • Purchase • 16:29', amount: '- ₱200.00', failed: true },
      { merchant: 'Ace Hardware & Home',  meta: 'Credit line • Card 5764 • Purchase • 11:09', amount: '- ₱154.00' },
      { merchant: 'Netflix Subscription', meta: 'Credit line • Card 5764 • Purchase • 11:09', amount: '- ₱549.00' },
    ],
  },
  { id: 'add', kind: 'add' },
]

const CSS = `
  /* Out and in run together, so the rows are never blank between them: the
     outgoing set is still at ${ROW_DIM} while the incoming set is already past it.
     Both move by the same ${ROW_SHIFT}px, which is small enough to read as a refresh
     rather than as something arriving. */
  @keyframes tx-row-out {
    0%   { opacity: 1; transform: none; }
    60%  { opacity: ${ROW_DIM}; }
    100% { opacity: 0; transform: translateY(-${ROW_SHIFT}px); }
  }
  @keyframes tx-row-in {
    from { opacity: ${ROW_DIM}; transform: translateY(${ROW_SHIFT}px); }
    to   { opacity: 1; transform: none; }
  }
  /* The outgoing rows are lifted out of the flow and left exactly where they
     were, so the incoming ones hold their final positions from the first frame
     and a row that both cards share never moves. */
  .tx-rows    { position: relative; transition: height ${HEIGHT_MS}ms ${ROW_EASE}; }
  .tx-leaving { position: absolute; top: 0; left: 0; right: 0; pointer-events: none; }
  .tx-row.is-out { animation: tx-row-out ${ROW_MS}ms ${ROW_EASE} both; }
  .tx-row.is-in  { animation: tx-row-in  ${ROW_MS}ms ${ROW_EASE} both; }
  @media (prefers-reduced-motion: reduce) {
    @keyframes tx-row-out { to { opacity: 0; } }
    @keyframes tx-row-in  { from { opacity: ${ROW_DIM}; } }
    .tx-row.is-out, .tx-row.is-in {
      animation-duration: ${ROW_REDUCED_MS}ms;
      animation-delay: 0ms !important;
    }
    .tx-rows { transition: none; }
  }
`

// ─── Card faces ───────────────────────────────────────────────────────────────

/**
 * The masked digits. Both the dots and the number take the card's own
 * on-surface colours: white on the physical face, base on the light virtual
 * one (I49002:20606;14839:3523 and I49002:20631;14839:3797). The card art is
 * not always dark, so neither is the text on it.
 */
const SURFACE_INK = {
  dark:  { text: 'var(--text-on-dark)', dot: 'var(--icon-on-dark)' },
  light: { text: 'var(--text-base)',    dot: 'var(--icon-base)'    },
}

function Dot({ color }) {
  return (
    <span style={{ width: 8, height: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden="true">
      <span style={{ width: 3.33, height: 3.33, borderRadius: '50%', backgroundColor: color }} />
    </span>
  )
}

function ArtCard({ art, last4, cloud, surface = 'dark' }) {
  const ink = SURFACE_INK[surface]
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
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              <Dot color={ink.dot} /><Dot color={ink.dot} />
            </span>
            <span style={{
              fontSize: 'var(--text-md)', fontWeight: 600, lineHeight: 1.5,
              color: ink.text, whiteSpace: 'nowrap',
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

function MenuItem({ icon, label, onClick, disabled }) {
  return (
    <div style={{
      width: 100, height: 78,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 'var(--space-200)',
    }}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        style={{
          width: 50, height: 50, borderRadius: 12, border: 'none', padding: 0,
          color: 'var(--icon-base)',
          backgroundColor: 'var(--bg-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: disabled ? 'not-allowed' : (onClick ? 'pointer' : 'default'),
        }}
      >
        {icon}
      </button>
      <span style={{
        width: 100, textAlign: 'center', fontFamily: 'var(--ds-font-family)',
        fontSize: 'var(--text-md)', fontWeight: 400, lineHeight: 1.5,
        color: disabled ? 'var(--text-disabled)' : 'var(--text-base)',
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

/**
 * The widget splits in two. The heading names the section and holds still; only
 * the list underneath belongs to one card and travels with it.
 */
function TransactionsHeading() {
  return (
    <div style={{ height: 24, display: 'flex', alignItems: 'center', gap: 'var(--space-200)', width: '100%', fontFamily: 'var(--ds-font-family)' }}>
      <span style={{ fontSize: 'var(--text-lg)', fontWeight: 600, lineHeight: 1.25, color: 'var(--text-base)', whiteSpace: 'nowrap' }}>
        Transactions for this card
      </span>
    </div>
  )
}

/** The date the rows are grouped under. It names the group, so it holds still. */
function TransactionsDate() {
  return (
    <div style={{ height: 28, display: 'flex', alignItems: 'center', paddingTop: 'var(--space-300)', paddingBottom: 'var(--space-200)', width: '100%', fontFamily: 'var(--ds-font-family)' }}>
      <span style={{ fontSize: 'var(--text-md)', fontWeight: 400, lineHeight: 1.5, color: 'var(--text-base)' }}>Today</span>
    </div>
  )
}

function TransactionsFooter() {
  return (
    <div style={{ height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-200)', width: '100%', fontFamily: 'var(--ds-font-family)' }}>
      <span style={{ fontSize: 'var(--text-md)', fontWeight: 600, lineHeight: 1.5, color: 'var(--text-subtle)' }}>View all</span>
    </div>
  )
}

/**
 * The rows themselves. `state` is a map of merchant to 'in' or 'out'; anything
 * missing from it is a row both cards have, and is left alone.
 */
function TransactionRows({ rows, state, hidden }) {
  return rows.map((tx, i) => {
    const phase = state?.[tx.merchant]
    return (
      <div
        key={tx.merchant}
        className={phase ? `tx-row is-${phase}` : 'tx-row'}
        style={{
          // Only the incoming rows are staggered, and barely.
          animationDelay: phase === 'in' ? `${i * ROW_STAGGER}ms` : undefined,
          // A shared row is already drawn by the list underneath; this copy only
          // holds the space so the rows above it do not move.
          visibility: hidden && !phase ? 'hidden' : undefined,
        }}
      >
        <TransactionItem tx={tx} />
      </div>
    )
  })
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

function CardCarouselDemo() {
  const [active, setActive] = useState(1)
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [settleMs, setSettleMs] = useState(FALLBACK_MS)
  const [settleEase, setSettleEase] = useState(FALLBACK_EASE)

  // Which card's rows are on screen, plus the set of rows on their way out and
  // the phase each row is in. Rows in neither set belong to both cards and are
  // left where they are.
  const [shown, setShown] = useState(active)
  const [leaving, setLeaving] = useState(null)   // { rows, state } or null
  const [phases, setPhases] = useState(null)     // merchant -> 'in'
  const boxRef = useRef(null)
  const listRef = useRef(null)
  const boxHeight = useRef(null)   // last measured list height

  const startX = useRef(0)
  const baseOffset = useRef(0)   // non-zero when a gesture interrupts a settle
  const moved = useRef(0)
  const samples = useRef([])     // recent {x, t} for the release velocity
  const trackRef = useRef(null)

  const last = CARDS.length - 1

  /**
   * Refresh the rows under the newly selected card.
   *
   * The new rows go in immediately, so the area is never empty and never waits
   * on anything. The old ones are lifted out of the flow and fade where they
   * stand. A row both cards have is in neither set: it is the same element in
   * the same place and nothing is played on it.
   *
   * Called again mid-refresh it simply recomputes against what is on screen
   * now, so rapid swipes leave one refresh, ending on the card you stopped at.
   */
  const refreshRows = (to) => {
    if (to === shown) return
    const before = CARDS[shown].tx ?? []
    const after = CARDS[to].tx ?? []
    const beforeKeys = new Set(before.map(t => t.merchant))
    const afterKeys = new Set(after.map(t => t.merchant))

    const outgoing = before.filter(t => !afterKeys.has(t.merchant))
    setLeaving(outgoing.length
      ? { rows: before, state: Object.fromEntries(outgoing.map(t => [t.merchant, 'out'])) }
      : null)
    setPhases(Object.fromEntries(
      after.filter(t => !beforeKeys.has(t.merchant)).map(t => [t.merchant, 'in'])
    ))
    setShown(to)
  }

  /** The outgoing rows share a duration, so the first one to end ends them all. */
  const onLeaveEnd = (e) => {
    if (e.animationName && !e.animationName.includes('tx-row-out')) return
    setLeaving(null)
  }


  /** Where the track actually is right now, mid-settle included. */
  const currentOffset = () => {
    const el = trackRef.current
    if (!el) return offset
    const m = new DOMMatrixReadOnly(getComputedStyle(el).transform)
    return m.m41 - SLOTS['0'].x
  }

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId)
    // Interruption: take over from wherever the settle has got to, no jump.
    baseOffset.current = dragging ? offset : currentOffset()
    setOffset(baseOffset.current)
    startX.current = e.clientX
    moved.current = 0
    samples.current = [{ x: e.clientX, t: performance.now() }]
    setDragging(true)
  }

  const onPointerMove = (e) => {
    if (!dragging) return
    const delta = e.clientX - startX.current
    if (Math.abs(delta) > TAP_SLOP) moved.current = delta

    samples.current.push({ x: e.clientX, t: performance.now() })
    if (samples.current.length > 6) samples.current.shift()

    let next = baseOffset.current + delta
    // Past either end the track resists rather than stopping dead.
    if ((active === 0 && next > 0) || (active === last && next < 0)) {
      const over = next
      next = Math.sign(over) * Math.min(Math.abs(over) * EDGE_RESIST, MAX_OVERSCROLL)
    }
    setOffset(next)
  }

  /** px/s over the last ~100ms of the gesture. */
  const releaseVelocity = () => {
    const s = samples.current
    if (s.length < 2) return 0
    const end = s[s.length - 1]
    const start = s.find(p => end.t - p.t <= 100) ?? s[0]
    const dt = end.t - start.t
    return dt > 0 ? ((end.x - start.x) / dt) * 1000 : 0
  }

  const onPointerUp = () => {
    if (!dragging) return
    setDragging(false)

    const velocity = releaseVelocity()
    const distance = offset
    const threshold = Math.min(COMMIT_PX, CARD.w * COMMIT_PCT)

    // Commit on distance OR on a flick, whichever happens first. One card max.
    const wantsPrev = distance > 0 || velocity > 0
    const committed =
      Math.abs(distance) >= threshold || Math.abs(velocity) >= FLICK_VELOCITY

    let next = active
    if (committed) {
      next = wantsPrev ? active - MAX_STEP : active + MAX_STEP
      next = Math.max(0, Math.min(last, next))
    }

    const changed = next !== active
    // Released against an end with nothing to move to: bounce back.
    const atEdge = !changed && ((active === 0 && offset > 0) || (active === last && offset < 0))
    const reduced = prefersReducedMotion()

    setSettleEase(atEdge && !reduced ? EDGE_SPRING_EASE : FALLBACK_EASE)
    setSettleMs(
      reduced ? REDUCED_MS
        : atEdge ? EDGE_SPRING_MS
          : (changed ? SETTLE_COMMIT_MS : SETTLE_SNAP_MS)
    )
    refreshRows(next)
    setActive(next)
    setOffset(0)
  }

  // A tap on a peeking card selects it. Movement under the slop is still a tap.
  const onCardClick = (index) => {
    if (Math.abs(moved.current) > TAP_SLOP) return
    setSettleEase(FALLBACK_EASE)
    setSettleMs(prefersReducedMotion() ? REDUCED_MS : SETTLE_COMMIT_MS)
    refreshRows(index)
    setActive(index)
  }

  /**
   * Height is a measurement, not a decision, so it is written to the node
   * rather than held in state. Lists of the same length leave the box on auto
   * and nothing animates. A different length is pinned to the old height,
   * flushed, then set to the new one, which is what gives the transition
   * something to run between. The box goes back to auto once it lands, so a
   * measurement taken now can never clip the content later.
   */
  useLayoutEffect(() => {
    const box = boxRef.current
    const list = listRef.current
    if (!box || !list) return
    const from = boxHeight.current
    const to = list.offsetHeight
    boxHeight.current = to
    if (from === null || from === to) {
      box.style.height = 'auto'
      return
    }
    box.style.height = `${from}px`
    void box.offsetHeight        // flush, or the browser only sees the last value
    box.style.height = `${to}px`
  }, [shown])

  return (
    <DemoCard label="Card carousel" stageStyle={{ padding: '24px 0 32px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        <style>{CSS}</style>
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
            // Slot relative to the centred card. Named apart from the drag
            // offset below: both live in this scope and one shadowing the
            // other silently stops the track following the finger.
            const rel = i - active
            const slot = SLOTS[String(rel)]
            if (!slot) return null
            return (
              <div
                key={card.id}
                ref={i === active ? trackRef : null}
                onClick={() => onCardClick(i)}
                style={{
                  position: 'absolute',
                  top: 20,                     // pt-20 from card-row
                  left: 0,
                  width: CARD.w,
                  height: CARD.h,
                  transformOrigin: '0 0',
                  transform: `translate(${slot.x + offset}px, ${slot.y}px) scale(${slot.s})`,
                  // One track: every card takes the same offset, none animates alone.
                  transition: dragging ? 'none' : `transform ${settleMs}ms ${settleEase}`,
                  willChange: 'transform',
                }}
              >
                {card.kind === 'add'
                  ? <AddCard />
                  : <ArtCard art={card.art} last4={card.last4} cloud={card.cloud} surface={card.surface} />}
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
                width: i === active ? DOT.active : DOT.inactive,
                height: i === active ? DOT.active : DOT.inactive,
                borderRadius: 'var(--radius-full)',
                backgroundColor: i === active ? 'var(--bg-secondary)' : 'var(--bg-selected)',
                transition: `width ${DOT_MS}ms ${DOT_EASE}, height ${DOT_MS}ms ${DOT_EASE}, background-color ${DOT_MS}ms ${DOT_EASE}`,
              }}
            />
          ))}
        </div>

        {/* Below the card: dependent content. The whole section is anchored,
            and the rows inside it refresh once the selection has settled. */}
        <div style={{ width: STAGE.w, marginTop: 'var(--space-700)', padding: `0 ${CONTENT_INSET}px`, boxSizing: 'border-box' }}>
          <div
            style={{
              display: 'flex', flexDirection: 'column', gap: 'var(--space-700)',
              opacity: CARDS[active].tx ? 1 : 0,
              pointerEvents: CARDS[active].tx ? undefined : 'none',
              transition: `opacity ${settleMs}ms ${settleEase}`,
            }}
            aria-hidden={CARDS[active].tx ? undefined : 'true'}
            inert={CARDS[active].tx ? undefined : true}
          >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <MenuItem
                label="View details"
                icon={<BilleaseIcon name="show" size="sm" color="var(--icon-base)" />}
              />
              <MenuItem label="Lock" icon={<LockToggleGlyph locked={false} />} />
              <MenuItem label="Manage" icon={<img src={manageIcon} alt="" width={20} height={20} style={{ display: 'block' }} />} />
            </div>
            {/* The section is one structure that stays put. Only the rows in the
                middle of it change, and only once the selection has settled. */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-400)' }}>
              <TransactionsHeading />
              <div>
                <TransactionsDate />
                <div
                  ref={boxRef}
                  className="tx-rows"
                  onTransitionEnd={e => {
                    // Released back to auto so a stale measurement cannot clip.
                    if (e.propertyName === 'height' && e.target === e.currentTarget) {
                      e.currentTarget.style.height = 'auto'
                    }
                  }}
                >
                  <div ref={listRef}>
                    <TransactionRows rows={CARDS[shown].tx ?? []} state={phases} />
                  </div>
                  {leaving && (
                    <div className="tx-leaving" aria-hidden="true" onAnimationEnd={onLeaveEnd}>
                      <TransactionRows rows={leaving.rows} state={leaving.state} hidden />
                    </div>
                  )}
                </div>
                <TransactionsFooter />
              </div>
            </div>
          </div>
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
  ['The track follows the finger',
   'While a pointer is down the cards move as one horizontal track at a 1:1 ratio, with no easing. No card animates on its own, and the neighbouring card simply enters the viewport as the track moves.'],
  ['Release commits on distance or velocity',
   'Below 60px the card snaps back. At 60px or beyond, or on a flick of 500px/s or more in the same direction, the carousel commits to the adjacent card. A gesture advances one card at most.'],
  ['Selection changes on release, not during',
   'Through the drag the current card stays selected and the dots stay put. The transactions move with the gesture, but moving is not switching: which card is selected, and which list is the one being read, is settled on release.'],
  ['The ends resist, they do not loop',
   'Dragging past the first or last card shows a quarter of the travel, up to about 28px. On release it bounces back rather than stopping dead, which is what tells someone they have reached the end rather than hit a broken gesture. Everywhere else the settle has no overshoot; this is the one exception.'],
  ['The transactions are dependent content, not part of the carousel',
   'The carousel is the question and the list is the answer. The section is anchored: it never slides sideways with the cards and it is never faded out as a layer. Only one thing is being dragged, and it is the cards.'],
  ['The frame of the section never moves',
   'The action row, the heading, the date the rows are grouped under and the footer all hold their place. What changes is the rows, which is the only part that actually belongs to one card.'],
  ['The list does not change during the drag',
   'Through the gesture it keeps showing the card that is still selected. A drag that is snapped back changes nothing at all, so rows that had already started changing would have to change back.'],
  ['Rows refresh in place once the selection settles',
   `On a commit the new rows take their final positions at once and rise the last ${ROW_SHIFT}px into them from ${ROW_DIM} opacity, while the rows they replace lift the same ${ROW_SHIFT}px and fade away. ${ROW_MS}ms on an ease-out. Both are on screen throughout, so the area never passes through empty.`],
  ['A row the two cards share is not touched',
   'Rows are matched between the old list and the new one. Anything present in both keeps its element and its position and plays nothing at all, so a refresh only moves what actually changed.'],
  ['The movement is small enough to read as a refresh',
   `${ROW_SHIFT}px, and never a full fade from nothing. Larger movement or a fade from zero would read as a panel arriving, which is the wrong story: the data is being updated under the card, not replaced by another screen.`],
  ['Stagger stays under the threshold of noticing',
   `${ROW_STAGGER}ms between rows, so the last of three lands ${2 * ROW_STAGGER}ms after the first. Enough to keep the rows from moving as one slab, not enough to read as a sequence.`],
  ['Height eases, it does not snap',
   `A longer or shorter list takes the section to its new height over ${HEIGHT_MS}ms rather than jumping, so nothing below it is thrown down the page. Lists of the same length never animate.`],
  ['Rapid swipes resolve to the last card',
   'A second commit during a refresh does not queue another. It recomputes against what is on screen at that moment, so three quick swipes leave one refresh, ending on the card you stopped at.'],
  ['Add card is a position, not an action',
   'The add-card slot navigates like any other card on the same thresholds. Landing on it must never trigger adding a card; only its own control does that.'],
  ['Gestures interrupt cleanly',
   'A new drag during a settle takes over from wherever the track has reached, with no jump back to a resting position. Rapid swipes stay continuous and animations are never queued.'],
]

const SPEC_ROWS = [
  ['Drag tracking',      '1:1, no easing'],
  ['Commit distance',    `${COMMIT_PX}px, or about ${COMMIT_PCT * 100}% of card width where sizing is relative`],
  ['Flick velocity',     `${FLICK_VELOCITY}px/s or more on release`],
  ['Cards per gesture',  String(MAX_STEP)],
  ['Commit settle',      `${SETTLE_COMMIT_MS}ms spring, preserving release velocity`],
  ['Snap-back settle',   `${SETTLE_SNAP_MS}ms, same spring character`],
  ['Spring damping',     `${SPRING_DAMPING}, no noticeable overshoot`],
  ['Curve fallback',     `${FALLBACK_MS}ms ${FALLBACK_EASE} where spring physics are unavailable`],
  ['Edge resistance',    `${EDGE_RESIST * 100}% of drag distance`],
  ['Max overscroll',     '24 to 32px'],
  ['Edge spring-back',   `${EDGE_SPRING_MS}ms cubic-bezier(0.34, 1.4, 0.64, 1), a slight bounce`],
  ['Reduced motion',     '100 to 150ms, no spring or overshoot'],
  ['Centred card',       '300 x 190, radius-lg'],
  ['Peeking card',       '268 x 170, the same card at 89.3%'],
  ['Slot left edges',    '-250 / 30 / 342 in a 360 stage, 12px gaps'],
  ['Dots',               'Active 8px on bg/secondary, inactive 6px on bg/selected, 8px apart'],
  ['Dot transition',     `${DOT_MS}ms ${DOT_EASE} on width, height and colour. They grow and recolour, they do not swap.`],
  ['What holds still',   'The section, the action row, the heading, the date and the footer. Nothing below the carousel translates.'],
  ['What changes',       'The rows, and only those that differ between the two cards'],
  ['Outgoing rows',      `Opacity 1 to ${ROW_DIM} and away, ${ROW_SHIFT}px up, ${ROW_MS}ms ${ROW_EASE}`],
  ['Incoming rows',      `Opacity ${ROW_DIM} to 1, ${ROW_SHIFT}px up into place, ${ROW_MS}ms ${ROW_EASE}`],
  ['Overlap',            'Full. Both sets run together, so the area is never blank.'],
  ['Stagger',            `${ROW_STAGGER}ms per row on the incoming set only, so a three-row list is done at ${ROW_MS + 2 * ROW_STAGGER}ms`],
  ['Shared rows',        'Untouched. Same element, same position, no animation.'],
  ['Height change',      `${HEIGHT_MS}ms ${ROW_EASE}, only when the two lists differ in height`],
  ['Rows reduced motion', `${ROW_REDUCED_MS}ms, opacity only, no movement and no stagger`],
  ['Card number',        'Takes the card\u2019s own surface colours: text/on-dark on the physical face, text/base on the light virtual one. The masked dots follow it.'],
]

const STATE_ROWS = [
  ['During drag',   'The current card stays selected, the dots are unchanged, and the transactions below are untouched. Only the cards move.'],
  ['Commit',        `The selected card and the dots update, and the rows refresh in place: what changed lifts ${ROW_SHIFT}px away as what replaces it rises ${ROW_SHIFT}px into position, ${ROW_MS}ms.`],
  ['Snap back',     'Nothing changes. The track returns to the card it started on and the rows are never touched.'],
  ['At either end', 'The track resists at a quarter of the drag, then bounces back to the boundary card. The carousel never loops.'],
  ['Add card',      'The dashed placeholder centred, with nothing below it: there is nothing to act on yet, so the whole section fades out on the settle as its rows leave.'],
  ['Locked',        'A locked card keeps its slot and still swipes. Lock is held per card, so it stays locked as others move past. The treatment itself is documented under Lock and unlock.'],
]

const ACCESSIBILITY_RULES = [
  ['Respect reduced motion',
   'Remove the spring and any overshoot, keeping the carousel fully functional on a 100 to 150ms transition, or the platform convention where one exists.'],
  ['Never gesture-only',
   'Tapping a peeking card selects it, so the carousel works without a drag. Anything reachable by gesture has to be reachable another way.'],
  ['Announce the position',
   'The dots are decorative. Position in the set, and the change of card, need announcing separately.'],
  ['Only the current rows are read',
   'The rows on their way out are hidden from assistive technology while they fade, so the page never reads two sets of transactions at once. Nothing hidden is left in the tab order.'],
  ['Motion is never required',
   'Which card is chosen is carried by the content below it, not by having seen the track move.'],
]

const DOT_LOTTIE_ROWS = [
  ['Play the right segment',
   '0 to 140ms activates a dot, 140 to 280ms deactivates it. The file is one dot, not the row.'],
  ['The row is layout',
   'How many dots there are and how they sit, 8px apart and centred, is not in the file. Only the dot changing state is.'],
  ['Colours are baked in',
   'It ships bg/selected growing into bg/secondary, the on-light pair. For dots over a card, override to alpha-white 20% and bg/base.'],
]

const ENGINEERING_ROWS = [
  ['Spring first, curve as fallback',
   'Settle with a spring that carries the release velocity through, so the motion continues the gesture rather than starting a new animation. Where spring physics are not available, a 250ms cubic-bezier(0.2, 0, 0, 1) is close enough. The demo on this page uses that fallback, since CSS cannot carry velocity into a transition.'],
  ['Distance and velocity, not one or the other',
   'Either condition commits. Measuring only distance loses the flick; measuring only velocity loses the slow, deliberate drag.'],
  ['Interrupt by reading the current transform',
   'On a new pointer down mid-settle, take the track position from its computed transform and continue from there. Resetting to the resting position first is what makes rapid swipes feel broken.'],
  ['Slot values are left edges',
   'The x values are each card\'s left edge, and scaling uses a top-left origin so they hold as the card shrinks. A centre origin puts the peeks in the wrong place. A peeking card is also offset down 10.13px, half the height it loses, or the row reads top-aligned.'],
  ['Threshold and slop are separate',
   'The 60px threshold decides whether a release commits. The 4px slop decides whether the gesture was a tap at all. Conflating them either makes taps impossible or turns every small drag into a selection.'],
  ['Symmetrical in both directions',
   'Left advances, right goes back, on identical thresholds and spring values. Desktop pointer and touch follow the same logic.'],
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CardCarousel() {
  return (
    <>
      <DocSection id="demo" title="Demo">
        <CardCarouselDemo />
        <div style={{ marginTop: 12 }}>
          <Note title="Try it.">
            Below 60px the card snaps back. At 60px or beyond, or on a
            high-velocity flick, the carousel commits to the adjacent card.
            Nothing eases while the pointer is down, and a new drag during a
            settle takes over from where the track had reached. Drag past either
            end and the track gives a quarter of the distance, then bounces back.
            Everything below the carousel holds its place. Once the card has
            settled, the rows that differ refresh where they stand: the old ones
            lift away as the new ones rise into position, four pixels, with
            anything the two cards share left exactly as it was.
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
          <Note title="Layout.">
            The Figma row is 268 + 12 + 300 + 12 + 268 centred in 360, which puts
            the card left edges at -250, 30 and 342.
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

        <div style={{ height: 32 }} />
        <DocCard>
          <CardHeader
            label="Lottie asset"
            action={<DownloadButton href={LOTTIE_DOT} name="slider-dot.json" />}
          />
          <RuleTable rows={DOT_LOTTIE_ROWS} labelWidth={220} bare />
        </DocCard>
      </DocSection>
    </>
  )
}
