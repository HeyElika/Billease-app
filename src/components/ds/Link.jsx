/**
 * Link — Billease Design System
 * Source: Figma node 190:3261 (link), file qESeTFW1GEEosrYnm4Hu3b
 * Variants: size=md|sm × state=default|active|disabled
 *
 * Figma specs:
 *   md: fontSize=16, fontWeight=600, textDecoration=underline
 *   sm: fontSize=14, fontWeight=600, textDecoration=underline
 *   default/active: color=var(--text-base) #1D2D40
 *   disabled: color=var(--text-disabled) #B4BDC5
 */

import BilleaseIcon from '../../assets/icons/BilleaseIcon'

const FONT_SIZE = { md: 16, sm: 14 }
const TEXT_COLOR = {
  default:  'var(--text-base)',
  active:   'var(--text-base)',
  disabled: 'var(--text-disabled)',
}

export default function Link({
  label = 'Button',
  size = 'md',          // md | sm
  state = 'default',    // default | active | disabled
  showIcon = true,
  onClick,
}) {
  const isDisabled = state === 'disabled'
  const color = TEXT_COLOR[state] ?? TEXT_COLOR.default
  const fontSize = FONT_SIZE[size] ?? FONT_SIZE.md

  return (
    <button
      disabled={isDisabled}
      onClick={!isDisabled ? onClick : undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: isDisabled ? 'default' : 'pointer',
        fontFamily: 'var(--ds-font-family)',
        fontSize,
        fontWeight: 600,
        color,
        textDecoration: 'underline',
        textUnderlineOffset: 2,
      }}
    >
      {label}
      {showIcon && (
        <BilleaseIcon
          name="chevron-right"
          size="xs"
          color={color}
          style={{ flexShrink: 0 }}
        />
      )}
    </button>
  )
}
