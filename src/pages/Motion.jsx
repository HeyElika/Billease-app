/**
 * Motion — Billease Design System portal
 *
 * Skeleton loader: the loading state for a region waiting on data.
 * Demonstrated on card/payment-review (Figma qESeTFW1GEEosrYnm4Hu3b, 6569:445).
 *
 * This is one pattern within the motion system, not the motion system itself.
 *
 * Colours are neutrals only, from variables2.json, already bound in index.css.
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useToc } from '../context/TocContext'
import Button from '../components/ds/Button'
import Alert from '../components/ds/Alert'
import BilleaseIcon from '../assets/icons/BilleaseIcon'
import merchantLogo from '../assets/merchants/pancake-house.png'

const SECTIONS = [
  { id: 'skeleton-loader', label: 'Skeleton loader'      },
  { id: 'demo',            label: 'Demo'                 },
  { id: 'usage',           label: 'Usage'                },
  { id: 'behaviour',       label: 'Behaviour'            },
  { id: 'specification',   label: 'Specification'        },
  { id: 'states',          label: 'States'               },
  { id: 'accessibility',   label: 'Accessibility'        },
  { id: 'engineering',     label: 'Engineering reference'},
]

const SHIMMER_CYCLE = 1000   // ms, one full pass of the band
const SKELETON_HOLD = 3000   // ms, demo only

const MOTION_CSS = `
  @keyframes ds-shimmer-sweep {
    from { transform: translateX(-100%); }
    to   { transform: translateX(300%); }
  }

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
    animation: ds-shimmer-sweep ${SHIMMER_CYCLE}ms linear infinite;
    will-change: transform;
  }

  .ds-shimmer--static::after { animation: none; opacity: 0; }

  @media (prefers-reduced-motion: reduce) {
    .ds-shimmer::after { animation: none; opacity: 0; }
  }
`

// ─── Shimmer primitives ───────────────────────────────────────────────────────

const boneClass = (staticOnly) => `ds-shimmer${staticOnly ? ' ds-shimmer--static' : ''}`

/** TextBone — holds the line box of the string it replaces, drawn at glyph height. */
function TextBone({ children, fontSize = 16, staticOnly = false }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', verticalAlign: 'top' }}>
      <span style={{ visibility: 'hidden' }}>{children}</span>
      <span
        className={boneClass(staticOnly)}
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

/** Bone — for a node with no intrinsic content to measure. */
function Bone({ size, radius, staticOnly = false }) {
  return (
    <div
      className={boneClass(staticOnly)}
      aria-hidden="true"
      style={{ width: size, height: size, borderRadius: radius, flexShrink: 0 }}
    />
  )
}

/**
 * ParagraphBone — one bone per rendered line of a wrapping paragraph.
 *
 * Only text nodes are ranged over, since ranging over an element would also
 * return its block rect, which spans every line at once. Fragments are grouped
 * into lines by the proximity of their vertical centres, which absorbs the
 * sub-pixel difference between bold and regular runs on the same line.
 */
function ParagraphBone({ fontSize = 14, staticOnly = false, children }) {
  const ref = useRef(null)
  const [rows, setRows] = useState([])

  useLayoutEffect(() => {
    let cancelled = false

    const measure = () => {
      const el = ref.current
      if (!el || cancelled) return
      const base = el.getBoundingClientRect()
      if (base.width === 0) return

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

      const typeEl = el.firstElementChild || el
      const lineHeight = parseFloat(getComputedStyle(typeEl).lineHeight) || fontSize * 1.5
      const count = Math.max(1, Math.round(base.height / lineHeight))
      setRows(Array.from({ length: count }, (_, i) => ({
        centre: (i + 0.5) * lineHeight, left: 0, width: base.width,
      })))
    }

    measure()
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
          className={boneClass(staticOnly)}
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
  width: 360, boxSizing: 'border-box', backgroundColor: 'var(--bg-base)',
  padding: 'var(--space-600) var(--space-500)',
  display: 'flex', flexDirection: 'column', gap: 'var(--space-600)',
  fontFamily: 'var(--ds-font-family)',
}
const merchantCard = {
  backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)',
  padding: 'var(--space-300)', display: 'flex', alignItems: 'center',
  gap: 'var(--space-300)', width: '100%', boxSizing: 'border-box',
}
const summaryCard = {
  backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-lg)', padding: 'var(--space-300)',
  display: 'flex', flexDirection: 'column', gap: 'var(--space-400)',
  width: '100%', boxSizing: 'border-box',
}
const rowStyle   = { display: 'flex', alignItems: 'center', gap: 'var(--space-200)', width: '100%' }
const labelStyle = { margin: 0, fontSize: 16, fontWeight: 400, lineHeight: 1.5, color: 'var(--text-subtle)', whiteSpace: 'nowrap', flexShrink: 0 }
const valueStyle = { margin: 0, fontSize: 16, fontWeight: 600, lineHeight: 1.5, color: 'var(--text-base)', flex: '1 0 0', minWidth: 0, textAlign: 'right' }
const nameStyle  = { margin: 0, fontSize: 16, fontWeight: 600, lineHeight: 1.5, color: 'var(--text-base)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
const consentStyle = { margin: 0, fontSize: 14, lineHeight: 1.5, color: 'var(--text-base)' }
const logoStyle = {
  width: 40, height: 40, borderRadius: 'var(--radius-full)',
  border: '1px solid var(--border-subtle)', overflow: 'hidden', flexShrink: 0,
  objectFit: 'cover', display: 'block',
}

const CONSENT = (
  <>
    I have read and agree to the{' '}
    <span style={{ fontWeight: 600, textDecoration: 'underline' }}>Disclosure statement</span>
    {'  '}and{' '}
    <span style={{ fontWeight: 600, textDecoration: 'underline' }}>Promissory note.</span>
  </>
)

function DetailRow({ row, loading, staticOnly }) {
  return (
    <div style={rowStyle}>
      {loading ? (
        <>
          <TextBone fontSize={16} staticOnly={staticOnly}><span style={labelStyle}>{row.label}</span></TextBone>
          <span style={valueStyle}>
            <TextBone fontSize={16} staticOnly={staticOnly}><span style={{ fontWeight: 600 }}>{row.value}</span></TextBone>
          </span>
        </>
      ) : (
        <>
          <p style={labelStyle}>{row.label}</p>
          <p style={valueStyle}>{row.value}</p>
        </>
      )}
    </div>
  )
}

/** One shell renders both states, so the chrome is identical across the change. */
function PaymentReviewCard({ loading, staticOnly = false }) {
  return (
    <div style={shell} data-node-id="6569:445">
      <div style={merchantCard}>
        {loading
          ? <Bone size={40} radius="var(--radius-full)" staticOnly={staticOnly} />
          : <img src={merchantLogo} alt="" style={logoStyle} />}
        <div style={{ flex: '1 0 0', minWidth: 0 }}>
          {loading
            ? <TextBone fontSize={16} staticOnly={staticOnly}><span style={nameStyle}>{MERCHANT}</span></TextBone>
            : <p style={nameStyle}>{MERCHANT}</p>}
        </div>
      </div>

      <div style={summaryCard}>
        {DETAIL_ROWS.map(row => (
          <DetailRow key={row.label} row={row} loading={loading} staticOnly={staticOnly} />
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-200)', width: '100%' }}>
        {loading
          ? <Bone size={24} radius="var(--radius-md)" staticOnly={staticOnly} />
          : <div style={{
              width: 24, height: 24, flexShrink: 0, boxSizing: 'border-box',
              border: '2px solid var(--border-bold)', borderRadius: 'var(--radius-md)',
            }} />}
        {loading ? (
          <ParagraphBone fontSize={14} staticOnly={staticOnly}>
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

function SkeletonLoaderDemo() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!loading) return
    const timer = setTimeout(() => setLoading(false), SKELETON_HOLD)
    return () => clearTimeout(timer)
  }, [loading])

  return (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <div style={{
        width: 360, flexShrink: 0,
        border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      }}>
        <PaymentReviewCard loading={loading} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Button type="secondary" size="sm" label="Replay" onClick={() => setLoading(true)} />
        <span style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: 'var(--text-subtle)' }}>
          {loading ? 'Loading' : 'Loaded'}
        </span>
      </div>
    </div>
  )
}

/** A three-row fragment, used to show the states side by side. */
function MiniCard({ loading, staticOnly = false }) {
  return (
    <div style={{ ...summaryCard, width: 208, fontFamily: 'var(--ds-font-family)', gap: 'var(--space-300)' }}>
      {DETAIL_ROWS.slice(0, 3).map(row => (
        <DetailRow key={row.label} row={{ ...row, label: row.label.split(' ')[0] }} loading={loading} staticOnly={staticOnly} />
      ))}
    </div>
  )
}

function Arrow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, padding: '0 4px' }}>
      <BilleaseIcon name="chevron-right" size="sm" color="var(--icon-subtle)" />
    </div>
  )
}

// ─── Layout helpers ───────────────────────────────────────────────────────────

function DocSection({ id, title, level = 3, children }) {
  const H = level === 2 ? 'h2' : 'h3'
  const size = level === 2 ? 24 : 17
  return (
    <section id={id} style={{ marginBottom: level === 2 ? 28 : 44 }}>
      <H style={{ fontFamily: 'var(--font-family)', fontSize: size, fontWeight: 700, color: 'var(--text-base)', margin: '0 0 12px' }}>
        {title}
      </H>
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
  return <div style={{ padding: '24px 28px', backgroundColor: '#fff', ...style }}>{children}</div>
}

const P = ({ children, style }) => (
  <p style={{ margin: '0 0 16px', fontSize: 14, color: 'var(--text-subtle)', lineHeight: 1.6, fontFamily: 'var(--font-family)', maxWidth: '72ch', ...style }}>
    {children}
  </p>
)

function RuleTable({ rows }) {
  return (
    <DocCard>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {rows.map((row, i, arr) => (
            <tr key={row[0]} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
              <td style={{ padding: '12px 16px', verticalAlign: 'top', width: 240, fontFamily: 'var(--font-family)', fontSize: 13, fontWeight: 600, color: 'var(--text-base)' }}>{row[0]}</td>
              <td style={{ padding: '12px 16px', verticalAlign: 'top', fontFamily: 'var(--font-family)', fontSize: 13, lineHeight: 1.6, color: 'var(--text-subtle)' }}>{row[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DocCard>
  )
}

function Swatch({ color }) {
  return (
    <span style={{
      display: 'inline-block', width: 12, height: 12, borderRadius: 3,
      backgroundColor: color, border: '1px solid var(--border-subtle)',
      verticalAlign: '-2px', marginRight: 8,
    }} />
  )
}

function UsageList({ label, items, tone }) {
  return (
    <DocCard style={{ flex: 1, minWidth: 260 }}>
      <CardHeader label={label} />
      <CardBody style={{ padding: '16px 20px' }}>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map(item => (
            <li key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontFamily: 'var(--font-family)', fontSize: 13, lineHeight: 1.5, color: 'var(--text-base)' }}>
              <BilleaseIcon name={tone === 'use' ? 'tick' : 'close-mini'} size="xs" color={tone === 'use' ? 'var(--icon-base)' : 'var(--icon-subtle)'} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardBody>
    </DocCard>
  )
}

function Note({ title, children }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 16px', border: '1px solid var(--border-subtle)', borderRadius: 8, backgroundColor: 'var(--bg-subtle)' }}>
      <div style={{ fontFamily: 'var(--font-family)', fontSize: 13, lineHeight: 1.6, color: 'var(--text-subtle)' }}>
        <strong style={{ color: 'var(--text-base)', fontWeight: 600 }}>{title}</strong>{' '}
        {children}
      </div>
    </div>
  )
}

function CodeBlock({ code }) {
  return (
    <pre style={{
      margin: 0, padding: '16px 20px', overflowX: 'auto',
      backgroundColor: 'var(--bg-subtle)', fontFamily: 'monospace',
      fontSize: 12.5, lineHeight: 1.65, color: 'var(--text-base)',
    }}>
      <code>{code}</code>
    </pre>
  )
}

// ─── Content ──────────────────────────────────────────────────────────────────

const USE_WHEN = [
  'The final content structure is known',
  'Data is still loading',
  'The wait is long enough to be perceptible',
  'Showing the expected layout helps orientation',
]

const AVOID_WHEN = [
  'The wait is extremely short',
  'The final structure is unknown',
  'The process has measurable progress',
  'Only a small independent action needs feedback',
]

const BEHAVIOUR_RULES = [
  ['Match the final layout',
   'Skeleton placeholders occupy the same space as the content they replace, so nothing shifts when content appears.'],
  ['Skeletonize only unresolved content',
   'Apply skeletons only to the region waiting on data. Keep independent available content usable.'],
  ['Keep related shimmer synchronized',
   'Placeholders within the same loading region should feel like one coordinated loading state.'],
  ['Keep structural chrome stable',
   'Container backgrounds, borders, radii, padding, and layout remain unchanged. Only unresolved content becomes skeleton.'],
  ['No layout movement on reveal',
   'Loaded content replaces the skeleton in the same space.'],
]

const SPEC_ROWS = [
  ['Base',              <><Swatch color="var(--bg-sunken)" /><code>bg/sunken</code> · Neutral 200</>],
  ['Highlight',         <><Swatch color="var(--bg-subtle)" /><code>bg/subtle</code> · Neutral 100</>],
  ['Animation',         'Shimmer'],
  ['Direction',         'Left to right'],
  ['Duration',          '1000ms'],
  ['Easing',            'Linear'],
  ['Repeat',            'Infinite while loading'],
  ['Text bone height',  '75% of font size'],
  ['Text bone radius',  'Full'],
  ['Reduced motion',    'Static skeleton'],
  ['Accessibility',     'Skeleton placeholders hidden from assistive technology, loading status announced separately'],
]

const ACCESSIBILITY_RULES = [
  ['Respect reduced motion',        'Under prefers-reduced-motion the skeleton is shown without the shimmer.'],
  ['Do not announce placeholders',  'Individual bones carry no content. Each is hidden from assistive technology.'],
  ['Announce the loading state',    'A single live region reports that the region is loading, and that it has finished.'],
  ['Motion is never required',      'Nothing about the screen can only be understood by seeing the shimmer move.'],
]

const CODE_SHIMMER = `.ds-shimmer {
  position: relative;
  overflow: hidden;
  background: var(--bg-sunken);            /* Neutral 200 */
}

/* A soft band one bone-width wide, peaking at Neutral 100. Sized in
   percentages, so every bone in a region finishes its pass together. */
.ds-shimmer::after {
  content: '';
  position: absolute;
  top: 0; bottom: 0; left: 0;
  width: 100%;
  background: linear-gradient(
    90deg,
    transparent       0%,
    var(--bg-subtle) 50%,                  /* Neutral 100 */
    transparent     100%
  );
  transform: translateX(-100%);
  animation: ds-shimmer-sweep 1000ms linear infinite;
  will-change: transform;                  /* compositor-only, no repaint */
}

@keyframes ds-shimmer-sweep {
  from { transform: translateX(-100%); }
  to   { transform: translateX(300%); }
}

@media (prefers-reduced-motion: reduce) {
  .ds-shimmer::after { animation: none; opacity: 0; }
}`

const CODE_SIZER = `// A bone takes its width from the content it replaces, never a percentage.
// The hidden copy holds the box open, so nothing moves on reveal.

function TextBone({ children, fontSize = 16 }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
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
}`

const ENG_NOTES = [
  ['Band geometry',
   'The gradient runs transparent to Neutral 100 to transparent across one bone-width, and translates from -100% to 300%. The peak therefore crosses a bone in a quarter of the cycle and the bone rests for the other three quarters.'],
  ['Percentage sizing',
   'Because the band is a percentage of each bone rather than a fixed pixel width, a 150px label and a 60px figure complete their pass at the same moment. Fixed widths would give every bone its own rhythm.'],
  ['Transform, not background-position',
   'Animating transform stays on the compositor. Animating background-position repaints every frame, which is costly on a card carrying more than a dozen bones.'],
  ['Wrapping paragraphs',
   'Bones for a multi-line paragraph are measured per line box at runtime, grouping text-node rects by vertical centre. Ranging over the element instead would also return its block rect, which spans every line at once.'],
]

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Motion() {
  const { setSections } = useToc()
  useEffect(() => { setSections(SECTIONS); return () => setSections([]) }, [])

  return (
    <div style={{ fontFamily: 'var(--font-family)' }}>
      <style>{MOTION_CSS}</style>

      <h1 style={{ margin: '0 0 8px', fontSize: 32, fontWeight: 700, color: 'var(--text-base)', lineHeight: 1.2 }}>Motion</h1>
      <p style={{ margin: '0 0 32px', fontSize: 15, color: 'var(--text-subtle)', lineHeight: 1.5, maxWidth: '72ch' }}>
        Motion patterns and their specifications. Skeleton loader is the first pattern documented here.
      </p>
      <div style={{ borderTop: '1px solid var(--border-subtle)', marginBottom: 32 }} />

      {/* ── Pattern ── */}
      <DocSection id="skeleton-loader" title="Skeleton loader" level={2}>
        <P style={{ marginBottom: 0, fontSize: 15, color: 'var(--text-base)' }}>
          Indicates that structured content is loading while preserving the layout
          users can expect when data arrives.
        </P>
      </DocSection>

      {/* ── Demo ── */}
      <DocSection id="demo" title="Demo">
        <DocCard>
          <CardHeader label="Loading to loaded" />
          <CardBody><SkeletonLoaderDemo /></CardBody>
        </DocCard>
      </DocSection>

      {/* ── Usage ── */}
      <DocSection id="usage" title="Usage">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <UsageList label="Use when" items={USE_WHEN} tone="use" />
          <UsageList label="Avoid when" items={AVOID_WHEN} tone="avoid" />
        </div>
      </DocSection>

      {/* ── Behaviour ── */}
      <DocSection id="behaviour" title="Behaviour">
        <RuleTable rows={BEHAVIOUR_RULES} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
          <Note title="Reveal.">
            Loaded content replaces the skeleton in place without layout movement.
            Avoid additional reveal motion unless it has been specifically validated.
          </Note>
          <Note title="Fast responses.">
            Avoid flashing skeletons for very fast responses. Use a consistent
            delay and minimum-display strategy so the loading state does not appear
            for only a few milliseconds. The threshold is not yet set.
          </Note>
          <Note title="Partial loading.">
            Independent regions may resolve separately, but placeholders within the
            same region should stay synchronized.
          </Note>
        </div>
      </DocSection>

      {/* ── Specification ── */}
      <DocSection id="specification" title="Specification">
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
      </DocSection>

      {/* ── States ── */}
      <DocSection id="states" title="States">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <DocCard>
            <CardHeader label="Loading to loaded" />
            <CardBody style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <MiniCard loading />
              <Arrow />
              <MiniCard loading={false} />
            </CardBody>
          </DocCard>
          <DocCard>
            <CardHeader label="Loading to error" />
            <CardBody style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <MiniCard loading />
              <Arrow />
              <div style={{ width: 320, fontFamily: 'var(--ds-font-family)' }}>
                <Alert type="critical" message="We could not load your payment details. Please try again." />
              </div>
            </CardBody>
          </DocCard>
          <DocCard>
            <CardHeader label="Reduced motion" />
            <CardBody style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <MiniCard loading staticOnly />
              <span style={{ fontFamily: 'var(--font-family)', fontSize: 13, color: 'var(--text-subtle)', lineHeight: 1.6, maxWidth: '38ch' }}>
                The skeleton still shows the expected layout. The shimmer does not run.
              </span>
            </CardBody>
          </DocCard>
        </div>
        <div style={{ marginTop: 12 }}>
          <Note title="Failed requests.">
            A skeleton must not continue indefinitely after a request has failed.
            Replace it with the appropriate error or retry state.
          </Note>
        </div>
      </DocSection>

      {/* ── Accessibility ── */}
      <DocSection id="accessibility" title="Accessibility">
        <RuleTable rows={ACCESSIBILITY_RULES} />
      </DocSection>

      {/* ── Engineering reference ── */}
      <DocSection id="engineering" title="Engineering reference">
        <details>
          <summary style={{
            cursor: 'pointer', listStyle: 'revert',
            fontFamily: 'var(--font-family)', fontSize: 13, color: 'var(--text-subtle)',
            padding: '10px 0',
          }}>
            Implementation details
          </summary>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            <RuleTable rows={ENG_NOTES} />
            <DocCard>
              <CardHeader label="Shimmer" />
              <CodeBlock code={CODE_SHIMMER} />
            </DocCard>
            <DocCard>
              <CardHeader label="Sizing a bone off the real content" />
              <CodeBlock code={CODE_SIZER} />
            </DocCard>
          </div>
        </details>
      </DocSection>

    </div>
  )
}
