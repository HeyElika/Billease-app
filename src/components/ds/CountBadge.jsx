/**
 * CountBadge — Billease Design System
 * Source: Figma node 8005:6802 (count-badge), file qESeTFW1GEEosrYnm4Hu3b
 * Variants: size=md|sm × type=neutral | overdue | pending | promise-to-pay | proof | upcoming | default sof
 *
 * Figma specs:
 *   md            28x28, number at body/body-md-semibold (16px / 600 / lh 1.5)
 *   sm            24x24, number at body/body-xxs-semibold (11px / 600 / lh 1.25)
 *   radius        border/radius/md (8px)
 *   neutral       bg/sunken       + text/base
 *   overdue       bg/error-bold   + text/error
 *   promise-to-pay bg/warning-bold + text/warning
 *   upcoming      bg/success-bold + text/success
 *   pending       bg/info-bold    + text/active
 *   proof         bg/info-bold    + text/base
 *   default sof   bg/success-bold + 20px icon instead of a count
 */

import BilleaseIcon from '../../assets/icons/BilleaseIcon'

const TYPES = {
  'neutral':        { bg: 'var(--bg-sunken)',       color: 'var(--text-base)'    },
  'overdue':        { bg: 'var(--bg-error-bold)',   color: 'var(--text-error)'   },
  'promise-to-pay': { bg: 'var(--bg-warning-bold)', color: 'var(--text-warning)' },
  'upcoming':       { bg: 'var(--bg-success-bold)', color: 'var(--text-success)' },
  'pending':        { bg: 'var(--bg-info-bold)',    color: 'var(--text-active)'  },
  'proof':          { bg: 'var(--bg-info-bold)',    color: 'var(--text-base)'    },
  'default-sof':    { bg: 'var(--bg-success-bold)', color: 'var(--text-base)'    },
}

const SIZES = {
  md: { box: 28, fontSize: 'var(--text-lg)',  lineHeight: 1.5  },
  sm: { box: 24, fontSize: 'var(--text-xxs)', lineHeight: 1.25 },
}

export default function CountBadge({
  type = 'neutral',
  size = 'md',
  count = 2,
  icon = 'cash',
}) {
  const key = String(type ?? '').trim().toLowerCase().replace(/\s+/g, '-')
  const tone = TYPES[key] ?? TYPES.neutral
  const dims = SIZES[size] ?? SIZES.md
  const isIconType = key === 'default-sof'

  return (
    <div style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: dims.box,
      height: dims.box,
      borderRadius: 'var(--radius-md)',
      backgroundColor: tone.bg,
      flexShrink: 0,
    }}>
      {isIconType ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
          width: 20,
          height: 20,
        }}>
          <BilleaseIcon name={icon} size="sm" color="var(--icon-success-bold)" />
        </div>
      ) : (
        <span style={{
          fontFamily: 'var(--ds-font-family)',
          fontSize: dims.fontSize,
          fontWeight: 600,
          lineHeight: dims.lineHeight,
          color: tone.color,
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}>
          {count}
        </span>
      )}
    </div>
  )
}

export const COUNT_BADGE_TYPES = Object.keys(TYPES)
export const COUNT_BADGE_SIZES = Object.keys(SIZES)
