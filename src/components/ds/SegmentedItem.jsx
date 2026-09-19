/**
 * SegmentedItem — Billease Design System
 * Source: Figma node 16:1573 (item), file qESeTFW1GEEosrYnm4Hu3b
 * Variants: state=default|active
 *
 * Figma specs:
 *   height       spacing/800 (32px), padding 10px / spacing/400 (16px)
 *   radius       radius-full
 *   typography   body/body-md-semibold (16px / 600 / lh 1.5)
 *   default      transparent fill, text/on-dark-subtle
 *   active       alpha-black 20% fill, text/on-dark
 *
 * Always sits on a dark surface.
 */

export default function SegmentedItem({ label = 'Item', state = 'default', onClick }) {
  const isActive = state === 'active'

  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'var(--space-800)',
        padding: '10px var(--space-400)',
        border: 'none',
        borderRadius: 'var(--radius-full)',
        backgroundColor: isActive ? 'var(--alpha-black-20)' : 'transparent',
        color: isActive ? 'var(--text-on-dark)' : 'var(--text-on-dark-subtle)',
        fontFamily: 'var(--ds-font-family)',
        fontSize: 'var(--text-lg)',
        fontWeight: 600,
        lineHeight: 1.5,
        whiteSpace: 'nowrap',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {label}
    </button>
  )
}
