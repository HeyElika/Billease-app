import { useState, useEffect } from 'react'
import { useToc } from '../context/TocContext'
import BilleaseIcon from '../assets/icons/BilleaseIcon'
import { ICONS } from '../assets/icons/index'

// ─── Data ─────────────────────────────────────────────────────────────────────

const ALL_ICON_NAMES = Object.keys(ICONS)

function getStyle(name) {
  if (name.startsWith('status-')) return 'status'
  if (name.endsWith('-outline')) return 'outline'
  if (name.endsWith('-fill')) return 'fill'
  return 'utility'
}

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']

const SIZE_PX = { xs: 16, sm: 20, md: 24, lg: 32, xl: 40, '2xl': 48 }

const OVERVIEW_SECTIONS = [
  { id: 'anatomy', label: 'Anatomy' },
  { id: 'sizes',   label: 'Sizes'   },
  { id: 'props',   label: 'Props'   },
]

// Anatomy pairs: outline variant → fill variant
const ANATOMY_PAIRS = [
  { outline: 'home-outline',        fill: 'home-fill',        label: 'Home'        },
  { outline: 'user-outline',        fill: 'user-fill',        label: 'User'        },
  { outline: 'calendar-outline',    fill: 'calendar-fill',    label: 'Calendar'    },
  { outline: 'installment-outline', fill: 'installment-fill', label: 'Installment' },
]

// ─── Overview tab ─────────────────────────────────────────────────────────────

function PropsTable() {
  const rows = [
    { prop: 'name',  type: 'string',                                    default: '—',             desc: 'Icon name (required). Must match a key in the icon library.' },
    { prop: 'size',  type: "'xs'|'sm'|'md'|'lg'|'xl'|'2xl'",          default: "'sm'",           desc: '16 / 20 / 24 / 32 / 40 / 48 px. Controls both width and height.' },
    { prop: 'color', type: 'string',                                    default: "'currentColor'", desc: 'SVG fill color. Ignored on status icons which have fixed semantic fills.' },
    { prop: 'style', type: 'CSSProperties',                            default: '—',             desc: 'Additional inline styles applied to the <svg> element.' },
  ]
  return (
    <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', overflow: 'hidden', backgroundColor: '#fff' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--bg-subtle)' }}>
            {['Prop', 'Type', 'Default', 'Description'].map(h => (
              <th key={h} style={{
                padding: '8px 14px',
                textAlign: 'left',
                fontSize: 11,
                fontWeight: 700,
                fontFamily: 'var(--font-family)',
                color: 'var(--text-disabled)',
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
                borderBottom: '1px solid var(--border-subtle)',
                whiteSpace: 'nowrap',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.prop} style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
              <td style={{ padding: '9px 14px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{r.prop}</td>
              <td style={{ padding: '9px 14px', fontFamily: 'monospace', fontSize: 11, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{r.type}</td>
              <td style={{ padding: '9px 14px', fontFamily: 'monospace', fontSize: 11, color: 'var(--text-base)' }}>{r.default}</td>
              <td style={{ padding: '9px 14px', fontFamily: 'var(--font-family)', fontSize: 13, color: 'var(--text-subtle)', lineHeight: 1.5 }}>{r.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function OverviewTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>

      {/* Anatomy */}
      <section id="anatomy">
        <h2 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 700, color: 'var(--text-base)', paddingBottom: 12, borderBottom: '1px solid var(--border-subtle)' }}>
          Anatomy
        </h2>
        <p style={{ margin: '12px 0 20px', fontSize: 14, color: 'var(--text-subtle)', lineHeight: 1.6 }}>
          Icons come in two visual styles. Outline icons use a stroked appearance for default / inactive states.
          Fill icons use a solid fill for selected / active states. Pair them: never mix styles within the same
          interactive element across its two states.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {ANATOMY_PAIRS.map(pair => (
            <div key={pair.label} style={{
              borderRadius: 8,
              border: '1px solid var(--border-subtle)',
              overflow: 'hidden',
              backgroundColor: '#fff',
            }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-subtle)', fontFamily: 'var(--font-family)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  {pair.label}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 0 }}>
                {[pair.outline, pair.fill].map((name, idx) => (
                  <div key={name} style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    padding: '20px 12px 14px',
                    borderRight: idx === 0 ? '1px solid var(--border-subtle)' : 'none',
                  }}>
                    <BilleaseIcon name={name} size="lg" color="var(--icon-base)" />
                    <span style={{
                      fontSize: 10,
                      fontFamily: 'monospace',
                      color: 'var(--text-disabled)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px',
                    }}>
                      {idx === 0 ? 'outline' : 'fill'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Status icons */}
        <div style={{ marginTop: 12, borderRadius: 8, border: '1px solid var(--border-subtle)', overflow: 'hidden', backgroundColor: '#fff' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-subtle)', fontFamily: 'var(--font-family)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Status — fixed semantic colors
            </span>
          </div>
          <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap' }}>
            {['status-success', 'status-error', 'status-warning', 'status-alert', 'status-pending'].map((name, idx, arr) => (
              <div key={name} style={{
                flex: '1 1 80px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                padding: '20px 12px 14px',
                borderRight: idx < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              }}>
                <BilleaseIcon name={name} size="lg" />
                <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  {name.replace('status-', '')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sizes */}
      <section id="sizes">
        <h2 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 700, color: 'var(--text-base)', paddingBottom: 12, borderBottom: '1px solid var(--border-subtle)' }}>
          Sizes
        </h2>
        <p style={{ margin: '12px 0 20px', fontSize: 14, color: 'var(--text-subtle)', lineHeight: 1.6 }}>
          All icons render on a square canvas. Pass the <code style={{ fontFamily: 'monospace', fontSize: 12, backgroundColor: 'var(--bg-subtle)', padding: '1px 4px', borderRadius: 3 }}>size</code> prop
          to control the canvas. The icon artwork scales uniformly within the bounding box.
        </p>
        <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', overflow: 'hidden', backgroundColor: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 0, padding: '32px 32px 24px', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
            {SIZES.map((s, idx) => (
              <div key={s} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                flex: '1 1 60px',
                borderRight: idx < SIZES.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                padding: '0 20px',
              }}>
                <BilleaseIcon name="home-outline" size={s} color="var(--icon-base)" />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-base)', fontWeight: 600 }}>{s}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-disabled)', marginTop: 2 }}>{SIZE_PX[s]}px</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-subtle)' }}>
            <code style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-subtle)' }}>
              {'<BilleaseIcon name="home-outline" size="lg" color="var(--icon-base)" />'}
            </code>
          </div>
        </div>
      </section>

      {/* Props */}
      <section id="props">
        <h2 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 700, color: 'var(--text-base)', paddingBottom: 12, borderBottom: '1px solid var(--border-subtle)' }}>
          Props
        </h2>
        <p style={{ margin: '12px 0 20px', fontSize: 14, color: 'var(--text-subtle)', lineHeight: 1.6 }}>
          <code style={{ fontFamily: 'monospace', fontSize: 12, backgroundColor: 'var(--bg-subtle)', padding: '1px 4px', borderRadius: 3 }}>BilleaseIcon</code> accepts standard SVG props in addition to the ones below.
        </p>
        <PropsTable />
      </section>

    </div>
  )
}

// ─── Library tab ──────────────────────────────────────────────────────────────

function IconCard({ name, size, copied, onCopy }) {
  const style = getStyle(name)
  return (
    <button
      onClick={() => onCopy(name)}
      title={`Click to copy "${name}"`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: '16px 8px 12px',
        border: `1px solid ${copied ? 'var(--border-success)' : 'var(--border-subtle)'}`,
        borderRadius: 8,
        backgroundColor: copied ? 'var(--bg-success-subtle)' : '#fff',
        cursor: 'pointer',
        transition: 'background-color 0.12s, border-color 0.12s',
        width: '100%',
        fontFamily: 'var(--font-family)',
      }}
      onMouseEnter={e => { if (!copied) e.currentTarget.style.backgroundColor = 'var(--bg-subtle)' }}
      onMouseLeave={e => { if (!copied) e.currentTarget.style.backgroundColor = '#fff' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 40 }}>
        <BilleaseIcon
          name={name}
          size={size}
          color={copied ? 'var(--text-success)' : 'var(--icon-base)'}
        />
      </div>
      <span style={{
        fontSize: 10,
        color: copied ? 'var(--text-success)' : 'var(--text-subtle)',
        textAlign: 'center',
        wordBreak: 'break-all',
        lineHeight: 1.4,
        fontFamily: 'monospace',
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        width: '100%',
      }}>
        {copied ? 'copied!' : name}
      </span>
      {!copied && (
        <span style={{
          fontSize: 9,
          fontFamily: 'var(--font-family)',
          color: 'var(--text-disabled)',
          textTransform: 'uppercase',
          letterSpacing: '0.3px',
        }}>
          {style}
        </span>
      )}
    </button>
  )
}

function LibraryTab() {
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState(null)

  function handleCopy(name) {
    navigator.clipboard.writeText(name).catch(() => {})
    setCopied(name)
    setTimeout(() => setCopied(null), 1200)
  }

  const filtered = ALL_ICON_NAMES.filter(name =>
    name.includes(search.toLowerCase().trim())
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Search bar */}
      <div style={{ position: 'relative', maxWidth: 320 }}>
        <BilleaseIcon
          name="search"
          size="sm"
          color="var(--icon-subtle)"
          style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
        />
        <input
          type="text"
          placeholder="Search icons…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            paddingLeft: 34,
            paddingRight: 12,
            paddingTop: 8,
            paddingBottom: 8,
            border: '1px solid var(--border-default)',
            borderRadius: 8,
            fontSize: 14,
            fontFamily: 'var(--font-family)',
            color: 'var(--text-base)',
            backgroundColor: 'var(--bg-sunken)',
            outline: 'none',
          }}
        />
      </div>

      {/* Result count */}
      <div style={{ fontSize: 12, color: 'var(--text-disabled)', fontFamily: 'var(--font-family)' }}>
        {filtered.length} of {ALL_ICON_NAMES.length} icons
        {search && <span> matching <strong style={{ color: 'var(--text-subtle)' }}>"{search}"</strong></span>}
      </div>

      {/* Icon grid */}
      {filtered.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: 8,
        }}>
          {filtered.map(name => (
            <IconCard
              key={name}
              name={name}
              size="md"
              copied={copied === name}
              onCopy={handleCopy}
            />
          ))}
        </div>
      ) : (
        <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-disabled)', fontFamily: 'var(--font-family)', fontSize: 14 }}>
          No icons match "{search}"
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Iconography() {
  const { setSections } = useToc()
  const [tab, setTab] = useState('overview')

  useEffect(() => {
    setSections(tab === 'overview' ? OVERVIEW_SECTIONS : [])
    return () => setSections([])
  }, [tab])

  return (
    <div style={{ fontFamily: 'var(--font-family)' }}>

      <h1 style={{ margin: '0 0 28px', fontSize: 32, fontWeight: 700, color: 'var(--text-base)', lineHeight: 1.2 }}>
        Iconography
      </h1>

      <div style={{ borderTop: '1px solid var(--border-subtle)', marginBottom: 0 }} />

      {/* Tab switcher */}
      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 32 }}>
        {[{ id: 'overview', label: 'Overview' }, { id: 'library', label: 'Library' }].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderBottom: tab === t.id ? '2px solid var(--text-primary)' : '2px solid transparent',
              backgroundColor: 'transparent',
              fontFamily: 'var(--font-family)',
              fontSize: 13,
              fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? 'var(--text-primary)' : 'var(--text-subtle)',
              cursor: 'pointer',
              transition: 'color 0.1s, border-color 0.1s',
              lineHeight: '20px',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' ? <OverviewTab /> : <LibraryTab />}

      <div style={{ height: 48 }} />
    </div>
  )
}
