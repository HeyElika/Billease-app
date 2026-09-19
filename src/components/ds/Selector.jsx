/**
 * Selector — Billease Design System
 * Source: Figma node 98:707 (selector), file qESeTFW1GEEosrYnm4Hu3b
 * Variants: state=default | selected | selected/w-logo, with `logo` and `action` booleans
 *
 * Figma specs:
 *   container      w 320, bg/subtle, padding spacing/300 (12px), radius border/radius/lg (12px)
 *   default        40px product icon + underlined body/body-md-semibold "Select wallet"
 *   selected       body/body-md-regular title, "Change" link (link/link-md) pushed right
 *   w-logo         28px round logo on bg/base with a border/subtle ring, regular title,
 *                  optional pill button: bg/sunken, h 32, px spacing/300, radius-full,
 *                  body/body-sm-semibold label
 */

import BilleaseIcon from '../../assets/icons/BilleaseIcon'

export default function Selector({
  state = 'default',              // default | selected | selected/w-logo
  placeholder = 'Select wallet',
  title = 'Title',
  actionLabel = 'Change',
  action = true,
  logo = true,
  logoSrc,
  icon = 'wallet',
  onAction,
}) {
  const isWithLogo = state === 'selected/w-logo'
  const isSelected = state === 'selected'

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: state === 'default' ? 'flex-start' : 'space-between',
      gap: state === 'default' ? 'var(--space-300)' : 0,
      width: 320,
      padding: 'var(--space-300)',
      borderRadius: 'var(--radius-lg)',
      backgroundColor: 'var(--bg-subtle)',
      fontFamily: 'var(--ds-font-family)',
    }}>

      {state === 'default' && (
        <>
          <div style={{ width: 40, height: 40, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BilleaseIcon name={icon} size="lg" color="var(--icon-base)" />
          </div>
          <span style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 600,
            lineHeight: 1.5,
            color: 'var(--text-base)',
            textDecoration: 'underline',
            textUnderlineOffset: 2,
          }}>
            {placeholder}
          </span>
        </>
      )}

      {isSelected && (
        <>
          <span style={{ fontSize: 'var(--text-lg)', fontWeight: 400, lineHeight: 1.5, color: 'var(--text-base)' }}>
            {title}
          </span>
          <button
            onClick={onAction}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              fontFamily: 'var(--ds-font-family)',
              fontSize: 'var(--text-lg)',
              fontWeight: 600,
              lineHeight: 1.5,
              color: 'var(--text-base)',
              textDecoration: 'underline',
              textUnderlineOffset: 2,
              whiteSpace: 'nowrap',
              cursor: onAction ? 'pointer' : 'default',
            }}
          >
            {actionLabel}
          </button>
        </>
      )}

      {isWithLogo && (
        <>
          <div style={{ display: 'flex', flex: '1 0 0', minWidth: 0, gap: 'var(--space-200)', alignItems: 'center' }}>
            {logo && (
              <div style={{
                width: 28,
                height: 28,
                flexShrink: 0,
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-base)',
                border: 'var(--border-width-100) solid var(--border-subtle)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {logoSrc && <img src={logoSrc} alt="" style={{ width: 16, height: 16, objectFit: 'contain' }} />}
              </div>
            )}
            <span style={{ flex: '1 0 0', minWidth: 0, fontSize: 'var(--text-lg)', fontWeight: 400, lineHeight: 1.5, color: 'var(--text-base)' }}>
              {title}
            </span>
          </div>
          {action && (
            <button
              onClick={onAction}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-200)',
                height: 32,
                padding: '0 var(--space-300)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-sunken)',
                fontFamily: 'var(--ds-font-family)',
                fontSize: 'var(--text-md)',
                fontWeight: 600,
                lineHeight: 1.5,
                color: 'var(--text-base)',
                whiteSpace: 'nowrap',
                cursor: onAction ? 'pointer' : 'default',
              }}
            >
              {actionLabel}
            </button>
          )}
        </>
      )}
    </div>
  )
}
