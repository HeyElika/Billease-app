/**
 * InputField — Billease Design System
 * Source: Figma node 109:1161 (input/fields), file qESeTFW1GEEosrYnm4Hu3b
 * All visual specs read directly from Figma. No invented values.
 */

// ─── Specs from Figma ──────────────────────────────────────────────────────────
// input/fields COMPONENT_SET · size=lg/md · state=default/focused/typing/filled/error/error-filled/disabled
// Component properties:
//   optional#109:0        BOOLEAN  default=false
//   label#193:41          BOOLEAN  default=true
//   icon right#193:56     BOOLEAN  default=true
//   info#209:89           BOOLEAN  default=false
//   character limit#2460:0 BOOLEAN default=false
//   country code#11972:0  BOOLEAN  default=false
//   Show sugestion#12019:0 BOOLEAN default=false
//   size                  VARIANT  md | lg
//   state                 VARIANT  default | focused | typing | filled | error | error-filled | disabled

// Input box height per size (absoluteBoundingBox.height of the Input-field frame)
const BOX_HEIGHT = { lg: 48, md: 40 }

// Padding inside input box
// lg: 12 all sides. md: 8 top/bottom, 12 left/right
const PADDING_H = 12
const PADDING_V = { lg: 12, md: 8 }

// Border radius (cornerRadius)
const RADIUS = 12

// Gap inside input box between text frame and icon slot (itemSpacing)
const INNER_GAP = 8

// Gap between outer stack children: label → input → bottom row (itemSpacing on variant)
const OUTER_GAP = 8

// Label row gap between label text and "(Optional)" tag
const LABEL_GAP = 4

// Country code frame: itemSpacing=10 between code text and divider,
// paddingRight=12 between the frame and the input (VariableID:2:726)
const COUNTRY_CODE_INNER_GAP = 10
const COUNTRY_CODE_RIGHT_PAD = 12

// ─── Per-state box styles ──────────────────────────────────────────────────────
const STATE_STYLES = {
  default:        { bg: 'var(--bg-sunken)',  border: 'none' },
  focused:        { bg: 'var(--bg-base)',    border: '1px solid var(--bg-secondary)' },
  typing:         { bg: 'var(--bg-base)',    border: '1px solid var(--bg-secondary)' },
  filled:         { bg: 'var(--bg-sunken)',  border: 'none' },
  error:          { bg: 'var(--bg-sunken)',  border: '1px solid var(--text-error)' },
  'error-filled': { bg: 'var(--bg-sunken)',  border: '1px solid var(--text-error)' },
  disabled:       { bg: 'var(--bg-sunken)',  border: 'none' },
}

const ERROR_STATES  = new Set(['error', 'error-filled'])
const VALUE_STATES  = new Set(['typing', 'filled', 'error-filled'])

// Figma: typing state → close-bold (componentId 97:1392); all others → hide (componentId 24:4320)
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, display: 'block' }}>
      <path d="M0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24Z" fill="#EAEDF0"/>
      <path d="M31.4375 14.4355C32.0184 13.8546 32.9816 13.8547 33.5625 14.4355C34.1434 15.0164 34.1434 15.9796 33.5625 16.5605L26.1231 24L33.5625 31.4394C34.1432 32.0204 34.1434 32.9835 33.5625 33.5644C32.9816 34.1451 32.0184 34.1452 31.4375 33.5644L23.9981 26.125L16.5606 33.5644C15.9797 34.1451 15.0164 34.1451 14.4356 33.5644C13.8548 32.9836 13.855 32.0204 14.4356 31.4394L21.8731 24L14.4356 16.5605C13.8549 15.9796 13.8547 15.0164 14.4356 14.4355C15.0164 13.8547 15.9797 13.8547 16.5606 14.4355L23.9981 21.873L31.4375 14.4355Z" fill="#1D2D40"/>
    </svg>
  )
}


// ─── InputField ───────────────────────────────────────────────────────────────

export default function InputField({
  // Variant / size
  variant = 'text',             // text | phone — 'phone' is an alias for showCountryCode=true
  size = 'lg',                  // lg | md

  // State
  state = 'default',            // default | focused | typing | filled | error | error-filled | disabled

  // Content
  label = 'Account name',
  placeholder = 'Enter text',
  value = 'Sample input value',
  errorMessage = 'Error message alongside the input',
  infoMessage = 'Info message goes here',
  countryCode = '+63',
  phonePlaceholder = 'XXX XXX XXXX',
  phoneValue = '917 555 0123',

  // Feature toggles (map directly to Figma component properties)
  showLabel = true,             // label#193:41       — show/hide label row
  showOptional = false,         // optional#109:0     — show "(Optional)" tag
  showIcon = true,              // icon right#193:56  — show icon slot on right
  info = false,                 // info#209:89        — show info message below
  characterLimit = false,       // character limit#2460:0 — show char count
  showCountryCode = false,      // country code#11972:0   — show country code prefix
  maxLength = 50,

  // Interactive mode — provide onChange to make the input live
  onChange,
  onFocus,
  onBlur,
  onClear,
}) {
  const interactive   = typeof onChange === 'function'
  const isPhone       = variant === 'phone' || showCountryCode
  const boxStyle      = STATE_STYLES[state]
  const isDisabled    = state === 'disabled'
  const hasError      = ERROR_STATES.has(state)
  const isValueState  = VALUE_STATES.has(state)
  const boxHeight     = BOX_HEIGHT[size]
  const paddingV      = PADDING_V[size]

  // Placeholder/value text color
  // Disabled uses var(--text-disabled) (#B4BDC5); other non-value states use var(--text-subtle)
  const inputTextColor = (interactive || isValueState)
    ? 'var(--text-base)'
    : isDisabled
      ? 'var(--text-disabled)'
      : 'var(--text-subtle)'

  const currentLength = interactive ? (value?.length ?? 0) : (isValueState ? value.length : 0)

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

      {/* Label row — visible when showLabel=true (label#193:41) */}
      {showLabel && (
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
          {/* (Optional) tag — optional#109:0, default=false */}
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
      )}

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

        {/* Country code prefix — country code#11972:0
            Frame: paddingRight=12 (gap to input), itemSpacing=10 (code↔divider) */}
        {isPhone && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: COUNTRY_CODE_INNER_GAP,
            paddingRight: COUNTRY_CODE_RIGHT_PAD,
            flexShrink: 0,
          }}>
            <span style={{
              fontSize: 16,
              fontWeight: 400,
              lineHeight: '24px',
              color: 'var(--text-base)',
              fontFamily: 'var(--font-family)',
            }}>
              {countryCode}
            </span>
            <span style={{
              width: 1,
              height: 16,
              backgroundColor: 'var(--border-default)',
              flexShrink: 0,
            }} />
          </div>
        )}

        {/* Text input */}
        <input
          type="text"
          placeholder={isPhone ? phonePlaceholder : placeholder}
          value={interactive
            ? value
            : (isValueState ? (isPhone ? phoneValue : value) : '')}
          readOnly={!interactive}
          disabled={isDisabled}
          onChange={interactive ? (e) => onChange(e.target.value) : undefined}
          onFocus={interactive ? onFocus : undefined}
          onBlur={interactive ? onBlur : undefined}
          style={inputStyle}
        />

        {/* Icon slot — icon right#193:56, default=true
            typing → close-bold (clears); all other states → hide (invisible, holds space) */}
        {showIcon && (
          <span
            style={{
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              cursor: state === 'typing' && interactive ? 'pointer' : 'default',
            }}
            onClick={state === 'typing' && interactive ? onClear : undefined}
          >
            {state === 'typing' ? <CloseIcon /> : null}
          </span>
        )}
      </div>

      {/* Info message — info#209:89, default=false
          color=var(--text-base), fontSize=14, lineHeight=21px
          Shown in non-error states only */}
      {info && !hasError && (
        <span style={{
          fontSize: 14,
          fontWeight: 400,
          lineHeight: '21px',
          color: 'var(--text-base)',
          fontFamily: 'var(--font-family)',
        }}>
          {infoMessage}
        </span>
      )}

      {/* Error row — flex row: [error text, flex:1] + optional [char limit, right-aligned]
          Error text color=var(--text-primary) (#F84040) */}
      {hasError && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: INNER_GAP }}>
          <span style={{
            flex: 1,
            fontSize: 14,
            fontWeight: 400,
            lineHeight: '21px',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-family)',
          }}>
            {errorMessage}
          </span>
          {/* Character limit shown in error row when enabled */}
          {characterLimit && (
            <span style={{
              fontSize: 14,
              fontWeight: 400,
              lineHeight: '21px',
              color: 'var(--text-subtle)',
              fontFamily: 'var(--font-family)',
              flexShrink: 0,
            }}>
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      )}

      {/* Standalone character limit (non-error states) — character limit#2460:0, default=false
          Right-aligned, color=var(--text-subtle), fontSize=14 */}
      {!hasError && characterLimit && (
        <span style={{
          fontSize: 14,
          fontWeight: 400,
          lineHeight: '21px',
          color: 'var(--text-subtle)',
          fontFamily: 'var(--font-family)',
          textAlign: 'right',
        }}>
          {currentLength}/{maxLength}
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
  const hasError     = ERROR_STATES.has(state)
  const isDisabled   = state === 'disabled'

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
    { property: 'input color',         value: isValueState ? 'var(--text-base)' : isDisabled ? 'var(--text-disabled)' : 'var(--text-subtle)', tokenPath: isValueState ? 'text/base' : isDisabled ? 'text/disabled' : 'text/subtle', resolves: isValueState ? '#1D2D40' : isDisabled ? '#B4BDC5' : '#606C79' },
    ...(hasError ? [{ property: 'error color', value: 'var(--text-primary)', tokenPath: 'text/primary', resolves: '#F84040' }] : []),
  ]
}
