import NavHeader from '../components/ds/NavHeader'
import NavigationWatermark from '../components/ds/NavigationWatermark'
import NavigationProgress from '../components/ds/NavigationProgress'
import { CHANGELOGS } from '../data/changelog'

// ─── Shared layout helpers ──────────────────────────────────────────────────

function DocSection({ id, title, children }) {
  return (
    <section id={id} style={{ marginBottom: 56 }}>
      <h2 style={{
        fontFamily: 'var(--font-family)',
        fontSize: 20,
        fontWeight: 700,
        color: 'var(--text-base)',
        margin: '0 0 20px',
      }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

function DocCard({ children, style }) {
  return (
    <div style={{
      backgroundColor: '#fff',
      border: '1px solid var(--border-subtle)',
      borderRadius: 8,
      overflow: 'hidden',
      ...style,
    }}>
      {children}
    </div>
  )
}

function CardHeader({ label }) {
  return (
    <div style={{
      padding: '10px 16px',
      borderBottom: '1px solid var(--border-subtle)',
      backgroundColor: 'var(--bg-subtle)',
    }}>
      <span style={{
        fontFamily: 'var(--font-family)',
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--text-subtle)',
        textTransform: 'uppercase',
        letterSpacing: '0.4px',
      }}>
        {label}
      </span>
    </div>
  )
}

function CardBody({ children, style }) {
  return (
    <div style={{
      padding: '28px 32px',
      display: 'flex',
      gap: 24,
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      backgroundColor: '#fff',
      ...style,
    }}>
      {children}
    </div>
  )
}

// ─── NavHeader preview container (360px phone width) ───────────────────────

function NavPreview({ children, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
      <div style={{
        width: 360,
        backgroundColor: 'var(--bg-base)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {children}
      </div>
      {label && (
        <span style={{
          fontSize: 11,
          fontFamily: 'var(--font-family)',
          color: 'var(--text-subtle)',
          textTransform: 'uppercase',
          letterSpacing: '0.4px',
        }}>
          {label}
        </span>
      )}
    </div>
  )
}

// ─── Section: Variants ─────────────────────────────────────────────────────

const VARIANTS = [
  { type: 'icon-left',       label: 'icon-left',       title: 'Screen title' },
  { type: 'title-only',      label: 'title-only',       title: 'Screen title' },
  { type: 'icon-left-right', label: 'icon-left-right',  title: 'Screen title' },
  { type: 'logo-only',       label: 'logo-only',        title: '' },
  { type: 'icon-right',      label: 'icon-right',       title: 'Screen title' },
  { type: 'help',            label: 'help',             title: 'Screen title' },
  { type: 'w/progress',      label: 'w/progress',       title: '' },
  { type: 'w/subtitle',      label: 'w/subtitle',       title: 'Screen title', subtitle: 'Supporting text' },
]

function VariantsSection() {
  return (
    <DocCard>
      <CardHeader label="All 8 Variants" />
      <CardBody style={{ gap: 24, flexWrap: 'wrap' }}>
        {VARIANTS.map(v => (
          <NavPreview key={v.type} label={v.label}>
            <NavHeader
              type={v.type}
              title={v.title}
              subtitle={v.subtitle ?? ''}
              showWatermark={true}
              progress="start"
            />
          </NavPreview>
        ))}
      </CardBody>
    </DocCard>
  )
}

// ─── Section: Sub-components ────────────────────────────────────────────────

function NavigationProgressRow({ state }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
      <NavigationProgress state={state} />
      <span style={{ fontSize: 11, fontFamily: 'var(--font-family)', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
        {state}
      </span>
    </div>
  )
}

function SubComponentsSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* NavigationWatermark */}
      <DocCard>
        <CardHeader label="NavigationWatermark — node 16:1698" />
        <CardBody style={{ flexDirection: 'column', gap: 12 }}>
          <p style={{ margin: 0, fontSize: 13, fontFamily: 'var(--font-family)', color: 'var(--text-subtle)', lineHeight: 1.5 }}>
            Row of 10 colored 4 px dots right-aligned along the top edge of every navigation header.
            Purely decorative DS indicator — no props.
          </p>
          <div style={{
            width: 360,
            height: 20,
            position: 'relative',
            backgroundColor: 'var(--bg-base)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 4,
          }}>
            <NavigationWatermark />
          </div>
        </CardBody>
      </DocCard>

      {/* NavigationProgress */}
      <DocCard>
        <CardHeader label="NavigationProgress — node 8728:4918" />
        <CardBody style={{ flexDirection: 'column', gap: 16 }}>
          <p style={{ margin: 0, fontSize: 13, fontFamily: 'var(--font-family)', color: 'var(--text-subtle)', lineHeight: 1.5 }}>
            Horizontal progress bar used in the <code style={{ fontFamily: 'monospace', fontSize: 12 }}>w/progress</code> NavHeader variant.
            Track is 90 × 4 px. Active fill uses <code style={{ fontFamily: 'monospace', fontSize: 12 }}>var(--bg-secondary)</code>.
          </p>
          <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <NavigationProgressRow state="start" />
            <NavigationProgressRow state="mid" />
            <NavigationProgressRow state="end" />
          </div>
          <div style={{ fontSize: 13, fontFamily: 'var(--font-family)', color: 'var(--text-subtle)', lineHeight: 1.6 }}>
            <span style={{ fontWeight: 600, color: 'var(--text-base)' }}>start</span> — active fill 30 px &nbsp;·&nbsp;
            <span style={{ fontWeight: 600, color: 'var(--text-base)' }}>mid</span> — active fill 60 px &nbsp;·&nbsp;
            <span style={{ fontWeight: 600, color: 'var(--text-base)' }}>end</span> — full track filled
          </div>
        </CardBody>
      </DocCard>

      {/* w/progress variant showing all 3 states */}
      <DocCard>
        <CardHeader label="w/progress — all progress states" />
        <CardBody style={{ flexWrap: 'wrap', gap: 24 }}>
          {['start', 'mid', 'end'].map(state => (
            <NavPreview key={state} label={`progress="${state}"`}>
              <NavHeader type="w/progress" progress={state} showWatermark={true} />
            </NavPreview>
          ))}
        </CardBody>
      </DocCard>

    </div>
  )
}

// ─── Section: Props ─────────────────────────────────────────────────────────

const PROPS = [
  { name: 'type',          type: 'string',   default: "'icon-left'",  desc: 'Variant: icon-left | title-only | icon-left-right | logo-only | icon-right | help | w/progress | w/subtitle' },
  { name: 'title',         type: 'string',   default: "''",           desc: 'Header title text (center slot)' },
  { name: 'subtitle',      type: 'string',   default: "''",           desc: 'Subtitle text. w/subtitle variant only.' },
  { name: 'progress',      type: 'string',   default: "'start'",      desc: 'NavigationProgress state: start | mid | end. w/progress variant only.' },
  { name: 'showBorder',    type: 'boolean',  default: 'false',        desc: 'Show 1 px bottom border (border-subtle)' },
  { name: 'showWatermark', type: 'boolean',  default: 'true',         desc: 'Show NavigationWatermark at top edge' },
  { name: 'showTitle',     type: 'boolean',  default: 'true',         desc: 'Show/hide the title text' },
  { name: 'onBack',        type: 'function', default: 'undefined',    desc: 'Callback for back arrow tap' },
  { name: 'onClose',       type: 'function', default: 'undefined',    desc: 'Callback for close icon tap' },
  { name: 'onHelp',        type: 'function', default: 'undefined',    desc: 'Callback for Help link tap (help variant)' },
]

function PropsSection() {
  return (
    <DocCard>
      <CardHeader label="NavHeader Props" />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-subtle)' }}>
              {['Prop', 'Type', 'Default', 'Description'].map(h => (
                <th key={h} style={{
                  padding: '8px 14px',
                  textAlign: 'left',
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: 'var(--font-family)',
                  color: 'var(--text-disabled)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px',
                  borderBottom: '1px solid var(--border-subtle)',
                  whiteSpace: 'nowrap',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PROPS.map((p, i) => (
              <tr key={p.name} style={{ borderBottom: i < PROPS.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                <td style={{ padding: '8px 14px', fontFamily: 'monospace', fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{p.name}</td>
                <td style={{ padding: '8px 14px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-subtle)', whiteSpace: 'nowrap' }}>{p.type}</td>
                <td style={{ padding: '8px 14px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{p.default}</td>
                <td style={{ padding: '8px 14px', fontFamily: 'var(--font-family)', fontSize: 13, color: 'var(--text-subtle)', lineHeight: 1.4 }}>{p.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DocCard>
  )
}

// ─── Section: Changelog ─────────────────────────────────────────────────────

function ChangelogSection({ comp }) {
  const entries = (CHANGELOGS[comp?.id] || []).slice().sort((a, b) => new Date(b.date) - new Date(a.date))

  if (!entries.length) {
    return (
      <DocCard>
        <CardBody>
          <span style={{ fontSize: 13, fontFamily: 'var(--font-family)', color: 'var(--text-disabled)' }}>No changelog entries yet.</span>
        </CardBody>
      </DocCard>
    )
  }

  return (
    <DocCard>
      <CardHeader label="History" />
      <div>
        {entries.map((e, i) => (
          <div key={i} style={{
            padding: '12px 16px',
            borderBottom: i < entries.length - 1 ? '1px solid var(--border-subtle)' : 'none',
            display: 'flex',
            gap: 16,
            alignItems: 'baseline',
          }}>
            <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-disabled)', whiteSpace: 'nowrap', minWidth: 80 }}>{e.date}</span>
            <span style={{ fontSize: 13, fontFamily: 'var(--font-family)', color: 'var(--text-base)', lineHeight: 1.4 }}>{e.note}</span>
          </div>
        ))}
      </div>
    </DocCard>
  )
}

// ─── NavHeaderDocs ──────────────────────────────────────────────────────────

export default function NavHeaderDocs({ comp }) {
  return (
    <div id="overview" style={{ fontFamily: 'var(--font-family)' }}>

      <h1 style={{ margin: '0 0 8px', fontSize: 32, fontWeight: 700, color: 'var(--text-base)', lineHeight: 1.2 }}>
        Navigation / Header
      </h1>
      <p style={{ margin: '0 0 28px', fontSize: 15, color: 'var(--text-subtle)', lineHeight: 1.5 }}>
        Top navigation bar for all app screens. 8 variants covering back, close, logo, progress, and subtitle layouts.
        Height is always 44 px; content row is 360 - 40 px inset (320 px wide).
      </p>

      <div style={{ borderTop: '1px solid var(--border-subtle)', marginBottom: 40 }} />

      <DocSection id="variants" title="Variants">
        <VariantsSection />
      </DocSection>

      <DocSection id="sub-components" title="Sub-components">
        <SubComponentsSection />
      </DocSection>

      <DocSection id="props" title="Props">
        <PropsSection />
      </DocSection>

      <DocSection id="changelog" title="Changelog">
        <ChangelogSection comp={comp} />
      </DocSection>

      <div style={{ height: 48 }} />
    </div>
  )
}
