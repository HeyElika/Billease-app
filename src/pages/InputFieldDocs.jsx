import { useState } from 'react'
import InputField, { getTokensForInput } from '../components/ds/InputField'
import { CHANGELOGS } from '../data/changelog'

// ─── Label maps ───────────────────────────────────────────────────────────────

const VARIANT_LABEL = { text: 'Text', phone: 'Phone' }
const STATE_LABEL = {
  default:        'Default',
  focused:        'Focused',
  typing:         'Typing',
  filled:         'Filled',
  error:          'Error',
  'error-filled': 'Error filled',
  disabled:       'Disabled',
}
const SIZE_LABEL = { lg: 'Large', md: 'Medium' }

const VARIANTS = ['text', 'phone']
const STATES   = ['default', 'focused', 'typing', 'filled', 'error', 'error-filled', 'disabled']
const SIZES    = ['lg', 'md']

// ─── Shared layout ─────────────────────────────────────────────────────────────

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

function AppearanceSection() {
  return (
    <DocCard>
      <CardHeader label="All variants" />
      <CardBody>
        {VARIANTS.map(variant => (
          <div key={variant} style={{ minWidth: 280 }}>
            <InputField
              variant={variant}
              size="lg"
              state="default"
              label={VARIANT_LABEL[variant]}
              showIcon={false}
            />
          </div>
        ))}
      </CardBody>
    </DocCard>
  )
}

// ─── Section 2: States ────────────────────────────────────────────────────────

function StatesSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {VARIANTS.map(variant => (
        <DocCard key={variant}>
          <CardHeader label={VARIANT_LABEL[variant]} />
          <CardBody>
            {STATES.map(state => (
              <div key={state} style={{ width: 260, flexShrink: 0 }}>
                <InputField
                  variant={variant}
                  size="lg"
                  state={state}
                  label={STATE_LABEL[state]}
                  showIcon={false}
                />
              </div>
            ))}
          </CardBody>
        </DocCard>
      ))}
    </div>
  )
}

// ─── Section 3: Sizes ─────────────────────────────────────────────────────────

function SizesSection() {
  return (
    <DocCard>
      <CardHeader label="All sizes — Text variant" />
      <CardBody style={{ alignItems: 'flex-start' }}>
        {SIZES.map(size => (
          <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8, minWidth: 280 }}>
            <InputField
              variant="text"
              size={size}
              state="default"
              label={SIZE_LABEL[size]}
            />
            <span style={{
              fontFamily: 'var(--font-family)',
              fontSize: 11,
              color: 'var(--text-subtle)',
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
            }}>
              {SIZE_LABEL[size]}
            </span>
          </div>
        ))}
      </CardBody>
    </DocCard>
  )
}

// ─── Section 4: Properties ────────────────────────────────────────────────────

function PropertiesSection() {
  const labelStyle = {
    fontFamily: 'var(--font-family)',
    fontSize: 11,
    color: 'var(--text-subtle)',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  }

  const properties = [
    {
      label: 'Optional label',
      desc: 'Appends an "(Optional)" tag beside the field label. Use when the field is not required.',
      render: () => (
        <InputField variant="text" size="lg" state="default" label="Account name" showOptional={true} />
      ),
    },
    {
      label: 'Info message',
      desc: 'Displays a helper text row below the input in non-error states. Hidden when an error is shown.',
      render: () => (
        <InputField variant="text" size="lg" state="default" label="Account name" info={true} infoMessage="Info message goes here" />
      ),
    },
    {
      label: 'Character limit',
      desc: 'Shows a character counter below the input. In error states it appears inline with the error message.',
      render: () => (
        <InputField variant="text" size="lg" state="typing" label="Account name" characterLimit={true} maxLength={50} />
      ),
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {properties.map(prop => (
        <DocCard key={prop.label}>
          <CardHeader label={prop.label} />
          <CardBody style={{ gap: 40, alignItems: 'center' }}>
            <div style={{ minWidth: 280 }}>
              {prop.render()}
            </div>
            <span style={{ ...labelStyle, fontSize: 13, textTransform: 'none', letterSpacing: 0, color: 'var(--text-subtle)', lineHeight: 1.5, maxWidth: 320 }}>
              {prop.desc}
            </span>
          </CardBody>
        </DocCard>
      ))}
    </div>
  )
}

// ─── Section 5: Icon Slot ─────────────────────────────────────────────────────

function IconSlotSection() {
  const descStyle = {
    fontSize: 13,
    fontFamily: 'var(--font-family)',
    color: 'var(--text-subtle)',
    lineHeight: 1.5,
    maxWidth: 320,
  }

  const slots = [
    {
      label: 'Hidden (default)',
      desc: 'No icon slot rendered. Use this when the field does not need a clear or action button.',
      render: () => (
        <InputField variant="text" size="lg" state="typing" label="Account name" showIcon={false} />
      ),
    },
    {
      label: 'Clear button (close-bold)',
      desc: 'Visible in typing state only. Tapping it clears the field value. The slot is always reserved (20×20) but invisible in all other states.',
      render: () => (
        <InputField variant="text" size="lg" state="typing" label="Account name" showIcon={true} />
      ),
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: '10px 14px', backgroundColor: 'var(--bg-warning-subtle)', borderRadius: 8, border: '1px solid var(--yellow-300)' }}>
        <span style={{ fontSize: 13, fontFamily: 'var(--font-family)', color: 'var(--text-warning)', fontWeight: 500 }}>
          The right icon slot is optional and contextual — it is hidden by default. Only enable it when an explicit in-field action is needed (e.g., clear, show/hide password).
        </span>
      </div>
      {slots.map(slot => (
        <DocCard key={slot.label}>
          <CardHeader label={slot.label} />
          <CardBody style={{ gap: 40, alignItems: 'center' }}>
            <div style={{ minWidth: 280 }}>
              {slot.render()}
            </div>
            <span style={descStyle}>{slot.desc}</span>
          </CardBody>
        </DocCard>
      ))}
    </div>
  )
}

// ─── Section 7: Specs ─────────────────────────────────────────────────────────

function ColorChip({ resolves }) {
  if (typeof resolves !== 'string') return null
  const color = (resolves.match(/#[0-9A-Fa-f]{3,8}/) || resolves.match(/rgba?\([^)]+\)/))?.[0]
  if (!color) return null
  return (
    <span style={{
      display: 'inline-block',
      width: 12,
      height: 12,
      borderRadius: 3,
      backgroundColor: color,
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
      <td style={{ padding: '7px 12px', fontSize: 11, fontFamily: 'monospace', color: 'var(--text-disabled)', whiteSpace: 'nowrap' }}>
        —
      </td>
    )
  }
  return (
    <td style={{ padding: '7px 12px', fontSize: 11, fontFamily: 'monospace', color: 'var(--text-base)' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <ColorChip resolves={resolves} />
        <span style={{ color: 'var(--text-secondary)' }}>{tokenPath}</span>
      </span>
    </td>
  )
}

function AppearanceTokensTable({ activeState }) {
  const thStyle = {
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
  }

  return (
    <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', overflow: 'hidden', backgroundColor: '#fff' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--bg-subtle)' }}>
            {['Size', 'Background', 'Border', 'Input color'].map(h => (
              <th key={h} style={thStyle}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SIZES.map((size, i) => {
            const tokens = getTokensForInput(size, activeState)
            const bgToken    = tokens.find(t => t.property === 'background')
            const borderToken = tokens.find(t => t.property === 'border')
            const colorToken  = tokens.find(t => t.property === 'input color')
            return (
              <tr key={size} style={{ borderBottom: i < SIZES.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                <td style={{ padding: '7px 12px', fontSize: 12, fontFamily: 'var(--font-family)', color: 'var(--text-subtle)', whiteSpace: 'nowrap' }}>
                  {SIZE_LABEL[size]}
                </td>
                <TokenCell tokenPath={bgToken?.tokenPath}     resolves={bgToken?.resolves} />
                <TokenCell tokenPath={borderToken?.tokenPath} resolves={borderToken?.resolves} />
                <TokenCell tokenPath={colorToken?.tokenPath}  resolves={colorToken?.resolves} />
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function SizeTokensTable() {
  const PROPERTY_KEYS = ['height (box)', 'padding-top/bottom', 'padding-left/right', 'border-radius', 'gap (inner)']

  const dataMap = {}
  SIZES.forEach(size => {
    const tokens = getTokensForInput(size, 'default')
    tokens.forEach(t => {
      if (!dataMap[t.property]) dataMap[t.property] = {}
      dataMap[t.property][size] = t.resolves
    })
  })

  const rows = PROPERTY_KEYS.filter(prop => dataMap[prop])

  return (
    <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', overflow: 'hidden', backgroundColor: '#fff' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--bg-subtle)' }}>
            <th style={{
              padding: '7px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700,
              fontFamily: 'var(--font-family)', color: 'var(--text-disabled)',
              textTransform: 'uppercase', letterSpacing: '0.4px',
              borderBottom: '1px solid var(--border-subtle)',
            }}>
              Property
            </th>
            {SIZES.map(size => (
              <th key={size} style={{
                padding: '7px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700,
                fontFamily: 'var(--font-family)', color: 'var(--text-disabled)',
                textTransform: 'uppercase', letterSpacing: '0.4px',
                borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap',
              }}>
                {SIZE_LABEL[size]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((prop, i) => (
            <tr key={prop} style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
              <td style={{ padding: '7px 12px', fontSize: 12, fontFamily: 'var(--font-family)', color: 'var(--text-subtle)', whiteSpace: 'nowrap' }}>
                {prop}
              </td>
              {SIZES.map(size => (
                <td key={size} style={{ padding: '7px 12px', fontSize: 11, fontFamily: 'monospace', color: 'var(--text-base)' }}>
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

function SpecsSection() {
  const [activeState, setActiveState] = useState('default')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

      {/* Appearance Tokens */}
      <div>
        <div style={{ marginBottom: 4 }}>
          <span style={{ fontFamily: 'var(--font-family)', fontSize: 14, fontWeight: 700, color: 'var(--text-base)' }}>
            Appearance Tokens
          </span>
        </div>
        <div style={{ marginBottom: 16, fontFamily: 'var(--font-family)', fontSize: 13, color: 'var(--text-subtle)' }}>
          Background, border and input text color by state
        </div>
        {/* Tab bar — TOC style */}
        <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 16 }}>
          {STATES.map(state => {
            const active = activeState === state
            return (
              <button
                key={state}
                onClick={() => setActiveState(state)}
                style={{
                  padding: '5px 16px',
                  border: 'none',
                  borderBottom: active ? '2px solid var(--text-primary)' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  color: active ? 'var(--text-primary)' : 'var(--text-subtle)',
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  fontFamily: 'var(--font-family)',
                  cursor: 'pointer',
                  transition: 'color 0.1s, border-color 0.1s',
                  lineHeight: '20px',
                }}
              >
                {STATE_LABEL[state]}
              </button>
            )
          })}
        </div>
        <AppearanceTokensTable activeState={activeState} />
      </div>

      {/* Size Tokens */}
      <div>
        <div style={{ marginBottom: 4 }}>
          <span style={{ fontFamily: 'var(--font-family)', fontSize: 14, fontWeight: 700, color: 'var(--text-base)' }}>
            Size Tokens
          </span>
        </div>
        <div style={{ marginBottom: 16, fontFamily: 'var(--font-family)', fontSize: 13, color: 'var(--text-subtle)' }}>
          Dimension and spacing values across sizes
        </div>
        <SizeTokensTable />
      </div>

    </div>
  )
}

// ─── Section 8: Changelog ─────────────────────────────────────────────────────

const CHANGE_TYPE = {
  removed:    { label: 'Removed',    bg: 'var(--bg-error-subtle)',   color: 'var(--text-primary)'   },
  added:      { label: 'Added',      bg: '#E6F4EA',                  color: '#1E6B3A'               },
  updated:    { label: 'Updated',    bg: '#EBF3FF',                  color: 'var(--text-secondary)' },
  deprecated: { label: 'Deprecated', bg: '#FFF7E6',                  color: 'var(--text-warning)'   },
}

function ChangelogSection({ nodeId }) {
  const entries = CHANGELOGS[nodeId] ?? []

  if (entries.length === 0) {
    return (
      <DocCard>
        <CardBody>
          <span style={{ fontFamily: 'var(--font-family)', fontSize: 13, color: 'var(--text-subtle)' }}>
            No changes recorded yet.
          </span>
        </CardBody>
      </DocCard>
    )
  }

  return (
    <DocCard>
      <div style={{ backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-subtle)' }}>
              {['Date', 'Type', 'Description'].map(h => (
                <th key={h} style={{
                  padding: '7px 16px',
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
            {entries.map((entry, i) => {
              const t = CHANGE_TYPE[entry.type] ?? CHANGE_TYPE.updated
              return (
                <tr key={i} style={{ borderBottom: i < entries.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <td style={{ padding: '10px 16px', fontSize: 12, fontFamily: 'monospace', color: 'var(--text-subtle)', whiteSpace: 'nowrap' }}>
                    {entry.date}
                  </td>
                  <td style={{ padding: '10px 16px', whiteSpace: 'nowrap' }}>
                    <span style={{
                      display: 'inline-flex',
                      padding: '2px 10px',
                      borderRadius: 9999,
                      backgroundColor: t.bg,
                      color: t.color,
                      fontSize: 11,
                      fontWeight: 600,
                      fontFamily: 'var(--font-family)',
                    }}>
                      {t.label}
                    </span>
                  </td>
                  <td style={{ padding: '10px 16px', fontSize: 13, fontFamily: 'var(--font-family)', color: 'var(--text-base)', lineHeight: 1.5 }}>
                    {entry.description}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </DocCard>
  )
}

// ─── Main InputFieldDocs component ───────────────────────────────────────────

export default function InputFieldDocs({ comp }) {
  const nodeId = comp?.id ?? '109:1161'
  return (
    <div style={{ fontFamily: 'var(--font-family)' }}>

      <DocSection id="appearance" title="Appearance">
        <AppearanceSection />
      </DocSection>

      <DocSection id="states" title="States">
        <StatesSection />
      </DocSection>

      <DocSection id="sizes" title="Sizes">
        <SizesSection />
      </DocSection>

      <DocSection id="properties" title="Properties">
        <PropertiesSection />
      </DocSection>

      <DocSection id="icon-slot" title="Icon Slot">
        <IconSlotSection />
      </DocSection>

      <DocSection id="specs" title="Specs">
        <SpecsSection />
      </DocSection>

      <DocSection id="changelog" title="Changelog">
        <ChangelogSection nodeId={nodeId} />
      </DocSection>

    </div>
  )
}
