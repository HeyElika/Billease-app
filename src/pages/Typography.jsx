import { useEffect } from 'react'
import { useToc } from '../context/TocContext'

// ─── Data from Figma file qESeTFW1GEEosrYnm4Hu3b (figma_get_design_system_kit) ─
const FONT_FAMILY = 'Source Sans Pro'

const HEADING_STYLES = [
  { token: 'heading/heading-xl-bold',     fontSize: 32, fontWeight: 700, lineHeight: 40    },
  { token: 'heading/heading-lg-bold',     fontSize: 24, fontWeight: 700, lineHeight: 30    },
  { token: 'heading/heading-lg-semibold', fontSize: 24, fontWeight: 600, lineHeight: 30    },
  { token: 'heading/heading-md-bold',     fontSize: 20, fontWeight: 700, lineHeight: 30    },
  { token: 'heading/heading-md-semibold', fontSize: 20, fontWeight: 600, lineHeight: 25    },
  { token: 'heading/heading-sm-semibold', fontSize: 16, fontWeight: 600, lineHeight: 20    },
  { token: 'heading/heading-xs-semibold', fontSize: 14, fontWeight: 600, lineHeight: 17.5  },
]

const BODY_STYLES = [
  { token: 'body/body-lg-regular',        fontSize: 20, fontWeight: 400, lineHeight: 30    },
  { token: 'body/body-lg-semibold',       fontSize: 20, fontWeight: 600, lineHeight: 30    },
  { token: 'body/body-md-regular',        fontSize: 16, fontWeight: 400, lineHeight: 24    },
  { token: 'body/body-md-semibold',       fontSize: 16, fontWeight: 600, lineHeight: 24    },
  { token: 'body/body-sm-regular',        fontSize: 14, fontWeight: 400, lineHeight: 21    },
  { token: 'body/body-sm-semibold',       fontSize: 14, fontWeight: 600, lineHeight: 21    },
  { token: 'body/body-xs-regular',        fontSize: 13, fontWeight: 400, lineHeight: 19.5  },
  { token: 'body/body-xs-semibold',       fontSize: 13, fontWeight: 600, lineHeight: 19.5  },
  { token: 'body/body-xxs-regular',       fontSize: 11, fontWeight: 400, lineHeight: 13.75 },
  { token: 'body/body-xxs-semibold',      fontSize: 11, fontWeight: 600, lineHeight: 13.75 },
]

const LINK_STYLES = [
  { token: 'link/link-md',                fontSize: 16, fontWeight: 600, lineHeight: 24,   letterSpacing: 0 },
  { token: 'link/link-sm',                fontSize: 14, fontWeight: 600, lineHeight: 21,   letterSpacing: 0 },
  { token: 'link/Label-xs',               fontSize: 13, fontWeight: 600, lineHeight: 19.5, letterSpacing: 1 },
]

const TOKEN_SECTIONS = [
  { id: 'heading', label: 'Heading' },
  { id: 'body',    label: 'Body'    },
  { id: 'link',    label: 'Link'    },
]

// ─── Type row ─────────────────────────────────────────────────────────────────

const TH = { padding: '6px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-family)', color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' }
const TD = { padding: '0 16px', fontFamily: 'monospace', fontSize: 11, color: 'var(--text-subtle)', whiteSpace: 'nowrap' }

function TypeRow({ style, isLast }) {
  const { token, fontSize, fontWeight, lineHeight, letterSpacing = 0 } = style
  const rowStyle = {
    borderBottom: isLast ? 'none' : '1px solid var(--border-subtle)',
    verticalAlign: 'middle',
  }
  const previewText = token.includes('heading') ? 'The quick brown fox' : token.includes('link') ? 'Learn more →' : 'The quick brown fox jumps over the lazy dog'
  const rowHeight = Math.max(lineHeight + 32, 56)

  return (
    <tr style={rowStyle}>
      {/* Preview */}
      <td style={{ padding: '12px 16px', width: '40%' }}>
        <span style={{
          fontFamily: FONT_FAMILY,
          fontSize,
          fontWeight,
          lineHeight: `${lineHeight}px`,
          letterSpacing: letterSpacing ? `${letterSpacing}px` : undefined,
          color: 'var(--text-base)',
          display: 'block',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {previewText}
        </span>
      </td>
      {/* Token name */}
      <td style={{ ...TD, color: 'var(--text-base)', fontFamily: 'monospace', fontSize: 12 }}>
        {token}
      </td>
      {/* Size */}
      <td style={TD}>{fontSize}px</td>
      {/* Weight */}
      <td style={TD}>{fontWeight}</td>
      {/* Line height */}
      <td style={TD}>{lineHeight}px</td>
      {/* Letter spacing */}
      <td style={TD}>{letterSpacing ? `${letterSpacing}px` : '—'}</td>
    </tr>
  )
}

function TypeTable({ styles }) {
  return (
    <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', overflow: 'hidden', backgroundColor: '#fff' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--bg-subtle)' }}>
            <th style={TH}>Preview</th>
            <th style={TH}>Token</th>
            <th style={TH}>Size</th>
            <th style={TH}>Weight</th>
            <th style={TH}>Line height</th>
            <th style={TH}>Letter spacing</th>
          </tr>
        </thead>
        <tbody>
          {styles.map((s, i) => (
            <TypeRow key={s.token} style={s} isLast={i === styles.length - 1} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ id, title, children }) {
  return (
    <div id={id} style={{ marginBottom: 40 }}>
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Typography() {
  const { setSections } = useToc()

  useEffect(() => {
    setSections(TOKEN_SECTIONS)
    return () => setSections([])
  }, [])

  return (
    <div style={{ fontFamily: 'var(--font-family)' }}>

      <h1 style={{ margin: '0 0 28px', fontSize: 32, fontWeight: 700, color: 'var(--text-base)', lineHeight: 1.2 }}>
        Typography
      </h1>

      <div style={{ borderTop: '1px solid var(--border-subtle)', marginBottom: 28 }} />

      <Section id="heading" title="Heading">
        <TypeTable styles={HEADING_STYLES} />
      </Section>

      <Section id="body" title="Body">
        <TypeTable styles={BODY_STYLES} />
      </Section>

      <Section id="link" title="Link">
        <TypeTable styles={LINK_STYLES} />
      </Section>

      <div style={{ height: 48 }} />
    </div>
  )
}
