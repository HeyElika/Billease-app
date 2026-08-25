/**
 * Motion — Billease Design System portal
 *
 * Skeleton shimmer + wipe reveal.
 * Replicated from the Motion for React example "Skeleton Shimmer"
 * (https://motion.dev/examples/react-skeleton-shimmer), read from the example's
 * own source bundle rather than the marketing page.
 *
 * What is carried over verbatim (the motion itself):
 *   - 3-stop horizontal gradient at 25% / 50% / 75% over a 200%-wide background
 *   - background-position swept -200% → 200%, 1.5s, ease-in-out, infinite loop
 *   - placeholders sized by wrapping the REAL node with visibility:hidden, so the
 *     skeleton is always the exact silhouette of the content that replaces it
 *   - reveal is a left-to-right mask wipe on the outgoing layer, 600ms ease-in-out
 *
 * What is adapted (per the design system compliance rules):
 *   - motion-plus/AnimateView is a paid package, so the reveal uses the native
 *     View Transitions API instead — same mask-wipe on the old layer, no new deps
 *   - the original's white-alpha-on-dark palette is swapped for existing tokens:
 *     --bg-sunken base, --bg-strong highlight (the same pair Skeleton.jsx ships)
 *   - the cover is a solid --bg-primary, not an invented two-colour gradient
 *   - Follow uses the DS Button, not a raw <button>
 */

import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { useToc } from '../context/TocContext'
import Button from '../components/ds/Button'
import BilleaseIcon from '../assets/icons/BilleaseIcon'

const SECTIONS = [
  { id: 'shimmer',  label: 'Skeleton shimmer' },
  { id: 'reveal',   label: 'Wipe reveal'      },
  { id: 'mechanics', label: 'Mechanics'       },
  { id: 'spec',     label: 'Specification'    },
]

// ─── Motion constants (from the Motion example source) ────────────────────────

const SHIMMER_DEFAULT_DURATION = 1.5   // seconds
const LOAD_DEFAULT_DELAY       = 2500  // ms
const WIPE_DURATION            = 600   // ms

const COVER_HEIGHT   = 120
const AVATAR_SIZE    = 56
const AVATAR_OVERLAP = 28
const CARD_WIDTH     = 360

const VIEW_NAME = 'ds-skeleton-card'

// ─── Global styles for the shimmer + view transition ──────────────────────────
// @property is what makes --ds-wipe animatable; without it the mask cannot tween.

const MOTION_CSS = `
  @property --ds-wipe {
    syntax: '<percentage>';
    inherits: true;
    initial-value: -100%;
  }

  @keyframes ds-shimmer-sweep {
    from { background-position: -200% 0; }
    to   { background-position:  200% 0; }
  }

  @keyframes ds-skeleton-wipe {
    from { --ds-wipe:  100%; }
    to   { --ds-wipe: -100%; }
  }

  .ds-shimmer {
    background: linear-gradient(
      90deg,
      var(--bg-sunken) 25%,
      var(--bg-strong) 50%,
      var(--bg-sunken) 75%
    );
    background-size: 200% 100%;
    animation: ds-shimmer-sweep var(--ds-shimmer-duration, 1.5s) ease-in-out infinite;
  }

  ::view-transition-group(${VIEW_NAME}) {
    border-radius: var(--radius-xl);
    overflow: hidden;
  }

  ::view-transition-image-pair(${VIEW_NAME}) {
    mix-blend-mode: normal;
  }

  /* The outgoing (skeleton) layer sits above the incoming one and is wiped away,
     revealing the real content underneath rather than cross-fading into it. */
  ::view-transition-old(${VIEW_NAME}) {
    z-index: 2;
    animation: ds-skeleton-wipe ${WIPE_DURATION}ms ease-in-out both;
    -webkit-mask-image: linear-gradient(to right, black var(--ds-wipe), transparent calc(var(--ds-wipe) + 100%));
            mask-image: linear-gradient(to right, black var(--ds-wipe), transparent calc(var(--ds-wipe) + 100%));
  }

  ::view-transition-new(${VIEW_NAME}) {
    animation: none;
    opacity: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    .ds-shimmer { animation: none; }
    ::view-transition-old(${VIEW_NAME}),
    ::view-transition-new(${VIEW_NAME}) { animation: none; }
  }
`

// ─── Shimmer primitives ───────────────────────────────────────────────────────

/**
 * Shimmer — sizes itself off the real node it stands in for.
 * The child is rendered but hidden, so the placeholder always matches the exact
 * width, height and line count of the content that will replace it. No guessed
 * pixel values, and no layout shift on reveal.
 */
function Shimmer({ duration, radius = 'var(--radius-sm)', style, children }) {
  return (
    <div
      className="ds-shimmer"
      style={{ borderRadius: radius, overflow: 'hidden', '--ds-shimmer-duration': `${duration}s`, ...style }}
      aria-hidden="true"
    >
      <div style={{ visibility: 'hidden' }}>{children}</div>
    </div>
  )
}

/** Bone — a fixed-size placeholder for a node with no intrinsic content (cover, avatar). */
function Bone({ width, height, radius = 'var(--radius-sm)', duration }) {
  return (
    <div
      className="ds-shimmer"
      style={{ width, height, borderRadius: radius, flexShrink: 0, '--ds-shimmer-duration': `${duration}s` }}
      aria-hidden="true"
    />
  )
}

// ─── Card content ─────────────────────────────────────────────────────────────

const PROFILE_NAME   = 'Billease'
const PROFILE_HANDLE = '@billease'
const PROFILE_BIO    = 'Buy now, pay later for everyday essentials. Split any purchase into instalments you can actually plan around.'

const STATS = [
  { value: '127', label: 'Bills'   },
  { value: '11K', label: 'Paid'    },
  { value: '5',   label: 'Pending' },
]

const cardStyle = {
  width: '100%',
  maxWidth: CARD_WIDTH,
  borderRadius: 'var(--radius-xl)',
  border: '1px solid var(--border-subtle)',
  backgroundColor: 'var(--bg-base)',
  overflow: 'hidden',
  fontFamily: 'var(--ds-font-family)',
  viewTransitionName: VIEW_NAME,
}

const profileAreaStyle = { padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }
const avatarWrapStyle  = { marginTop: -AVATAR_OVERLAP }
const infoGroupStyle   = { display: 'flex', flexDirection: 'column', gap: 4 }
const nameStyle        = { margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--text-base)', lineHeight: 1.2 }
const handleStyle      = { margin: 0, fontSize: 13, color: 'var(--text-subtle)', lineHeight: 1.2 }
const bioStyle         = { margin: 0, fontSize: 13, lineHeight: 1.5, color: 'var(--text-subtle)' }
const statsRowStyle    = { display: 'flex', gap: 8 }
const statItemStyle    = { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 4px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)', flex: 1, gap: 2 }
const statValueStyle   = { fontSize: 15, fontWeight: 600, color: 'var(--text-base)', lineHeight: 1.3 }
const statLabelStyle   = { fontSize: 11, color: 'var(--text-subtle)', lineHeight: 1.3 }

function StatItem({ stat }) {
  return (
    <div style={statItemStyle}>
      <span style={statValueStyle}>{stat.value}</span>
      <span style={statLabelStyle}>{stat.label}</span>
    </div>
  )
}

function InfoGroup() {
  return (
    <div style={infoGroupStyle}>
      <h3 style={nameStyle}>{PROFILE_NAME}</h3>
      <p style={handleStyle}>{PROFILE_HANDLE}</p>
    </div>
  )
}

function ProfileCard() {
  return (
    <div style={cardStyle}>
      <div style={{ width: '100%', height: COVER_HEIGHT, backgroundColor: 'var(--bg-primary)' }} />
      <div style={profileAreaStyle}>
        <div style={avatarWrapStyle}>
          <div style={{
            width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: '50%',
            backgroundColor: 'var(--bg-selected)', border: '3px solid var(--bg-base)',
            boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BilleaseIcon name="user-fill" size="md" color="var(--icon-base)" />
          </div>
        </div>
        <InfoGroup />
        <p style={bioStyle}>{PROFILE_BIO}</p>
        <div style={statsRowStyle}>
          {STATS.map(stat => <StatItem key={stat.label} stat={stat} />)}
        </div>
        <Button type="primary" size="md" label="Follow" fullWidth />
      </div>
    </div>
  )
}

function SkeletonCard({ duration }) {
  return (
    <div style={cardStyle}>
      <Bone width="100%" height={COVER_HEIGHT} radius={0} duration={duration} />
      <div style={profileAreaStyle}>
        <div style={avatarWrapStyle}>
          <div style={{
            width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: '50%',
            backgroundColor: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Bone width={AVATAR_SIZE - 6} height={AVATAR_SIZE - 6} radius="50%" duration={duration} />
          </div>
        </div>
        <Shimmer duration={duration} radius="var(--radius-sm)" style={{ alignSelf: 'flex-start' }}>
          <InfoGroup />
        </Shimmer>
        <Shimmer duration={duration} radius="var(--radius-sm)">
          <p style={bioStyle}>{PROFILE_BIO}</p>
        </Shimmer>
        <div style={statsRowStyle}>
          {STATS.map(stat => (
            <Shimmer key={stat.label} duration={duration} radius="var(--radius-md)" style={{ flex: 1 }}>
              <StatItem stat={stat} />
            </Shimmer>
          ))}
        </div>
        <Shimmer duration={duration} radius="var(--radius-md)">
          <Button type="primary" size="md" label="Follow" fullWidth />
        </Shimmer>
      </div>
    </div>
  )
}

// ─── The demo ─────────────────────────────────────────────────────────────────

/** Wraps a state change in a view transition so the skeleton wipes away. */
function withWipe(update) {
  const reduced = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (typeof document === 'undefined' || typeof document.startViewTransition !== 'function' || reduced) {
    update()
    return
  }
  document.startViewTransition(() => flushSync(update))
}

function SkeletonShimmerDemo() {
  const [loaded, setLoaded] = useState(false)
  const [duration, setDuration] = useState(SHIMMER_DEFAULT_DURATION)
  const [delay, setDelay] = useState(LOAD_DEFAULT_DELAY)

  useEffect(() => {
    if (loaded) return
    const timer = setTimeout(() => withWipe(() => setLoaded(true)), delay)
    return () => clearTimeout(timer)
  }, [loaded, delay])

  return (
    <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <div style={{ width: CARD_WIDTH, flexShrink: 0 }}>
        {loaded ? <ProfileCard /> : <SkeletonCard duration={duration} />}
      </div>

      <div style={{ flex: 1, minWidth: 240, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Control
          label="Shimmer duration"
          value={`${duration.toFixed(1)}s`}
          min={0.5} max={4} step={0.1}
          raw={duration}
          onChange={setDuration}
        />
        <Control
          label="Load delay"
          value={`${delay}ms`}
          min={500} max={5000} step={100}
          raw={delay}
          onChange={setDelay}
        />
        <div>
          <Button
            type="secondary"
            size="sm"
            label="Reload"
            onClick={() => withWipe(() => setLoaded(false))}
          />
        </div>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--text-subtle)', lineHeight: 1.6, fontFamily: 'var(--font-family)' }}>
          The wipe reveal uses the View Transitions API. In browsers without it the
          swap still happens, just without the wipe, and the same applies when
          reduced motion is on.
        </p>
      </div>
    </div>
  )
}

function Control({ label, value, min, max, step, raw, onChange }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-family)' }}>
      <span style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-subtle)' }}>
        <span>{label}</span>
        <span style={{ fontFamily: 'monospace', color: 'var(--text-base)', fontWeight: 600 }}>{value}</span>
      </span>
      <input
        type="range"
        min={min} max={max} step={step} value={raw}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--bg-primary)' }}
      />
    </label>
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
  return (
    <div style={{ padding: '28px 32px', backgroundColor: '#fff', ...style }}>
      {children}
    </div>
  )
}

const P = ({ children }) => (
  <p style={{ margin: '0 0 20px', fontSize: 14, color: 'var(--text-subtle)', lineHeight: 1.6, fontFamily: 'var(--font-family)' }}>
    {children}
  </p>
)

const CODE_SHIMMER = `.ds-shimmer {
  background: linear-gradient(
    90deg,
    var(--bg-sunken) 25%,
    var(--bg-strong) 50%,
    var(--bg-sunken) 75%
  );
  background-size: 200% 100%;
  animation: ds-shimmer-sweep 1.5s ease-in-out infinite;
}

@keyframes ds-shimmer-sweep {
  from { background-position: -200% 0; }
  to   { background-position:  200% 0; }
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

::view-transition-old(ds-skeleton-card) {
  z-index: 2;                 /* wipe the skeleton off the top of the real card */
  animation: ds-skeleton-wipe 600ms ease-in-out both;
  mask-image: linear-gradient(
    to right,
    black var(--ds-wipe),
    transparent calc(var(--ds-wipe) + 100%)
  );
}`

const CODE_SIZER = `// The placeholder is sized by the node it replaces, never by a guessed value.
<Shimmer radius="var(--radius-md)">
  <Button type="primary" size="md" label="Follow" fullWidth />
</Shimmer>

function Shimmer({ radius, children }) {
  return (
    <div className="ds-shimmer" style={{ borderRadius: radius, overflow: 'hidden' }}>
      <div style={{ visibility: 'hidden' }}>{children}</div>
    </div>
  )
}`

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

const SPEC_ROWS = [
  { prop: 'Gradient',      motion: 'linear-gradient(90deg, base 25%, highlight 50%, base 75%)', here: 'Identical stop layout, --bg-sunken base and --bg-strong highlight' },
  { prop: 'Background size', motion: '200% 100%',                    here: 'Identical' },
  { prop: 'Sweep',         motion: 'background-position -200% 0 → 200% 0', here: 'Identical' },
  { prop: 'Duration',      motion: '1.5s (adjustable 0.5s to 4s)',  here: 'Identical, same slider range' },
  { prop: 'Easing',        motion: 'easeInOut',                     here: 'ease-in-out, the exact same cubic-bezier(0.42, 0, 0.58, 1)' },
  { prop: 'Repeat',        motion: 'Infinity, restart (not ping-pong)', here: 'infinite, restart' },
  { prop: 'Sizing',        motion: 'Real node wrapped at visibility: hidden', here: 'Identical' },
  { prop: 'Reveal',        motion: 'motion-plus AnimateView, mask wipe on the old layer', here: 'Native View Transitions API, same mask wipe. AnimateView is a paid package so it is not a dependency here' },
  { prop: 'Wipe duration', motion: '0.6s easeInOut',                here: 'Identical' },
  { prop: 'Load delay',    motion: '2500ms (adjustable 500ms to 5000ms)', here: 'Identical, same slider range' },
  { prop: 'Palette',       motion: 'rgba(255,255,255,0.06) on 0.12, dark surface', here: 'Token pair --bg-sunken on --bg-strong, light surface, matching Skeleton.jsx' },
  { prop: 'Cover fill',    motion: 'Two-colour gradient from theme hues', here: 'Solid --bg-primary. No new gradient value introduced' },
]

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Motion() {
  const { setSections } = useToc()
  useEffect(() => { setSections(SECTIONS); return () => setSections([]) }, [])

  return (
    <div style={{ fontFamily: 'var(--font-family)' }}>
      <style>{MOTION_CSS}</style>

      <h1 style={{ margin: '0 0 8px', fontSize: 32, fontWeight: 700, color: 'var(--text-base)', lineHeight: 1.2 }}>Motion</h1>
      <p style={{ margin: '0 0 40px', fontSize: 15, color: 'var(--text-subtle)', lineHeight: 1.5 }}>
        Loading states, transitions and the timing values behind them.
      </p>
      <div style={{ borderTop: '1px solid var(--border-subtle)', marginBottom: 40 }} />

      {/* ── Skeleton shimmer ── */}
      <DocSection id="shimmer" title="Skeleton shimmer">
        <P>
          A replication of the Motion for React <a href="https://motion.dev/examples/react-skeleton-shimmer" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)' }}>Skeleton Shimmer</a> example.
          The card loads on a delay, shimmers while it waits, then the skeleton is wiped
          off the top of the real content rather than cross-faded into it. Every timing
          value is carried across unchanged. Only the palette is swapped, for the
          tokens this library already ships.
        </P>
        <DocCard>
          <CardHeader label="Live demo" />
          <CardBody>
            <SkeletonShimmerDemo />
          </CardBody>
        </DocCard>
      </DocSection>

      {/* ── Wipe reveal ── */}
      <DocSection id="reveal" title="Wipe reveal">
        <P>
          The original uses <code>AnimateView</code> from Motion+, which is a paid package.
          The underlying effect does not need it. A named view transition gives the same
          two layers, and a masked gradient on the outgoing one wipes the skeleton away
          left to right over 600ms while the real card sits underneath, already in place.
          Nothing moves, so there is no layout shift at the moment of reveal.
        </P>
        <DocCard>
          <CardHeader label="Reveal CSS" />
          <CodeBlock code={CODE_WIPE} />
        </DocCard>
      </DocSection>

      {/* ── Mechanics ── */}
      <DocSection id="mechanics" title="Mechanics">
        <P>
          The shimmer is one gradient twice as wide as the element it fills, slid across
          it. Nothing is layered on top and there is no pseudo-element, so it composites
          cleanly at any corner radius.
        </P>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <DocCard>
            <CardHeader label="Shimmer CSS" />
            <CodeBlock code={CODE_SHIMMER} />
          </DocCard>
          <DocCard>
            <CardHeader label="Sizing off the real node" />
            <CodeBlock code={CODE_SIZER} />
          </DocCard>
        </div>
        <div style={{ height: 20 }} />
        <P>
          The second block is the part worth keeping. Each placeholder renders the real
          component inside itself at <code>visibility: hidden</code> and takes its size
          from it. A button placeholder is exactly the height of that button, a two-line
          bio is exactly two lines. Change the type scale or the button padding and the
          skeleton follows on its own.
        </P>
      </DocSection>

      {/* ── Specification ── */}
      <DocSection id="spec" title="Specification">
        <P>
          Read from the Motion example&apos;s own source, not from the documentation page.
        </P>
        <DocCard>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-subtle)' }}>
                  {['Property', 'Motion example', 'This library'].map(h => (
                    <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-family)', color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid var(--border-subtle)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SPEC_ROWS.map((row, i, arr) => (
                  <tr key={row.prop} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                    <td style={{ padding: '8px 14px', fontFamily: 'monospace', fontSize: 12.5, fontWeight: 600, color: 'var(--text-base)', whiteSpace: 'nowrap', verticalAlign: 'top' }}>{row.prop}</td>
                    <td style={{ padding: '8px 14px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)', verticalAlign: 'top' }}>{row.motion}</td>
                    <td style={{ padding: '8px 14px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-subtle)', verticalAlign: 'top' }}>{row.here}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DocCard>
      </DocSection>

    </div>
  )
}
