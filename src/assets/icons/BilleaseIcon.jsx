import { ICONS } from './index'

const SIZES = { xs: 16, sm: 20, md: 24, lg: 32, xl: 40, '2xl': 48 }

export default function BilleaseIcon({ name, size = 'sm', color = 'currentColor', style, ...rest }) {
  const px = SIZES[size] ?? SIZES.sm
  const iconDef = ICONS[name]

  if (!iconDef) {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: 10,
        fontFamily: 'monospace',
        color: 'var(--text-subtle)',
        border: '1px dashed var(--border-default)',
        borderRadius: 4,
        padding: '1px 4px',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        ...style,
      }}>
        {name}
      </span>
    )
  }

  // Support both legacy array format (24×24 viewBox) and { viewBox, paths } object format
  const paths = Array.isArray(iconDef) ? iconDef : (iconDef.paths ?? [])
  const vBox = Array.isArray(iconDef) ? '0 0 24 24' : (iconDef.viewBox ?? '0 0 24 24')

  return (
    <svg
      width={px}
      height={px}
      viewBox={vBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, display: 'block', ...style }}
      {...rest}
    >
      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          fill={p.fill ?? color}
          fillRule={p.fillRule}
          clipRule={p.clipRule}
        />
      ))}
    </svg>
  )
}
