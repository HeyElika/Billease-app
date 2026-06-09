import { useEffect } from 'react'
import { primitives, semantic } from '../tokens'
import { useToc } from '../context/TocContext'

const TOKEN_SECTIONS = [
  { id: 'brand-palette',  label: 'Brand Palette'  },
  { id: 'semantic-bg',    label: 'Background'      },
  { id: 'semantic-text',  label: 'Text'            },
  { id: 'spacing',        label: 'Spacing'         },
  { id: 'border-radius',  label: 'Border Radius'   },
]

function ColorSwatch({ name, hex }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
      <div style={{
        width: 32,
        height: 32,
        borderRadius: 6,
        backgroundColor: hex,
        border: '1px solid var(--border-subtle)',
        flexShrink: 0,
      }} />
      <div>
        <div style={{ fontFamily: 'var(--font-family)', fontSize: 12, fontWeight: 600, color: 'var(--text-base)' }}>
          {name}
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-subtle)' }}>
          {hex}
        </div>
      </div>
    </div>
  )
}

function Section({ id, title, children }) {
  return (
    <div id={id} style={{ marginBottom: 32 }}>
      <h2 style={{
        fontFamily: 'var(--font-family)',
        fontSize: 16,
        fontWeight: 700,
        color: 'var(--text-base)',
        margin: '0 0 16px',
        paddingBottom: 8,
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

function TokenRow({ name, value, resolved }) {
  return (
    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-base)' }}>
        {name}
      </td>
      <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)' }}>
        {value}
      </td>
      {resolved && (
        <td style={{ padding: '8px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              backgroundColor: resolved,
              border: '1px solid var(--border-subtle)',
              flexShrink: 0,
            }} />
            <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-subtle)' }}>{resolved}</span>
          </div>
        </td>
      )}
    </tr>
  )
}

export default function Tokens() {
  const { setSections } = useToc()

  useEffect(() => {
    setSections(TOKEN_SECTIONS)
    return () => setSections([])
  }, [])

  const bgTokens   = Object.entries(semantic.bg)
  const textTokens = Object.entries(semantic.text)
  const borderTokens = Object.entries(semantic.border)

  return (
    <div style={{ fontFamily: 'var(--font-family)' }}>

      <h1 style={{
        margin: '0 0 28px',
        fontSize: 32,
        fontWeight: 700,
        color: 'var(--text-base)',
        lineHeight: 1.2,
      }}>
        Design Tokens
      </h1>

      <div style={{ borderTop: '1px solid var(--border-subtle)', marginBottom: 28 }} />

      {/* Brand colors */}
      <Section id="brand-palette" title="Brand Palette">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
          {Object.entries(primitives.color.red).map(([k, v]) => (
            <ColorSwatch key={k} name={`red/${k}`} hex={v} />
          ))}
        </div>
      </Section>

      {/* Semantic backgrounds */}
      <Section id="semantic-bg" title="Semantic — Background">
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: 8, border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-subtle)' }}>
              {['Token', 'CSS Var', 'Resolved'].map(h => (
                <th key={h} style={{ padding: '6px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid var(--border-subtle)', fontFamily: 'var(--font-family)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bgTokens.map(([name, hex]) => (
              <TokenRow key={name} name={`bg/${name}`} value={`var(--bg-${name.replace(/([A-Z])/g, '-$1').toLowerCase()})`} resolved={hex} />
            ))}
          </tbody>
        </table>
      </Section>

      {/* Semantic text */}
      <Section id="semantic-text" title="Semantic — Text">
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: 8, border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-subtle)' }}>
              {['Token', 'CSS Var', 'Resolved'].map(h => (
                <th key={h} style={{ padding: '6px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid var(--border-subtle)', fontFamily: 'var(--font-family)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {textTokens.map(([name, hex]) => (
              <TokenRow key={name} name={`text/${name}`} value={`var(--text-${name.replace(/([A-Z])/g, '-$1').toLowerCase()})`} resolved={hex} />
            ))}
          </tbody>
        </table>
      </Section>

      {/* Spacing */}
      <Section id="spacing" title="Spacing">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {Object.entries(primitives.spacing).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: v * 2,
                height: 20,
                backgroundColor: 'var(--bg-primary)',
                borderRadius: 2,
                minWidth: 4,
              }} />
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--text-subtle)' }}>{v}px</span>
              <span style={{ fontSize: 10, fontFamily: 'var(--font-family)', color: 'var(--text-disabled)' }}>{k}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Border radius */}
      <Section id="border-radius" title="Border Radius">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {Object.entries(primitives.radius).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 48,
                height: 48,
                backgroundColor: 'var(--bg-sunken)',
                border: '1px solid var(--border-default)',
                borderRadius: Math.min(v, 24),
              }} />
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--text-subtle)' }}>{v === 9999 ? 'full' : `${v}px`}</span>
              <span style={{ fontSize: 10, fontFamily: 'var(--font-family)', color: 'var(--text-disabled)' }}>{k}</span>
            </div>
          ))}
        </div>
      </Section>

      <div style={{ height: 48 }} />
    </div>
  )
}
