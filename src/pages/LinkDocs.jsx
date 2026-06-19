import Link from '../components/ds/Link'
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
      gap: 40,
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      backgroundColor: '#fff',
      ...style,
    }}>
      {children}
    </div>
  )
}

// ─── Section: States ────────────────────────────────────────────────────────

const STATES = ['default', 'active', 'disabled']
const STATE_LABEL = { default: 'Default', active: 'Active', disabled: 'Disabled' }

function StatesSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {['md', 'sm'].map(size => (
        <DocCard key={size}>
          <CardHeader label={`All states — ${size === 'md' ? 'Medium' : 'Small'}`} />
          <CardBody>
            {STATES.map(state => (
              <div key={state} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <Link size={size} state={state} label={STATE_LABEL[state]} showIcon />
                <span style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 11,
                  color: 'var(--text-subtle)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                }}>
                  {STATE_LABEL[state]}
                </span>
              </div>
            ))}
          </CardBody>
        </DocCard>
      ))}
    </div>
  )
}

// ─── Section: Sizes ──────────────────────────────────────────────────────────

function SizesSection() {
  return (
    <DocCard>
      <CardHeader label="All sizes — Default state" />
      <CardBody style={{ alignItems: 'flex-end' }}>
        {[
          { size: 'md', label: 'Medium — 16px' },
          { size: 'sm', label: 'Small — 14px'  },
        ].map(({ size, label }) => (
          <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <Link size={size} state="default" label={label} showIcon />
            <span style={{
              fontFamily: 'var(--font-family)',
              fontSize: 11,
              color: 'var(--text-subtle)',
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
            }}>
              {size}
            </span>
          </div>
        ))}
      </CardBody>
    </DocCard>
  )
}

// ─── Section: Icon slot ─────────────────────────────────────────────────────

function IconSlotSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{
        padding: '10px 14px',
        backgroundColor: 'var(--bg-warning-subtle)',
        borderRadius: 8,
        border: '1px solid var(--yellow-300)',
      }}>
        <span style={{ fontSize: 13, fontFamily: 'var(--font-family)', color: 'var(--text-warning)', fontWeight: 500 }}>
          The trailing arrow icon is optional. Omit it for inline text links where a directional cue would be distracting.
        </span>
      </div>

      <DocCard>
        <CardHeader label="With trailing icon (default)" />
        <CardBody>
          <Link size="md" state="default" label="View statement" showIcon />
          <Link size="sm" state="default" label="View statement" showIcon />
        </CardBody>
      </DocCard>

      <DocCard>
        <CardHeader label="Without icon" />
        <CardBody>
          <Link size="md" state="default" label="Terms & Conditions" showIcon={false} />
          <Link size="sm" state="default" label="Terms & Conditions" showIcon={false} />
        </CardBody>
      </DocCard>
    </div>
  )
}

// ─── Section: Changelog ─────────────────────────────────────────────────────

const CHANGE_TYPE = {
  removed:    { label: 'Removed',    bg: 'var(--bg-error-subtle)',   color: 'var(--text-primary)'   },
  added:      { label: 'Added',      bg: '#E6F4EA',                  color: '#1E6B3A'               },
  updated:    { label: 'Updated',    bg: '#EBF3FF',                  color: 'var(--text-secondary)' },
  deprecated: { label: 'Deprecated', bg: '#FFF7E6',                  color: 'var(--text-warning)'   },
}

function ChangelogSection({ nodeId }) {
  const entries = CHANGELOGS[nodeId] ?? []

  if (entries.length === 0) {
    return (
      <DocCard>
        <div style={{ padding: '28px 32px' }}>
          <span style={{ fontFamily: 'var(--font-family)', fontSize: 13, color: 'var(--text-subtle)' }}>
            No changes recorded yet.
          </span>
        </div>
      </DocCard>
    )
  }

  return (
    <DocCard>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--bg-subtle)' }}>
            {['Date', 'Type', 'Description'].map(h => (
              <th key={h} style={{
                padding: '7px 16px',
                textAlign: 'left',
                fontSize: 11,
                fontWeight: 700,
                fontFamily: 'var(--font-family)',
                color: 'var(--text-disabled)',
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
                borderBottom: '1px solid var(--border-subtle)',
                whiteSpace: 'nowrap',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => {
            const t = CHANGE_TYPE[entry.type] ?? CHANGE_TYPE.updated
            return (
              <tr key={i} style={{ borderBottom: i < entries.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                <td style={{ padding: '10px 16px', fontSize: 12, fontFamily: 'monospace', color: 'var(--text-subtle)', whiteSpace: 'nowrap' }}>{entry.date}</td>
                <td style={{ padding: '10px 16px', whiteSpace: 'nowrap' }}>
                  <span style={{ display: 'inline-flex', padding: '2px 10px', borderRadius: 9999, backgroundColor: t.bg, color: t.color, fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-family)' }}>
                    {t.label}
                  </span>
                </td>
                <td style={{ padding: '10px 16px', fontSize: 13, fontFamily: 'var(--font-family)', color: 'var(--text-base)', lineHeight: 1.5 }}>{entry.description}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </DocCard>
  )
}

// ─── Main component ─────────────────────────────────────────────────────────

export default function LinkDocs({ comp }) {
  const nodeId = comp?.id ?? '190:3261'
  return (
    <div style={{ fontFamily: 'var(--font-family)' }}>

      <DocSection id="states" title="States">
        <StatesSection />
      </DocSection>

      <DocSection id="sizes" title="Sizes">
        <SizesSection />
      </DocSection>

      <DocSection id="icon-slot" title="Icon slot">
        <IconSlotSection />
      </DocSection>

      <DocSection id="changelog" title="Changelog">
        <ChangelogSection nodeId={nodeId} />
      </DocSection>

    </div>
  )
}
