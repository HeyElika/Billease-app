import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { componentIndex } from '../data/components'
import Button, { MissingSpec, getTokensForVariant } from '../components/ds/Button'

// ─── Component registry ───────────────────────────────────────────────────────
// Only components with implementations live here. Everything else shows a placeholder.

const VARIANTS = ['primary', 'secondary', 'ghost', 'gradient', 'ghost-destructive']
const STATES   = ['default', 'active', 'pressed', 'disabled', 'loading']
const SIZES    = ['lg', 'md', 'sm']

const REGISTRY = {
  '16:182': {
    variants: VARIANTS,
    sizes: SIZES,
    states: STATES,
    defaultVariant: 'primary',
    defaultSize: 'lg',
    defaultState: 'default',
    defaultLabel: 'Pay Now',
    renderComponent: ({ variant, size, state, label }) => (
      <Button type={variant} size={size} state={state} label={label} />
    ),
    getTokens: getTokensForVariant,
    isMissing: (variant, size, state) =>
      (variant === 'ghost-destructive' && size === 'md') ||
      ((variant === 'ghost' || variant === 'ghost-destructive') && state === 'loading'),
  },
}

// ─── Pill selector ────────────────────────────────────────────────────────────

function PillSelector({ label, options, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
      <span style={{
        fontFamily: 'var(--font-family)',
        fontSize: 11,
        fontWeight: 700,
        color: 'var(--text-disabled)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        minWidth: 44,
        flexShrink: 0,
      }}>
        {label}
      </span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {options.map(opt => {
          const active = value === opt
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              style={{
                padding: '3px 12px',
                borderRadius: 9999,
                border: `1px solid ${active ? 'var(--border-primary)' : 'var(--border-default)'}`,
                backgroundColor: active ? 'var(--bg-error-subtle)' : '#fff',
                color: active ? 'var(--text-primary)' : 'var(--text-subtle)',
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                fontFamily: 'var(--font-family)',
                cursor: 'pointer',
                transition: 'all 0.1s',
                lineHeight: '20px',
              }}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Checkerboard preview bg ──────────────────────────────────────────────────

function PreviewArea({ children, dark, onToggleDark }) {
  return (
    <div style={{
      borderRadius: 8,
      border: '1px solid var(--border-subtle)',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: '#fff',
      }}>
        <span style={{
          fontFamily: 'var(--font-family)',
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--text-subtle)',
          textTransform: 'uppercase',
          letterSpacing: '0.4px',
        }}>
          Preview
        </span>
        <button
          onClick={onToggleDark}
          style={{
            padding: '2px 10px',
            borderRadius: 9999,
            border: '1px solid var(--border-default)',
            backgroundColor: dark ? 'var(--neutral-800)' : '#fff',
            color: dark ? '#fff' : 'var(--text-subtle)',
            fontSize: 11,
            fontFamily: 'var(--font-family)',
            cursor: 'pointer',
          }}
        >
          {dark ? 'Dark' : 'Light'}
        </button>
      </div>
      <div style={{
        minHeight: 140,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        backgroundColor: dark ? 'var(--neutral-800)' : '#fff',
        backgroundImage: dark ? 'none' : `
          linear-gradient(45deg, var(--neutral-200) 25%, transparent 25%),
          linear-gradient(-45deg, var(--neutral-200) 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, var(--neutral-200) 75%),
          linear-gradient(-45deg, transparent 75%, var(--neutral-200) 75%)
        `,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0',
      }}>
        {children}
      </div>
    </div>
  )
}

// ─── Token table ──────────────────────────────────────────────────────────────

function TokenTable({ tokens }) {
  if (!tokens || tokens.length === 0) return null
  return (
    <div style={{
      borderRadius: 8,
      border: '1px solid var(--border-subtle)',
      overflow: 'hidden',
      backgroundColor: '#fff',
    }}>
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <span style={{
          fontFamily: 'var(--font-family)',
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--text-subtle)',
          textTransform: 'uppercase',
          letterSpacing: '0.4px',
        }}>
          Token References
        </span>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--bg-subtle)' }}>
            {['Property', 'Value', 'Token'].map(h => (
              <th key={h} style={{
                padding: '6px 12px',
                textAlign: 'left',
                fontSize: 11,
                fontWeight: 700,
                fontFamily: 'var(--font-family)',
                color: 'var(--text-disabled)',
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
                borderBottom: '1px solid var(--border-subtle)',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tokens.map((t, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <td style={{ padding: '7px 12px', fontSize: 12, fontFamily: 'var(--font-family)', color: 'var(--text-subtle)', whiteSpace: 'nowrap' }}>
                {t.property}
              </td>
              <td style={{ padding: '7px 12px', fontSize: 11, fontFamily: 'monospace', color: 'var(--text-base)', maxWidth: 160, wordBreak: 'break-all' }}>
                {t.value}
              </td>
              <td style={{ padding: '7px 12px', fontSize: 11, fontFamily: 'var(--font-family)', color: 'var(--text-secondary)' }}>
                {t.token}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── All-states strip ─────────────────────────────────────────────────────────

function AllStatesStrip({ spec, variant, size }) {
  return (
    <div style={{
      borderRadius: 8,
      border: '1px solid var(--border-subtle)',
      overflow: 'hidden',
      backgroundColor: '#fff',
    }}>
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <span style={{
          fontFamily: 'var(--font-family)',
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--text-subtle)',
          textTransform: 'uppercase',
          letterSpacing: '0.4px',
        }}>
          All States — {variant} / {size}
        </span>
      </div>
      <div style={{
        padding: '24px 32px',
        display: 'flex',
        gap: 32,
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        backgroundColor: (variant === 'ghost' || variant === 'ghost-destructive')
          ? 'var(--bg-subtle)' : '#fff',
      }}>
        {spec.states.map(s => {
          const missing = spec.isMissing(variant, size, s)
          return (
            <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              {missing
                ? <MissingSpec label="—" />
                : spec.renderComponent({ variant, size, state: s, label: 'Button' })
              }
              <span style={{
                fontSize: 11,
                fontFamily: 'var(--font-family)',
                color: 'var(--text-subtle)',
                textTransform: 'uppercase',
                letterSpacing: '0.3px',
              }}>
                {s}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Placeholder for unbuilt components ──────────────────────────────────────

function ComingSoon({ comp }) {
  const variantCount = Math.max(comp.variants, 1)
  const propEntries = Object.entries(comp.variantProps || {})
  return (
    <div style={{
      padding: '48px 40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
      textAlign: 'center',
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: 'var(--bg-subtle)',
        border: '1px dashed var(--border-default)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        color: 'var(--text-disabled)',
      }}>
        ◻
      </div>
      <div>
        <div style={{
          fontFamily: 'var(--font-family)',
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--text-base)',
          marginBottom: 4,
        }}>
          Not yet implemented
        </div>
        <div style={{
          fontFamily: 'var(--font-family)',
          fontSize: 13,
          color: 'var(--text-subtle)',
        }}>
          {variantCount} variant{variantCount !== 1 ? 's' : ''} · Node {comp.id}
        </div>
      </div>
      {propEntries.length > 0 && (
        <div style={{
          marginTop: 8,
          padding: '12px 16px',
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: 8,
          border: '1px solid var(--border-subtle)',
          textAlign: 'left',
          maxWidth: 360,
          width: '100%',
        }}>
          {propEntries.map(([prop, values]) => (
            <div key={prop} style={{ marginBottom: 6, fontSize: 12, fontFamily: 'var(--font-family)' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-base)' }}>{prop}:</span>{' '}
              <span style={{ color: 'var(--text-subtle)' }}>{values.join(', ')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main Explorer page ───────────────────────────────────────────────────────

export default function Explorer() {
  const { nodeId: nodeIdParam } = useParams()
  const nodeId = nodeIdParam ? nodeIdParam.replace(/_/g, ':') : '16:182'

  const comp = componentIndex.find(c => c.id === nodeId)
  const spec  = REGISTRY[nodeId]

  const [variant, setVariant] = useState(spec?.defaultVariant ?? 'primary')
  const [size,    setSize]    = useState(spec?.defaultSize    ?? 'lg')
  const [state,   setState]   = useState(spec?.defaultState   ?? 'default')
  const [darkBg,  setDarkBg]  = useState(false)

  // Reset selectors when navigating to a new component
  const effectiveVariant = spec?.variants.includes(variant) ? variant : spec?.defaultVariant ?? 'primary'
  const effectiveState   = spec?.states.includes(state)     ? state   : spec?.defaultState   ?? 'default'
  const effectiveSize    = spec?.sizes.includes(size)        ? size    : spec?.defaultSize    ?? 'lg'

  const missing = spec?.isMissing(effectiveVariant, effectiveSize, effectiveState) ?? false
  const tokens  = spec && !missing
    ? spec.getTokens(effectiveVariant, effectiveSize, effectiveState)
    : []

  if (!comp) {
    return (
      <div style={{ padding: 40, fontFamily: 'var(--font-family)', color: 'var(--text-subtle)', fontSize: 14 }}>
        Component not found.
      </div>
    )
  }

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1200, minWidth: 0 }}>

      {/* Breadcrumb */}
      <div style={{
        fontFamily: 'var(--font-family)',
        fontSize: 13,
        color: 'var(--text-subtle)',
        marginBottom: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        <span>Components</span>
        <span style={{ color: 'var(--text-disabled)' }}>›</span>
        <span>{comp.category}</span>
        <span style={{ color: 'var(--text-disabled)' }}>›</span>
        <span style={{ color: 'var(--text-base)', fontWeight: 600 }}>{comp.name}</span>
      </div>

      {/* Heading */}
      <h1 style={{
        margin: '0 0 4px',
        fontFamily: 'var(--font-family)',
        fontSize: 32,
        fontWeight: 700,
        color: 'var(--text-base)',
        lineHeight: 1.2,
      }}>
        {comp.name}
      </h1>

      {/* Meta row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginBottom: 28,
        fontFamily: 'var(--font-family)',
        fontSize: 13,
        color: 'var(--text-subtle)',
      }}>
        {comp.variants > 0 && <span>{comp.variants} variants</span>}
        <span style={{ color: 'var(--border-default)' }}>·</span>
        <span>Node {comp.id}</span>
        <span style={{ color: 'var(--border-default)' }}>·</span>
        <a
          href={`https://www.figma.com/design/qESeTFW1GEEosrYnm4Hu3b?node-id=${encodeURIComponent(comp.id)}`}
          target="_blank"
          rel="noreferrer"
          style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 13 }}
        >
          Open in Figma ↗
        </a>
        {!spec && (
          <span style={{
            padding: '1px 8px',
            borderRadius: 4,
            backgroundColor: 'var(--bg-warning-subtle)',
            border: '1px solid var(--yellow-300)',
            color: 'var(--text-warning)',
            fontSize: 11,
            fontWeight: 600,
          }}>
            Coming soon
          </span>
        )}
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', marginBottom: 28 }} />

      {/* Unbuilt: show placeholder */}
      {!spec ? (
        <div style={{
          backgroundColor: '#fff',
          borderRadius: 8,
          border: '1px solid var(--border-subtle)',
        }}>
          <ComingSoon comp={comp} />
        </div>
      ) : (
        <>
          {/* Selectors */}
          <div style={{
            backgroundColor: '#fff',
            borderRadius: 8,
            border: '1px solid var(--border-subtle)',
            padding: '16px 20px',
            marginBottom: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            <PillSelector label="Variant" options={spec.variants} value={effectiveVariant} onChange={setVariant} />
            <PillSelector label="Size"    options={spec.sizes}    value={effectiveSize}    onChange={setSize}    />
            <PillSelector label="State"   options={spec.states}   value={effectiveState}   onChange={setState}   />
          </div>

          {/* Preview + Tokens side by side */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: 16,
            alignItems: 'start',
            marginBottom: 16,
          }}>
            <PreviewArea dark={darkBg} onToggleDark={() => setDarkBg(d => !d)}>
              {missing
                ? <MissingSpec label={`No Figma spec: ${effectiveVariant}/${effectiveSize}/${effectiveState}`} />
                : spec.renderComponent({ variant: effectiveVariant, size: effectiveSize, state: effectiveState, label: 'Pay Now' })
              }
            </PreviewArea>

            <div style={{ position: 'sticky', top: 24 }}>
              <TokenTable tokens={missing ? [] : tokens} />
              {missing && (
                <div style={{ padding: 16, backgroundColor: '#fff', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                  <MissingSpec label={`No Figma spec: ${effectiveVariant}/${effectiveSize}/${effectiveState}`} />
                </div>
              )}
            </div>
          </div>

          {/* All states */}
          <AllStatesStrip spec={spec} variant={effectiveVariant} size={effectiveSize} />
        </>
      )}

      {/* Bottom padding */}
      <div style={{ height: 48 }} />
    </div>
  )
}
