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
// Figma: boundVariables.fontSize → VariableID:2:388 (--text-lg = 16px, --text-md = 14px)
const FONT_SIZE = { lg: 16, md: 16, sm: 14 }                  // px values for spec table
const FONT_SIZE_TOKEN = { lg: 'var(--text-lg)', md: 'var(--text-lg)', sm: 'var(--text-md)' }

// Figma: boundVariables.fontStyle → VariableID:2:374 (SemiBold = 600)
const FONT_WEIGHT_TOKEN = 600   // no separate CSS variable; resolved from token

// Figma: lineHeightPercentFontSize = 150 → lineHeight 1.5
const LINE_HEIGHT = 1.5

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

// ─── Platform spinners ────────────────────────────────────────────────────────
// Android: conic-gradient filled circle — matches Figma node 11108:2625
//   GRADIENT_ANGULAR fill, color→transparent over 25.5% (~92°), strokeWeight 1.5
//   Light mode: #265CE5 (bg-secondary); in button context: spec.text color
// iOS: 8-spoke radial activity indicator — matches Figma node 2430:1071
//   30×30 component set, 8 frames, 120ms LINEAR transitions, 960ms full cycle

function AndroidSpinner({ color }) {
  // Figma gradientHandlePositions[1] at (0.0625, 0.625) → start angle ≈286° in CSS
  // Gradient sweeps ~92° (25.5% of 360°) from full color to transparent
  return (
    <span
      style={{
        display: 'inline-block',
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: `conic-gradient(from 286deg, ${color} 0deg, transparent 92deg)`,
        animation: 'btn-android-spin 0.8s linear infinite',
        flexShrink: 0,
      }}
    />
  )
}

// iOS: 8 spokes at 45° intervals, each 1.5×5px, staggered opacity cascade
// Container 20×20px (scaled from Figma 30×30). outer_r=9px inner_r=4px
// Spoke top: 1px from container edge. transformOrigin at container center (9px below spoke top)
function IOSSpinner({ color }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: 20, height: 20, flexShrink: 0 }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            top: 1,
            left: '50%',
            width: 1.5,
            height: 5,
            marginLeft: -0.75,
            borderRadius: 0.75,
            backgroundColor: color,
            transformOrigin: '50% 9px',
            transform: `rotate(${i * 45}deg)`,
            animation: 'ios-spoke 0.96s linear infinite',
            animationDelay: `${-i * 0.12}s`,
          }}
        />
      ))}
    </span>
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
  type = 'primary',       // primary | secondary | gradient | ghost | ghost-destructive
  size = 'lg',            // lg | md | sm
  state = 'default',      // default | active | pressed | disabled | loading
  label = 'Button',
  iconLeft = false,
  iconRight = false,
  platform = 'android',   // android | ios
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
  const isDisabled = state === 'disabled'
  const isLoading = state === 'loading'
  const radius = isFilled ? RADIUS_FILLED : 0
  const fontSizeToken = FONT_SIZE_TOKEN[size]

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
    fontFamily: 'var(--font-family)',    // VariableID:2:364
    fontSize: fontSizeToken,             // VariableID:2:388
    fontWeight: FONT_WEIGHT_TOKEN,       // VariableID:2:374
    lineHeight: LINE_HEIGHT,             // 150% per Figma lineHeightPercentFontSize
    color: spec.text,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    transition: 'background 0.15s',
    userSelect: 'none',
  }

  return (
    <>
      <style>{`
        @keyframes btn-android-spin { to { transform: rotate(360deg); } }
        @keyframes ios-spoke {
          0%    { opacity: 1;    }
          12.5% { opacity: 0.85; }
          25%   { opacity: 0.65; }
          37.5% { opacity: 0.45; }
          50%   { opacity: 0.30; }
          62.5% { opacity: 0.18; }
          75%   { opacity: 0.10; }
          87.5% { opacity: 0.08; }
        }
      `}</style>
      <button
        style={buttonStyle}
        disabled={isDisabled || isLoading}
        onClick={onClick}
      >
        {iconLeft && !isLoading && (
          <span style={{ width: 16, height: 16, background: 'currentColor', borderRadius: 2, opacity: 0.5, flexShrink: 0 }} />
        )}
        {isLoading ? (
          platform === 'ios'
            ? <IOSSpinner color={spec.text} />
            : <AndroidSpinner color={spec.text} />
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
    { property: 'font-size',     value: FONT_SIZE_TOKEN[size],                      tokenPath: `typography/size/${size === 'sm' ? 'md' : 'lg'}`, resolves: `${FONT_SIZE[size]}px` },
    { property: 'font-weight',   value: `${FONT_WEIGHT_TOKEN}`,                    tokenPath: 'typography/weight/semibold', resolves: '600' },
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
