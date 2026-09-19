/**
 * DocKit — shared documentation primitives for Explorer component pages.
 *
 * Every DS docs page uses these containers. Never introduce a different preview
 * container or a bespoke grey background: the card chrome is part of the portal
 * pattern, not per-page styling.
 */

import { CHANGELOGS } from '../../data/changelog'

export function DocSection({ id, title, children }) {
  return (
    <section id={id} style={{ marginBottom: 56 }}>
      <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 20, fontWeight: 700, color: 'var(--text-base)', margin: '0 0 20px' }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

export function DocCard({ children, style }) {
  return (
    <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 8, overflow: 'hidden', ...style }}>
      {children}
    </div>
  )
}

export function CardHeader({ label }) {
  return (
    <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)' }}>
      <span style={{ fontFamily: 'var(--font-family)', fontSize: 12, fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
        {label}
      </span>
    </div>
  )
}

export function CardBody({ children, style }) {
  return (
    <div style={{ padding: '28px 32px', display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap', backgroundColor: '#fff', ...style }}>
      {children}
    </div>
  )
}

/** A single labelled preview cell — the caption is the Figma variant value. */
export function PreviewCell({ label, children, width }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start', minWidth: width ?? 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', minHeight: 32 }}>{children}</div>
      {label && (
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-subtle)' }}>{label}</span>
      )}
    </div>
  )
}

export function PropsTable({ rows = [] }) {
  if (rows.length === 0) return null
  return (
    <DocCard>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--bg-subtle)' }}>
            {['Prop', 'Type', 'Default', 'Description'].map(h => (
              <th key={h} style={{ padding: '7px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-family)', color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.name} style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
              <td style={{ padding: '10px 16px', fontSize: 12, fontFamily: 'monospace', color: 'var(--text-base)', whiteSpace: 'nowrap' }}>{row.name}</td>
              <td style={{ padding: '10px 16px', fontSize: 12, fontFamily: 'monospace', color: 'var(--text-subtle)' }}>{row.type}</td>
              <td style={{ padding: '10px 16px', fontSize: 12, fontFamily: 'monospace', color: 'var(--text-subtle)', whiteSpace: 'nowrap' }}>{row.default ?? '—'}</td>
              <td style={{ padding: '10px 16px', fontSize: 13, fontFamily: 'var(--font-family)', color: 'var(--text-base)', lineHeight: 1.5 }}>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DocCard>
  )
}

const CHANGE_TYPE = {
  removed:    { label: 'Removed',    bg: 'var(--bg-error-subtle)',   color: 'var(--text-primary)'   },
  added:      { label: 'Added',      bg: '#E6F4EA',                  color: '#1E6B3A'               },
  updated:    { label: 'Updated',    bg: '#EBF3FF',                  color: 'var(--text-secondary)' },
  deprecated: { label: 'Deprecated', bg: '#FFF7E6',                  color: 'var(--text-warning)'   },
}

export function ChangelogSection({ nodeId }) {
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
