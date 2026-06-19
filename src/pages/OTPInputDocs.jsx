import OTPInput, { OTPCell } from '../components/ds/OTPInput'
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

// ─── Section 1: States (individual cells) ─────────────────────────────────────

const CELL_STATES = ['default', 'focused', 'filled', 'success', 'error', 'masked', 'disabled']
const CELL_STATE_LABEL = {
  default:  'Default',
  focused:  'Focused',
  filled:   'Filled',
  success:  'Success',
  error:    'Error',
  masked:   'Masked',
  disabled: 'Disabled',
}

const CELL_STATE_VALUES = {
  default:  '',
  focused:  '',
  filled:   '4',
  success:  '4',
  error:    '4',
  masked:   '',
  disabled: '',
}

function StatesSection() {
  return (
    <DocCard>
      <CardHeader label="All cell states" />
      <CardBody>
        {CELL_STATES.map(state => (
          <div key={state} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <OTPCell state={state} value={CELL_STATE_VALUES[state]} />
            <span style={{
              fontFamily: 'var(--font-family)',
              fontSize: 11,
              color: 'var(--text-subtle)',
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
              whiteSpace: 'nowrap',
            }}>
              {CELL_STATE_LABEL[state]}
            </span>
          </div>
        ))}
      </CardBody>
    </DocCard>
  )
}

// ─── Section 2: Types ─────────────────────────────────────────────────────────

const TYPES = ['PIN', 'OTP-email', 'OTP-mobile', 'code']
const TYPE_LABEL = {
  'PIN':        'PIN (4 cells)',
  'OTP-email':  'OTP — Email (6 cells)',
  'OTP-mobile': 'OTP — Mobile (4 cells)',
  'code':       'Code (8 cells, compact)',
}

const TYPE_VALUES = {
  'PIN':        ['1', '2', '', ''],
  'OTP-email':  ['1', '2', '3', '', '', ''],
  'OTP-mobile': ['1', '2', '', ''],
  'code':       ['A', 'B', 'C', '1', '', '', '', ''],
}

function TypesSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {TYPES.map(type => (
        <DocCard key={type}>
          <CardHeader label={TYPE_LABEL[type]} />
          <CardBody>
            <OTPInput
              type={type}
              values={TYPE_VALUES[type]}
              focusedIndex={TYPE_VALUES[type].findIndex(v => !v)}
            />
          </CardBody>
        </DocCard>
      ))}
    </div>
  )
}

// ─── Section 3: Group states (Figma node 188:3115) ────────────────────────────

const GROUP_EXAMPLES = [
  {
    label: 'Default — entering code',
    values: ['3', '7', '', '', '', ''],
    focusedIndex: 2,
    showError: false,
    errorMessage: '',
  },
  {
    label: 'Error — incorrect attempt',
    values: ['3', '7', '2', '9', '0', '1'],
    focusedIndex: undefined,
    showError: true,
    errorMessage: 'Incorrect code. Try again.',
  },
  {
    label: 'Blocked — too many attempts',
    values: ['5', '8', '2', '1', '3', '7'],
    focusedIndex: undefined,
    showError: true,
    errorMessage: 'Too many incorrect attempts',
  },
]

function GroupStatesSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {GROUP_EXAMPLES.map(ex => (
        <DocCard key={ex.label}>
          <CardHeader label={ex.label} />
          <CardBody>
            <OTPInput
              type="OTP-email"
              values={ex.values}
              focusedIndex={ex.focusedIndex}
              showError={ex.showError}
              errorMessage={ex.errorMessage}
            />
          </CardBody>
        </DocCard>
      ))}
    </div>
  )
}

// ─── Section 4: Changelog ─────────────────────────────────────────────────────

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

// ─── Main OTPInputDocs component ──────────────────────────────────────────────

export default function OTPInputDocs({ comp }) {
  const nodeId = comp?.id ?? '188:2882'
  return (
    <div style={{ fontFamily: 'var(--font-family)' }}>

      <DocSection id="states" title="States">
        <StatesSection />
      </DocSection>

      <DocSection id="types" title="Types">
        <TypesSection />
      </DocSection>

      <DocSection id="group-states" title="Group states">
        <GroupStatesSection />
      </DocSection>

      <DocSection id="changelog" title="Changelog">
        <ChangelogSection nodeId={nodeId} />
      </DocSection>

    </div>
  )
}
