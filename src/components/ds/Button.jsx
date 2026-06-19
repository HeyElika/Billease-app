import BilleaseIcon from '../../assets/icons/BilleaseIcon'

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

// icon-placeholder size per button size (read from Figma node)
// lg/md → size-[20px] → BilleaseIcon sm; sm → size-[16px] → BilleaseIcon xs
const ICON_SIZE = { lg: 'sm', md: 'sm', sm: 'xs' }
const ICON_SIZE_PX = { lg: 20, md: 20, sm: 16 }

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
// Android: SVG arc — Figma node 11108:2625, GRADIENT_ANGULAR fill, 25.5% arc (~92°)
//   strokeDasharray gives a clean partial ring, strokeLinecap="round" for soft ends
// iOS: SVG 8-spoke — Figma node 2430:1071, 8 frames × 120ms LINEAR = 960ms cycle
//   Clockwise rotation: delay formula -(8-i)%8 × 120ms ensures lit spoke advances CW

function AndroidSpinner({ color }) {
  // r=8.25 inside 20×20 viewBox. circumference≈51.84. 25.5% arc≈13.22px visible.
  const r = 8.25
  const circ = 2 * Math.PI * r
  const arc = circ * 0.255
  return (
    <svg
      width="20" height="20" viewBox="0 0 20 20"
      style={{ animation: 'btn-android-spin 0.8s linear infinite', flexShrink: 0, display: 'block' }}
    >
      <circle
        cx="10" cy="10" r={r}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray={`${arc.toFixed(2)} ${(circ - arc).toFixed(2)}`}
        transform="rotate(-90 10 10)"
      />
    </svg>
  )
}

// 8 spokes as SVG lines, inner_r=3.5 outer_r=8.5, cx=cy=10 (20×20 viewBox)
// animationDelay: -(8-i)%8 × 0.12s → spoke 0 lit first, then 1,2,… clockwise
function IOSSpinner({ color }) {
  const spokes = 8
  const cx = 10, cy = 10, innerR = 3.5, outerR = 8.5
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" style={{ flexShrink: 0, display: 'block' }}>
      {Array.from({ length: spokes }).map((_, i) => {
        const rad = ((i * 45) - 90) * Math.PI / 180
        const x1 = (cx + innerR * Math.cos(rad)).toFixed(2)
        const y1 = (cy + innerR * Math.sin(rad)).toFixed(2)
        const x2 = (cx + outerR * Math.cos(rad)).toFixed(2)
        const y2 = (cy + outerR * Math.sin(rad)).toFixed(2)
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{
              animation: 'ios-spoke 0.96s linear infinite',
              animationDelay: `${-((8 - i) % 8) * 0.12}s`,
            }}
          />
        )
      })}
    </svg>
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
  fullWidth = false,
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
    width: fullWidth ? '100%' : undefined,
    boxSizing: 'border-box',
    borderRadius: radius,
    background,
    border: 'none',
    outline: 'none',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    fontFamily: 'var(--ds-font-family)',    // VariableID:2:364
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
          <BilleaseIcon name="arrow-left" size={ICON_SIZE[size]} color={spec.text} />
        )}
        {isLoading ? (
          platform === 'ios'
            ? <IOSSpinner color={spec.text} />
            : <AndroidSpinner color={spec.text} />
        ) : (
          <span>{label}</span>
        )}
        {iconRight && !isLoading && (
          <BilleaseIcon name="arrow-left" size={ICON_SIZE[size]} color={spec.text} style={{ transform: 'rotate(180deg)' }} />
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
    { property: 'icon size',     value: ICON_SIZE[size],                            tokenPath: `icon/size/${ICON_SIZE[size]}`, resolves: `${ICON_SIZE_PX[size]}px` },
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
    'var(--bg-primary)': { tokenPath: 'bg/primary',  resolves: '#F84040'    },
    'var(--bg-sunken)':  { tokenPath: 'bg/sunken',   resolves: '#EAEDF0'    },
    'transparent':       { tokenPath: '—',            resolves: 'transparent' },
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
    'rgba(255,255,255,0.5)': { tokenPath: 'text/on-dark-disabled', resolves: 'rgba(255,255,255,0.5)' },
  }
  const textInfo = textTokenMap[spec.text] || { tokenPath: spec.text, resolves: spec.text }
  tokens.push({ property: 'color', value: spec.text, tokenPath: textInfo.tokenPath, resolves: textInfo.resolves })

  return tokens
}
