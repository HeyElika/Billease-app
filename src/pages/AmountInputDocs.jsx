import AmountInput from '../components/ds/AmountInput'
import { CHANGELOGS } from '../data/changelog'

// ─── Shared layout helpers ─────────────────────────────────────────────────────

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
      gap: 32,
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      backgroundColor: '#fff',
      ...style,
    }}>
      {children}
    </div>
  )
}

// ─── State label map ───────────────────────────────────────────────────────────

const STATES = ['default', 'focused', 'typing', 'filled', 'error', 'success']
const STATE_LABEL = {
  default: 'Default',
  focused: 'Focused',
  typing:  'Typing',
  filled:  'Filled',
  error:   'Error',
  success: 'Success',
}

// ─── Section 1: States ────────────────────────────────────────────────────────

function StatesSection() {
  return (
    <DocCard>
      <CardHeader label="All states" />
      <CardBody>
        {STATES.map(state => (
          <div key={state} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <AmountInput state={state} />
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
  )
}

// ─── Section 2: Changelog ─────────────────────────────────────────────────────

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
        <CardBody>
          <span style={{ fontFamily: 'var(--font-family)', fontSize: 13, color: 'var(--text-subtle)' }}>
            No changes recorded yet.
          </span>
        </CardBody>
      </DocCard>
    )
  }

  return (
    <DocCard>
      <div style={{ backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden' }}>
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
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => {
              const t = CHANGE_TYPE[entry.type] ?? CHANGE_TYPE.updated
              return (
                <tr key={i} style={{ borderBottom: i < entries.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <td style={{ padding: '10px 16px', fontSize: 12, fontFamily: 'monospace', color: 'var(--text-subtle)', whiteSpace: 'nowrap' }}>
                    {entry.date}
                  </td>
                  <td style={{ padding: '10px 16px', whiteSpace: 'nowrap' }}>
                    <span style={{
                      display: 'inline-flex',
                      padding: '2px 10px',
                      borderRadius: 9999,
                      backgroundColor: t.bg,
                      color: t.color,
                      fontSize: 11,
                      fontWeight: 600,
                      fontFamily: 'var(--font-family)',
                    }}>
                      {t.label}
                    </span>
                  </td>
                  <td style={{ padding: '10px 16px', fontSize: 13, fontFamily: 'var(--font-family)', color: 'var(--text-base)', lineHeight: 1.5 }}>
                    {entry.description}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </DocCard>
  )
}

// ─── Main AmountInputDocs component ───────────────────────────────────────────

export default function AmountInputDocs({ comp }) {
  const nodeId = comp?.id ?? '51:1615'
  return (
    <div style={{ fontFamily: 'var(--font-family)' }}>

      <DocSection id="states" title="States">
        <StatesSection />
      </DocSection>

      <DocSection id="changelog" title="Changelog">
        <ChangelogSection nodeId={nodeId} />
      </DocSection>

    </div>
  )
}
