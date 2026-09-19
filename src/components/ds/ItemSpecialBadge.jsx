/**
 * ItemSpecialBadge — Billease Design System
 * Source: Figma node 220:10713 (badge/item-special), file qESeTFW1GEEosrYnm4Hu3b
 * Variants: type=limit-boost | Recommended
 *
 * Figma specs:
 *   width        110px, clipped
 *   padding      spacing/400 (16px) horizontal
 *   limit-boost  bg/primary, py spacing/100 (4px), radius 12px on top-left + bottom-right,
 *                body/body-sm-semibold (14px / 600) on text/on-dark
 *   Recommended  bg/selected, fixed 24px height, radius 12px on top-right + bottom-left,
 *                body/body-xs-regular (13px / 400) on text/base
 */

const TYPES = {
  'limit-boost': {
    label: 'Limit Boost™',
    background: 'var(--bg-primary)',
    color: 'var(--text-on-dark)',
    fontSize: 'var(--text-md)',
    fontWeight: 600,
    borderRadius: 'var(--radius-lg) 0 var(--radius-lg) 0',
    padding: 'var(--space-100) var(--space-400)',
    alignItems: 'flex-start',
  },
  'recommended': {
    label: 'Recommended',
    background: 'var(--bg-selected)',
    color: 'var(--text-base)',
    fontSize: 'var(--text-sm)',
    fontWeight: 400,
    borderRadius: '0 var(--radius-lg) 0 var(--radius-lg)',
    padding: '0 var(--space-400)',
    alignItems: 'center',
    height: 24,
  },
}

export default function ItemSpecialBadge({ type = 'limit-boost', label }) {
  const key = String(type ?? '').trim().toLowerCase()
  const spec = TYPES[key] ?? TYPES['limit-boost']

  return (
    <div style={{
      display: 'flex',
      width: 110,
      overflow: 'hidden',
      alignItems: spec.alignItems,
      height: spec.height,
      padding: spec.padding,
      borderRadius: spec.borderRadius,
      backgroundColor: spec.background,
    }}>
      <span style={{
        fontFamily: 'var(--ds-font-family)',
        fontSize: spec.fontSize,
        fontWeight: spec.fontWeight,
        lineHeight: 1.5,
        color: spec.color,
        whiteSpace: 'nowrap',
      }}>
        {label ?? spec.label}
      </span>
    </div>
  )
}
