/**
 * Motion — Billease Design System portal
 *
 * Skeleton shimmer + wipe reveal, demonstrated on the real
 * card/payment-review component (Figma qESeTFW1GEEosrYnm4Hu3b, node 6569:445).
 *
 * Technique is from the Motion for React "Skeleton Shimmer" example
 * (https://motion.dev/examples/react-skeleton-shimmer), read from that example's
 * own source bundle. Motion's timing values are NOT used — see TIMING below.
 *
 * The reveal uses the native View Transitions API. The original depends on
 * AnimateView from motion-plus, which is paid, and the effect does not need it.
 *
 * Colours are neutrals only, from Desktop/variables2.json:
 *   neutral 100 #F5F5F5  neutral 200 #E0E0E0  neutral 500 #919191
 *   neutral 700 #545454  neutral 900 #1A1A1A  white
 * All are already bound in src/index.css, so this file references the tokens.
 */

import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { useToc } from '../context/TocContext'
import Button from '../components/ds/Button'
import merchantLogo from '../assets/merchants/pancake-house.png'

const SECTIONS = [
  { id: 'demo',      label: 'Skeleton loader' },
  { id: 'spec',      label: 'Specification'   },
  { id: 'rationale', label: 'Why these values'},
  { id: 'mechanics', label: 'Mechanics'       },
]

/* ───────────────────────────────────────────────────────────────────────────
   TIMING — fixed. Not configurable at runtime, by design.

   Neither variables2.json nor the Motion design file carries duration or easing
   tokens, and the "General Skeleton Behaviour" frame (P4kziTuTniQFQen8RQUIuy,
   567:25575) has no keyframe data on it. These values are a decision, not an
   extraction, and the reasoning for each is in the "Why these values" section.
   ─────────────────────────────────────────────────────────────────────────── */

const SHIMMER_CYCLE  = 1500   // ms, one full sweep
const SHIMMER_EASING = 'linear'
const SKELETON_HOLD  = 3000   // ms, exactly two cycles, so the reveal lands on a seam
const WIPE_DURATION  = 400    // ms
const WIPE_EASING    = 'cubic-bezier(0.4, 0, 0.2, 1)'  // Billease transition easing

const VIEW_NAME = 'ds-payment-review'

const MOTION_CSS = `
  @property --ds-wipe {
    syntax: '<percentage>';
    inherits: true;
    initial-value: -100%;
  }

  @keyframes ds-shimmer-sweep {
    from { transform: translateX(-100%); }
    to   { transform: translateX(100%); }
  }

  @keyframes ds-skeleton-wipe {
    from { --ds-wipe:  100%; }
    to   { --ds-wipe: -100%; }
  }

  /* neutral 200 bone, swept by a narrow feathered band of neutral 500.
     The sweep only ever darkens the bone, so it cannot wash out against white
     or dissolve into the neutral 100 merchant card. */
  .ds-shimmer {
    position: relative;
    overflow: hidden;
    background: var(--bg-sunken);
  }
  .ds-shimmer::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      transparent 35%,
      var(--bg-strong) 50%,
      transparent 65%,
      transparent 100%
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

      {/* checkbox-paragraph — static copy, never fetched, so never skeletoned */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-200)', width: '100%' }}>
        <div style={{
          width: 24, height: 24, flexShrink: 0, boxSizing: 'border-box',
          border: '2px solid var(--border-bold)', borderRadius: 'var(--radius-md)',
        }} />
        <p style={{ margin: 0, flex: '1 0 0', minWidth: 0, fontSize: 14, lineHeight: 1.5, color: 'var(--text-base)' }}>
          I have read and agree to the{' '}
          <span style={{ fontWeight: 600, textDecoration: 'underline' }}>Disclosure statement</span>
          {'  '}and{' '}
          <span style={{ fontWeight: 600, textDecoration: 'underline' }}>Promissory note.</span>
        </p>
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
          The merchant and the six figures are fetched, so they get placeholders.
          The consent row is static copy that is never fetched, so it never gets one.
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
  ['Shimmer cycle',   '1500ms',                          'One full pass of the band across a placeholder.'],
  ['Shimmer easing',  'linear',                          'Constant speed, so the rhythm reads the same on a wide label and a narrow figure.'],
  ['Shimmer repeat',  'infinite, restart',               'Restart, never alternate. A band that bounces back reads as scrubbing, not loading.'],
  ['Mechanism',       'transform: translateX() on ::after', 'Compositor-only. Animating background-position repaints every frame, which this card would do fourteen times over.'],
  ['Band',            '90deg, transparent 0/35%, n500 50%, transparent 65/100%', 'A narrow feathered band, roughly 30% of the width. A hard edge reads as a glitch, a soft one as light.'],
  ['Travel',          'translateX(-100%) → translateX(100%)', 'The band enters from the left and exits right, in the direction of reading.'],
  ['Bone colour',     'neutral 200 #E0E0E0',             'Same value the General Skeleton Behaviour frame draws bones at.'],
  ['Highlight',       'neutral 500 #919191',             'The sweep only ever darkens. A bone can never wash out against white or dissolve into the neutral 100 merchant card.'],
  ['Bone height',     '0.75 x font-size',                'Glyph height, not line height. The bone still occupies the full line box.'],
  ['Bone radius',     'var(--radius-full)',              'Pill, matching the placeholder lines in the Figma behaviour frame.'],
  ['Skeleton hold',   '3000ms',                          'Exactly two cycles, so the reveal lands on a seam rather than mid-sweep.'],
  ['Reveal',          'mask wipe, left to right',        'The skeleton is wiped off the top of the real card. No cross-fade, no movement.'],
  ['Reveal duration', '400ms',                           'Slightly longer than the 320ms screen push, because a soft-edged mask starts and ends gentler than a hard screen edge.'],
  ['Reveal easing',   'cubic-bezier(0.4, 0, 0.2, 1)',    'The same curve as the StepForwardBack screen transition.'],
  ['Reduced motion',  'band hidden, bone static',        'The placeholder still shows, it just does not move.'],
]

const RATIONALE_ROWS = [
  ['1500ms cycle',
   'Material, Ant Design and Vuetify all land between 1.4s and 1.6s.',
   'Vuetify’s 1500ms default is confirmed in its own source. Three independent systems converging on the same window is better evidence than any single reference implementation, and 1500ms doubles cleanly into the 3000ms hold.'],
  ['linear, not ease-in-out',
   'The Motion example uses easeInOut.',
   'Easing parks the band off-element at both ends, creating a rest beat. That beat is a fixed share of the cycle but a variable share of each bone’s width, so on a card mixing a 150px label with a 60px figure the narrow bones visibly pulse out of step. Linear keeps the rhythm identical at every width.'],
  ['translateX, not background-position',
   'The Motion example animates background-position.',
   'Transform is compositor-only. Background-position triggers a repaint on every frame, and this card animates fourteen placeholders at once. Same visual result, without the paint cost.'],
  ['Darker highlight',
   'An earlier pass swept toward neutral 100.',
   'Sweeping lighter thinned the bones toward white at the peak of each pass, so they visibly faded rather than shimmered, and on the neutral 100 merchant card the highlight matched the container exactly. Sweeping toward neutral 500 means the bone only ever gains contrast, so it holds its shape against every surface this card uses.'],
  ['Narrow feathered band',
   'A three-stop gradient brightens the whole bone at once.',
   'Stops at 0/35/50/65/100 confine the peak to roughly 30% of the width and feather both edges. The result reads as light travelling across the surface rather than the whole element pulsing.'],
  ['90 degrees, not diagonal',
   'The shipped Skeleton component uses 65.69deg, from Figma.',
   'A diagonal’s apparent steepness changes with each element’s aspect ratio, so the same class looks different on a 40px circle and a 300px line. This card has both.'],
  ['3000ms hold',
   'The Motion example holds for 2500ms.',
   'Two exact cycles. An arbitrary hold cuts the band in half mid-travel, which is visible. Landing the reveal on a seam means the band has just left the element when the wipe starts.'],
  ['400ms wipe',
   'The Motion example wipes over 600ms.',
   '600ms is tuned to a full-viewport hero. Against the 320ms screen push already in this system, 600ms for a single card would make the smaller gesture the slowest thing on screen.'],
  ['No runtime controls',
   'The reference example ships sliders.',
   'Sliders suit a gallery whose product is the parameter space. They are wrong for a design system, where the value of the spec is that there is exactly one of it.'],
]

const CODE_SHIMMER = `.ds-shimmer {
  position: relative;
  overflow: hidden;
  background: var(--bg-sunken);          /* neutral 200 */
}

/* A narrow, feathered band that only ever darkens the bone. */
.ds-shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent      0%,
    transparent     35%,
    var(--bg-strong) 50%,                /* neutral 500 */
    transparent     65%,
    transparent    100%
  );
  transform: translateX(-100%);
  animation: ds-shimmer-sweep 1500ms linear infinite;
  will-change: transform;                /* compositor-only, no repaint */
}

@keyframes ds-shimmer-sweep {
  from { transform: translateX(-100%); }
  to   { transform: translateX(100%); }
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

const CODE_SIZER = `// The bone is measured by the string it replaces, never by a percentage.
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
          Shown on <code>card/payment-review</code>, the installment review screen.
          It is a good test for the pattern because it mixes a photo, a merchant
          name, and six label and figure pairs of very different widths, and
          because every one of those values arrives from the server at once.
        </P>
        <DocCard>
          <CardHeader label="Live demo" />
          <CardBody><SkeletonLoaderDemo /></CardBody>
        </DocCard>
      </DocSection>

      <DocSection id="spec" title="Specification">
        <P>
          Fixed values. Nothing here is configurable per screen.
        </P>
        <DocCard>
          <SpecTable cols={['Property', 'Value', 'Notes']} rows={SPEC_ROWS} />
        </DocCard>
      </DocSection>

      <DocSection id="rationale" title="Why these values">
        <P>
          Neither <code>variables2.json</code> nor the Motion design file carries
          duration or easing tokens, and the General Skeleton Behaviour frame has
          no keyframe data on it. So these numbers are a decision rather than an
          extraction, and each one is worth being able to defend.
        </P>
        <DocCard>
          <SpecTable cols={['Decision', 'Reference point', 'Reasoning']} rows={RATIONALE_ROWS} />
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
          exactly as wide as that figure will be. Change the type scale and the
          placeholders follow on their own. Nothing moves at the moment of reveal,
          which is what lets the wipe read as a reveal rather than a swap.
        </P>
      </DocSection>

    </div>
  )
}
