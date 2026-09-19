/**
 * StatusBadge — Billease Design System
 * Source: Figma node 8720:535 (status-badge), file qESeTFW1GEEosrYnm4Hu3b
 * Variants: type=Grace on | Ready | Due | Overdue
 *
 * Figma specs:
 *   padding      spacing/200 (8px) horizontal, spacing/100 (4px) vertical
 *   radius       border/radius/md (8px)
 *   typography   body/body-xs-semibold — 13px / 600 / lh 1.5
 *   grace-on     bg/success-bold + text/success
 *   ready        bg/info-bold    + text/info
 *   due          bg/warning-bold + text/warning
 *   overdue      bg/error-bold   + text/error
 */

const TYPES = {
  'grace-on': { bg: 'var(--bg-success-bold)', color: 'var(--text-success)' },
  'ready':    { bg: 'var(--bg-info-bold)',    color: 'var(--text-info)'    },
  'due':      { bg: 'var(--bg-warning-bold)', color: 'var(--text-warning)' },
  'overdue':  { bg: 'var(--bg-error-bold)',   color: 'var(--text-error)'   },
}

// Figma variant values ("Grace on") and code values ("grace-on") both resolve.
export function normalizeStatusType(type) {
  return String(type ?? '').trim().toLowerCase().replace(/\s+/g, '-')
}

export default function StatusBadge({ type = 'grace-on', label = 'Due May 31' }) {
  const key = normalizeStatusType(type)
  const tone = TYPES[key] ?? TYPES['grace-on']

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-100) var(--space-200)',
      borderRadius: 'var(--radius-md)',
      backgroundColor: tone.bg,
      color: tone.color,
      fontFamily: 'var(--ds-font-family)',
      fontSize: 'var(--text-sm)',
      fontWeight: 600,
      lineHeight: 1.5,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </div>
  )
}

export const STATUS_BADGE_TYPES = Object.keys(TYPES)

export const STATUS_BADGE_SAMPLE_LABEL = {
  'grace-on': 'Due May 31',
  'ready':    'Ready to use',
  'due':      'Due in 2 days',
  'overdue':  'Overdue',
}
