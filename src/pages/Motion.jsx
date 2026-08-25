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
  { id: 'measured',  label: 'Measured source'  },
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

const SHIMMER_CYCLE  = 1000   // ms, one full sweep (measured off LinkedIn)
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

  /* Measured off the LinkedIn feed skeleton (see the Measurement section).
     Bone sits at neutral 200. A soft band exactly one bone-width wide passes
     over it, peaking at neutral 100. The band is sized in percentages, so a
     narrow bone and a wide one complete their pass in the same 1000ms. */
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
  ['Shimmer cycle',   '1000ms',                          'One full pass. Measured at 4830px/s across a 1120px bone on a 3x screen.'],
  ['Shimmer easing',  'linear',                          'Constant velocity. The measured peak moved at a steady rate across the whole pass.'],
  ['Shimmer repeat',  'infinite, restart',               'Restart, never alternate.'],
  ['Duty cycle',      '~25% sweeping, ~75% at rest',     'The peak crosses a bone in roughly 250ms, then the bone sits near flat for the rest of the second.'],
  ['Mechanism',       'transform: translateX() on ::after', 'Compositor-only. Percentage-based, so a narrow bone and a wide one finish together.'],
  ['Band',            '90deg, transparent → n100 → transparent', 'Exactly one bone-width wide with a linear ramp either side. Measured half-ramp was 554px on a 1120px bone.'],
  ['Travel',          'translateX(-100%) → translateX(300%)', 'Peak enters at -0.5w and leaves at 3.5w, giving the 25% duty above.'],
  ['Bone colour',     'neutral 200 #E0E0E0',             'LinkedIn measures #E3E3E3. Neutral 200 is the closest value in this ramp.'],
  ['Highlight',       'neutral 100 #F5F5F5',             'LinkedIn peaks at #F2F2F2. Neutral 100 is the closest value in this ramp.'],
  ['Amplitude',       '+21 luminance at peak',           'LinkedIn measures +15. Deliberately gentle. The bone glows, it does not flash.'],
  ['Bone height',     '0.75 x font-size',                'Glyph height, not line height. The bone still occupies the full line box.'],
  ['Bone radius',     'var(--radius-full)',              'Pill, matching both LinkedIn and the Figma behaviour frame.'],
  ['Skeleton hold',   '3000ms',                          'Three exact cycles, so the reveal lands on a seam rather than mid-pass.'],
  ['Reveal',          'mask wipe, left to right',        'The skeleton is wiped off the top of the real card. No cross-fade, no movement.'],
  ['Reveal duration', '400ms',                           'Slightly longer than the 320ms screen push, because a soft-edged mask starts and ends gentler than a hard screen edge.'],
  ['Reveal easing',   'cubic-bezier(0.4, 0, 0.2, 1)',    'The same curve as the StepForwardBack screen transition.'],
  ['Reduced motion',  'band hidden, bone static',        'The placeholder still shows, it just does not move.'],
]

const MEASURED_ROWS = [
  ['Capture',        '2.92s at 60fps, 1206 x 2622',      'iPhone screen recording of the LinkedIn feed cold-starting. The skeleton is on screen from about 1.19s to 1.82s.'],
  ['Bone luminance', '227 of 255  (#E3E3E3)',            'Flat and identical across every bone between passes.'],
  ['Peak luminance', '242 of 255  (#F2F2F2)',            'The brightest value reached anywhere on a bone during a pass.'],
  ['Direction',      'left to right',                    'Peak x increases with time on every sampled row.'],
  ['Peak velocity',  '4830 px/s',                        'Peak tracked from x=281 at 1.240s to x=1150 at 1.420s on a 1120px bone.'],
  ['Crossing time',  '~250ms',                           'Derived from the velocity above. Only one pass occurs in the 630ms the skeleton is visible, which is what puts the cycle near 1000ms.'],
  ['Band width',     '~1x the bone width',               'At 1.300s the ramp ran from base at x=136 to peak at x=690, a 554px half-ramp on a 1120px bone.'],
  ['Scaling',        'per bone, in percentages',         'At the same instant a 1120px bone peaked at 58% of its own width and a 790px bone peaked at 61% of its own width. One global wave would have put both peaks at the same x.'],
]

const RATIONALE_ROWS = [
  ['Copied, not invented',
   'LinkedIn’s feed skeleton.',
   'The shimmer values are measured off a screen recording rather than reasoned from first principles. Where LinkedIn’s exact greys fall between steps of this ramp, the nearest neutral is used: #E3E3E3 becomes neutral 200 and #F2F2F2 becomes neutral 100.'],
  ['Light, not dark',
   'An earlier pass swept toward neutral 500.',
   'The measurement settles it. LinkedIn sweeps from 227 up to 242, so the bone brightens. A darker sweep is a different effect, not a variant of this one.'],
  ['Gentle amplitude',
   'LinkedIn moves 15 luminance steps.',
   'Neutral 200 to neutral 100 is 21 steps, slightly stronger, because those are the two ramp values either side of the measured pair. Still well short of anything that reads as a flash.'],
  ['A long rest between passes',
   'The peak is on a bone for about a quarter of the cycle.',
   'This is the part most implementations miss. A continuous conveyor never stops moving and reads as busy. LinkedIn passes once, then leaves the bone almost flat for three quarters of a second, which is what makes it calm enough to sit under real content.'],
  ['Percentage-scaled per bone',
   'Verified by comparing two bones of different widths.',
   'Because the band is sized as a percentage of each bone, every bone finishes its pass at the same moment regardless of width. On this card, which mixes a 150px label with a 60px figure, that is the difference between one coordinated pass and fourteen independent ones.'],
  ['linear',
   'The measured peak held a constant 4830px/s.',
   'No acceleration into or out of the pass. Anything eased would have shown as a changing velocity across the sampled frames.'],
  ['translateX, not background-position',
   'The Motion example animates background-position.',
   'Transform is compositor-only. Background-position repaints every frame, and this card animates fourteen placeholders at once. Same visual result, without the paint cost.'],
  ['3000ms hold',
   'LinkedIn’s own feed loaded in about 630ms.',
   'Under one full cycle, so on a real load you often see a single pass. The demo holds for three so the rhythm is legible, and three exact cycles put the reveal on a seam rather than mid-pass.'],
  ['400ms wipe',
   'Not from LinkedIn. Its content simply cuts in.',
   'The wipe is this system’s own addition, reusing the 320ms StepForwardBack easing. 400ms rather than 320ms because a soft-edged mask starts and ends gentler than a hard screen edge.'],
  ['No runtime controls',
   'The Motion reference ships sliders.',
   'Sliders suit a gallery whose product is the parameter space. They are wrong for a design system, where the value of the spec is that there is exactly one of it.'],
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
          The shimmer is a replication of LinkedIn&apos;s feed skeleton, measured
          frame by frame off a screen recording rather than guessed. It is shown
          here on <code>card/payment-review</code>, the installment review screen,
          which is a good test for the pattern because it mixes a photo, a
          merchant name, and six label and figure pairs of very different widths,
          and because every one of those values arrives from the server at once.
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

      <DocSection id="measured" title="Measured source">
        <P>
          Everything in the shimmer row of the table above comes from sampling
          pixel luminance across frames of a LinkedIn cold start, not from its
          published CSS. The two rows worth reading are the last two.
        </P>
        <DocCard>
          <SpecTable cols={['Reading', 'Value', 'How']} rows={MEASURED_ROWS} />
        </DocCard>
        <div style={{ height: 20 }} />
        <P>
          The duty cycle is the part that is easy to miss by eye. The band is
          only on a given bone for about a quarter of the second. Most
          reimplementations of this pattern run a band across the element
          continuously, which looks busy next to the original.
        </P>
        <P>
          The scaling test is the other one. At a single instant, a 1120px bone
          and a 790px bone had their bright peaks at 58% and 61% of their own
          widths. If one gradient were sweeping across the whole screen, both
          peaks would have sat at the same x. They did not, so each bone carries
          its own band, sized to itself.
        </P>
      </DocSection>

      <DocSection id="rationale" title="Why these values">
        <P>
          Neither <code>variables2.json</code> nor the Motion design file carries
          duration or easing tokens, and the General Skeleton Behaviour frame has
          no keyframe data on it. The shimmer values below are therefore taken
          from the measurement above. The reveal is this system&apos;s own, since
          LinkedIn has no equivalent, and is reasoned rather than measured.
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
