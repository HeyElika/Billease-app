import { useState } from 'react'
import Button, { MissingSpec, getTokensForVariant } from '../components/ds/Button'

const VARIANTS = ['primary', 'secondary', 'ghost', 'gradient', 'ghost-destructive']
const STATES   = ['default', 'active', 'pressed', 'disabled', 'loading']
const SIZES    = ['lg', 'md', 'sm']

function SelectorGroup({ label, options, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{
        fontSize: 'var(--text-xs)',
        fontWeight: 600,
        color: 'var(--text-subtle)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        fontFamily: 'var(--font-family)',
      }}>
        {label}
      </span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: value === opt ? 'var(--border-primary)' : 'var(--border-default)',
              backgroundColor: value === opt ? 'var(--bg-error-subtle)' : 'var(--bg-base)',
              color: value === opt ? 'var(--text-primary)' : 'var(--text-subtle)',
              fontSize: 'var(--text-sm)',
              fontWeight: value === opt ? 600 : 400,
              fontFamily: 'var(--font-family)',
              cursor: 'pointer',
              transition: 'all 0.1s',
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function TokenRow({ property, value, token }) {
  return (
    <tr>
      <td style={{
        padding: '8px 12px',
        fontSize: 'var(--text-xs)',
        fontFamily: 'var(--font-family)',
        color: 'var(--text-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        whiteSpace: 'nowrap',
      }}>
        {property}
      </td>
      <td style={{
        padding: '8px 12px',
        fontSize: 'var(--text-xs)',
        fontFamily: 'monospace',
        color: 'var(--text-base)',
        borderBottom: '1px solid var(--border-subtle)',
        maxWidth: 180,
      }}>
        {value}
      </td>
      <td style={{
        padding: '8px 12px',
        fontSize: 'var(--text-xs)',
        fontFamily: 'var(--font-family)',
        color: 'var(--text-secondary)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        {token}
      </td>
    </tr>
  )
}

function CheckerBg({ children, dark }) {
  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 120,
      borderRadius: 'var(--radius-lg)',
      backgroundColor: dark ? 'var(--neutral-800)' : 'var(--bg-base)',
      backgroundImage: dark ? 'none' : `
        linear-gradient(45deg, var(--neutral-200) 25%, transparent 25%),
        linear-gradient(-45deg, var(--neutral-200) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, var(--neutral-200) 75%),
        linear-gradient(-45deg, transparent 75%, var(--neutral-200) 75%)
      `,
      backgroundSize: '16px 16px',
      backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
      padding: 32,
    }}>
      {children}
    </div>
  )
}

export default function Explorer() {
  const [variant, setVariant] = useState('primary')
  const [state, setState]     = useState('default')
  const [size, setSize]       = useState('lg')
  const [darkBg, setDarkBg]   = useState(false)

  const tokens = getTokensForVariant(variant, size, state)

  const isMissing =
    (variant === 'ghost-destructive' && size === 'md') ||
    ((variant === 'ghost' || variant === 'ghost-destructive') && state === 'loading')

  return (
    <div style={{
      padding: 'var(--space-600)',
      fontFamily: 'var(--font-family)',
      maxWidth: 960,
    }}>

      {/* Page title row */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          margin: '0 0 4px',
          fontSize: 'var(--text-xl)',
          fontWeight: 700,
          color: 'var(--text-base)',
        }}>
          Button
        </h2>
        <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-subtle)' }}>
          Node 16:182 · 5 types · 3 sizes · 5 states · 61 variants
        </p>
      </div>

      {/* Two-column layout: controls + preview | tokens */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'start' }}>

        {/* Left: controls + preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Controls card */}
          <div style={{
            backgroundColor: 'var(--bg-base)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}>
            <SelectorGroup label="Variant (type)" options={VARIANTS} value={variant} onChange={setVariant} />
            <SelectorGroup label="Size"           options={SIZES}    value={size}    onChange={setSize}    />
            <SelectorGroup label="State"          options={STATES}   value={state}   onChange={setState}   />
          </div>

          {/* Preview card */}
          <div style={{
            backgroundColor: 'var(--bg-base)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-base)' }}>
                Preview
              </span>
              <button
                onClick={() => setDarkBg(d => !d)}
                style={{
                  padding: '2px 10px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-default)',
                  backgroundColor: darkBg ? 'var(--neutral-800)' : 'var(--bg-base)',
                  color: darkBg ? 'var(--text-on-dark)' : 'var(--text-subtle)',
                  fontSize: 'var(--text-xs)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-family)',
                }}
              >
                {darkBg ? '○ Dark bg' : '● Light bg'}
              </button>
            </div>

            <div style={{ padding: 24 }}>
              <CheckerBg dark={darkBg}>
                {isMissing ? (
                  <MissingSpec label={`No Figma spec: ${variant}/${size}/${state}`} />
                ) : (
                  <Button
                    type={variant}
                    size={size}
                    state={state}
                    label="Pay Now"
                  />
                )}
              </CheckerBg>
            </div>
          </div>

          {/* All states preview strip */}
          <div style={{
            backgroundColor: 'var(--bg-base)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-base)' }}>
                All states — {variant} / {size}
              </span>
            </div>
            <div style={{
              padding: 20,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              alignItems: 'center',
              backgroundColor: variant === 'ghost' || variant === 'ghost-destructive' ? 'var(--bg-subtle)' : 'var(--bg-base)',
            }}>
              {STATES.map(s => {
                const missing =
                  (variant === 'ghost-destructive' && size === 'md') ||
                  ((variant === 'ghost' || variant === 'ghost-destructive') && s === 'loading')
                return (
                  <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    {missing ? (
                      <MissingSpec label="—" />
                    ) : (
                      <Button type={variant} size={size} state={s} label="Button" />
                    )}
                    <span style={{ fontSize: 'var(--text-xxs)', color: 'var(--text-subtle)', fontFamily: 'var(--font-family)' }}>
                      {s}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right: token inspector */}
        <div style={{
          backgroundColor: 'var(--bg-base)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
          position: 'sticky',
          top: 16,
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-base)' }}>
              Token References
            </span>
            <p style={{ margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-subtle)' }}>
              {variant} / {size} / {state}
            </p>
          </div>

          {isMissing ? (
            <div style={{ padding: 16 }}>
              <MissingSpec label={`No Figma spec: ${variant}/${size}/${state}`} />
            </div>
          ) : tokens.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-subtle)' }}>
                  {['Property', 'Value', 'Token'].map(h => (
                    <th key={h} style={{
                      padding: '6px 12px',
                      fontSize: 'var(--text-xxs)',
                      fontWeight: 600,
                      color: 'var(--text-subtle)',
                      textAlign: 'left',
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                      borderBottom: '1px solid var(--border-subtle)',
                      fontFamily: 'var(--font-family)',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tokens.map((t, i) => (
                  <TokenRow key={i} property={t.property} value={t.value} token={t.token} />
                ))}
              </tbody>
            </table>
          ) : null}
        </div>
      </div>
    </div>
  )
}
