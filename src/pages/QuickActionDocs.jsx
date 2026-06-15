import QuickActionItem from '../components/ds/QuickActionItem'
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
  { icon: 'installment-outline', label: 'Pay'       },
  { icon: 'auto-debit',          label: 'Auto-debit' },
  { icon: 'statement-outline',   label: 'Statement' },
  { icon: 'auto-renew',          label: 'Renew'     },
]

// ─── Section: States ────────────────────────────────────────────────────────

const STATES = ['Default', 'disabled']
const STATE_LABEL = { Default: 'Default', disabled: 'Disabled' }

function StatesSection() {
  return (
    <DocCard>
      <CardHeader label="All states" />
      <div style={{ padding: '28px 32px', display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {STATES.map(state => (
          <div key={state} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <QuickActionItem state={state} icon="installment-outline" label="Pay" />
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
      </div>
    </DocCard>
  )
}

// ─── Section: Quick action row ──────────────────────────────────────────────

function QuickActionRowSection() {
  return (
    <DocCard>
      <CardHeader label="Quick action row — full example" />
      <div style={{ padding: '24px 20px', display: 'flex', gap: 4, justifyContent: 'space-around' }}>
        {DEMO_ITEMS.map(item => (
          <QuickActionItem key={item.label} state="Default" icon={item.icon} label={item.label} />
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

export default function QuickActionDocs({ comp }) {
  const nodeId = comp?.id ?? '11079:851'
  return (
    <div style={{ fontFamily: 'var(--font-family)' }}>

      <DocSection id="states" title="States">
        <StatesSection />
      </DocSection>

      <DocSection id="quick-action" title="Quick action row">
        <QuickActionRowSection />
      </DocSection>

      <DocSection id="changelog" title="Changelog">
        <ChangelogSection nodeId={nodeId} />
      </DocSection>

    </div>
  )
}
