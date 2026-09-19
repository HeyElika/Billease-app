/**
 * Checkbox — Billease Design System
 * Source: Figma nodes 188:2520 (.Checkbox), 183:1591 (checkbox-label),
 *         183:2213 (checkbox-paragraph), file qESeTFW1GEEosrYnm4Hu3b
 * Variants: state=default | checked | error
 *
 * Figma specs:
 *   box        24x24, radius border/radius/md (8px), 2px border
 *   default    border/bold          #919191
 *   error      border/error-bold    #eb5c69
 *   checked    bg/primary fill with a 20px tick on text/on-dark
 *   label      body/body-md-regular (16px / 400) on text/base
 *   description body/body-sm-regular (14px / 400) on text/subtle
 *   error copy  body/body-sm-regular (14px / 400) on text/error, below the row
 *   gap        spacing/200 (8px)
 */

import BilleaseIcon from '../../assets/icons/BilleaseIcon'

/** The 24px box on its own — used by checkbox-label and checkbox-paragraph. */
export function CheckboxBox({ state = 'default', disabled = false }) {
  const base = {
    width: 24,
    height: 24,
    borderRadius: 'var(--radius-md)',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.4 : 1,
  }

  if (state === 'checked') {
    return (
      <div style={{ ...base, backgroundColor: 'var(--bg-primary)', overflow: 'hidden' }}>
        <BilleaseIcon name="tick" size="sm" color="var(--icon-on-dark)" />
      </div>
    )
  }

  return (
    <div style={{
      ...base,
      border: `var(--border-width-200) solid ${state === 'error' ? 'var(--border-error-bold)' : 'var(--border-bold)'}`,
    }} />
  )
}

export default function Checkbox({
  state = 'default',        // default | checked | error
  label = 'Placeholder',
  description,
  errorMessage = 'Error message alongside the input',
  disabled = false,
  onChange,
}) {
  const isError = state === 'error'

  const row = (
    <div style={{ display: 'flex', gap: 'var(--space-200)', alignItems: 'flex-start', width: '100%' }}>
      <CheckboxBox state={state} disabled={disabled} />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        flex: '1 0 0',
        minWidth: 0,
        justifyContent: 'center',
        fontFamily: 'var(--ds-font-family)',
        lineHeight: 1.5,
      }}>
        <span style={{ fontSize: 'var(--text-lg)', fontWeight: 400, color: 'var(--text-base)' }}>{label}</span>
        {description && (
          <span style={{ fontSize: 'var(--text-md)', fontWeight: 400, color: 'var(--text-subtle)' }}>{description}</span>
        )}
      </div>
    </div>
  )

  return (
    <div
      onClick={!disabled && onChange ? () => onChange(state !== 'checked') : undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-200)',
        alignItems: 'flex-start',
        width: 200,
        cursor: !disabled && onChange ? 'pointer' : 'default',
      }}
    >
      {row}
      {isError && (
        <span style={{
          fontFamily: 'var(--ds-font-family)',
          fontSize: 'var(--text-md)',
          fontWeight: 400,
          lineHeight: 1.5,
          color: 'var(--text-error)',
          width: '100%',
        }}>
          {errorMessage}
        </span>
      )}
    </div>
  )
}

/**
 * CheckboxParagraph — Figma node 183:2213 (checkbox-paragraph)
 * Variants: state=default | checked | error
 *
 * Same box as Checkbox, but the copy is a wrapping paragraph at
 * body/body-sm-regular (14px / 400) in a 300px container.
 */
export function CheckboxParagraph({
  state = 'default',
  text = 'Checkbox with long description. Wow it’s a long description but still it lines up okay! That first line lines up with the box because of the auto layout gutter on this container.',
  errorMessage = 'Error message alongside the input',
  disabled = false,
  onChange,
}) {
  return (
    <div
      onClick={!disabled && onChange ? () => onChange(state !== 'checked') : undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-200)',
        alignItems: 'flex-start',
        width: 300,
        cursor: !disabled && onChange ? 'pointer' : 'default',
      }}
    >
      <div style={{ display: 'flex', gap: 'var(--space-200)', alignItems: 'flex-start', width: '100%' }}>
        <CheckboxBox state={state} disabled={disabled} />
        <p style={{
          flex: '1 0 0',
          minWidth: 0,
          margin: 0,
          fontFamily: 'var(--ds-font-family)',
          fontSize: 'var(--text-md)',
          fontWeight: 400,
          lineHeight: 1.5,
          color: 'var(--text-base)',
        }}>
          {text}
        </p>
      </div>
      {state === 'error' && (
        <span style={{
          fontFamily: 'var(--ds-font-family)',
          fontSize: 'var(--text-md)',
          fontWeight: 400,
          lineHeight: 1.5,
          color: 'var(--text-error)',
          width: '100%',
        }}>
          {errorMessage}
        </span>
      )}
    </div>
  )
}
