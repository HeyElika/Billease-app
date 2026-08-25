import Skeleton, { SkeletonText } from '../components/ds/Skeleton'
import Button from '../components/ds/Button'
import { CHANGELOGS } from '../data/changelog'

// ─── Shared layout helpers (same as AlertDocs / ButtonDocs) ────────────────────

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
    <div style={{ padding: '28px 32px', display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap', backgroundColor: '#fff', ...style }}>
      {children}
    </div>
  )
}

// ─── Composition examples ──────────────────────────────────────────────────────

function ContentCard() {
  return (
    <div style={{ width: 360, padding: 16, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <Skeleton circle width={40} height={40} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <SkeletonText role="primary" width="medium" />
          <SkeletonText role="supporting" width="short" />
        </div>
      </div>
      <SkeletonText role="secondary" width="long" />
      <SkeletonText role="secondary" width="long" />
      <SkeletonText role="secondary" width="short" />
    </div>
  )
}

function GridLoader() {
  return (
    <div style={{ width: 360, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      {[0, 1, 2, 3].map(i => (
        <Skeleton key={i} width="100%" height={64} radius={'var(--radius-lg)'} />
      ))}
    </div>
  )
}

function DetailLoader() {
  return (
    <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Skeleton width="100%" height={96} radius={'var(--radius-lg)'} />
      <SkeletonText role="secondary" width="long" />
      <SkeletonText role="secondary" width="long" />
      <SkeletonText role="supporting" width="short" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
        <div style={{ opacity: 0.48, pointerEvents: 'none' }}>
          <Button type="primary" size="sm" label="Continue" state="disabled" />
        </div>
        <span style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: 'var(--text-subtle)' }}>
          action disabled while content loads
        </span>
      </div>
    </div>
  )
}

function TypeHierarchyExample() {
  return (
    <div style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 84, fontFamily: 'var(--font-family)', fontSize: 11, color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.4px', flexShrink: 0 }}>Primary</span>
        <SkeletonText role="primary" width="medium" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 84, fontFamily: 'var(--font-family)', fontSize: 11, color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.4px', flexShrink: 0 }}>Secondary</span>
        <SkeletonText role="secondary" width="medium" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 84, fontFamily: 'var(--font-family)', fontSize: 11, color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.4px', flexShrink: 0 }}>Supporting</span>
        <SkeletonText role="supporting" width="medium" />
      </div>
    </div>
  )
}

function WidthPresetExample() {
  return (
    <div style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 84, fontFamily: 'var(--font-family)', fontSize: 11, color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.4px', flexShrink: 0 }}>Short</span>
        <SkeletonText role="secondary" width="short" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 84, fontFamily: 'var(--font-family)', fontSize: 11, color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.4px', flexShrink: 0 }}>Medium</span>
        <SkeletonText role="secondary" width="medium" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 84, fontFamily: 'var(--font-family)', fontSize: 11, color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.4px', flexShrink: 0 }}>Long</span>
        <SkeletonText role="secondary" width="long" />
      </div>
    </div>
  )
}

// ─── Vuetify reference (comparison only — not the shipped component) ──────────
// Structural properties (angle, stop layout, duration, easing, translate range)
// taken from vuetifyjs/vuetify VSkeletonLoader.sass / _variables.scss:
//   $skeleton-loader-bone-background: linear-gradient(90deg, surface@0, surface@.3, surface@0)
//   $skeleton-loader-loading-animation: loading 1.5s infinite   (no easing set → default "ease")
// Vuetify's own keyframes only define the 100% state and rely on a separate static
// `transform: translateX(-100%)` as the implicit start — that didn't render reliably
// here, so both endpoints are written explicitly (from/to) below instead.
// Base color swapped for this library's own neutral per request: #E0E0E0. The highlight
// started as #919191 (matching the Figma-sourced Skeleton), but at Vuetify's real 30%
// opacity that only peaks at #C8C8C8 — a ~10.6% luminance difference, too subtle to read
// at this element size. Swapped to the darker #696969 instead (peak #BCBCBC, ~15.9%),
// which reads clearly at the true 30% opacity — no artificial opacity boost needed.

function VuetifyBone({ width = '100%', height = 16, radius = 6, circle = false }) {
  return (
    <>
      <style>{`
        @keyframes vuetify-ref-loading {
          from { transform: translateX(-100%); }
          to   { transform: translateX(100%); }
        }
        .vuetify-ref-bone {
          position: relative;
          overflow: hidden;
          background: #E0E0E0;
        }
        .vuetify-ref-bone::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(105,105,105,0), rgba(105,105,105,0.3), rgba(105,105,105,0));
          animation: vuetify-ref-loading 1.5s infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .vuetify-ref-bone::after { animation: none; }
        }
      `}</style>
      <div
        className="vuetify-ref-bone"
        style={{ width, height, borderRadius: circle ? '50%' : radius }}
        aria-hidden="true"
      />
    </>
  )
}

function VuetifyContentCard() {
  return (
    <div style={{ width: 360, padding: 16, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <VuetifyBone circle width={40} height={40} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <VuetifyBone width="51%" height={12} radius={6} />
          <VuetifyBone width="78%" height={12} radius={6} />
        </div>
      </div>
      <VuetifyBone width="100%" height={12} radius={6} />
      <VuetifyBone width="90%" height={12} radius={6} />
      <VuetifyBone width="65%" height={12} radius={6} />
    </div>
  )
}

const COMPARE_ROWS = [
  { prop: 'Base color',    figma: '#E0E0E0 (neutral 200)', vuetify: '#E0E0E0 (solid) — same, per request' },
  { prop: 'Highlight',     figma: '#F5F5F5 (neutral 100)', vuetify: '#696969 blended at 30% opacity — a darker grey than Skeleton uses, needed so the real 30% default reads visibly here' },
  { prop: 'Gradient angle', figma: '90deg (horizontal)', vuetify: '90deg (pure horizontal) — Vuetify default, not tilted' },
  { prop: 'Stop layout',   figma: '0% / 50% / 100% (evenly spaced, symmetric)', vuetify: '0% / 50% / 100% (evenly spaced, symmetric)' },
  { prop: 'Duration',      figma: '1000ms', vuetify: '1500ms — Vuetify default' },
  { prop: 'Easing',        figma: 'linear', vuetify: 'ease — Vuetify never sets a timing function, so the browser default applies' },
  { prop: 'Translate range', figma: '-100% → 300%, restart (not ping-pong)', vuetify: '-100% → 100%, restart — identical mechanism' },
]

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function SkeletonDocs({ comp }) {
  const nodeId = comp?.id ?? '53:176'

  return (
    <div style={{ fontFamily: 'var(--font-family)' }}>

      {/* ── Appearance ── */}
      <DocSection id="appearance" title="Appearance">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <DocCard>
            <CardHeader label="Single block" />
            <CardBody>
              <Skeleton width={240} height={16} />
            </CardBody>
          </DocCard>
          <DocCard>
            <CardHeader label="Circle (avatar)" />
            <CardBody>
              <Skeleton circle width={40} height={40} />
            </CardBody>
          </DocCard>
          <DocCard>
            <CardHeader label="Content card" />
            <CardBody>
              <ContentCard />
            </CardBody>
          </DocCard>
        </div>
      </DocSection>

      {/* ── Composition ── */}
      <DocSection id="composition" title="Composition">
        <p style={{ margin: '0 0 20px', fontSize: 14, color: 'var(--text-subtle)', lineHeight: 1.6, fontFamily: 'var(--font-family)' }}>
          Skeleton is a primitive — build screen-level loaders by tiling it into the real layout. Match the placeholder to the silhouette of the incoming content: same size, same corner radius, same rough proportions. Vary line widths so it reads as content, not a solid block.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <DocCard>
            <CardHeader label="Grid loader" />
            <CardBody>
              <GridLoader />
            </CardBody>
          </DocCard>
          <DocCard>
            <CardHeader label="Detail loader" />
            <CardBody>
              <DetailLoader />
            </CardBody>
          </DocCard>
        </div>
      </DocSection>

      {/* ── Typography hierarchy ── */}
      <DocSection id="typography" title="Typography hierarchy">
        <p style={{ margin: '0 0 20px', fontSize: 14, color: 'var(--text-subtle)', lineHeight: 1.6, fontFamily: 'var(--font-family)' }}>
          <code>SkeletonText</code> sizes off the typography scale, not off a guessed pixel value. Height is 75% of the role's font-size — primary/secondary/supporting — so it represents the glyph shape rather than the full line box. Width is one of three reusable proportional presets, never computed from the real string that will load.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <DocCard>
            <CardHeader label="Height by role" />
            <CardBody>
              <TypeHierarchyExample />
            </CardBody>
          </DocCard>
          <DocCard>
            <CardHeader label="Width presets" />
            <CardBody>
              <WidthPresetExample />
            </CardBody>
          </DocCard>
        </div>
      </DocSection>

      {/* ── Vuetify reference ── */}
      <DocSection id="vuetify-reference" title="Vuetify reference">
        <p style={{ margin: '0 0 20px', fontSize: 14, color: 'var(--text-subtle)', lineHeight: 1.6, fontFamily: 'var(--font-family)' }}>
          For visual comparison only — this is <a href="https://vuetifyjs.com/en/components/skeleton-loaders/" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)' }}>Vuetify's <code>v-skeleton-loader</code></a> shimmer, read straight from its <code>VSkeletonLoader.sass</code> / <code>_variables.scss</code> source, with this library's own neutrals swapped in for Vuetify's theme colors: <code>#E0E0E0</code> base (same as Skeleton), <code>#696969</code> highlight (darker than Skeleton's <code>#919191</code> — needed for Vuetify's real 30%-opacity blend to actually read against this base; at 30%, <code>#919191</code> only peaks at <code>#C8C8C8</code>, ~10.6% luminance difference, which is essentially flat at this size). Not used anywhere in the app — the shipped component above is sourced from Figma.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <DocCard>
            <CardHeader label="Content card — Vuetify shimmer properties" />
            <CardBody>
              <VuetifyContentCard />
            </CardBody>
          </DocCard>
          <DocCard>
            <CardHeader label="Property differences" />
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-subtle)' }}>
                    {['Property', 'This library (Figma)', 'Vuetify default'].map(h => (
                      <th key={h} style={{ padding: '7px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-family)', color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid var(--border-subtle)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row, i, arr) => (
                    <tr key={row.prop} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                      <td style={{ padding: '7px 12px', fontFamily: 'monospace', fontSize: 12.5, fontWeight: 600, color: 'var(--text-base)', whiteSpace: 'nowrap' }}>{row.prop}</td>
                      <td style={{ padding: '7px 12px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)' }}>{row.figma}</td>
                      <td style={{ padding: '7px 12px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-subtle)' }}>{row.vuetify}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DocCard>
        </div>
      </DocSection>

      {/* ── Props ── */}
      <DocSection id="props" title="Props">
        <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 600, color: 'var(--text-base)', fontFamily: 'var(--font-family)' }}>Skeleton</p>
        <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', overflow: 'hidden', backgroundColor: '#fff', marginBottom: 24 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-subtle)' }}>
                {['Prop', 'Type', 'Default', 'Description'].map(h => (
                  <th key={h} style={{ padding: '7px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-family)', color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid var(--border-subtle)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'width',  type: 'number | string', def: '"100%"', desc: 'CSS width of the placeholder block.' },
                { name: 'height', type: 'number | string', def: '16',     desc: 'CSS height of the placeholder block.' },
                { name: 'radius', type: 'number | string', def: 'var(--radius-md)', desc: 'Corner radius. 8px is the spec default for text and rectangular placeholders. Pass circle for a round avatar.' },
                { name: 'circle', type: 'boolean',         def: 'false',  desc: 'Shorthand for a fully round avatar placeholder — sets border-radius to 50%.' },
              ].map((row, i, arr) => (
                <tr key={row.name} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <td style={{ padding: '7px 12px', fontFamily: 'monospace', fontSize: 13, color: 'var(--text-base)' }}>{row.name}</td>
                  <td style={{ padding: '7px 12px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)' }}>{row.type}</td>
                  <td style={{ padding: '7px 12px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-subtle)' }}>{row.def}</td>
                  <td style={{ padding: '7px 12px', fontSize: 13, fontFamily: 'var(--font-family)', color: 'var(--text-subtle)' }}>{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 600, color: 'var(--text-base)', fontFamily: 'var(--font-family)' }}>SkeletonText</p>
        <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', overflow: 'hidden', backgroundColor: '#fff' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-subtle)' }}>
                {['Prop', 'Type', 'Default', 'Description'].map(h => (
                  <th key={h} style={{ padding: '7px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-family)', color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid var(--border-subtle)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'role',  type: '"primary" | "secondary" | "supporting"', def: '"secondary"', desc: 'Maps to --skeleton-text-height-{role} — 75% of the --text-xl / --text-md / --text-xxs type-scale tokens, not a fixed px value.' },
                { name: 'width', type: '"short" | "medium" | "long" | string', def: '"medium"', desc: 'Maps to --skeleton-text-width-{preset} (35% / 60% / 85%). A raw CSS width string also passes through, but avoid computing it from real content.' },
              ].map((row, i, arr) => (
                <tr key={row.name} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <td style={{ padding: '7px 12px', fontFamily: 'monospace', fontSize: 13, color: 'var(--text-base)' }}>{row.name}</td>
                  <td style={{ padding: '7px 12px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)' }}>{row.type}</td>
                  <td style={{ padding: '7px 12px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-subtle)' }}>{row.def}</td>
                  <td style={{ padding: '7px 12px', fontSize: 13, fontFamily: 'var(--font-family)', color: 'var(--text-subtle)' }}>{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      {/* ── Changelog ── */}
      <DocSection id="changelog" title="Changelog">
        {(CHANGELOGS[nodeId] ?? []).length === 0 ? (
          <DocCard>
            <CardBody>
              <span style={{ fontFamily: 'var(--font-family)', fontSize: 13, color: 'var(--text-subtle)' }}>No changes recorded yet.</span>
            </CardBody>
          </DocCard>
        ) : null}
      </DocSection>

    </div>
  )
}
