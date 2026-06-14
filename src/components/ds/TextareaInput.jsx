/**
 * TextareaInput — Billease Design System
 * Source: Figma node 5529:781 (input/text), file qESeTFW1GEEosrYnm4Hu3b
 * All visual specs read directly from Figma. No invented values.
 */

// ─── State → box styles ────────────────────────────────────────────────────────
const STATE_STYLES = {
  default: { background: 'var(--bg-sunken)', border: 'none' },
  typing:  { background: 'var(--bg-base)',   border: '1px solid var(--bg-secondary)' },
  filled:  { background: 'var(--bg-sunken)', border: 'none' },
  error:   { background: 'var(--bg-sunken)', border: '1px solid var(--text-error)' },
}

const VALUE_STATES = new Set(['filled', 'typing'])

// ─── TextareaInput ─────────────────────────────────────────────────────────────

export default function TextareaInput({
  state = 'default',
  placeholder = 'Type the reason',
  value = '',
  errorMessage = 'Please type the reason',
  characterLimit = false,
  maxLength = 50,
  onChange,
  onFocus,
  onBlur,
}) {
  const interactive = typeof onChange === 'function'
  const boxStyle = STATE_STYLES[state] ?? STATE_STYLES.default
  const hasError = state === 'error'
  const isValueState = VALUE_STATES.has(state)

  const textColor = (interactive || isValueState)
    ? 'var(--text-base)'
    : 'var(--text-subtle)'

  const currentLength = interactive ? (value?.length ?? 0) : (isValueState ? value.length : 0)

  const textareaStyle = {
    width: '100%',
    minHeight: 100,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    resize: 'vertical',
    fontSize: 16,
    fontWeight: 400,
    lineHeight: '24px',
    fontFamily: 'var(--ds-font-family)',
    color: textColor,
    boxSizing: 'border-box',
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      width: '100%',
      maxWidth: 360,
      fontFamily: 'var(--ds-font-family)',
    }}>

      {/* Textarea box */}
      <div style={{
        minHeight: 100,
        borderRadius: 12,
        padding: 12,
        gap: 8,
        backgroundColor: boxStyle.background,
        border: boxStyle.border,
        boxSizing: 'border-box',
        transition: 'background-color 0.12s, border-color 0.12s',
      }}>
        {interactive ? (
          <textarea
            placeholder={placeholder}
            value={value}
            maxLength={characterLimit ? maxLength : undefined}
            onChange={e => onChange(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            style={textareaStyle}
          />
        ) : (
          <div style={{
            ...textareaStyle,
            display: 'block',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            {isValueState && value ? value : (
              <span style={{ color: 'var(--text-subtle)' }}>{placeholder}</span>
            )}
          </div>
        )}
      </div>

      {/* Error row */}
      {hasError && (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <span style={{
            fontSize: 14,
            fontWeight: 400,
            lineHeight: '21px',
            color: 'var(--text-primary)',
            fontFamily: 'var(--ds-font-family)',
            flex: 1,
          }}>
            {errorMessage}
          </span>
          {characterLimit && (
            <span style={{
              fontSize: 14,
              fontWeight: 400,
              lineHeight: '21px',
              color: 'var(--text-subtle)',
              fontFamily: 'var(--ds-font-family)',
              flexShrink: 0,
            }}>
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      )}

      {/* Standalone character limit (non-error) */}
      {!hasError && characterLimit && (
        <span style={{
          fontSize: 14,
          fontWeight: 400,
          lineHeight: '21px',
          color: 'var(--text-subtle)',
          fontFamily: 'var(--ds-font-family)',
          textAlign: 'right',
        }}>
          {currentLength}/{maxLength}
        </span>
      )}
    </div>
  )
}
