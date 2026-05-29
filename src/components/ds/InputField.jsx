import BilleaseIcon from '../../assets/icons/BilleaseIcon'

/**
 * InputField — Billease Design System
 * Source: Figma node 109:1161 (input/fields), file qESeTFW1GEEosrYnm4Hu3b
 * All visual specs read directly from Figma. No invented values.
 */

// ─── Specs from Figma ──────────────────────────────────────────────────────────
// input/fields COMPONENT_SET · size=lg/md · state=default/focused/typing/filled/error/error-filled/disabled

// Input box height per size (absoluteBoundingBox.height of the Input-field frame)
const BOX_HEIGHT = { lg: 48, md: 40 }

// Padding inside input box per size (paddingLeft/Right/Top/Bottom from Figma)
const PADDING_H = 12                         // same for lg and md
const PADDING_V = { lg: 12, md: 8 }

// Border radius of input box (cornerRadius)
const RADIUS = 12                            // 12px, both sizes

// Gap inside input box between text and icon (itemSpacing)
const INNER_GAP = 8

// Gap between outer stack children (label → input box → bottom row) (itemSpacing on variant)
const OUTER_GAP = 8

// Label row gap between label text and "(Optional)" (itemSpacing on label frame)
const LABEL_GAP = 4

// ─── Label text (from grandchild "Account name" TEXT node) ────────────────────
// fs=16, fw=400, color=#1D2D40 (VariableID:4:1423 → text/base)
// "(Optional)" fs=14, fw=400, color=#606C79 (VariableID:5:17 → text/subtle)

// ─── Input text (from input/text State=Default "Type the reason") ─────────────
// placeholder: fs=16, fw=400, color=#606C79 (text/subtle)
// value:       fs=16, fw=400, color=#1D2D40 (text/base)

// ─── Bottom row text (error/char-limit row, fs=14, fw=400) ────────────────────
// Error message: color=#F84040  (text/primary)
// Char limit:    color=#606C79  (text/subtle)

// ─── Per-state box styles (read from Input-field/lg/* frames) ─────────────────
const STATE_STYLES = {
  default:      { bg: 'var(--bg-sunken)',  border: 'none' },
  focused:      { bg: 'var(--bg-base)',    border: '1px solid var(--bg-secondary)' },
  typing:       { bg: 'var(--bg-base)',    border: '1px solid var(--bg-secondary)' },
  filled:       { bg: 'var(--bg-sunken)',  border: 'none' },
  error:        { bg: 'var(--bg-sunken)',  border: '1px solid var(--text-error)' },
  'error-filled': { bg: 'var(--bg-sunken)', border: '1px solid var(--text-error)' },
  disabled:     { bg: 'var(--bg-sunken)',  border: 'none' },
}

// States that show an error message row below the input
const ERROR_STATES = new Set(['error', 'error-filled'])

// States that show the value color (not placeholder color) for the input text
const VALUE_STATES = new Set(['typing', 'filled', 'error-filled'])


// ─── InputField ───────────────────────────────────────────────────────────────

export default function InputField({
  size = 'lg',             // lg | md
  state = 'default',       // default | focused | typing | filled | error | error-filled | disabled
  label = 'Account name',
  placeholder = 'Enter text',
  value = 'Sample input value',
  errorMessage = 'Error message alongside the input',
  showOptional = true,
  showIcon = true,
}) {
  const boxStyle = STATE_STYLES[state]
  const isDisabled = state === 'disabled'
  const hasError = ERROR_STATES.has(state)
  const isValueState = VALUE_STATES.has(state)

  const inputTextColor = isValueState ? 'var(--text-base)' : 'var(--text-subtle)'
  const boxHeight = BOX_HEIGHT[size]
  const paddingV = PADDING_V[size]

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: OUTER_GAP,
      width: '100%',
      maxWidth: 360,
      fontFamily: 'var(--font-family)',
    }}>

      {/* Label row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: LABEL_GAP }}>
        <span style={{
          fontSize: 16,
          fontWeight: 400,
          lineHeight: '24px',
          color: 'var(--text-base)',
          fontFamily: 'var(--font-family)',
        }}>
          {label}
        </span>
        {showOptional && (
          <span style={{
            fontSize: 14,
            fontWeight: 400,
            lineHeight: '21px',
            color: 'var(--text-subtle)',
            fontFamily: 'var(--font-family)',
          }}>
            (Optional)
          </span>
        )}
      </div>

      {/* Input box */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: INNER_GAP,
        height: boxHeight,
        paddingLeft: PADDING_H,
        paddingRight: PADDING_H,
        paddingTop: paddingV,
        paddingBottom: paddingV,
        backgroundColor: boxStyle.bg,
        border: boxStyle.border,
        borderRadius: RADIUS,
        boxSizing: 'border-box',
        cursor: isDisabled ? 'not-allowed' : 'text',
        transition: 'background-color 0.12s, border-color 0.12s',
      }}>
        <input
          type="text"
          placeholder={placeholder}
          value={isValueState ? value : ''}
          readOnly
          disabled={isDisabled}
          style={{
            flex: 1,
            minWidth: 0,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: 16,
            fontWeight: 400,
            lineHeight: '24px',
            color: inputTextColor,
            fontFamily: 'var(--font-family)',
            cursor: isDisabled ? 'not-allowed' : 'text',
          }}
        />
        {showIcon && (
          <BilleaseIcon
            name="edit-outline"
            size="sm"
            color={isDisabled ? 'var(--text-disabled)' : 'var(--text-subtle)'}
          />
        )}
      </div>

      {/* Bottom row: error message (error states only) */}
      {hasError && (
        <span style={{
          fontSize: 14,
          fontWeight: 400,
          lineHeight: '21px',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-family)',
        }}>
          {errorMessage}
        </span>
      )}
    </div>
  )
}

// ─── Token map (for Specs table) ──────────────────────────────────────────────

export function getTokensForInput(size, state) {
  const box = STATE_STYLES[state]
  if (!box) return []

  const isValueState = VALUE_STATES.has(state)
  const hasError = ERROR_STATES.has(state)

  return [
    { property: 'height (box)',      value: `${BOX_HEIGHT[size]}px`,      tokenPath: '—',                      resolves: `${BOX_HEIGHT[size]}px` },
    { property: 'padding-top/bot',   value: `${PADDING_V[size]}px`,       tokenPath: '—',                      resolves: `${PADDING_V[size]}px` },
    { property: 'padding-left/right',value: `${PADDING_H}px`,             tokenPath: '—',                      resolves: `${PADDING_H}px` },
    { property: 'border-radius',     value: `${RADIUS}px`,                tokenPath: '—',                      resolves: `${RADIUS}px` },
    { property: 'gap (inner)',       value: `${INNER_GAP}px`,             tokenPath: 'spacing/200',            resolves: '8px' },
    { property: 'background',        value: box.bg,                       tokenPath: box.bg === 'var(--bg-sunken)' ? 'bg/sunken' : 'bg/base', resolves: box.bg === 'var(--bg-sunken)' ? '#EAEDF0' : '#FFFFFF' },
    { property: 'border',            value: box.border,                   tokenPath: box.border.includes('bg-secondary') ? 'bg/secondary' : box.border.includes('text-error') ? 'text/error' : '—', resolves: box.border.includes('bg-secondary') ? '#265CE5' : box.border.includes('text-error') ? '#DD0C0C' : 'none' },
    { property: 'label font-size',   value: '16px',                       tokenPath: 'typography/size/lg',     resolves: '16px' },
    { property: 'label color',       value: 'var(--text-base)',           tokenPath: 'text/base',              resolves: '#1D2D40' },
    { property: 'input font-size',   value: '16px',                       tokenPath: 'typography/size/lg',     resolves: '16px' },
    { property: 'input color',       value: isValueState ? 'var(--text-base)' : 'var(--text-subtle)', tokenPath: isValueState ? 'text/base' : 'text/subtle', resolves: isValueState ? '#1D2D40' : '#606C79' },
    ...(hasError ? [{ property: 'error color', value: 'var(--text-primary)', tokenPath: 'text/primary', resolves: '#F84040' }] : []),
  ]
}
