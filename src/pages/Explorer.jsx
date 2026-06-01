import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { componentIndex } from '../data/components'
import { useToc } from '../context/TocContext'
import Button, { MissingSpec, getTokensForVariant } from '../components/ds/Button'
import InputField, { getTokensForInput } from '../components/ds/InputField'

// ─── Registry ─────────────────────────────────────────────────────────────────

const VARIANTS = ['primary', 'secondary', 'ghost', 'gradient', 'ghost-destructive']
const STATES   = ['default', 'active', 'pressed', 'disabled', 'loading']
const SIZES    = ['lg', 'md', 'sm']

const INPUT_STATES = ['default', 'focused', 'typing', 'filled', 'error', 'error-filled', 'disabled']
const INPUT_SIZES  = ['lg', 'md']

const REGISTRY = {
  '16:182': {
    variants: VARIANTS,
    sizes: SIZES,
    states: STATES,
    defaultVariant: 'primary',
    defaultSize: 'lg',
    defaultState: 'default',
    renderComponent: ({ variant, size, state, label, platform }) => (
      <Button type={variant} size={size} state={state} label={label} platform={platform ?? 'android'} />
    ),
    getTokens: getTokensForVariant,
    isMissing: (variant, size, state) =>
      (variant === 'ghost-destructive' && size === 'md') ||
      ((variant === 'ghost' || variant === 'ghost-destructive') && state === 'loading'),
  },

  '109:1161': {
    variants: ['(none)'],
    sizes: INPUT_SIZES,
    states: INPUT_STATES,
    defaultVariant: '(none)',
    defaultSize: 'lg',
    defaultState: 'default',
    renderComponent: ({ size, state }) => (
      <InputField size={size} state={state} />
    ),
    getTokens: (variant, size, state) => getTokensForInput(size, state),
    isMissing: () => false,
  },
}

const SECTION_DEFS = [
  { id: 'anatomy',  label: 'Anatomy'  },
  { id: 'variants', label: 'Variants' },
  { id: 'states',   label: 'States'   },
  { id: 'specs',    label: 'Specs'    },
  { id: 'usage',    label: 'Usage'    },
]

const BASIC_SECTIONS = [{ id: 'overview', label: 'Overview' }]

// ─── Shared UI helpers ────────────────────────────────────────────────────────

function SectionHeading({ children }) {
  return (
    <h2 style={{
      fontFamily: 'var(--font-family)',
      fontSize: 20,
      fontWeight: 700,
      color: 'var(--text-base)',
      margin: '0 0 20px',
      paddingBottom: 12,
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      {children}
    </h2>
  )
}

function PillSelector({ label, options, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <span style={{
        fontFamily: 'var(--font-family)',
        fontSize: 11,
        fontWeight: 700,
        color: 'var(--text-disabled)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        minWidth: 52,
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

function PreviewArea({ children, platform, onChangePlatform }) {
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
        <div style={{ display: 'flex', gap: 2, borderRadius: 8, border: '1px solid var(--border-subtle)', padding: 2, backgroundColor: 'var(--bg-subtle)' }}>
          {['android', 'ios'].map(p => {
            const active = platform === p
            return (
              <button
                key={p}
                onClick={() => onChangePlatform(p)}
                style={{
                  padding: '2px 10px',
                  borderRadius: 6,
                  border: 'none',
                  backgroundColor: active ? '#fff' : 'transparent',
                  color: active ? 'var(--text-base)' : 'var(--text-subtle)',
                  fontSize: 11,
                  fontWeight: active ? 600 : 400,
                  fontFamily: 'var(--font-family)',
                  cursor: 'pointer',
                  boxShadow: active ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.1s',
                  textTransform: 'capitalize',
                }}
              >
                {p === 'android' ? 'Android' : 'iOS'}
              </button>
            )
          })}
        </div>
      </div>
      <div style={{
        minHeight: 140,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        backgroundColor: '#fff',
        backgroundImage: `
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

// ─── Anatomy section ──────────────────────────────────────────────────────────

const ANATOMY_PARTS = {
  '16:182': [
    { name: 'Background fill',    desc: 'Solid color, gradient, or transparent depending on variant' },
    { name: 'Label',              desc: 'Short action text · 600 weight · size-responsive font' },
    { name: 'Leading icon',       desc: 'Optional 16 × 16 icon to the left of label' },
    { name: 'Trailing icon',      desc: 'Optional 16 × 16 icon to the right of label' },
    { name: 'State overlay',      desc: 'Semi-transparent layer for active / pressed / disabled states' },
  ],
  '109:1161': [
    { name: 'Label row',          desc: '16px/400 text-base label + 14px/400 text-subtle "(Optional)" tag · gap 4px' },
    { name: 'Input box',          desc: 'bg-sunken (#EAEDF0) fill, radius 12px · height 48px (lg) / 40px (md) · padding 12px H' },
    { name: 'Placeholder text',   desc: '16px/400 text-subtle (#606C79) — shown in default, focused, error, disabled states' },
    { name: 'Value text',         desc: '16px/400 text-base (#1D2D40) — shown in typing, filled, error-filled states' },
    { name: 'Right icon',         desc: '20 × 20 icon slot (icon-placeholder instance) · text-subtle color' },
    { name: 'Focus / error ring', desc: '1px border · #265CE5 (bg-secondary) on focus/typing · #DD0C0C (text-error) on error states' },
    { name: 'Error message row',  desc: '14px/400 text-primary (#F84040) · shown below box on error / error-filled only' },
  ],
}

function AnatomySection({ nodeId, spec, platform }) {
  const parts = ANATOMY_PARTS[nodeId]
  const defaultVariant = spec.defaultVariant
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{
        padding: '32px',
        backgroundColor: 'var(--bg-subtle)',
        borderRadius: 8,
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'center',
        gap: 32,
        flexWrap: 'wrap',
        alignItems: 'flex-start',
      }}>
        {spec.sizes.map(sz => (
          <div key={sz} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            {spec.renderComponent({ variant: defaultVariant, size: sz, state: 'default', label: 'Pay now', platform })}
            <span style={{ fontFamily: 'var(--font-family)', fontSize: 11, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{sz}</span>
          </div>
        ))}
      </div>
      {parts && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderRadius: 8, border: '1px solid var(--border-subtle)', overflow: 'hidden', backgroundColor: '#fff' }}>
          {parts.map((p, i) => (
            <div
              key={p.name}
              style={{
                display: 'flex',
                gap: 16,
                padding: '10px 16px',
                borderBottom: i < parts.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                alignItems: 'baseline',
              }}
            >
              <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-primary)', minWidth: 140, flexShrink: 0 }}>{p.name}</span>
              <span style={{ fontFamily: 'var(--font-family)', fontSize: 13, color: 'var(--text-subtle)' }}>{p.desc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── States section ───────────────────────────────────────────────────────────

function StatesSection({ spec, variant, size, platform }) {
  const isGhost = variant === 'ghost' || variant === 'ghost-destructive'
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
        backgroundColor: 'var(--bg-subtle)',
      }}>
        <span style={{ fontFamily: 'var(--font-family)', fontSize: 12, fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
          All States — {variant === '(none)' ? '' : `${variant} / `}{size}
        </span>
      </div>
      <div style={{
        padding: '28px 32px',
        display: 'flex',
        gap: 32,
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        backgroundColor: isGhost ? 'var(--bg-subtle)' : '#fff',
      }}>
        {spec.states.map(s => {
          const missing = spec.isMissing(variant, size, s)
          return (
            <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              {missing
                ? <MissingSpec label="—" />
                : spec.renderComponent({ variant, size, state: s, label: 'Button', platform })
              }
              <span style={{ fontSize: 11, fontFamily: 'var(--font-family)', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                {s}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Specs section ────────────────────────────────────────────────────────────

function SpecsTable({ tokens }) {
  if (!tokens || tokens.length === 0) return null
  return (
    <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', overflow: 'hidden', backgroundColor: '#fff' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--bg-subtle)' }}>
            {['Property', 'Value', 'Token', 'Resolves'].map(h => (
              <th key={h} style={{
                padding: '7px 12px',
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
              <td style={{ padding: '7px 12px', fontSize: 11, fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                {t.tokenPath}
              </td>
              <td style={{ padding: '7px 12px', fontSize: 11, fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                {t.resolves}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Usage section ────────────────────────────────────────────────────────────

const USAGE = {
  '16:182': {
    dos: [
      'Use Primary for the single most important action on screen.',
      'Use Gradient for high-emphasis CTAs in promotional contexts.',
      'Use Ghost for low-priority or tertiary actions.',
      'Keep labels short and action-oriented (2–3 words max).',
    ],
    donts: [
      'Don\'t place more than one Primary button in the same view.',
      'Don\'t mix Gradient and Primary buttons in the same section.',
      'Avoid vague labels like "Click here" or "Submit".',
      'Don\'t use disabled state without a clear reason visible to users.',
    ],
  },
  '109:1161': {
    dos: [
      'Always pair the input with a visible label above the field.',
      'Show error messages immediately below the field in error / error-filled states.',
      'Use the focused border (#265CE5) to confirm the field is active.',
      'Use lg size for primary forms; md size for compact or secondary flows.',
    ],
    donts: [
      'Don\'t use placeholder text as a substitute for a label.',
      'Don\'t suppress the error message — always tell the user what went wrong.',
      'Don\'t disable a field without making the reason obvious in context.',
      'Don\'t mix lg and md inputs within the same form.',
    ],
  },
}

function UsageSection({ nodeId }) {
  const rules = USAGE[nodeId]
  if (!rules) return <p style={{ fontFamily: 'var(--font-family)', fontSize: 14, color: 'var(--text-subtle)' }}>Usage guidelines not yet documented.</p>
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', overflow: 'hidden', backgroundColor: '#fff' }}>
        <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-subtle)', backgroundColor: '#F0FAF0', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14 }}>✓</span>
          <span style={{ fontFamily: 'var(--font-family)', fontSize: 13, fontWeight: 700, color: '#1A7A34' }}>Do</span>
        </div>
        <ul style={{ margin: 0, padding: '12px 16px 12px 32px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rules.dos.map((d, i) => (
            <li key={i} style={{ fontFamily: 'var(--font-family)', fontSize: 13, color: 'var(--text-base)', lineHeight: 1.5 }}>{d}</li>
          ))}
        </ul>
      </div>
      <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', overflow: 'hidden', backgroundColor: '#fff' }}>
        <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-error-subtle)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14 }}>✕</span>
          <span style={{ fontFamily: 'var(--font-family)', fontSize: 13, fontWeight: 700, color: 'var(--text-error)' }}>Don't</span>
        </div>
        <ul style={{ margin: 0, padding: '12px 16px 12px 32px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rules.donts.map((d, i) => (
            <li key={i} style={{ fontFamily: 'var(--font-family)', fontSize: 13, color: 'var(--text-base)', lineHeight: 1.5 }}>{d}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ─── Coming soon placeholder ──────────────────────────────────────────────────

function ComingSoon({ comp }) {
  const variantCount = Math.max(comp.variants, 1)
  const propEntries = Object.entries(comp.variantProps || {})
  return (
    <div style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
      <div style={{
        width: 48, height: 48, borderRadius: 8, backgroundColor: 'var(--bg-subtle)',
        border: '1px dashed var(--border-default)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 20, color: 'var(--text-disabled)',
      }}>◻</div>
      <div>
        <div style={{ fontFamily: 'var(--font-family)', fontSize: 14, fontWeight: 600, color: 'var(--text-base)', marginBottom: 4 }}>
          Not yet implemented
        </div>
        <div style={{ fontFamily: 'var(--font-family)', fontSize: 13, color: 'var(--text-subtle)' }}>
          {variantCount} variant{variantCount !== 1 ? 's' : ''} · Node {comp.id}
        </div>
      </div>
      {propEntries.length > 0 && (
        <div style={{ marginTop: 8, padding: '12px 16px', backgroundColor: 'var(--bg-subtle)', borderRadius: 8, border: '1px solid var(--border-subtle)', textAlign: 'left', maxWidth: 360, width: '100%' }}>
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
  const { setSections } = useToc()

  const comp = componentIndex.find(c => c.id === nodeId)
  const spec = REGISTRY[nodeId]

  const [variant, setVariant] = useState(spec?.defaultVariant ?? 'primary')
  const [size,    setSize]    = useState(spec?.defaultSize    ?? 'lg')
  const [state,   setState]   = useState(spec?.defaultState   ?? 'default')
  const [platform, setPlatform] = useState('android')

  useEffect(() => {
    setSections(spec ? SECTION_DEFS : BASIC_SECTIONS)
    return () => setSections([])
  }, [nodeId])

  const effectiveVariant = spec?.variants.includes(variant) ? variant : spec?.defaultVariant ?? 'primary'
  const effectiveSize    = spec?.sizes.includes(size)        ? size    : spec?.defaultSize    ?? 'lg'
  const effectiveState   = spec?.states.includes(state)      ? state   : spec?.defaultState   ?? 'default'

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
    <div id="overview" style={{ fontFamily: 'var(--font-family)' }}>

      {/* Breadcrumb */}
      <div style={{ fontSize: 13, color: 'var(--text-subtle)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>Components</span>
        <span style={{ color: 'var(--text-disabled)' }}>›</span>
        <span>{comp.category}</span>
        <span style={{ color: 'var(--text-disabled)' }}>›</span>
        <span style={{ color: 'var(--text-base)', fontWeight: 600 }}>{comp.name}</span>
      </div>

      <h1 style={{ margin: '0 0 8px', fontSize: 32, fontWeight: 700, color: 'var(--text-base)', lineHeight: 1.2 }}>
        {comp.name}
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, fontSize: 13, color: 'var(--text-subtle)', flexWrap: 'wrap' }}>
        {comp.variants > 0 && <span>{comp.variants} variants</span>}
        <span style={{ color: 'var(--border-default)' }}>·</span>
        <span>Node {comp.id}</span>
        <span style={{ color: 'var(--border-default)' }}>·</span>
        <a
          href={`https://www.figma.com/design/qESeTFW1GEEosrYnm4Hu3b?node-id=${encodeURIComponent(comp.id)}`}
          target="_blank"
          rel="noreferrer"
          style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
        >
          Open in Figma ↗
        </a>
        {!spec && (
          <span style={{ padding: '1px 8px', borderRadius: 4, backgroundColor: 'var(--bg-warning-subtle)', border: '1px solid var(--yellow-300)', color: 'var(--text-warning)', fontSize: 11, fontWeight: 600 }}>
            Coming soon
          </span>
        )}
      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)', marginBottom: 40 }} />

      {/* Unbuilt: placeholder only */}
      {!spec ? (
        <div style={{ backgroundColor: '#fff', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
          <ComingSoon comp={comp} />
        </div>
      ) : (
        <>
          {/* ── Anatomy ── */}
          <section id="anatomy" style={{ marginBottom: 56 }}>
            <SectionHeading>Anatomy</SectionHeading>
            <AnatomySection nodeId={nodeId} spec={spec} platform={platform} />
          </section>

          {/* ── Variants ── */}
          <section id="variants" style={{ marginBottom: 56 }}>
            <SectionHeading>Variants</SectionHeading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ backgroundColor: '#fff', borderRadius: 8, border: '1px solid var(--border-subtle)', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {effectiveVariant !== '(none)' && (
                  <PillSelector label="Variant" options={spec.variants} value={effectiveVariant} onChange={setVariant} />
                )}
                <PillSelector label="Size"  options={spec.sizes}  value={effectiveSize}  onChange={setSize}  />
                <PillSelector label="State" options={spec.states} value={effectiveState} onChange={setState} />
              </div>
              <PreviewArea platform={platform} onChangePlatform={setPlatform}>
                {missing
                  ? <MissingSpec label={`No Figma spec: ${effectiveVariant}/${effectiveSize}/${effectiveState}`} />
                  : spec.renderComponent({ variant: effectiveVariant, size: effectiveSize, state: effectiveState, label: 'Pay now', platform })
                }
              </PreviewArea>
            </div>
          </section>

          {/* ── States ── */}
          <section id="states" style={{ marginBottom: 56 }}>
            <SectionHeading>States</SectionHeading>
            <StatesSection spec={spec} variant={effectiveVariant} size={effectiveSize} platform={platform} />
          </section>

          {/* ── Specs ── */}
          <section id="specs" style={{ marginBottom: 56 }}>
            <SectionHeading>Specs</SectionHeading>
            {missing ? (
              <div style={{ padding: 16, backgroundColor: '#fff', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                <MissingSpec label={`No Figma spec: ${effectiveVariant}/${effectiveSize}/${effectiveState}`} />
              </div>
            ) : (
              <SpecsTable tokens={tokens} />
            )}
          </section>

          {/* ── Usage ── */}
          <section id="usage" style={{ marginBottom: 56 }}>
            <SectionHeading>Usage</SectionHeading>
            <UsageSection nodeId={nodeId} />
          </section>
        </>
      )}

      <div style={{ height: 48 }} />
    </div>
  )
}
