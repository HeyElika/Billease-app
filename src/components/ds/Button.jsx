/**
 * Button — Billease Design System
 * Source: Figma node 16:182, file qESeTFW1GEEosrYnm4Hu3b
 * All visual specs read directly from Figma. No invented values.
 */

// ─── Specs from Figma ────────────────────────────────────────────────────────

// absoluteBoundingBox.height per size
const HEIGHT = { lg: 48, md: 40, sm: 32 }

// paddingLeft / paddingRight per size (filled types only; ghost has no padding)
const PADDING_H = { lg: 20, md: 16, sm: 12 }

// text child style.fontSize per size
const FONT_SIZE = { lg: 16, md: 16, sm: 14 }

// itemSpacing: 8px for filled types, 4px for ghost types
const GAP = { filled: 8, ghost: 4 }

// cornerRadius: 9999 for all filled types; ghost has no background so radius is irrelevant
const RADIUS_FILLED = 'var(--radius-full)'  // 9999px

/**
 * Per-variant, per-state fill specs.
 * bg: base background (CSS background value — may be a gradient string or token)
 * overlay: second fill layer stacked on top (replicates Figma multi-fill behaviour)
 * textColor: exact text fill color read from Figma text child
 *
 * Figma fill reads (rgba exact):
 *   #F84040 → var(--bg-primary)         [red 500]
 *   #EAEDF0 → var(--bg-sunken)          [neutral 200]
 *   #FFFFFF → var(--text-on-dark)       [white]
 *   #1D2D40 → var(--text-base)          [neutral 800]
 *   #606C79 → var(--text-subtle)        [neutral 600]
 *   #B4BDC5 → var(--text-disabled)      [neutral 400]
 *   #FA7B6F → var(--red-400)            [gradient start]
 *   rgba(255,255,255,0.5) → on-dark disabled text
 *
 * Overlay fills (state layers):
 *   active  → rgba(0,0,0,0.30) darkens base
 *   pressed → rgba(0,0,0,0.50) darkens base more
 *   disabled primary/gradient → rgba(255,255,255,0.30) lightens base
 *   disabled secondary → rgba(0,0,0,0.10) subtle darkening
 */
const SPECS = {
  primary: {
    default:  { bg: 'var(--bg-primary)',   overlay: null,                    text: 'var(--text-on-dark)'  },
    active:   { bg: 'var(--bg-primary)',   overlay: 'rgba(0,0,0,0.30)',      text: 'var(--text-on-dark)'  },
    pressed:  { bg: 'var(--bg-primary)',   overlay: 'rgba(0,0,0,0.50)',      text: 'var(--text-on-dark)'  },
    disabled: { bg: 'var(--bg-primary)',   overlay: 'rgba(255,255,255,0.30)',text: 'rgba(255,255,255,0.5)'},
    loading:  { bg: 'var(--bg-primary)',   overlay: null,                    text: 'var(--text-on-dark)'  },
  },
  secondary: {
    default:  { bg: 'var(--bg-sunken)',    overlay: null,                    text: 'var(--text-base)'     },
    active:   { bg: 'var(--bg-sunken)',    overlay: 'rgba(0,0,0,0.30)',      text: 'var(--text-base)'     },
    pressed:  { bg: 'var(--bg-sunken)',    overlay: 'rgba(0,0,0,0.50)',      text: 'var(--text-base)'     },
    disabled: { bg: 'var(--bg-sunken)',    overlay: 'rgba(0,0,0,0.10)',      text: 'var(--text-disabled)' },
    loading:  { bg: 'var(--bg-sunken)',    overlay: null,                    text: 'var(--text-base)'     },
  },
  // Gradient default uses linear-gradient from red-400 → red-500 (Figma gradientStops exact)
  gradient: {
    default:  { bg: 'linear-gradient(to bottom, var(--red-400) 0%, var(--red-500) 70%)', overlay: null,                    text: 'var(--text-on-dark)'   },
    active:   { bg: 'var(--bg-primary)',   overlay: 'rgba(0,0,0,0.30)',      text: 'var(--text-on-dark)'  },
    pressed:  { bg: 'var(--bg-primary)',   overlay: 'rgba(0,0,0,0.50)',      text: 'var(--text-on-dark)'  },
    disabled: { bg: 'var(--bg-primary)',   overlay: 'rgba(255,255,255,0.30)',text: 'rgba(255,255,255,0.5)'},
    loading:  { bg: 'linear-gradient(to bottom, var(--red-400) 0%, var(--red-500) 70%)', overlay: null,                    text: 'var(--text-on-dark)'   },
  },
  // Ghost: no background fill, no border, no radius. Padding absent in Figma.
  ghost: {
    default:  { bg: 'transparent',         overlay: null, text: 'var(--text-subtle)'   },
    active:   { bg: 'transparent',         overlay: null, text: 'var(--text-base)'     },
    pressed:  { bg: 'transparent',         overlay: null, text: 'var(--text-base)'     },
    disabled: { bg: 'transparent',         overlay: null, text: 'var(--text-disabled)' },
    loading:  null, // Not present in Figma component set
  },
  'ghost-destructive': {
    default:  { bg: 'transparent',         overlay: null, text: 'var(--text-primary)'  },
    active:   { bg: 'transparent',         overlay: null, text: 'var(--text-primary)'  },
    pressed:  { bg: 'transparent',         overlay: null, text: 'var(--text-primary)'  },
    disabled: { bg: 'transparent',         overlay: null, text: 'var(--text-disabled)' },
    loading:  null, // Not present in Figma component set
  },
}

// ghost-destructive has no md variant in Figma (only lg and sm exist)
const MISSING_COMBOS = [
  { type: 'ghost-destructive', size: 'md' },
  { type: 'ghost', state: 'loading' },
  { type: 'ghost-destructive', state: 'loading' },
]

function isMissing(type, size, state) {
  return MISSING_COMBOS.some(c =>
    (c.type === type) && (!c.size || c.size === size) && (!c.state || c.state === state)
  )
}

// ─── Spinner (loading state) ──────────────────────────────────────────────────

function Spinner({ color }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 16,
        height: 16,
        border: `2px solid ${color}`,
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'btn-spin 0.7s linear infinite',
        flexShrink: 0,
      }}
    />
  )
}

// ─── Missing badge ────────────────────────────────────────────────────────────

export function MissingSpec({ label = 'Missing specification' }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: 'var(--bg-error-subtle)',
        border: '1px solid var(--border-error)',
        color: 'var(--text-error)',
        fontSize: 'var(--text-xs)',
        fontWeight: 600,
        fontFamily: 'var(--font-family)',
        whiteSpace: 'nowrap',
      }}
    >
      ⚠ {label}
    </span>
  )
}

// ─── Button ───────────────────────────────────────────────────────────────────

export default function Button({
  type = 'primary',    // primary | secondary | gradient | ghost | ghost-destructive
  size = 'lg',         // lg | md | sm
  state = 'default',   // default | active | pressed | disabled | loading
  label = 'Button',
  iconLeft = false,
  iconRight = false,
  onClick,
}) {
  if (isMissing(type, size, state)) {
    return <MissingSpec label={`No Figma spec for ${type}/${size}/${state}`} />
  }

  const spec = SPECS[type]?.[state]
  if (!spec) {
    return <MissingSpec label={`Unknown variant ${type}/${state}`} />
  }

  const isGhost = type === 'ghost' || type === 'ghost-destructive'
  const isFilled = !isGhost
  const height = HEIGHT[size]
  const paddingH = isFilled ? PADDING_H[size] : 0
  const gap = isGhost ? GAP.ghost : GAP.filled
  const fontSize = FONT_SIZE[size]
  const isDisabled = state === 'disabled'
  const isLoading = state === 'loading'
  const radius = isFilled ? RADIUS_FILLED : 0

  // Multi-fill background: overlay stacked on base (replicates Figma layered fills)
  const background = spec.overlay
    ? `linear-gradient(${spec.overlay}, ${spec.overlay}), ${spec.bg}`
    : spec.bg

  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap,
    height,
    paddingLeft: paddingH,
    paddingRight: paddingH,
    paddingTop: 0,
    paddingBottom: 0,
    borderRadius: radius,
    background,
    border: 'none',
    outline: 'none',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    fontFamily: 'var(--font-family)',
    fontSize,
    fontWeight: 600,
    lineHeight: 1,
    color: spec.text,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    transition: 'background 0.15s',
    userSelect: 'none',
  }

  return (
    <>
      <style>{`@keyframes btn-spin { to { transform: rotate(360deg); } }`}</style>
      <button
        style={buttonStyle}
        disabled={isDisabled || isLoading}
        onClick={onClick}
      >
        {iconLeft && !isLoading && (
          <span style={{ width: 16, height: 16, background: 'currentColor', borderRadius: 2, opacity: 0.5, flexShrink: 0 }} />
        )}
        {isLoading ? (
          <Spinner color={spec.text} />
        ) : (
          <span>{label}</span>
        )}
        {iconRight && !isLoading && (
          <span style={{ width: 16, height: 16, background: 'currentColor', borderRadius: 2, opacity: 0.5, flexShrink: 0 }} />
        )}
      </button>
    </>
  )
}

// ─── Token map (for Inspector panel) ─────────────────────────────────────────

export function getTokensForVariant(type, size, state) {
  if (isMissing(type, size, state)) return []

  const spec = SPECS[type]?.[state]
  if (!spec) return []

  const isGhost = type === 'ghost' || type === 'ghost-destructive'
  const paddingVal = PADDING_H[size]

  const tokens = [
    { property: 'height',        value: `${HEIGHT[size]}px`,                       tokenPath: '—',                      resolves: `${HEIGHT[size]}px` },
    { property: 'font-size',     value: `${FONT_SIZE[size]}px`,                    tokenPath: `typography/size/${size === 'sm' ? 'md' : 'lg'}`, resolves: `${FONT_SIZE[size]}px` },
    { property: 'font-weight',   value: '600',                                     tokenPath: 'typography/weight/semibold', resolves: '600' },
    { property: 'gap',           value: `${isGhost ? GAP.ghost : GAP.filled}px`,  tokenPath: isGhost ? 'spacing/100' : 'spacing/200', resolves: isGhost ? '4px' : '8px' },
    { property: 'border-radius', value: isGhost ? 'none' : '9999px',              tokenPath: isGhost ? '—' : 'border/radius/full', resolves: isGhost ? 'none' : '9999px' },
  ]

  if (!isGhost) {
    const paddingToken = paddingVal === 20 ? 'spacing/500' : paddingVal === 16 ? 'spacing/400' : 'spacing/300'
    tokens.push({ property: 'padding-left/right', value: `${paddingVal}px`, tokenPath: paddingToken, resolves: `${paddingVal}px` })
  }

  const bgTokenMap = {
    'var(--bg-primary)': { tokenPath: 'bg/primary',             resolves: '#F84040' },
    'var(--bg-sunken)':  { tokenPath: 'bg/sunken',              resolves: '#EAEDF0' },
    'transparent':       { tokenPath: '—',                      resolves: 'transparent' },
    'linear-gradient(to bottom, var(--red-400) 0%, var(--red-500) 70%)': { tokenPath: 'color/red/400 → 500', resolves: '#FA7B6F → #F84040' },
  }
  const bgInfo = bgTokenMap[spec.bg] || { tokenPath: spec.bg, resolves: spec.bg }
  tokens.push({ property: 'background', value: spec.bg, tokenPath: bgInfo.tokenPath, resolves: bgInfo.resolves })

  if (spec.overlay) {
    tokens.push({ property: 'overlay (state)', value: spec.overlay, tokenPath: 'color/alphas/alpha-black', resolves: spec.overlay })
  }

  const textTokenMap = {
    'var(--text-on-dark)':   { tokenPath: 'text/on-dark',  resolves: '#FFFFFF' },
    'var(--text-base)':      { tokenPath: 'text/base',     resolves: '#1D2D40' },
    'var(--text-subtle)':    { tokenPath: 'text/subtle',   resolves: '#606C79' },
    'var(--text-disabled)':  { tokenPath: 'text/disabled', resolves: '#B4BDC5' },
    'var(--text-primary)':   { tokenPath: 'text/primary',  resolves: '#F84040' },
    'rgba(255,255,255,0.5)': { tokenPath: 'text/on-dark',  resolves: 'rgba(255,255,255,0.5)' },
  }
  const textInfo = textTokenMap[spec.text] || { tokenPath: spec.text, resolves: spec.text }
  tokens.push({ property: 'color', value: spec.text, tokenPath: textInfo.tokenPath, resolves: textInfo.resolves })

  return tokens
}
