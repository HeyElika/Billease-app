/**
 * AmountInput — Billease Design System
 * Source: Figma node 51:1615 (input/amount), file qESeTFW1GEEosrYnm4Hu3b
 * All visual specs read directly from Figma. No invented values.
 */

// ─── State → visual mapping ────────────────────────────────────────────────────
const STATE_MAP = {
  default: {
    amountColor: 'var(--text-disabled)',
    helperColor: 'var(--text-subtle)',
    defaultAmount: '₱0.00',
    defaultHelper: 'Minimum amount ₱25.00',
  },
  focused: {
    amountColor: 'var(--text-base)',
    helperColor: 'var(--text-subtle)',
    defaultAmount: '₱',
    defaultHelper: 'Minimum amount ₱25.00',
    showCursor: true,
  },
  typing: {
    amountColor: 'var(--text-base)',
    helperColor: 'var(--text-subtle)',
    defaultAmount: '₱1,034.00',
    defaultHelper: 'Minimum amount ₱25.00',
    showCursor: true,
  },
  filled: {
    amountColor: 'var(--text-base)',
    helperColor: 'var(--text-subtle)',
    defaultAmount: '₱1,034.00',
    defaultHelper: 'Minimum amount ₱25.00',
  },
  error: {
    amountColor: 'var(--text-primary)',
    helperColor: 'var(--text-primary)',
    defaultAmount: '₱1,034.00',
    defaultHelper: 'Not enough balance',
  },
  success: {
    amountColor: 'var(--text-success)',
    helperColor: 'var(--text-subtle)',
    defaultAmount: '₱1,034.00',
    defaultHelper: 'Info message',
  },
}

// ─── AmountInput ──────────────────────────────────────────────────────────────

export default function AmountInput({
  state = 'default',
  title = 'Enter amount',
  amount,
  helperText,
  onChange,
  onFocus,
  onBlur,
}) {
  const interactive = typeof onChange === 'function'
  const stateConfig = STATE_MAP[state] ?? STATE_MAP.default
  const displayAmount = amount ?? stateConfig.defaultAmount
  const displayHelper = helperText ?? stateConfig.defaultHelper
  const showCursor = stateConfig.showCursor ?? false

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 24,
      paddingBottom: 24,
      gap: 24,
      width: '100%',
      maxWidth: 360,
      fontFamily: 'var(--ds-font-family)',
      boxSizing: 'border-box',
    }}>

      {/* Title */}
      <div style={{
        fontSize: 20,
        fontWeight: 600,
        lineHeight: '30px',
        color: 'var(--text-base)',
        fontFamily: 'var(--ds-font-family)',
        textAlign: 'center',
      }}>
        {title}
      </div>

      {/* Amount + helper */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
      }}>

        {/* Amount display */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {interactive ? (
            <input
              type="text"
              value={amount ?? ''}
              onChange={e => onChange(e.target.value)}
              onFocus={onFocus}
              onBlur={onBlur}
              style={{
                fontSize: 32,
                fontWeight: 700,
                lineHeight: '40px',
                fontFamily: 'var(--ds-font-family)',
                color: stateConfig.amountColor,
                textAlign: 'center',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                width: '100%',
              }}
            />
          ) : (
            <>
              <span style={{
                fontSize: 32,
                fontWeight: 700,
                lineHeight: '40px',
                fontFamily: 'var(--ds-font-family)',
                color: stateConfig.amountColor,
                textAlign: 'center',
              }}>
                {displayAmount}
              </span>
              {showCursor && (
                <span style={{
                  display: 'inline-block',
                  width: 2,
                  height: 32,
                  backgroundColor: 'var(--text-base)',
                  verticalAlign: 'middle',
                  marginLeft: 2,
                  animation: 'blink 1s step-end infinite',
                }} />
              )}
            </>
          )}
        </div>

        {/* Helper text */}
        <span style={{
          fontSize: 16,
          fontWeight: 400,
          lineHeight: '24px',
          fontFamily: 'var(--ds-font-family)',
          color: stateConfig.helperColor,
          textAlign: 'center',
        }}>
          {displayHelper}
        </span>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
