/**
 * TabItem — Billease Design System
 * Source: Figma node 43:2261 (tab/item), file qESeTFW1GEEosrYnm4Hu3b
 * Variants: type=text|logo × size=md|sm × state=default|active|disabled × On-dark=False|True
 *           plus a `badge` boolean on the on-dark text tab
 *
 * Figma pairs the axes: md tabs sit on light surfaces, sm tabs on dark ones.
 *   md (light)  h 48, px spacing/400 (16px), py 10
 *               default  text/subtle          active  text/active + 3px border/active underline
 *               disabled icon/disabled        logo    51x24 mark, 60% opacity when disabled
 *   sm (dark)   h 32, px spacing/200 (8px), py 10
 *               default  text/on-dark-subtle  active  text/on-dark + 1px border/on-dark underline
 *               disabled icon/on-dark-disabled
 *   badge       bg/primary pill, radius-sm, h 22, 11px semibold on text/on-dark
 */

const LIGHT_TEXT = {
  default:  'var(--text-subtle)',
  active:   'var(--text-active)',
  disabled: 'var(--icon-disabled)',
}

const DARK_TEXT = {
  default:  'var(--text-on-dark-subtle)',
  active:   'var(--text-on-dark)',
  disabled: 'var(--icon-on-dark-disabled)',
}

export default function TabItem({
  label = 'Tab',
  type = 'text',          // text | logo
  size = 'md',            // md (light) | sm (on-dark)
  state = 'default',      // default | active | disabled
  onDark = false,
  badge = false,
  badgeLabel = 'NEW',
  logo,                   // element rendered in place of the label for type="logo"
  onClick,
}) {
  const isActive = state === 'active'
  const isDisabled = state === 'disabled'
  const color = (onDark ? DARK_TEXT : LIGHT_TEXT)[state] ?? LIGHT_TEXT.default

  const underline = isActive
    ? (onDark
        ? `var(--border-width-100) solid var(--border-on-dark)`
        : `var(--border-width-300) solid var(--border-active)`)
    : 'none'

  return (
    <div
      onClick={!isDisabled && onClick ? onClick : undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isActive && onDark ? 10 : 'var(--space-100)',
        height: onDark ? 32 : 48,
        padding: onDark ? '10px var(--space-200)' : '10px var(--space-400)',
        borderBottom: underline,
        opacity: isDisabled && type === 'logo' ? 0.6 : 1,
        cursor: !isDisabled && onClick ? 'pointer' : 'default',
      }}
    >
      {type === 'logo' ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 51, height: 24 }}>
          {logo}
        </div>
      ) : (
        <span style={{
          fontFamily: 'var(--ds-font-family)',
          fontSize: 'var(--text-lg)',
          fontWeight: 600,
          lineHeight: 1.5,
          textAlign: 'center',
          whiteSpace: 'nowrap',
          color,
        }}>
          {label}
        </span>
      )}

      {badge && type === 'text' && state === 'default' && onDark && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 22,
          padding: 'var(--space-100) var(--space-200)',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--bg-primary)',
        }}>
          <span style={{
            fontFamily: 'var(--ds-font-family)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            lineHeight: 1.25,
            color: 'var(--text-on-dark)',
            whiteSpace: 'nowrap',
          }}>
            {badgeLabel}
          </span>
        </div>
      )}
    </div>
  )
}
