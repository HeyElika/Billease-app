/**
 * Motion — Billease Design System portal
 *
 * Skeleton loader: the shimmer applied to placeholder content while a screen
 * waits on data, and the wipe that reveals the real content once it arrives.
 * Demonstrated on card/payment-review (Figma qESeTFW1GEEosrYnm4Hu3b, 6569:445).
 *
 * The reveal uses the native View Transitions API, so it needs no animation
 * library. Where the API is unavailable the state still swaps, just without
 * the wipe, and the same applies under prefers-reduced-motion.
 *
 * Colours are neutrals only, from Desktop/variables2.json:
 *   neutral 100 #F5F5F5  neutral 200 #E0E0E0  neutral 500 #919191
 *   neutral 700 #545454  neutral 900 #1A1A1A  white
 * All are already bound in src/index.css, so this file references the tokens.
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useToc } from '../context/TocContext'
import Button from '../components/ds/Button'
import merchantLogo from '../assets/merchants/pancake-house.png'

const SECTIONS = [
  { id: 'demo',      label: 'Skeleton loader' },
  { id: 'spec',      label: 'Specification'   },
  { id: 'behaviour', label: 'Behaviour'       },
  { id: 'mechanics', label: 'Mechanics'       },
]

/* ───────────────────────────────────────────────────────────────────────────
   TIMING — fixed. Not configurable at runtime, by design. Every screen that
   uses the skeleton loader uses these exact values.
   ─────────────────────────────────────────────────────────────────────────── */

const SHIMMER_CYCLE  = 1000   // ms, one full pass of the band
const SHIMMER_EASING = 'linear'
const SKELETON_HOLD  = 3000   // ms, exactly three cycles, so the reveal lands on a seam
const WIPE_DURATION  = 400    // ms
const WIPE_EASING    = 'cubic-bezier(0.4, 0, 0.2, 1)'  // Billease transition easing

const VIEW_NAME = 'ds-payment-review'

const MOTION_CSS = `
  @property --ds-wipe {
    syntax: '<percentage>';
    inherits: true;
    initial-value: -100%;
  }

  /* Peak enters at -0.5w and leaves at 3.5w, so it crosses the bone in a
     quarter of the cycle and the remaining three quarters are near-flat rest. */
  @keyframes ds-shimmer-sweep {
    from { transform: translateX(-100%); }
    to   { transform: translateX(300%); }
  }

  @keyframes ds-skeleton-wipe {
    from { --ds-wipe:  100%; }
    to   { --ds-wipe: -100%; }
  }

  /* The bone sits at neutral 200. A soft band exactly one bone-width wide
     passes over it, peaking at neutral 100. The band is sized in percentages,
     so a narrow bone and a wide one complete their pass in the same 1000ms. */
  .ds-shimmer {
    position: relative;
    overflow: hidden;
    background: var(--bg-sunken);
  }
  .ds-shimmer::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(
      90deg,
      transparent      0%,
      var(--bg-subtle) 50%,
      transparent    100%
    );
    transform: translateX(-100%);
    animation: ds-shimmer-sweep ${SHIMMER_CYCLE}ms ${SHIMMER_EASING} infinite;
    will-change: transform;
  }

  ::view-transition-group(${VIEW_NAME}) {
    border-radius: var(--radius-lg);
    overflow: hidden;
  }

  ::view-transition-image-pair(${VIEW_NAME}) {
    mix-blend-mode: normal;
  }

  /* The skeleton is wiped off the top of the real card, not cross-faded into it. */
  ::view-transition-old(${VIEW_NAME}) {
    z-index: 2;
    animation: ds-skeleton-wipe ${WIPE_DURATION}ms ${WIPE_EASING} both;
    -webkit-mask-image: linear-gradient(to right, black var(--ds-wipe), transparent calc(var(--ds-wipe) + 100%));
            mask-image: linear-gradient(to right, black var(--ds-wipe), transparent calc(var(--ds-wipe) + 100%));
  }

  ::view-transition-new(${VIEW_NAME}) {
    animation: none;
    opacity: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    .ds-shimmer::after { animation: none; opacity: 0; }
    ::view-transition-old(${VIEW_NAME}),
    ::view-transition-new(${VIEW_NAME}) { animation: none; }
  }
`

// ─── Shimmer primitives ───────────────────────────────────────────────────────

/**
 * TextBone — occupies the exact line box of the string it replaces, so nothing
 * moves on reveal, but draws the bone at glyph height rather than line height.
 * Width comes from the real string. No guessed percentages.
 */
function TextBone({ children, fontSize = 16 }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', verticalAlign: 'top' }}>
      <span style={{ visibility: 'hidden' }}>{children}</span>
      <span
        className="ds-shimmer"
        aria-hidden="true"
        style={{
          position: 'absolute', left: 0, right: 0, top: '50%',
          transform: 'translateY(-50%)',
          height: Math.round(fontSize * 0.75),
          borderRadius: 'var(--radius-full)',
        }}
      />
    </span>
  )
}

/** Bone — for a node with no intrinsic content to measure (the merchant logo). */
function Bone({ size, radius }) {
  return (
    <div
      className="ds-shimmer"
      aria-hidden="true"
      style={{ width: size, height: size, borderRadius: radius, flexShrink: 0 }}
    />
  )
}

/**
 * ParagraphBone — one bone per rendered line of a wrapping paragraph.
 *
 * Where TextBone measures a single string, this finds where the real text breaks
 * and draws a bone over each line, so the bones follow the true wrap and the
 * last one is short because the last line is short.
 *
 * Three things make this fiddly enough to be worth spelling out:
 *
 *  - Ranging over the wrapper element returns a rect for its block box as well
 *    as one per line fragment, and that block rect spans every line at once.
 *    Only text nodes are ranged over here, so no block rect is ever produced.
 *  - A run that wraps is one text node with two rects. A line built from several
 *    runs is several rects at the same height. So fragments are grouped into
 *    lines by vertical position, not by which node they came from.
 *  - Line positions are derived from the fragments themselves rather than from
 *    a computed line-height, which would have to be read off the right element
 *    to be correct. Grouping by proximity needs no such assumption, and absorbs
 *    the sub-pixel differences between bold and regular runs on one line.
 */
function ParagraphBone({ fontSize = 14, children }) {
  const ref = useRef(null)
  const [rows, setRows] = useState([])

  useLayoutEffect(() => {
    let cancelled = false

    const measure = () => {
      const el = ref.current
      if (!el || cancelled) return
      const base = el.getBoundingClientRect()
      if (base.width === 0) return

      // Text nodes only. Ranging over an element would also return its block rect.
      const frags = []
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        if (!node.nodeValue || !node.nodeValue.trim()) continue
        const range = document.createRange()
        range.selectNodeContents(node)
        for (const r of range.getClientRects()) {
          if (r.width <= 0 || r.height <= 0) continue
          frags.push({
            centre: r.top + r.height / 2 - base.top,
            left: r.left - base.left,
            right: r.right - base.left,
          })
        }
      }

      // Fragments within a few pixels of each other vertically are one line.
      const LINE_TOLERANCE = 3
      frags.sort((a, b) => a.centre - b.centre)
      const lines = []
      for (const f of frags) {
        const last = lines[lines.length - 1]
        if (last && Math.abs(f.centre - last.centre) <= LINE_TOLERANCE) {
          last.left = Math.min(last.left, f.left)
          last.right = Math.max(last.right, f.right)
        } else {
          lines.push({ centre: f.centre, left: f.left, right: f.right })
        }
      }

      const next = lines
        .map(l => ({
          centre: l.centre,
          left: Math.max(l.left, 0),
          width: Math.min(l.right, base.width) - Math.max(l.left, 0),
        }))
        .filter(l => l.width > 0)

      if (next.length) { setRows(next); return }

      // Nothing measurable. Fall back to full-width bones on a computed grid.
      const typeEl = el.firstElementChild || el
      const lineHeight = parseFloat(getComputedStyle(typeEl).lineHeight) || fontSize * 1.5
      const count = Math.max(1, Math.round(base.height / lineHeight))
      setRows(Array.from({ length: count }, (_, i) => ({
        centre: (i + 0.5) * lineHeight, left: 0, width: base.width,
      })))
    }

    measure()
    // Re-measure once webfonts settle, since Source Sans Pro changes the wrap.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure).catch(() => {})

    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null
    if (ro && ref.current) ro.observe(ref.current)
    return () => { cancelled = true; if (ro) ro.disconnect() }
  }, [children, fontSize])

  const boneHeight = Math.round(fontSize * 0.75)

  return (
    <div style={{ position: 'relative', flex: '1 0 0', minWidth: 0 }}>
      <div ref={ref} style={{ visibility: 'hidden' }}>{children}</div>
      {rows.map((l, i) => (
        <span
          key={i}
          className="ds-shimmer"
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: l.left,
            width: l.width,
            top: l.centre - boneHeight / 2,
            height: boneHeight,
            borderRadius: 'var(--radius-full)',
          }}
        />
      ))}
    </div>
  )
}

// ─── card/payment-review — Figma node 6569:445 ────────────────────────────────

const MERCHANT = 'Pancake House'

const DETAIL_ROWS = [
  { label: 'Installment term',    value: '9 months'     },
  { label: 'Repayment frequency', value: 'Monthly'      },
  { label: 'First payment due',   value: 'Nov 03, 2025' },
  { label: 'Purchase amount',     value: '₱5,428.00' },
  { label: 'Installment amount',  value: '₱610.00'   },
  { label: 'Total to pay',        value: '₱5,490.00' },
]

const shell = {
  width: 360,
  boxSizing: 'border-box',
  backgroundColor: 'var(--bg-base)',
  padding: 'var(--space-600) var(--space-500)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-600)',
  fontFamily: 'var(--ds-font-family)',
  viewTransitionName: VIEW_NAME,
}

const merchantCard = {
  backgroundColor: 'var(--bg-subtle)',
  borderRadius: 'var(--radius-lg)',
  padding: 'var(--space-300)',
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-300)',
  width: '100%',
  boxSizing: 'border-box',
}

const summaryCard = {
  backgroundColor: 'var(--bg-base)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-lg)',
  padding: 'var(--space-300)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-400)',
  width: '100%',
  boxSizing: 'border-box',
}

const rowStyle    = { display: 'flex', alignItems: 'center', gap: 'var(--space-200)', width: '100%' }
const labelStyle  = { margin: 0, fontSize: 16, fontWeight: 400, lineHeight: 1.5, color: 'var(--text-subtle)', whiteSpace: 'nowrap', flexShrink: 0 }
const valueStyle  = { margin: 0, fontSize: 16, fontWeight: 600, lineHeight: 1.5, color: 'var(--text-base)', flex: '1 0 0', minWidth: 0, textAlign: 'right' }
const nameStyle   = { margin: 0, fontSize: 16, fontWeight: 600, lineHeight: 1.5, color: 'var(--text-base)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
const consentStyle = { margin: 0, fontSize: 14, lineHeight: 1.5, color: 'var(--text-base)' }

const CONSENT = (
  <>
    I have read and agree to the{' '}
    <span style={{ fontWeight: 600, textDecoration: 'underline' }}>Disclosure statement</span>
    {'  '}and{' '}
    <span style={{ fontWeight: 600, textDecoration: 'underline' }}>Promissory note.</span>
  </>
)

const logoStyle = {
  width: 40, height: 40, borderRadius: 'var(--radius-full)',
  border: '1px solid var(--border-subtle)', overflow: 'hidden', flexShrink: 0,
  objectFit: 'cover', display: 'block',
}

/**
 * The same shell renders both states. Only the data nodes swap, so the chrome
 * (backgrounds, borders, the consent row) is byte-identical across the wipe and
 * the layout cannot shift.
 */
function PaymentReviewCard({ loading }) {
  return (
    <div style={shell} data-node-id="6569:445">
      {/* card/recipient */}
      <div style={merchantCard}>
        {loading
          ? <Bone size={40} radius="var(--radius-full)" />
          : <img src={merchantLogo} alt="" style={logoStyle} />}
        <div style={{ flex: '1 0 0', minWidth: 0 }}>
          {loading
            ? <TextBone fontSize={16}><span style={nameStyle}>{MERCHANT}</span></TextBone>
            : <p style={nameStyle}>{MERCHANT}</p>}
        </div>
      </div>

      {/* card/summary-review */}
      <div style={summaryCard}>
        {DETAIL_ROWS.map(row => (
          <div key={row.label} style={rowStyle}>
            {loading ? (
              <>
                <TextBone fontSize={16}><span style={labelStyle}>{row.label}</span></TextBone>
                <span style={{ ...valueStyle, fontWeight: 600 }}>
                  <TextBone fontSize={16}><span style={{ fontWeight: 600 }}>{row.value}</span></TextBone>
                </span>
              </>
            ) : (
              <>
                <p style={labelStyle}>{row.label}</p>
                <p style={valueStyle}>{row.value}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* checkbox-paragraph */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-200)', width: '100%' }}>
        {loading
          ? <Bone size={24} radius="var(--radius-md)" />
          : <div style={{
              width: 24, height: 24, flexShrink: 0, boxSizing: 'border-box',
              border: '2px solid var(--border-bold)', borderRadius: 'var(--radius-md)',
            }} />}
        {loading ? (
          <ParagraphBone fontSize={14}>
            <p style={consentStyle}>{CONSENT}</p>
          </ParagraphBone>
        ) : (
          <p style={{ ...consentStyle, flex: '1 0 0', minWidth: 0 }}>{CONSENT}</p>
        )}
      </div>
    </div>
  )
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

function withWipe(update) {
  const reduced = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (typeof document === 'undefined' || typeof document.startViewTransition !== 'function' || reduced) {
    update()
    return
  }
  document.startViewTransition(() => flushSync(update))
}

function SkeletonLoaderDemo() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!loading) return
    const timer = setTimeout(() => withWipe(() => setLoading(false)), SKELETON_HOLD)
    return () => clearTimeout(timer)
  }, [loading])

  return (
    <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <div style={{
        width: 360, flexShrink: 0,
        border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      }}>
        <PaymentReviewCard loading={loading} />
      </div>

      <div style={{ flex: 1, minWidth: 240, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Button type="secondary" size="sm" label="Replay" onClick={() => setLoading(true)} />
        <p style={{ margin: 0, fontSize: 13, color: 'var(--text-subtle)', lineHeight: 1.6, fontFamily: 'var(--font-family)' }}>
          The card is <code>card/payment-review</code>, Figma node <code>6569:445</code>.
          Every element gets a placeholder, the checkbox and the consent copy
          included. The consent bones are measured off the real line boxes at
          runtime, so they follow wherever the text actually wraps.
        </p>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--text-subtle)', lineHeight: 1.6, fontFamily: 'var(--font-family)' }}>
          Timings are fixed. There is nothing to tune here on purpose, so the same
          numbers ship everywhere the pattern is used.
        </p>
      </div>
    </div>
  )
}

// ─── Layout helpers (same pattern as the component docs pages) ────────────────

function DocSection({ id, title, children }) {
  return (
    <section id={id} style={{ marginBottom: 56 }}>
      <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 20, fontWeight: 700, color: 'var(--text-base)', margin: '0 0 20px' }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

function DocCard({ children, style }) {
  return (
    <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 8, overflow: 'hidden', ...style }}>
      {children}
    </div>
  )
}

function CardHeader({ label }) {
  return (
    <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)' }}>
      <span style={{ fontFamily: 'var(--font-family)', fontSize: 12, fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
        {label}
      </span>
    </div>
  )
}

function CardBody({ children, style }) {
  return <div style={{ padding: '28px 32px', backgroundColor: '#fff', ...style }}>{children}</div>
}

const P = ({ children }) => (
  <p style={{ margin: '0 0 20px', fontSize: 14, color: 'var(--text-subtle)', lineHeight: 1.6, fontFamily: 'var(--font-family)' }}>
    {children}
  </p>
)

function CodeBlock({ code }) {
  return (
    <pre style={{
      margin: 0, padding: '18px 20px', overflowX: 'auto',
      backgroundColor: 'var(--bg-subtle)', fontFamily: 'monospace',
      fontSize: 12.5, lineHeight: 1.65, color: 'var(--text-base)',
    }}>
      <code>{code}</code>
    </pre>
  )
}

function SpecTable({ cols, rows }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 620 }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--bg-subtle)' }}>
            {cols.map(h => (
              <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-family)', color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid var(--border-subtle)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i, arr) => (
            <tr key={row[0]} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
              {row.map((cell, j) => (
                <td key={j} style={{
                  padding: '8px 14px', verticalAlign: 'top',
                  fontFamily: j < 2 ? 'monospace' : 'var(--font-family)',
                  fontSize: j === 0 ? 12.5 : j === 1 ? 12 : 13,
                  fontWeight: j === 0 ? 600 : 400,
                  whiteSpace: j === 0 ? 'nowrap' : 'normal',
                  color: j === 0 ? 'var(--text-base)' : j === 1 ? 'var(--text-base)' : 'var(--text-subtle)',
                }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const SPEC_ROWS = [
  ['Bone colour',     'neutral 200',   'var(--bg-sunken), #E0E0E0. The resting colour of every placeholder.'],
  ['Highlight',       'neutral 100',   'var(--bg-subtle), #F5F5F5. The peak of the band as it passes.'],
  ['Amplitude',       '+21 luminance', 'The bone glows, it does not flash.'],
  ['Band',            '90deg, transparent → neutral 100 → transparent', 'One bone-width wide, with a linear ramp either side. No hard edge.'],
  ['Band travel',     'translateX(-100%) → translateX(300%)', 'The peak enters at -0.5w and leaves at 3.5w.'],
  ['Cycle',           '1000ms',        'One full pass, start to start.'],
  ['Easing',          'linear',        'Constant velocity. No acceleration into or out of the pass.'],
  ['Repeat',          'infinite, restart', 'Restart, never alternate. A band that bounces back reads as scrubbing.'],
  ['Duty cycle',      '25% passing, 75% at rest', 'The peak crosses a bone in 250ms, then the bone sits near flat for the remaining 750ms.'],
  ['Scaling',         'per bone, in percentages', 'Every bone completes its pass in the same 1000ms regardless of width.'],
  ['Mechanism',       'transform on ::after', 'Compositor-only. Never animate background-position.'],
  ['Bone height',     '0.75 × font-size', 'Glyph height, not line height. The bone still occupies the full line box.'],
  ['Bone radius',     'var(--radius-full)', 'Pill on text. Placeholders for shaped elements take that element’s own radius.'],
  ['Coverage',        'every element',  'Text, images, controls. Nothing in a loading region is left in its resolved state.'],
  ['Skeleton hold',   '3000ms',        'Demo only. Three exact cycles, so the reveal lands on a seam rather than mid-pass.'],
  ['Reveal',          'mask wipe, left to right', 'The skeleton is wiped off the top of the real content. No cross-fade, no movement.'],
  ['Reveal duration', '400ms',         'Slightly longer than the 320ms screen push, because a soft-edged mask starts and ends gentler than a hard edge.'],
  ['Reveal easing',   'cubic-bezier(0.4, 0, 0.2, 1)', 'The same curve as the StepForwardBack screen transition.'],
  ['Reduced motion',  'band hidden, bone static', 'The placeholder still shows, it just does not move.'],
  ['Accessibility',   'aria-hidden on every bone', 'Placeholders carry no content to announce. A separate live region should say "Loading".'],
]

const BEHAVIOUR_ROWS = [
  ['Everything gets a placeholder',
   'Text, figures, images, checkboxes, buttons. If an element sits inside a region that is waiting on data, it gets a bone. Leaving one element resolved while its neighbours load reads as a rendering fault rather than a loading state.'],
  ['Bones are measured, not guessed',
   'A bone takes its width from the real content it stands in for, by rendering that content hidden and sizing to it. Placeholder widths are never percentages picked by eye. A wrapping paragraph is measured per line box at runtime, so the bones follow the actual wrap.'],
  ['Nothing moves on reveal',
   'Because every bone already occupies the exact box its content will occupy, the layout at the moment of reveal is identical to the layout before it. That is what lets the wipe read as a reveal rather than a swap.'],
  ['One coordinated pass, not many',
   'The band is sized as a percentage of each bone, so a 150px label and a 60px figure finish together. Sizing in pixels instead would give every bone its own rhythm and the card would look like it was loading in fragments.'],
  ['A long rest between passes',
   'The band is on a given bone for only a quarter of the cycle. A continuous conveyor never stops moving and reads as busy. The three quarters of rest is what makes the loader calm enough to sit under real content.'],
  ['The chrome stays put',
   'Card backgrounds, borders, radii and padding are not placeholders. They are identical in both states, so the wipe passes over them invisibly and the shape of the screen is stable from first paint.'],
  ['Fixed values, everywhere',
   'None of this is configurable per screen. The value of the spec is that there is exactly one of it.'],
]

const CODE_SHIMMER = `.ds-shimmer {
  position: relative;
  overflow: hidden;
  background: var(--bg-sunken);            /* neutral 200 */
}

/* A soft band exactly one bone-width wide, peaking at neutral 100.
   Sized in percentages, so every bone finishes its pass together. */
.ds-shimmer::after {
  content: '';
  position: absolute;
  top: 0; bottom: 0; left: 0;
  width: 100%;
  background: linear-gradient(
    90deg,
    transparent       0%,
    var(--bg-subtle) 50%,                  /* neutral 100 */
    transparent     100%
  );
  transform: translateX(-100%);
  animation: ds-shimmer-sweep 1000ms linear infinite;
  will-change: transform;                  /* compositor-only, no repaint */
}

/* Peak enters at -0.5w and leaves at 3.5w, so it crosses the bone in a
   quarter of the cycle and rests for the other three quarters. */
@keyframes ds-shimmer-sweep {
  from { transform: translateX(-100%); }
  to   { transform: translateX(300%); }
}`

const CODE_WIPE = `@property --ds-wipe {
  syntax: '<percentage>';
  inherits: true;
  initial-value: -100%;
}

@keyframes ds-skeleton-wipe {
  from { --ds-wipe:  100%; }
  to   { --ds-wipe: -100%; }
}

::view-transition-old(ds-payment-review) {
  z-index: 2;               /* wipe the skeleton off the top of the real card */
  animation: ds-skeleton-wipe 400ms cubic-bezier(0.4, 0, 0.2, 1) both;
  mask-image: linear-gradient(
    to right,
    black var(--ds-wipe),
    transparent calc(var(--ds-wipe) + 100%)
  );
}`

const CODE_SIZER = `// The bone takes its width from the string it replaces, never a percentage.
// The hidden copy holds the line box open, so nothing moves on reveal.

function TextBone({ children, fontSize = 16 }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{ visibility: 'hidden' }}>{children}</span>
      <span
        className="ds-shimmer"
        style={{
          position: 'absolute', left: 0, right: 0, top: '50%',
          transform: 'translateY(-50%)',
          height: Math.round(fontSize * 0.75),
          borderRadius: 'var(--radius-full)',
        }}
      />
    </span>
  )
}

<TextBone fontSize={16}>{'₱5,428.00'}</TextBone>`

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Motion() {
  const { setSections } = useToc()
  useEffect(() => { setSections(SECTIONS); return () => setSections([]) }, [])

  return (
    <div style={{ fontFamily: 'var(--font-family)' }}>
      <style>{MOTION_CSS}</style>

      <h1 style={{ margin: '0 0 8px', fontSize: 32, fontWeight: 700, color: 'var(--text-base)', lineHeight: 1.2 }}>Motion</h1>
      <p style={{ margin: '0 0 40px', fontSize: 15, color: 'var(--text-subtle)', lineHeight: 1.5 }}>
        Loading states, transitions, and the timing values behind them.
      </p>
      <div style={{ borderTop: '1px solid var(--border-subtle)', marginBottom: 40 }} />

      <DocSection id="demo" title="Skeleton loader">
        <P>
          The loading state for any screen waiting on data. Shown here on{' '}
          <code>card/payment-review</code>, the installment review screen, which
          is a good test for it because it mixes a photo, a merchant name, six
          label and figure pairs of very different widths, a checkbox and a
          wrapping paragraph. Every one of them gets a placeholder.
        </P>
        <DocCard>
          <CardHeader label="Live demo" />
          <CardBody><SkeletonLoaderDemo /></CardBody>
        </DocCard>
      </DocSection>

      <DocSection id="spec" title="Specification">
        <P>
          The complete set of values applied to the skeleton loader. Fixed, and
          not configurable per screen.
        </P>
        <DocCard>
          <SpecTable cols={['Property', 'Value', 'Notes']} rows={SPEC_ROWS} />
        </DocCard>
      </DocSection>

      <DocSection id="behaviour" title="Behaviour">
        <P>
          The rules the values above are there to serve. These matter more than
          any single number, because they are what a screen has to get right for
          the loader to read as one state rather than a half-drawn page.
        </P>
        <DocCard>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
              <tbody>
                {BEHAVIOUR_ROWS.map((row, i, arr) => (
                  <tr key={row[0]} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                    <td style={{ padding: '12px 14px', verticalAlign: 'top', width: 220, fontFamily: 'var(--font-family)', fontSize: 13, fontWeight: 600, color: 'var(--text-base)' }}>{row[0]}</td>
                    <td style={{ padding: '12px 14px', verticalAlign: 'top', fontFamily: 'var(--font-family)', fontSize: 13, lineHeight: 1.6, color: 'var(--text-subtle)' }}>{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DocCard>
      </DocSection>

      <DocSection id="mechanics" title="Mechanics">
        <P>
          The shimmer is one gradient twice as wide as the element it fills, slid
          across it. There is no overlay and no pseudo-element, so it composites
          cleanly at any corner radius.
        </P>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <DocCard>
            <CardHeader label="Shimmer" />
            <CodeBlock code={CODE_SHIMMER} />
          </DocCard>
          <DocCard>
            <CardHeader label="Reveal" />
            <CodeBlock code={CODE_WIPE} />
          </DocCard>
          <DocCard>
            <CardHeader label="Sizing a bone off the real string" />
            <CodeBlock code={CODE_SIZER} />
          </DocCard>
        </div>
        <div style={{ height: 20 }} />
        <P>
          The third block is the part worth keeping. Each placeholder renders the
          real string inside itself at <code>visibility: hidden</code> and takes
          its width from it, so the bone for <code>&#8369;5,428.00</code> is
          exactly as wide as that figure will be. A wrapping paragraph is handled
          the same way, measured per line box, so the bones follow the real wrap
          and the last one is short because the last line is short. Change the
          type scale and every placeholder follows on its own.
        </P>
      </DocSection>

    </div>
  )
}
