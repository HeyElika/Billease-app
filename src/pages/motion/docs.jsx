/**
 * Shared documentation primitives for Motion pattern pages.
 *
 * Every pattern under /motion uses these, so the pages stay visually identical
 * to each other and to the component docs pages.
 */

import BilleaseIcon from '../../assets/icons/BilleaseIcon'

export function DocSection({ id, title, children }) {
  return (
    <section id={id} style={{ marginBottom: 48 }}>
      <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 20, fontWeight: 700, color: 'var(--text-base)', margin: '0 0 16px' }}>
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
  return <div style={{ padding: '24px 28px', backgroundColor: '#fff', ...style }}>{children}</div>
}

export const P = ({ children, style }) => (
  <p style={{ margin: '0 0 16px', fontSize: 14, color: 'var(--text-subtle)', lineHeight: 1.6, fontFamily: 'var(--font-family)', maxWidth: '72ch', ...style }}>
    {children}
  </p>
)

/** Two-column table of rule name and description. */
export function RuleTable({ rows, labelWidth = 240 }) {
  return (
    <DocCard>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {rows.map((row, i, arr) => (
            <tr key={row[0]} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
              <td style={{ padding: '12px 16px', verticalAlign: 'top', width: labelWidth, fontFamily: 'var(--font-family)', fontSize: 13, fontWeight: 600, color: 'var(--text-base)' }}>{row[0]}</td>
              <td style={{ padding: '12px 16px', verticalAlign: 'top', fontFamily: 'var(--font-family)', fontSize: 13, lineHeight: 1.6, color: 'var(--text-subtle)' }}>{row[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DocCard>
  )
}

export function Swatch({ color }) {
  return (
    <span style={{
      display: 'inline-block', width: 12, height: 12, borderRadius: 3,
      backgroundColor: color, border: '1px solid var(--border-subtle)',
      verticalAlign: '-2px', marginRight: 8,
    }} />
  )
}

export function UsageList({ label, items, tone }) {
  return (
    <DocCard style={{ flex: 1, minWidth: 260 }}>
      <CardHeader label={label} />
      <CardBody style={{ padding: '16px 20px' }}>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map(item => (
            <li key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontFamily: 'var(--font-family)', fontSize: 13, lineHeight: 1.5, color: 'var(--text-base)' }}>
              <BilleaseIcon name={tone === 'use' ? 'tick' : 'close-mini'} size="xs" color={tone === 'use' ? 'var(--icon-base)' : 'var(--icon-subtle)'} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardBody>
    </DocCard>
  )
}

export function Note({ title, children }) {
  return (
    <div style={{ padding: '14px 16px', border: '1px solid var(--border-subtle)', borderRadius: 8, backgroundColor: 'var(--bg-subtle)' }}>
      <div style={{ fontFamily: 'var(--font-family)', fontSize: 13, lineHeight: 1.6, color: 'var(--text-subtle)' }}>
        <strong style={{ color: 'var(--text-base)', fontWeight: 600 }}>{title}</strong>{' '}
        {children}
      </div>
    </div>
  )
}

export function CodeBlock({ code }) {
  return (
    <pre style={{
      margin: 0, padding: '16px 20px', overflowX: 'auto',
      backgroundColor: 'var(--bg-subtle)', fontFamily: 'monospace',
      fontSize: 12.5, lineHeight: 1.65, color: 'var(--text-base)',
    }}>
      <code>{code}</code>
    </pre>
  )
}
