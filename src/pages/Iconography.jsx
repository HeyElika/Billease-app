import { useState, useEffect } from 'react'
import { useToc } from '../context/TocContext'
import BilleaseIcon from '../assets/icons/BilleaseIcon'
import { ICONS } from '../assets/icons/index'

const TOC_SECTIONS = [
  { id: 'navigation',     label: 'Navigation'     },
  { id: 'users',          label: 'Users'           },
  { id: 'finance',        label: 'Finance'         },
  { id: 'calendar',       label: 'Calendar'        },
  { id: 'communication',  label: 'Communication'   },
  { id: 'actions',        label: 'Actions'         },
]

const ICON_GROUPS = [
  {
    id: 'navigation',
    label: 'Navigation',
    icons: ['home-outline', 'home-fill', 'arrow-left', 'arrow-up', 'arrows'],
  },
  {
    id: 'users',
    label: 'Users',
    icons: ['user-outline', 'user-fill', 'users-outline', 'users-fill', 'account-outline', 'add-user-outline'],
  },
  {
    id: 'finance',
    label: 'Finance',
    icons: ['installment-outline', 'installment-fill', 'statement-outline', 'statement-fill', 'auto-debit', 'auto-renew'],
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icons: ['calendar-outline', 'calendar-fill', 'activity-outline', 'activity-fill'],
  },
  {
    id: 'communication',
    label: 'Communication',
    icons: ['chat-outline', 'chat-fill', 'info-outline'],
  },
  {
    id: 'actions',
    label: 'Actions',
    icons: ['edit-outline', 'trash-outline', 'start-outline', 'start-fill', 'pin-outline', 'pin-fill'],
  },
]

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
const SIZE_PX = { xs: 16, sm: 20, md: 24, lg: 32, xl: 40, '2xl': 48 }

function IconCard({ name, size, copied, onCopy }) {
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
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
        backgroundColor: copied ? 'var(--bg-success-subtle)' : 'var(--bg-base)',
        cursor: 'pointer',
        transition: 'background-color 0.15s, border-color 0.15s',
        width: '100%',
        fontFamily: 'var(--font-family)',
      }}
      onMouseEnter={e => {
        if (!copied) e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'
      }}
      onMouseLeave={e => {
        if (!copied) e.currentTarget.style.backgroundColor = 'var(--bg-base)'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
      }}>
        <BilleaseIcon
          name={name}
          size={size}
          color={copied ? 'var(--text-success)' : 'var(--icon-base)'}
        />
      </div>
      <span style={{
        fontSize: 11,
        color: copied ? 'var(--text-success)' : 'var(--text-subtle)',
        textAlign: 'center',
        wordBreak: 'break-all',
        lineHeight: 1.4,
        fontFamily: 'monospace',
      }}>
        {copied ? 'copied!' : name}
      </span>
    </button>
  )
}

export default function Iconography() {
  const { setSections } = useToc()
  const [size, setSize] = useState('md')
  const [copied, setCopied] = useState(null)

  useEffect(() => {
    setSections(TOC_SECTIONS)
    return () => setSections([])
  }, [])

  function handleCopy(name) {
    navigator.clipboard.writeText(name).catch(() => {})
    setCopied(name)
    setTimeout(() => setCopied(null), 1200)
  }

  const totalCount = Object.keys(ICONS).length

  return (
    <div style={{ fontFamily: 'var(--font-family)' }}>

      {/* Breadcrumb */}
      <div style={{ fontSize: 13, color: 'var(--text-subtle)', marginBottom: 8 }}>
        <span>Foundations</span>
        <span style={{ margin: '0 6px', color: 'var(--text-disabled)' }}>›</span>
        <span style={{ color: 'var(--text-base)', fontWeight: 600 }}>Iconography</span>
      </div>

      <h1 style={{ margin: '0 0 4px', fontSize: 32, fontWeight: 700, color: 'var(--text-base)', lineHeight: 1.2 }}>
        Iconography
      </h1>
      <p style={{ margin: '0 0 20px', fontSize: 14, color: 'var(--text-subtle)', lineHeight: 1.6 }}>
        {totalCount} icons from Figma file <code style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-base)' }}>qESeTFW1GEEosrYnm4Hu3b</code>.
        Click any icon to copy its name. Use via{' '}
        <code style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-base)' }}>{'<BilleaseIcon name="…" />'}</code>.
      </p>

      {/* Size switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
        <span style={{ fontSize: 13, color: 'var(--text-subtle)', marginRight: 4 }}>Size:</span>
        {SIZES.map(s => (
          <button
            key={s}
            onClick={() => setSize(s)}
            style={{
              padding: '4px 10px',
              border: `1px solid ${size === s ? 'var(--bg-secondary)' : 'var(--border-default)'}`,
              borderRadius: 6,
              backgroundColor: size === s ? 'var(--bg-info-subtle)' : 'transparent',
              color: size === s ? 'var(--text-secondary)' : 'var(--text-subtle)',
              fontFamily: 'var(--font-family)',
              fontSize: 12,
              fontWeight: size === s ? 600 : 400,
              cursor: 'pointer',
            }}
          >
            {s}
            <span style={{ marginLeft: 4, opacity: 0.6, fontSize: 10 }}>{SIZE_PX[s]}px</span>
          </button>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)', marginBottom: 32 }} />

      {ICON_GROUPS.map(group => (
        <div key={group.id} id={group.id} style={{ marginBottom: 40 }}>
          <h2 style={{
            margin: '0 0 16px',
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--text-base)',
            paddingBottom: 8,
            borderBottom: '1px solid var(--border-subtle)',
          }}>
            {group.label}
            <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 400, color: 'var(--text-disabled)' }}>
              {group.icons.length}
            </span>
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: 8,
          }}>
            {group.icons.map(name => (
              <IconCard
                key={name}
                name={name}
                size={size}
                copied={copied === name}
                onCopy={handleCopy}
              />
            ))}
          </div>
        </div>
      ))}

      <div style={{ height: 48 }} />
    </div>
  )
}
