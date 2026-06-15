/**
 * ActionMenuItem (action-menu/item) — Billease Design System
 * Source: Figma node 11079:2976, file qESeTFW1GEEosrYnm4Hu3b
 *
 * COMPONENT_SET properties:
 *   state   VARIANT   Default | disabled | danger
 */
import BilleaseIcon from '../../assets/icons/BilleaseIcon'

const SPECS = {
  Default:  { text: 'var(--text-base)',     icon: 'var(--icon-base)',     bg: '#fff' },
  disabled: { text: 'var(--text-disabled)', icon: 'var(--text-disabled)', bg: '#fff' },
  danger:   { text: 'var(--text-primary)',  icon: 'var(--text-primary)',  bg: '#fff' },
}

// Chevron right arrow (12×12)
function ChevronRight({ color }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <path d="M4.5 2.5L8 6L4.5 9.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function ActionMenuItem({
  state = 'Default',        // Default | disabled | danger
  icon = 'edit-outline',    // any BilleaseIcon name
  label = 'Action',
  showChevron = false,
  onClick,
}) {
  const spec = SPECS[state] ?? SPECS.Default
  const isDisabled = state === 'disabled'

  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        padding: '14px 16px',
        border: 'none',
        backgroundColor: spec.bg,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        textAlign: 'left',
        outline: 'none',
      }}
    >
      <BilleaseIcon name={icon} size="md" color={spec.icon} />
      <span style={{
        flex: 1,
        fontFamily: 'var(--font-family)',
        fontSize: 15,
        fontWeight: 400,
        lineHeight: '22px',
        color: spec.text,
      }}>
        {label}
      </span>
      {showChevron && <ChevronRight color={spec.icon} />}
    </button>
  )
}
