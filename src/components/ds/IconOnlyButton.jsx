/**
 * IconOnlyButton — Billease Design System
 * Source: Figma node 11079:2004, file qESeTFW1GEEosrYnm4Hu3b
 *
 * Types: secondary | ghost
 * Size: 40×40px fixed
 * Corner radius: 12px
 * Icon: home-outline (20px)
 */
import BilleaseIcon from '../../assets/icons/BilleaseIcon'

const SIZE   = 40
const RADIUS = 12

const SPECS = {
  secondary: {
    default:  { bg: 'var(--bg-sunken)',  overlay: null,                icon: 'var(--text-base)'      },
    active:   { bg: 'var(--bg-sunken)',  overlay: 'rgba(0,0,0,0.30)', icon: 'var(--text-base)'      },
    pressed:  { bg: 'var(--bg-sunken)',  overlay: 'rgba(0,0,0,0.50)', icon: 'var(--text-base)'      },
    disabled: { bg: 'var(--bg-sunken)',  overlay: 'rgba(0,0,0,0.10)', icon: 'var(--text-disabled)'  },
    loading:  { bg: 'var(--bg-sunken)',  overlay: null,                icon: 'var(--text-base)'      },
  },
  ghost: {
    default:  { bg: 'transparent', overlay: null, icon: 'var(--text-subtle)'   },
    active:   { bg: 'transparent', overlay: null, icon: 'var(--text-base)'     },
    pressed:  { bg: 'transparent', overlay: null, icon: 'var(--text-base)'     },
    disabled: { bg: 'transparent', overlay: null, icon: 'var(--text-disabled)' },
  },
}

function Spinner({ color }) {
  const r = 8.25
  const circ = 2 * Math.PI * r
  const arc  = circ * 0.255
  return (
    <svg
      width="20" height="20" viewBox="0 0 20 20"
      style={{ animation: 'icon-btn-spin 0.8s linear infinite', display: 'block' }}
    >
      <circle
        cx="10" cy="10" r={r}
        fill="none" stroke={color} strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray={`${arc.toFixed(2)} ${(circ - arc).toFixed(2)}`}
        transform="rotate(-90 10 10)"
      />
    </svg>
  )
}

export default function IconOnlyButton({
  type  = 'secondary',   // secondary | ghost
  state = 'default',     // default | active | pressed | disabled | loading
  onClick,
}) {
  const spec = SPECS[type]?.[state]
  if (!spec) return null

  const isDisabled = state === 'disabled'
  const isLoading  = state === 'loading'

  const bg = spec.overlay
    ? `linear-gradient(${spec.overlay}, ${spec.overlay}), ${spec.bg}`
    : spec.bg

  return (
    <>
      <style>{`@keyframes icon-btn-spin { to { transform: rotate(360deg); } }`}</style>
      <button
        disabled={isDisabled || isLoading}
        onClick={onClick}
        style={{
          display:         'inline-flex',
          alignItems:      'center',
          justifyContent:  'center',
          width:           SIZE,
          height:          SIZE,
          borderRadius:    RADIUS,
          background:      bg,
          border:          'none',
          outline:         'none',
          cursor:          isDisabled ? 'not-allowed' : 'pointer',
          flexShrink:      0,
          transition:      'background 0.15s',
        }}
      >
        {isLoading
          ? <Spinner color={spec.icon} />
          : <BilleaseIcon name="home-outline" size="sm" color={spec.icon} />
        }
      </button>
    </>
  )
}
