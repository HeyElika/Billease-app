import ActionMenuItem from '../components/ds/ActionMenuItem'
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
        paddingBottom: 12,
        borderBottom: '1px solid var(--border-subtle)',
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

// ─── Section: States ────────────────────────────────────────────────────────

const STATES = [
  { state: 'Default',  icon: 'start-outline', label: 'Add to favorites' },
  { state: 'disabled', icon: 'start-outline', label: 'Add to favorites' },
  { state: 'danger',   icon: 'trash-outline', label: 'Remove recipient' },
]

function StatesSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {STATES.map(({ state, icon, label }) => (
        <DocCard key={state}>
          <CardHeader label={state === 'Default' ? 'Default' : state === 'disabled' ? 'Disabled' : 'Danger'} />
          <div style={{ padding: '0 16px' }}>
            <ActionMenuItem state={state} icon={icon} label={label} showArrow={state !== 'danger'} />
          </div>
        </DocCard>
      ))}
    </div>
  )
}

// ─── Section: Action menu (full list example) ───────────────────────────────

const FULL_MENU = [
  { state: 'Default', icon: 'account-outline', label: 'Recipient details', description: 'View and edit recipient details', showArrow: true,  showDescription: true },
  { state: 'Default', icon: 'start-outline',   label: 'Add to favorites',  showArrow: false, showDescription: false },
  { state: 'danger',  icon: 'trash-outline',   label: 'Remove recipient',  showArrow: false, showDescription: false },
]

function ActionMenuSection() {
  return (
    <DocCard style={{ maxWidth: 360 }}>
      <CardHeader label="Full action menu" />
      {/* Items stack with no gaps — no dividers — matches Figma action-menu component */}
      <div style={{ padding: '0 16px' }}>
        {FULL_MENU.map((item, i) => (
          <ActionMenuItem
            key={i}
            state={item.state}
            icon={item.icon}
            label={item.label}
            description={item.description ?? ''}
            showArrow={item.showArrow}
            showDescription={item.showDescription}
          />
        ))}
      </div>
    </DocCard>
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
                padding: '7px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700,
                fontFamily: 'var(--font-family)', color: 'var(--text-disabled)',
                textTransform: 'uppercase', letterSpacing: '0.4px',
                borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap',
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
                  <span style={{ display: 'inline-flex', padding: '2px 10px', borderRadius: 9999, backgroundColor: t.bg, color: t.color, fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-family)' }}>{t.label}</span>
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

export default function ActionMenuDocs({ comp }) {
  const nodeId = comp?.id ?? '11079:3310'
  return (
    <div style={{ fontFamily: 'var(--font-family)' }}>

      <DocSection id="states" title="States">
        <StatesSection />
      </DocSection>

      <DocSection id="action-menu" title="Action menu">
        <ActionMenuSection />
      </DocSection>

      <DocSection id="changelog" title="Changelog">
        <ChangelogSection nodeId={nodeId} />
      </DocSection>

    </div>
  )
}
