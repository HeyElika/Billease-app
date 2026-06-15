/**
 * OTPInput — Billease Design System
 * Source: Figma node 188:2882 (input/code) + 188:3115 (input/code/group), file qESeTFW1GEEosrYnm4Hu3b
 * All visual specs read directly from Figma. No invented values.
 */

// ─── Cell state styles ─────────────────────────────────────────────────────────
const CELL_STYLES = {
  default:       { background: 'var(--bg-sunken)',       border: 'none' },
  focused:       { background: 'var(--bg-base)',         border: 'var(--border-width-200) solid var(--bg-secondary)' },
  filled:        { background: 'var(--bg-sunken)',       border: 'none' },
  success:       { background: 'var(--bg-base)',         border: 'var(--border-width-200) solid var(--border-success)' },
  error:         { background: 'var(--bg-error-subtle)', border: 'none' },
  'error-active':{ background: 'var(--bg-base)',         border: 'var(--border-width-200) solid var(--text-error)' },
  masked:        { background: 'var(--bg-sunken)',       border: 'none' },
  'masked-error':{ background: 'var(--bg-error-subtle)', border: 'none' },
  disabled:      { background: 'var(--bg-sunken)',       border: 'none' },
}

// ─── Type → cell config ────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  'PIN':        { numCells: 4, cellW: 44, cellH: 50 },
  'OTP-email':  { numCells: 6, cellW: 44, cellH: 50 },
  'OTP-mobile': { numCells: 4, cellW: 44, cellH: 50 },
  'code':       { numCells: 8, cellW: 32, cellH: 42 },
}

// ─── OTPCell (single cell) ─────────────────────────────────────────────────────

export function OTPCell({ state = 'default', value = '', cellW = 44, cellH = 50 }) {
  const cellStyle = CELL_STYLES[state] ?? CELL_STYLES.default
  const isMasked = state === 'masked' || state === 'masked-error'
  const isEmpty = state === 'disabled'

  return (
    <div style={{
      width: cellW,
      height: cellH,
      borderRadius: 12,
      padding: 12,
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: cellStyle.background,
      border: cellStyle.border,
      flexShrink: 0,
    }}>
      {isMasked && (
        <div style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: 'var(--text-base)',
        }} />
      )}
      {!isMasked && !isEmpty && (
        <span style={{
          fontSize: 24,
          fontWeight: 600,
          lineHeight: '30px',
          fontFamily: 'var(--ds-font-family)',
          textAlign: 'center',
          color: 'var(--text-base)',
        }}>
          {value}
        </span>
      )}
    </div>
  )
}

// ─── OTPInput (group) ─────────────────────────────────────────────────────────

export default function OTPInput({
  type = 'OTP-mobile',
  values = [],
  focusedIndex,
  errorMessage = '',
  showError = false,
  onChange,
}) {
  const config = TYPE_CONFIG[type] ?? TYPE_CONFIG['OTP-mobile']
  const { numCells, cellW, cellH } = config

  function getCellState(i) {
    if (focusedIndex === i) return 'focused'
    if (values[i]) return 'filled'
    return 'default'
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      fontFamily: 'var(--ds-font-family)',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 8,
      }}>
        {Array.from({ length: numCells }).map((_, i) => {
          const cellState = getCellState(i)
          return (
            <OTPCell
              key={i}
              state={cellState}
              value={values[i] ?? ''}
              cellW={cellW}
              cellH={cellH}
            />
          )
        })}
      </div>

      {showError && errorMessage && (
        <span style={{
          fontSize: 14,
          fontWeight: 400,
          lineHeight: '21px',
          color: 'var(--text-primary)',
          fontFamily: 'var(--ds-font-family)',
          textAlign: 'center',
        }}>
          {errorMessage}
        </span>
      )}
    </div>
  )
}
