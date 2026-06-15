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

// ─── Demo items config ──────────────────────────────────────────────────────

const DEMO_ITEMS = [
  { icon: 'edit-outline',      label: 'Edit profile'   },
  { icon: 'statement-outline', label: 'View statement' },
  { icon: 'info-outline',      label: 'Learn more'     },
  { icon: 'trash-outline',     label: 'Delete',        danger: true },
]

// ─── Section: States ────────────────────────────────────────────────────────

const STATES = ['Default', 'disabled', 'danger']
const STATE_LABEL = { Default: 'Default', disabled: 'Disabled', danger: 'Danger' }

function StatesSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {STATES.map(state => (
        <DocCard key={state}>
          <CardHeader label={STATE_LABEL[state]} />
          <div>
            <ActionMenuItem
              state={state}
              icon={state === 'danger' ? 'trash-outline' : 'edit-outline'}
              label={state === 'danger' ? 'Delete account' : 'Edit profile'}
            />
          </div>
        </DocCard>
      ))}
    </div>
  )
}

// ─── Section: Action menu (full list) ───────────────────────────────────────

function ActionMenuSection() {
  return (
    <DocCard style={{ maxWidth: 360 }}>
      <CardHeader label="Action menu — full example" />
      <div>
        {DEMO_ITEMS.map((item, i) => (
          <div key={item.label}>
            <ActionMenuItem
              state={item.danger ? 'danger' : 'Default'}
              icon={item.icon}
              label={item.label}
            />
            {i < DEMO_ITEMS.length - 1 && (
              <div style={{ height: 1, backgroundColor: 'var(--border-subtle)', margin: '0 16px' }} />
            )}
          </div>
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
