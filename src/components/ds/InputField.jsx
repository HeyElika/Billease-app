/**
 * InputField — Billease Design System
 * Source: Figma node 109:1161 (input/fields), file qESeTFW1GEEosrYnm4Hu3b
 * All visual specs read directly from Figma. No invented values.
 */

// ─── Specs from Figma ──────────────────────────────────────────────────────────
// input/fields COMPONENT_SET · size=lg/md · state=default/focused/typing/filled/error/error-filled/disabled

// Input box height per size (absoluteBoundingBox.height of the Input-field frame)
const BOX_HEIGHT = { lg: 48, md: 40 }

// Padding inside input box (paddingLeft/Right from Figma)
const PADDING_H = 12
const PADDING_V = { lg: 12, md: 8 }

// Border radius (cornerRadius)
const RADIUS = 12

// Gap inside input box between placeholder-with-code frame and icon slot (itemSpacing)
const INNER_GAP = 8

// Gap between outer stack children: label → input → bottom row (itemSpacing on variant)
const OUTER_GAP = 8

// Label row gap between label text and "(Optional)" tag (itemSpacing on label frame)
const LABEL_GAP = 4

// Phone variant: gap between +63 text and divider, and divider and placeholder
// Figma: 'placeholder with code' frame has itemSpacing=12 (VariableID:2:726)
const PHONE_CODE_GAP = 12

// ─── Per-state box styles (read from Input-field/lg/* frames) ─────────────────
const STATE_STYLES = {
  default:        { bg: 'var(--bg-sunken)',  border: 'none' },
  focused:        { bg: 'var(--bg-base)',    border: '1px solid var(--bg-secondary)' },
  typing:         { bg: 'var(--bg-base)',    border: '1px solid var(--bg-secondary)' },
  filled:         { bg: 'var(--bg-sunken)',  border: 'none' },
  error:          { bg: 'var(--bg-sunken)',  border: '1px solid var(--text-error)' },
  'error-filled': { bg: 'var(--bg-sunken)',  border: '1px solid var(--text-error)' },
  disabled:       { bg: 'var(--bg-sunken)',  border: 'none' },
}

// States that show an error message below the input
const ERROR_STATES = new Set(['error', 'error-filled'])

// States that show the typed value (not placeholder color) in the input text
const VALUE_STATES = new Set(['typing', 'filled', 'error-filled'])

// Icon slot behavior (from Figma componentProperties 'swap icon#21:5' + 'icon right#193:56'):
//   icon right boolean = defaultValue: true → slot always rendered (20×20 sm size)
//   typing state  → close-bold (componentId 97:1392) = × to clear text
//   all other states → 'hide' (componentId 24:4320) = invisible, slot still takes space

function CloseIcon() {
  // close-bold (Figma node 97:1392) — exact SVG exported from Figma at 2× (48×48 viewBox)
  // Path 1: circle bg — fill #EAEDF0 (bg-sunken, VariableID:5:1388)
  // Path 2: × shape  — fill #1D2D40 (text-base, VariableID:5:62), no stroke
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, display: 'block' }}>
      <path d="M0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24Z" fill="#EAEDF0"/>
      <path d="M31.4375 14.4355C32.0184 13.8546 32.9816 13.8547 33.5625 14.4355C34.1434 15.0164 34.1434 15.9796 33.5625 16.5605L26.1231 24L33.5625 31.4394C34.1432 32.0204 34.1434 32.9835 33.5625 33.5644C32.9816 34.1451 32.0184 34.1452 31.4375 33.5644L23.9981 26.125L16.5606 33.5644C15.9797 34.1451 15.0164 34.1451 14.4356 33.5644C13.8548 32.9836 13.855 32.0204 14.4356 31.4394L21.8731 24L14.4356 16.5605C13.8549 15.9796 13.8547 15.0164 14.4356 14.4355C15.0164 13.8547 15.9797 13.8547 16.5606 14.4355L23.9981 21.873L31.4375 14.4355Z" fill="#1D2D40"/>
    </svg>
  )
}


// ─── InputField ───────────────────────────────────────────────────────────────

export default function InputField({
  variant = 'text',        // text | phone
  size = 'lg',             // lg | md
  state = 'default',       // default | focused | typing | filled | error | error-filled | disabled
  label = 'Account name',
  placeholder = 'Enter text',
  phonePlaceholder = 'XXX XXX XXXX',
  value = 'Sample input value',
  phoneValue = '917 555 0123',
  errorMessage = 'Error message alongside the input',
  showOptional = true,
}) {
  const boxStyle = STATE_STYLES[state]
  const isDisabled = state === 'disabled'
  const hasError = ERROR_STATES.has(state)
  const isValueState = VALUE_STATES.has(state)
  const isPhone = variant === 'phone'

  const inputTextColor = isValueState ? 'var(--text-base)' : 'var(--text-subtle)'
  const boxHeight = BOX_HEIGHT[size]
  const paddingV = PADDING_V[size]

  const inputStyle = {
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
  }

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

        {isPhone ? (
          /* Phone variant: "+63 | placeholder" prefix group */
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: PHONE_CODE_GAP,
            flex: 1,
            minWidth: 0,
          }}>
            {/* Country code — Philippines, no flag */}
            <span style={{
              fontSize: 16,
              fontWeight: 400,
              lineHeight: '24px',
              color: 'var(--text-base)',
              fontFamily: 'var(--font-family)',
              flexShrink: 0,
            }}>
              +63
            </span>

            {/* Vertical divider */}
            <span style={{
              width: 1,
              height: 16,
              backgroundColor: 'var(--border-default)',
              flexShrink: 0,
            }} />

            {/* Phone number input */}
            <input
              type="text"
              placeholder={phonePlaceholder}
              value={isValueState ? phoneValue : ''}
              readOnly
              disabled={isDisabled}
              style={inputStyle}
            />
          </div>
        ) : (
          /* Text variant: standard input */
          <input
            type="text"
            placeholder={placeholder}
            value={isValueState ? value : ''}
            readOnly
            disabled={isDisabled}
            style={inputStyle}
          />
        )}

        {/* icon slot — always present (icon right#193:56 = true by default) */}
        <span style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {state === 'typing'
            ? <CloseIcon />
            : null /* 'hide' component — slot occupies space, shows nothing */
          }
        </span>
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
    { property: 'height (box)',        value: `${BOX_HEIGHT[size]}px`,  tokenPath: '—',               resolves: `${BOX_HEIGHT[size]}px` },
    { property: 'padding-top/bottom',  value: `${PADDING_V[size]}px`,   tokenPath: '—',               resolves: `${PADDING_V[size]}px` },
    { property: 'padding-left/right',  value: `${PADDING_H}px`,         tokenPath: '—',               resolves: `${PADDING_H}px` },
    { property: 'border-radius',       value: `${RADIUS}px`,            tokenPath: '—',               resolves: `${RADIUS}px` },
    { property: 'gap (inner)',         value: `${INNER_GAP}px`,         tokenPath: 'spacing/200',     resolves: '8px' },
    { property: 'background',          value: box.bg,                   tokenPath: box.bg === 'var(--bg-sunken)' ? 'bg/sunken' : 'bg/base', resolves: box.bg === 'var(--bg-sunken)' ? '#EAEDF0' : '#FFFFFF' },
    { property: 'border',              value: box.border,               tokenPath: box.border.includes('bg-secondary') ? 'bg/secondary' : box.border.includes('text-error') ? 'text/error' : '—', resolves: box.border.includes('bg-secondary') ? '#265CE5' : box.border.includes('text-error') ? '#DD0C0C' : 'none' },
    { property: 'label font-size',     value: '16px',                   tokenPath: 'typography/size/lg', resolves: '16px' },
    { property: 'label color',         value: 'var(--text-base)',       tokenPath: 'text/base',       resolves: '#1D2D40' },
    { property: 'input font-size',     value: '16px',                   tokenPath: 'typography/size/lg', resolves: '16px' },
    { property: 'input color',         value: isValueState ? 'var(--text-base)' : 'var(--text-subtle)', tokenPath: isValueState ? 'text/base' : 'text/subtle', resolves: isValueState ? '#1D2D40' : '#606C79' },
    ...(hasError ? [{ property: 'error color', value: 'var(--text-primary)', tokenPath: 'text/primary', resolves: '#F84040' }] : []),
  ]
}
