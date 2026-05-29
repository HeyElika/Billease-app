import { ICONS } from './index'

const SIZES = { xs: 16, sm: 20, md: 24, lg: 32, xl: 40, '2xl': 48 }

export default function BilleaseIcon({ name, size = 'sm', color = 'currentColor', style, ...rest }) {
  const px = SIZES[size] ?? SIZES.sm
  const paths = ICONS[name]

  if (!paths) {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: 10,
        fontFamily: 'monospace',
        color: 'var(--text-primary)',
        border: '1px solid var(--text-primary)',
        borderRadius: 4,
        padding: '1px 4px',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        ...style,
      }}>
        Missing icon: {name}
      </span>
    )
  }

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, ...style }}
      {...rest}
    >
      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          fill={color}
          fillRule={p.fillRule}
          clipRule={p.clipRule}
        />
      ))}
    </svg>
  )
}
