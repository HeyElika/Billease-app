/**
 * RadioButton — Billease Design System
 * Source: Figma node 188:2593 (radio-button), file qESeTFW1GEEosrYnm4Hu3b
 * Variants: size=md|sm × state=default|selected × Disabled=False|True
 *
 * Figma specs:
 *   md            24x24, 2px border, radius-full
 *   sm            20x20, 1.667px border, radius-full
 *   default       border/bold #919191
 *   selected      bg/primary fill with a centred white dot (1/3 of the box)
 *   disabled      the same visual at 50% opacity
 */

const SIZES = {
  md: { box: 24, border: 'var(--border-width-200)', dot: 8 },
  sm: { box: 20, border: '1.667px',                 dot: 6.67 },
}

export default function RadioButton({
  size = 'md',           // md | sm
  state = 'default',     // default | selected
  disabled = false,
  onClick,
}) {
  const dims = SIZES[size] ?? SIZES.md
  const isSelected = state === 'selected'

  return (
    <div
      onClick={!disabled && onClick ? onClick : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: dims.box,
        height: dims.box,
        flexShrink: 0,
        borderRadius: 'var(--radius-full)',
        opacity: disabled ? 0.5 : 1,
        cursor: !disabled && onClick ? 'pointer' : 'default',
        backgroundColor: isSelected ? 'var(--bg-primary)' : 'transparent',
        border: isSelected ? 'none' : `${dims.border} solid var(--border-bold)`,
      }}
    >
      {isSelected && (
        <div style={{
          width: dims.dot,
          height: dims.dot,
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--bg-base)',
        }} />
      )}
    </div>
  )
}
