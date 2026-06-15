/**
 * QuickActionItem (quick-action/item) — Billease Design System
 * Source: Figma node 11079:718, file qESeTFW1GEEosrYnm4Hu3b
 *
 * COMPONENT_SET properties:
 *   state   VARIANT   Default | disabled
 */
import BilleaseIcon from '../../assets/icons/BilleaseIcon'

const SPECS = {
  Default:  { icon: 'var(--icon-base)',     text: 'var(--text-base)'     },
  disabled: { icon: 'var(--text-disabled)', text: 'var(--text-disabled)' },
}

export default function QuickActionItem({
  state = 'Default',          // Default | disabled
  icon = 'installment-outline',
  label = 'Pay',
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
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        width: 72,
        padding: '8px 4px',
        border: 'none',
        background: 'none',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        outline: 'none',
      }}
    >
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'var(--bg-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <BilleaseIcon name={icon} size="md" color={spec.icon} />
      </div>
      <span style={{
        fontFamily: 'var(--font-family)',
        fontSize: 12,
        fontWeight: 400,
        lineHeight: '16px',
        color: spec.text,
        textAlign: 'center',
        whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
    </button>
  )
}
