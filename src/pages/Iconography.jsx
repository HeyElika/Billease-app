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

const STYLE_FILTERS = [
  { value: 'all',     label: 'All'     },
  { value: 'outline', label: 'Outline' },
  { value: 'fill',    label: 'Fill'    },
  { value: 'utility', label: 'Utility' },
  { value: 'status',  label: 'Status'  },
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
  const [styleFilter, setStyleFilter] = useState('all')
  const [size, setSize] = useState('md')
  const [copied, setCopied] = useState(null)

  function handleCopy(name) {
    navigator.clipboard.writeText(name).catch(() => {})
    setCopied(name)
    setTimeout(() => setCopied(null), 1200)
  }

  const filtered = ALL_ICON_NAMES.filter(name => {
    const matchesSearch = name.includes(search.toLowerCase().trim())
    const matchesStyle  = styleFilter === 'all' || getStyle(name) === styleFilter
    return matchesSearch && matchesStyle
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Search + filter bar */}
      <div style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: '14px 16px',
        backgroundColor: '#fff',
        borderRadius: 8,
        border: '1px solid var(--border-subtle)',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
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

        {/* Style filter pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {STYLE_FILTERS.map(f => {
            const active = styleFilter === f.value
            return (
              <button
                key={f.value}
                onClick={() => setStyleFilter(f.value)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 9999,
                  border: `1px solid ${active ? 'var(--border-primary)' : 'var(--border-default)'}`,
                  backgroundColor: active ? 'var(--bg-error-subtle)' : 'transparent',
                  color: active ? 'var(--text-primary)' : 'var(--text-subtle)',
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  fontFamily: 'var(--font-family)',
                  cursor: 'pointer',
                  transition: 'all 0.1s',
                }}
              >
                {f.label}
              </button>
            )
          })}
        </div>

        {/* Size switcher */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', borderLeft: '1px solid var(--border-subtle)', paddingLeft: 12 }}>
          <span style={{ fontSize: 11, color: 'var(--text-disabled)', marginRight: 2, fontFamily: 'var(--font-family)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Size</span>
          {SIZES.map(s => (
            <button
              key={s}
              onClick={() => setSize(s)}
              style={{
                padding: '3px 8px',
                borderRadius: 6,
                border: `1px solid ${size === s ? 'var(--border-primary)' : 'transparent'}`,
                backgroundColor: size === s ? 'var(--bg-error-subtle)' : 'transparent',
                color: size === s ? 'var(--text-primary)' : 'var(--text-subtle)',
                fontSize: 11,
                fontFamily: 'monospace',
                fontWeight: size === s ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {s}
            </button>
          ))}
        </div>
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
              size={size}
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

      {/* Breadcrumb */}
      <div style={{ fontSize: 13, color: 'var(--text-subtle)', marginBottom: 8 }}>
        <span>Foundations</span>
        <span style={{ margin: '0 6px', color: 'var(--text-disabled)' }}>›</span>
        <span style={{ color: 'var(--text-base)', fontWeight: 600 }}>Iconography</span>
      </div>

      <h1 style={{ margin: '0 0 6px', fontSize: 32, fontWeight: 700, color: 'var(--text-base)', lineHeight: 1.2 }}>
        Iconography
      </h1>
      <p style={{ margin: '0 0 24px', fontSize: 14, color: 'var(--text-subtle)', lineHeight: 1.6 }}>
        {ALL_ICON_NAMES.length} icons · Figma file{' '}
        <code style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-base)' }}>qESeTFW1GEEosrYnm4Hu3b</code>
      </p>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border-subtle)', marginBottom: 32 }}>
        {[{ id: 'overview', label: 'Overview' }, { id: 'library', label: 'Library' }].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '10px 20px',
              border: 'none',
              backgroundColor: 'transparent',
              fontFamily: 'var(--font-family)',
              fontSize: 14,
              fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? 'var(--text-base)' : 'var(--text-subtle)',
              cursor: 'pointer',
              borderBottom: `2px solid ${tab === t.id ? 'var(--text-base)' : 'transparent'}`,
              marginBottom: -1,
              transition: 'color 0.1s',
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
