/**
 * Shared documentation primitives for Motion pattern pages.
 *
 * Every pattern under /motion uses these, so the pages stay visually identical
 * to each other and to the component docs pages.
 */

import { Fragment } from 'react'
import BilleaseIcon from '../../assets/icons/BilleaseIcon'

export function DocSection({ id, title, children }) {
  return (
    <section id={id} style={{ marginBottom: 72 }}>
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

/**
 * CardHeader — the label bar on a doc card.
 *
 * `action` renders on the right of the bar. Every motion demo puts its replay
 * control here rather than beside the example, so the stage below stays clean.
 */
export function CardHeader({ label, action }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      minHeight: action ? 48 : 0,
      padding: action ? '8px 12px 8px 16px' : '10px 16px',
      borderBottom: '1px solid var(--border-subtle)',
      backgroundColor: 'var(--bg-subtle)',
    }}>
      <span style={{ fontFamily: 'var(--font-family)', fontSize: 12, fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
        {label}
      </span>
      {action ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          {action}
        </div>
      ) : null}
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

/** DemoStage — centres a live example inside a doc card. */
export function DemoStage({ children, style }) {
  return (
    <div style={{
      padding: '40px 28px',
      backgroundColor: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    }}>
      {children}
    </div>
  )
}

/**
 * DemoCard — the standard shape for a motion demo: a labelled bar carrying the
 * replay control, over a centred stage. Every motion pattern uses this so the
 * demos stay comparable.
 */
export function DemoCard({ label, action, children, stageStyle }) {
  return (
    <DocCard>
      <CardHeader label={label} action={action} />
      <DemoStage style={stageStyle}>{children}</DemoStage>
    </DocCard>
  )
}

/**
 * ReplayButton — the replay control on a motion demo.
 *
 * Portal chrome, not a design-system component. It matches Button
 * secondary/sm exactly (32px tall, 12px horizontal padding, 8px gap,
 * --radius-full, --bg-sunken on --text-base, 14px semibold) but carries a
 * leading icon, which the DS Button cannot do: its iconLeft slot is hardcoded
 * to arrow-left. Logged as a missing variant rather than modifying Button.
 *
 * Icon is solar:refresh-linear, taken verbatim from the Iconify Solar set.
 */
export function ReplayButton({ onClick, label = 'Replay' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: 32,
        padding: '0 12px',
        border: 'none',
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--bg-sunken)',
        color: 'var(--text-base)',
        fontFamily: 'var(--ds-font-family)',
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 1.5,
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      <RefreshIcon />
      <span>{label}</span>
    </button>
  )
}

/** solar:refresh-linear — exact paths from the Iconify Solar set, not redrawn. */
function RefreshIcon({ size = 16 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ flexShrink: 0, display: 'block' }}
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
        <path d="M3.67981 13L3.67981 11.3333C3.67981 6.73096 7.4402 3 12.0789 3C15.1178 3 17.7799 4.60136 19.2545 7M2 11.3333L3.67981 13L5.35962 11.3333" />
        <path d="M20.3139 11V12.6667C20.3139 17.269 16.5391 21 11.8827 21C8.83213 21 6.15995 19.3986 4.67969 17M22.0001 12.6667L20.3139 11L18.6277 12.6667" />
      </g>
    </svg>
  )
}

/**
 * Two-column table of rule name and description.
 *
 * Wraps itself in a DocCard by default. Pass `bare` when it already sits inside
 * one, or the two borders and radii stack and show as a doubled edge.
 */
export function RuleTable({ rows, labelWidth = 240, bare = false }) {
  const Wrap = bare ? Fragment : DocCard
  return (
    <Wrap>
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
    </Wrap>
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
