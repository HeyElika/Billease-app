// Grid constants — source of truth for all prototype screens
export const GRID = {
  unit:        4,    // base unit in px (4pt grid)
  marginH:     20,   // horizontal screen margin (left + right)
  columns:     4,    // column count
  gutter:      16,   // gap between columns
  frameWidth:  390,  // phone frame width (iPhone 14 / standard)
  frameHeight: 844,  // phone frame height
}

// Derived: content width inside margins
// contentW = frameWidth - marginH * 2 = 390 - 40 = 350
export const GRID_CONTENT_W = GRID.frameWidth - GRID.marginH * 2

// Column width (all 4 cols, 3 gutters)
// colW = (contentW - gutter * (columns - 1)) / columns = (350 - 48) / 4 = 75.5
export const GRID_COL_W = (GRID_CONTENT_W - GRID.gutter * (GRID.columns - 1)) / GRID.columns

// ── Foundation page ───────────────────────────────────────────────────────────

import { useEffect } from 'react'
import { useToc } from '../context/TocContext'

const SECTIONS = [
  { id: 'base-unit',  label: 'Base Unit'  },
  { id: 'layout',     label: 'Layout'     },
  { id: 'columns',    label: 'Columns'    },
  { id: 'spacing',    label: 'Spacing scale' },
]

function Section({ id, title, children }) {
  return (
    <div id={id} style={{ marginBottom: 48 }}>
      <h2 style={{ fontFamily: 'var(--font-family)', fontSize: 20, fontWeight: 700, color: 'var(--text-base)', margin: '0 0 20px' }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

function Card({ children, style }) {
  return (
    <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 8, overflow: 'hidden', ...style }}>
      {children}
    </div>
  )
}

function Row({ label, value, note }) {
  return (
    <tr>
      <td style={{ padding: '10px 16px', fontFamily: 'var(--font-family)', fontSize: 13, color: 'var(--text-base)', borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' }}>{label}</td>
      <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: 13, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)', fontWeight: 600 }}>{value}</td>
      <td style={{ padding: '10px 16px', fontFamily: 'var(--font-family)', fontSize: 12, color: 'var(--text-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>{note}</td>
    </tr>
  )
}

function TableHead({ cols }) {
  return (
    <tr style={{ backgroundColor: 'var(--bg-subtle)' }}>
      {cols.map(h => (
        <th key={h} style={{ padding: '8px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid var(--border-subtle)', fontFamily: 'var(--font-family)', whiteSpace: 'nowrap' }}>{h}</th>
      ))}
    </tr>
  )
}

export default function Grid() {
  const { setSections } = useToc()
  useEffect(() => { setSections(SECTIONS); return () => setSections([]) }, [])

  // Multiples of 4 up to 80
  const scale = Array.from({ length: 20 }, (_, i) => (i + 1) * 4)

  return (
    <div style={{ fontFamily: 'var(--font-family)' }}>
      <h1 style={{ margin: '0 0 8px', fontSize: 32, fontWeight: 700, color: 'var(--text-base)', lineHeight: 1.2 }}>Grid & Spacing</h1>
      <p style={{ margin: '0 0 40px', fontSize: 15, color: 'var(--text-subtle)', lineHeight: 1.5 }}>
        All prototype screens follow a 4pt base grid with 20px horizontal margins. Every spacing value is a multiple of 4.
      </p>
      <div style={{ borderTop: '1px solid var(--border-subtle)', marginBottom: 40 }} />

      {/* ── Base unit ── */}
      <Section id="base-unit" title="Base unit">
        <p style={{ margin: '0 0 20px', fontSize: 14, color: 'var(--text-subtle)', lineHeight: 1.6 }}>
          The smallest increment is <strong style={{ color: 'var(--text-base)' }}>4px</strong>. All spacing, sizing, and layout values must be multiples of 4. This creates visual consistency and makes designs predictable across screens.
        </p>
        <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap', padding: '24px 0' }}>
          {[4, 8, 12, 16, 20, 24, 32, 40, 48].map(v => (
            <div key={v} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: v, height: v, backgroundColor: 'var(--bg-secondary)', borderRadius: 2, opacity: 0.7 + v / 200 }} />
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--text-subtle)' }}>{v}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Layout ── */}
      <Section id="layout" title="Layout">
        <Card>
          {/* Phone frame visual */}
          <div style={{ padding: '32px 32px 0', display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Phone mockup */}
            <div style={{ flexShrink: 0 }}>
              <div style={{ position: 'relative', width: 130, height: 260, border: '2px solid var(--border-default)', borderRadius: 16, overflow: 'hidden', backgroundColor: '#fff' }}>
                {/* Status bar */}
                <div style={{ height: 12, backgroundColor: 'var(--bg-subtle)' }} />
                {/* Left margin */}
                <div style={{ position: 'absolute', top: 12, left: 0, bottom: 0, width: 130 * (20/390), backgroundColor: 'rgba(246,122,111,0.15)', borderRight: '1px dashed rgba(246,122,111,0.5)' }} />
                {/* Right margin */}
                <div style={{ position: 'absolute', top: 12, right: 0, bottom: 0, width: 130 * (20/390), backgroundColor: 'rgba(246,122,111,0.15)', borderLeft: '1px dashed rgba(246,122,111,0.5)' }} />
                {/* Content area label */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 7, fontFamily: 'var(--font-family)', color: 'var(--text-subtle)', textAlign: 'center', lineHeight: 1.4 }}>
                  content<br/>350px
                </div>
                {/* Margin labels */}
                <div style={{ position: 'absolute', bottom: 8, left: 0, width: 130 * (20/390), textAlign: 'center', fontSize: 6, fontFamily: 'var(--font-family)', color: 'var(--text-primary)' }}>20</div>
                <div style={{ position: 'absolute', bottom: 8, right: 0, width: 130 * (20/390), textAlign: 'center', fontSize: 6, fontFamily: 'var(--font-family)', color: 'var(--text-primary)' }}>20</div>
              </div>
            </div>
            {/* Specs table */}
            <div style={{ flex: 1, minWidth: 280 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid var(--border-subtle)', borderRadius: 8, overflow: 'hidden' }}>
                <thead><TableHead cols={['Property', 'Value', 'Note']} /></thead>
                <tbody>
                  <Row label="Frame width"    value="390px"  note="iPhone 14 / standard Android" />
                  <Row label="Frame height"   value="844px"  note="Excludes system chrome in mockups" />
                  <Row label="Margin (H)"     value="20px"   note="Left and right — do not place content outside this" />
                  <Row label="Content width"  value="350px"  note="390 − (20 × 2)" />
                </tbody>
              </table>
            </div>
          </div>
          <div style={{ height: 32 }} />
        </Card>
      </Section>

      {/* ── Columns ── */}
      <Section id="columns" title="Columns">
        <Card>
          <div style={{ padding: '32px 32px 0', display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Column visual */}
            <div style={{ flexShrink: 0 }}>
              <div style={{ width: 140, display: 'flex', gap: 5, padding: '4px 8px', backgroundColor: 'var(--bg-subtle)', borderRadius: 8 }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} style={{ flex: 1, height: 100, backgroundColor: 'rgba(38,92,229,0.12)', border: '1px solid rgba(38,92,229,0.25)', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 9, fontFamily: 'var(--font-family)', color: 'var(--text-secondary)' }}>{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 280 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid var(--border-subtle)', borderRadius: 8, overflow: 'hidden' }}>
                <thead><TableHead cols={['Property', 'Value', 'Note']} /></thead>
                <tbody>
                  <Row label="Columns"      value="4"      note="Standard mobile grid" />
                  <Row label="Gutter"       value="16px"   note="Gap between columns (4pt × 4)" />
                  <Row label="Column width" value="75.5px" note="(350 − 16×3) / 4" />
                  <Row label="Span 2 cols"  value="167px"  note="75.5 × 2 + 16" />
                  <Row label="Span 3 cols"  value="258.5px" note="75.5 × 3 + 32" />
                  <Row label="Full width"   value="350px"  note="All 4 columns + gutters" />
                </tbody>
              </table>
            </div>
          </div>
          <div style={{ height: 32 }} />
        </Card>
      </Section>

      {/* ── Spacing scale ── */}
      <Section id="spacing" title="Spacing scale">
        <p style={{ margin: '0 0 20px', fontSize: 14, color: 'var(--text-subtle)', lineHeight: 1.6 }}>
          All spacing values are multiples of the 4px base unit. Use these — never hardcode arbitrary values.
        </p>
        <Card>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <TableHead cols={['Step', 'Value', 'Visual']} />
            </thead>
            <tbody>
              {scale.map((v, i) => (
                <tr key={v} style={{ borderBottom: i < scale.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <td style={{ padding: '8px 16px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-subtle)' }}>{i + 1}</td>
                  <td style={{ padding: '8px 16px', fontFamily: 'monospace', fontSize: 13, color: 'var(--text-base)', fontWeight: 600 }}>{v}px</td>
                  <td style={{ padding: '8px 16px' }}>
                    <div style={{ width: Math.min(v * 2, 320), height: 12, backgroundColor: 'var(--bg-secondary)', borderRadius: 2, opacity: 0.6 }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Section>

      <div style={{ height: 48 }} />
    </div>
  )
}
