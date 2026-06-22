import Alert from '../components/ds/Alert'
import { CHANGELOGS } from '../data/changelog'

// ─── Shared layout helpers (same as ButtonDocs / LinkDocs) ────────────────────

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

// ─── Changelog (same as ButtonDocs) ──────────────────────────────────────────

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
          <span style={{ fontFamily: 'var(--font-family)', fontSize: 13, color: 'var(--text-subtle)' }}>No changes recorded yet.</span>
        </CardBody>
      </DocCard>
    )
  }
  return (
    <DocCard>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--bg-subtle)' }}>
            {['Date', 'Type', 'Description'].map(h => (
              <th key={h} style={{ padding: '7px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-family)', color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' }}>
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

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AlertDocs({ comp }) {
  const nodeId = comp?.id ?? '228:11126'

  return (
    <div style={{ fontFamily: 'var(--font-family)' }}>

      {/* ── Appearance ── */}
      <DocSection id="appearance" title="Appearance">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <DocCard>
            <CardHeader label="Critical" />
            <CardBody style={{ flexDirection: 'column', gap: 0 }}>
              <Alert type="critical" message="Your account has been locked after too many failed attempts." />
            </CardBody>
          </DocCard>
          <DocCard>
            <CardHeader label="Success" />
            <CardBody style={{ flexDirection: 'column', gap: 0 }}>
              <Alert type="success" message="Your email address has been verified successfully." />
            </CardBody>
          </DocCard>
          <DocCard>
            <CardHeader label="Info" />
            <CardBody style={{ flexDirection: 'column', gap: 0 }}>
              <Alert type="info" message="Your application is under review. This usually takes 1–2 business days." />
            </CardBody>
          </DocCard>
          <DocCard>
            <CardHeader label="Warning" />
            <CardBody style={{ flexDirection: 'column', gap: 0 }}>
              <Alert type="warning" message="Make sure your details are correct before submitting." />
            </CardBody>
          </DocCard>
        </div>
      </DocSection>

      {/* ── Alignment ── */}
      <DocSection id="alignment" title="Alignment">
        <p style={{ margin: '0 0 20px', fontSize: 14, color: 'var(--text-subtle)', lineHeight: 1.6, fontFamily: 'var(--font-family)' }}>
          The icon automatically aligns based on text length. Single-line messages keep the icon vertically centered. Two or more lines lock the icon to the top.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <DocCard>
            <CardHeader label="Single line — icon centered" />
            <CardBody style={{ flexDirection: 'column', gap: 0 }}>
              <Alert type="info" message="Your code has been sent." />
            </CardBody>
          </DocCard>
          <DocCard>
            <CardHeader label="Multi-line — icon top-aligned" />
            <CardBody style={{ flexDirection: 'column', gap: 0 }}>
              <div style={{ maxWidth: 360 }}>
                <Alert type="warning" message="Your verification code has expired. Please request a new one and make sure to use it within the next 5 minutes." />
              </div>
            </CardBody>
          </DocCard>
        </div>
      </DocSection>

      {/* ── Props ── */}
      <DocSection id="props" title="Props">
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
                { name: 'type',     type: '"critical" | "success" | "info" | "warning"', def: '"info"', desc: 'Visual variant — controls background color and icon.' },
                { name: 'message',  type: 'string',     def: '—',      desc: 'Text content. Use this or children, not both.' },
                { name: 'children', type: 'ReactNode',  def: '—',      desc: 'Rich text content (bold, spans). Used when message is not set.' },
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
        <ChangelogSection nodeId={nodeId} />
      </DocSection>

    </div>
  )
}
