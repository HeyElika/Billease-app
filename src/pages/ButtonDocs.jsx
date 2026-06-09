import { useState } from 'react'
import Button, { MissingSpec, getTokensForVariant } from '../components/ds/Button'

// ─── Display label mappings ───────────────────────────────────────────────────

const SIZE_LABEL = { lg: 'Large', md: 'Medium', sm: 'Small' }
const VARIANT_LABEL = {
  primary: 'Primary',
  secondary: 'Secondary',
  ghost: 'Ghost',
  gradient: 'Gradient',
  'ghost-destructive': 'Ghost Destructive',
}
const STATE_LABEL = {
  default: 'Default',
  active: 'Hover',
  pressed: 'Pressed',
  disabled: 'Disabled',
  loading: 'Loading',
}

const isGhost = v => v === 'ghost' || v === 'ghost-destructive'

// ─── Shared sub-components ────────────────────────────────────────────────────

function DocSection({ id, title, children }) {
  return (
    <section id={id} style={{ marginBottom: 56 }}>
      <h2 style={{
        fontFamily: 'var(--font-family)',
        fontSize: 20,
        fontWeight: 700,
        color: 'var(--text-base)',
        margin: '0 0 20px',
        paddingBottom: 12,
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

function DocCard({ children, style }) {
  return (
    <div style={{
      backgroundColor: '#fff',
      border: '1px solid var(--border-subtle)',
      borderRadius: 8,
      overflow: 'hidden',
      ...style,
    }}>
      {children}
    </div>
  )
}

function CardHeader({ label }) {
  return (
    <div style={{
      padding: '10px 16px',
      borderBottom: '1px solid var(--border-subtle)',
      backgroundColor: 'var(--bg-subtle)',
    }}>
      <span style={{
        fontFamily: 'var(--font-family)',
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--text-subtle)',
        textTransform: 'uppercase',
        letterSpacing: '0.4px',
      }}>
        {label}
      </span>
    </div>
  )
}

function CardBody({ children, style }) {
  return (
    <div style={{
      padding: '28px 32px',
      display: 'flex',
      gap: 32,
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      backgroundColor: '#fff',
      ...style,
    }}>
      {children}
    </div>
  )
}

// ─── Section 1: Appearance ────────────────────────────────────────────────────

function AppearanceSection({ spec, platform }) {
  return (
    <DocCard>
      <CardHeader label="All variants" />
      <CardBody>
        {spec.variants.map(variant => (
          <div key={variant} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            {spec.renderComponent({ variant, size: 'lg', state: 'default', label: VARIANT_LABEL[variant] || variant, platform })}
            <span style={{ fontFamily: 'var(--font-family)', fontSize: 11, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.4px', textAlign: 'center' }}>
              {VARIANT_LABEL[variant] || variant}
            </span>
          </div>
        ))}
      </CardBody>
    </DocCard>
  )
}

// ─── Section 2: States ────────────────────────────────────────────────────────

function StatesSection({ spec, platform }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {spec.variants.map(variant => (
        <DocCard key={variant}>
          <CardHeader label={VARIANT_LABEL[variant] || variant} />
          <CardBody>
            {spec.states.map(state => {
              if (spec.isMissing(variant, spec.defaultSize, state)) return null
              return (
                <div key={state} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  {spec.renderComponent({
                    variant,
                    size: spec.defaultSize,
                    state,
                    label: 'Button',
                    platform,
                  })}
                  <span style={{
                    fontFamily: 'var(--font-family)',
                    fontSize: 11,
                    color: 'var(--text-subtle)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px',
                  }}>
                    {STATE_LABEL[state] || state}
                  </span>
                </div>
              )
            })}
          </CardBody>
        </DocCard>
      ))}
    </div>
  )
}

// ─── Section 3: Sizes ─────────────────────────────────────────────────────────

function SizesSection({ spec, platform }) {
  return (
    <DocCard>
      <CardHeader label="All sizes — Primary" />
      <CardBody style={{ alignItems: 'flex-end' }}>
        {spec.sizes.map(size => (
          <div key={size} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}>
            {spec.renderComponent({
              variant: 'primary',
              size,
              state: 'default',
              label: SIZE_LABEL[size] || size,
              platform,
            })}
            <span style={{
              fontFamily: 'var(--font-family)',
              fontSize: 11,
              color: 'var(--text-subtle)',
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
            }}>
              {SIZE_LABEL[size] || size}
            </span>
          </div>
        ))}
      </CardBody>
    </DocCard>
  )
}

// ─── Section 4: Icon Slots ────────────────────────────────────────────────────

function IconSlotsSection({ spec, platform }) {
  const variants = spec.variants
  const labelStyle = {
    fontFamily: 'var(--font-family)',
    fontSize: 11,
    color: 'var(--text-subtle)',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
    textAlign: 'center',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: '10px 14px', backgroundColor: 'var(--bg-warning-subtle)', borderRadius: 8, border: '1px solid var(--yellow-300)' }}>
        <span style={{ fontSize: 13, fontFamily: 'var(--font-family)', color: 'var(--text-warning)', fontWeight: 500 }}>
          Only one icon slot can be active at a time — leading OR trailing, never both simultaneously.
        </span>
      </div>

      <DocCard>
        <CardHeader label="Leading icon — left of label" />
        <CardBody>
          {variants.map(variant => (
            <div key={variant} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              {spec.renderComponent({ variant, size: 'lg', state: 'default', label: VARIANT_LABEL[variant], platform, iconLeft: true })}
              <span style={labelStyle}>{VARIANT_LABEL[variant]}</span>
            </div>
          ))}
        </CardBody>
      </DocCard>

      <DocCard>
        <CardHeader label="Trailing icon — right of label" />
        <CardBody>
          {variants.map(variant => (
            <div key={variant} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              {spec.renderComponent({ variant, size: 'lg', state: 'default', label: VARIANT_LABEL[variant], platform, iconRight: true })}
              <span style={labelStyle}>{VARIANT_LABEL[variant]}</span>
            </div>
          ))}
        </CardBody>
      </DocCard>

      <DocCard>
        <CardHeader label="Icon button" />
        <CardBody>
          {variants.map(variant => (
            <div key={variant} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              {spec.renderComponent({ variant, size: 'lg', state: 'default', label: '', platform, iconOnly: true })}
              <span style={labelStyle}>{VARIANT_LABEL[variant]}</span>
            </div>
          ))}
        </CardBody>
      </DocCard>
    </div>
  )
}

// ─── Section 5: Button Groups ─────────────────────────────────────────────────

function ButtonGroupsSection({ spec, platform }) {
  const patterns = [
    {
      label: 'Horizontal group',
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          {spec.renderComponent({ variant: 'primary', size: 'lg', state: 'default', label: 'Confirm', platform })}
          {spec.renderComponent({ variant: 'secondary', size: 'lg', state: 'default', label: 'Cancel', platform })}
        </div>
      ),
    },
    {
      label: 'Vertical group',
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 240 }}>
          {spec.renderComponent({ variant: 'primary', size: 'lg', state: 'default', label: 'Pay now', platform })}
          {spec.renderComponent({ variant: 'secondary', size: 'lg', state: 'default', label: 'Cancel', platform })}
        </div>
      ),
    },
    {
      label: 'Mobile stacked',
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 260 }}>
          {spec.renderComponent({ variant: 'primary', size: 'lg', state: 'default', label: 'Pay now', platform })}
          {spec.renderComponent({ variant: 'secondary', size: 'lg', state: 'default', label: 'Cancel', platform })}
        </div>
      ),
    },
    {
      label: 'Ghost + Primary',
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          {spec.renderComponent({ variant: 'ghost', size: 'lg', state: 'default', label: 'Cancel', platform })}
          {spec.renderComponent({ variant: 'primary', size: 'lg', state: 'default', label: 'Confirm', platform })}
        </div>
      ),
    },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 16,
    }}>
      {patterns.map(pattern => (
        <DocCard key={pattern.label}>
          <CardHeader label={pattern.label} />
          <div style={{
            padding: '32px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-subtle)',
            minHeight: 120,
          }}>
            {pattern.render()}
          </div>
        </DocCard>
      ))}
    </div>
  )
}

// ─── Section 6: Specs ─────────────────────────────────────────────────────────

function ColorChip({ resolves }) {
  const hexMatch = typeof resolves === 'string' ? resolves.match(/#[0-9A-Fa-f]{3,8}/) : null
  if (!hexMatch) return null
  return (
    <span style={{
      display: 'inline-block',
      width: 12,
      height: 12,
      borderRadius: 3,
      backgroundColor: hexMatch[0],
      border: '1px solid rgba(0,0,0,0.10)',
      verticalAlign: 'middle',
      marginRight: 6,
      flexShrink: 0,
    }} />
  )
}

function TokenCell({ tokenPath, resolves }) {
  if (!tokenPath || tokenPath === '—') {
    return (
      <td style={{
        padding: '7px 12px',
        fontSize: 11,
        fontFamily: 'monospace',
        color: 'var(--text-disabled)',
        whiteSpace: 'nowrap',
      }}>
        —
      </td>
    )
  }
  return (
    <td style={{
      padding: '7px 12px',
      fontSize: 11,
      fontFamily: 'monospace',
      color: 'var(--text-base)',
    }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        <ColorChip resolves={resolves} />
        <span style={{ color: 'var(--text-secondary)' }}>{tokenPath}</span>
        <span style={{ color: 'var(--text-disabled)', margin: '0 4px' }}> → </span>
        <span style={{ color: 'var(--text-base)' }}>{resolves}</span>
      </span>
    </td>
  )
}

function AppearanceTokensTable({ spec, activeVariant }) {
  const columnProps = ['background', 'overlay (state)', 'color']

  return (
    <div style={{
      borderRadius: 8,
      border: '1px solid var(--border-subtle)',
      overflow: 'hidden',
      backgroundColor: '#fff',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--bg-subtle)' }}>
            {['State', 'Background', 'Overlay', 'Text color'].map(h => (
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
                whiteSpace: 'nowrap',
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {spec.states.map((state, i) => {
            if (spec.isMissing(activeVariant, 'lg', state)) return null
            const tokens = getTokensForVariant(activeVariant, 'lg', state)
            const bgToken      = tokens.find(t => t.property === 'background')
            const overlayToken = tokens.find(t => t.property === 'overlay (state)')
            const colorToken   = tokens.find(t => t.property === 'color')
            return (
              <tr key={state} style={{
                borderBottom: i < spec.states.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              }}>
                <td style={{
                  padding: '7px 12px',
                  fontSize: 12,
                  fontFamily: 'var(--font-family)',
                  color: 'var(--text-base)',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}>
                  {STATE_LABEL[state] || state}
                </td>
                <TokenCell
                  tokenPath={bgToken?.tokenPath}
                  resolves={bgToken?.resolves}
                />
                <TokenCell
                  tokenPath={overlayToken?.tokenPath ?? '—'}
                  resolves={overlayToken?.resolves ?? '—'}
                />
                <TokenCell
                  tokenPath={colorToken?.tokenPath}
                  resolves={colorToken?.resolves}
                />
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function SizeTokensTable({ spec }) {
  const PROPERTY_KEYS = ['height', 'font-size', 'padding-left/right', 'gap', 'font-weight', 'border-radius']

  // Build a map: property → { lg: resolves, md: resolves, sm: resolves }
  const dataMap = {}
  spec.sizes.forEach(size => {
    const tokens = getTokensForVariant('primary', size, 'default')
    tokens.forEach(t => {
      if (!dataMap[t.property]) dataMap[t.property] = {}
      dataMap[t.property][size] = t.resolves
    })
  })

  const rows = PROPERTY_KEYS.filter(prop => {
    const row = dataMap[prop]
    return row && spec.sizes.some(s => row[s] !== undefined)
  })

  return (
    <div style={{
      borderRadius: 8,
      border: '1px solid var(--border-subtle)',
      overflow: 'hidden',
      backgroundColor: '#fff',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--bg-subtle)' }}>
            <th style={{
              padding: '7px 12px',
              textAlign: 'left',
              fontSize: 11,
              fontWeight: 700,
              fontFamily: 'var(--font-family)',
              color: 'var(--text-disabled)',
              textTransform: 'uppercase',
              letterSpacing: '0.4px',
              borderBottom: '1px solid var(--border-subtle)',
            }}>
              Property
            </th>
            {spec.sizes.map(size => (
              <th key={size} style={{
                padding: '7px 12px',
                textAlign: 'left',
                fontSize: 11,
                fontWeight: 700,
                fontFamily: 'var(--font-family)',
                color: 'var(--text-disabled)',
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
                borderBottom: '1px solid var(--border-subtle)',
                whiteSpace: 'nowrap',
              }}>
                {SIZE_LABEL[size] || size}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((prop, i) => (
            <tr key={prop} style={{
              borderBottom: i < rows.length - 1 ? '1px solid var(--border-subtle)' : 'none',
            }}>
              <td style={{
                padding: '7px 12px',
                fontSize: 12,
                fontFamily: 'var(--font-family)',
                color: 'var(--text-subtle)',
                whiteSpace: 'nowrap',
              }}>
                {prop}
              </td>
              {spec.sizes.map(size => (
                <td key={size} style={{
                  padding: '7px 12px',
                  fontSize: 11,
                  fontFamily: 'monospace',
                  color: 'var(--text-base)',
                }}>
                  {dataMap[prop]?.[size] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SpecsSection({ spec }) {
  const [activeVariant, setActiveVariant] = useState(spec.defaultVariant ?? 'primary')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      {/* Appearance Tokens */}
      <div>
        <div style={{ marginBottom: 4 }}>
          <span style={{
            fontFamily: 'var(--font-family)',
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--text-base)',
          }}>
            Appearance Tokens
          </span>
        </div>
        <div style={{
          marginBottom: 16,
          fontFamily: 'var(--font-family)',
          fontSize: 13,
          color: 'var(--text-subtle)',
        }}>
          Background and text color by state, grouped by appearance
        </div>

        {/* Tab bar */}
        <div style={{
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
          marginBottom: 16,
        }}>
          {spec.variants.map(variant => {
            const active = activeVariant === variant
            return (
              <button
                key={variant}
                onClick={() => setActiveVariant(variant)}
                style={{
                  padding: '4px 14px',
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
                {VARIANT_LABEL[variant] || variant}
              </button>
            )
          })}
        </div>

        <AppearanceTokensTable spec={spec} activeVariant={activeVariant} />
      </div>

      {/* Size Tokens */}
      <div>
        <div style={{ marginBottom: 4 }}>
          <span style={{
            fontFamily: 'var(--font-family)',
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--text-base)',
          }}>
            Size Tokens
          </span>
        </div>
        <div style={{
          marginBottom: 16,
          fontFamily: 'var(--font-family)',
          fontSize: 13,
          color: 'var(--text-subtle)',
        }}>
          Dimension and spacing values across sizes
        </div>
        <SizeTokensTable spec={spec} />
      </div>
    </div>
  )
}

// ─── Platform toggle ──────────────────────────────────────────────────────────

function PlatformToggle({ platform, onChangePlatform }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: 24,
      alignItems: 'center',
      gap: 8,
    }}>
      <span style={{
        fontFamily: 'var(--font-family)',
        fontSize: 11,
        color: 'var(--text-disabled)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        Platform
      </span>
      <div style={{
        display: 'flex',
        gap: 2,
        borderRadius: 8,
        border: '1px solid var(--border-subtle)',
        padding: 2,
        backgroundColor: 'var(--bg-subtle)',
      }}>
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
  )
}

// ─── Main ButtonDocs component ────────────────────────────────────────────────

export default function ButtonDocs({ comp, spec, platform, onChangePlatform }) {
  return (
    <div style={{ fontFamily: 'var(--font-family)' }}>
      <PlatformToggle platform={platform} onChangePlatform={onChangePlatform} />

      <DocSection id="appearance" title="Appearance">
        <AppearanceSection spec={spec} platform={platform} />
      </DocSection>

      <DocSection id="states" title="States">
        <StatesSection spec={spec} platform={platform} />
      </DocSection>

      <DocSection id="sizes" title="Sizes">
        <SizesSection spec={spec} platform={platform} />
      </DocSection>

      <DocSection id="icon-slots" title="Icon Slots">
        <IconSlotsSection spec={spec} platform={platform} />
      </DocSection>

      <DocSection id="button-groups" title="Button Groups">
        <ButtonGroupsSection spec={spec} platform={platform} />
      </DocSection>

      <DocSection id="specs" title="Specs">
        <SpecsSection spec={spec} />
      </DocSection>
    </div>
  )
}
