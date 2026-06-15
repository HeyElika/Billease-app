/**
 * ActionMenuItem (action-menu/item) — Billease Design System
 * Source: Figma node 11079:2976, file qESeTFW1GEEosrYnm4Hu3b
 *
 * COMPONENT_SET properties:
 *   state              VARIANT   Default | disabled | danger
 *   Show arrow         BOOLEAN   default: true  — chevron xs (16px) on right
 *   Show Description   BOOLEAN   default: false — 13px subtitle below label
 *
 * Layout: 320px fixed width × 60px fixed height
 * Direction: HORIZONTAL, SPACE_BETWEEN, CENTER
 * Left gap (icon → text): 12px
 * No horizontal padding on item itself
 */
import BilleaseIcon from '../../assets/icons/BilleaseIcon'

// VariableID:4:1423 → text-base (#1D2D40)
// VariableID:5:17  → text-subtle (#606C79)
// VariableID:5:21  → text-disabled (#B4BDC5)
// VariableID:5:39  → #F84040 (text-error / danger)
// VariableID:5:62  → icon color Default  = text-base
// VariableID:5:61  → icon color disabled = text-disabled

const SPECS = {
  Default:  { label: 'var(--text-base)',     icon: 'var(--icon-base)'    },
  disabled: { label: 'var(--text-disabled)', icon: 'var(--text-disabled)' },
  danger:   { label: '#F84040',              icon: '#F84040'              },
}

// Chevron > arrow — xs (12×12 path inside 16×16 container)
function ChevronRight({ color }) {
  return (
    <div style={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M4 2.5L7.5 6L4 9.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  )
}

export default function ActionMenuItem({
  state       = 'Default',          // Default | disabled | danger
  icon        = 'start-outline',    // any BilleaseIcon name
  label       = 'Label',
  description = '',                  // optional subtitle text
  showArrow   = true,
  showDescription = false,
  onClick,
}) {
  const spec = SPECS[state] ?? SPECS.Default
  const isDisabled = state === 'disabled'

  return (
    <div
      role="button"
      onClick={isDisabled ? undefined : onClick}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 60,
        gap: 12,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        backgroundColor: 'transparent',
        flexShrink: 0,
      }}
    >
      {/* Left: icon + text */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
        minWidth: 0,
      }}>
        {/* icon-placeholder: 24×24 frame, 2px internal padding → 20px visual icon */}
        <div style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <BilleaseIcon name={icon} size="sm" color={spec.icon} />
        </div>

        {/* Text stack */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-family)',
            fontSize: 16,
            fontWeight: 400,
            lineHeight: '24px',
            color: spec.label,
          }}>
            {label}
          </span>
          {showDescription && description && (
            <span style={{
              fontFamily: 'var(--font-family)',
              fontSize: 13,
              fontWeight: 400,
              lineHeight: '19.5px',
              color: isDisabled ? 'var(--text-disabled)' : 'var(--text-subtle)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}>
              {description}
            </span>
          )}
        </div>
      </div>

      {/* Right: chevron arrow (xs, 16×16) */}
      {showArrow && <ChevronRight color={spec.icon} />}
    </div>
  )
}
