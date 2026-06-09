import { useState, useEffect, useCallback } from 'react'
import { NavLink, useParams, useLocation } from 'react-router-dom'
import { componentIndex } from '../../data/components'

// Categories shown in sidebar (user-specified order)
const SHOWN_CATEGORIES = [
  'Accordion', 'Alert', 'Badge', 'Banners', 'Buttons', 'Cards',
  'Checkbox', 'Dropdown', 'Empty state', 'Hero', 'Input', 'List',
  'Loans', 'Modal', 'Navigation', 'Pay now', 'Payment', 'Radio button',
  'Search', 'Slider', 'Tabs',
]

export function toSlug(id) {
  return id.replace(/:/g, '_')
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 12 12" fill="none"
      style={{
        transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
        transition: 'transform 0.18s ease',
        flexShrink: 0,
      }}
    >
      <path d="M4 2.5L7.5 6L4 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function CategoryItem({ category, components, open, onToggle }) {
  return (
    <div>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '7px 16px',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          fontFamily: 'var(--font-family)',
          fontSize: 13,
          fontWeight: open ? 600 : 400,
          color: open ? 'var(--text-base)' : 'var(--text-subtle)',
          textAlign: 'left',
          borderRadius: 0,
          transition: 'color 0.12s',
        }}
      >
        <span>{category}</span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div>
          {components.map(comp => {
            const slug = toSlug(comp.id)
            return (
              <NavLink
                key={comp.id}
                to={`/explorer/${slug}`}
                style={({ isActive }) => ({
                  display: 'block',
                  padding: '5px 16px 5px 26px',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-family)',
                  fontSize: 13,
                  color: isActive ? 'var(--text-base)' : 'var(--text-subtle)',
                  fontWeight: isActive ? 600 : 400,
                  borderLeft: isActive ? '2px solid var(--bg-secondary)' : '2px solid transparent',
                  backgroundColor: isActive ? 'var(--bg-info-subtle)' : 'transparent',
                  transition: 'background-color 0.1s, color 0.1s',
                })}
                onMouseEnter={e => {
                  const isCurrent = e.currentTarget.getAttribute('aria-current') === 'page'
                  if (!isCurrent) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'
                    e.currentTarget.style.color = 'var(--text-base)'
                  }
                }}
                onMouseLeave={e => {
                  const isCurrent = e.currentTarget.getAttribute('aria-current') === 'page'
                  if (!isCurrent) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = 'var(--text-subtle)'
                  }
                }}
              >
                {comp.name}
              </NavLink>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function Sidebar() {
  const { nodeId: nodeIdParam } = useParams()
  const location = useLocation()
  const activeNodeId = nodeIdParam ? nodeIdParam.replace(/_/g, ':') : null
  const [search, setSearch] = useState('')
  const query = search.trim().toLowerCase()

  // Build category→components map (filtered by search)
  const categoryMap = {}
  SHOWN_CATEGORIES.forEach(cat => {
    categoryMap[cat] = componentIndex.filter(c => {
      if (c.category.toLowerCase() !== cat.toLowerCase()) return false
      if (!query) return true
      return c.name.toLowerCase().includes(query)
    })
  })

  // Which category is active?
  const activeCategoryForComp = componentIndex.find(c => c.id === activeNodeId)?.category ?? null

  // Single-open accordion: track which category is open
  const defaultOpen = activeCategoryForComp ?? 'Buttons'
  const [openCategory, setOpenCategory] = useState(defaultOpen)

  // When the active route changes to a different category, open that category
  useEffect(() => {
    if (activeCategoryForComp) setOpenCategory(activeCategoryForComp)
  }, [activeCategoryForComp])

  // When searching, open all matched categories — clear search to restore single-open
  const handleToggle = useCallback((cat) => {
    setOpenCategory(prev => prev === cat ? null : cat)
  }, [])

  const isTokensActive = location.pathname === '/tokens'
  const isIconsActive = location.pathname === '/icons'

  return (
    <aside style={{
      position: 'fixed',
      left: 0,
      top: 0,
      width: 220,
      height: '100vh',
      overflowY: 'auto',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #EAEDF0',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      flexShrink: 0,
    }}>

      {/* Logo */}
      <div style={{
        padding: '20px 16px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            backgroundColor: 'var(--bg-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-family)' }}>B</span>
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-family)',
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--text-base)',
              lineHeight: 1.2,
            }}>
              Billease DS
            </div>
            <div style={{
              fontFamily: 'var(--font-family)',
              fontSize: 11,
              color: 'var(--text-subtle)',
            }}>
              Native App Library
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable nav body */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 24 }}>

        {/* Search */}
        <div style={{ padding: '12px 12px 4px' }}>
          <div style={{ position: 'relative' }}>
            <svg
              width="14" height="14" viewBox="0 0 14 14" fill="none"
              style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-disabled)', pointerEvents: 'none' }}
            >
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search components…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 8px 6px 28px',
                border: '1px solid var(--border-subtle)',
                borderRadius: 6,
                fontFamily: 'var(--font-family)',
                fontSize: 12,
                color: 'var(--text-base)',
                backgroundColor: 'var(--bg-subtle)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Components section */}
        <div style={{
          padding: '12px 16px 6px',
          fontFamily: 'var(--font-family)',
          fontSize: 11,
          fontWeight: 700,
          color: 'var(--text-disabled)',
          letterSpacing: '0.6px',
          textTransform: 'uppercase',
        }}>
          Components
        </div>

        {SHOWN_CATEGORIES.map(cat => {
          const comps = categoryMap[cat] || []
          if (comps.length === 0) return null
          const isOpen = query
            ? comps.some(c => c.name.toLowerCase().includes(query))
            : openCategory === cat
          return (
            <CategoryItem
              key={cat}
              category={cat}
              components={comps}
              open={isOpen}
              onToggle={() => handleToggle(cat)}
            />
          )
        })}

        {/* Divider */}
        <div style={{
          margin: '12px 16px',
          borderTop: '1px solid var(--border-subtle)',
        }} />

        {/* Foundations section */}
        <div style={{
          padding: '4px 16px 6px',
          fontFamily: 'var(--font-family)',
          fontSize: 11,
          fontWeight: 700,
          color: 'var(--text-disabled)',
          letterSpacing: '0.6px',
          textTransform: 'uppercase',
        }}>
          Foundations
        </div>

        {[
          { to: '/tokens', label: 'Design Tokens', active: isTokensActive },
          { to: '/icons',  label: 'Iconography',   active: isIconsActive  },
        ].map(({ to, label, active }) => (
          <NavLink
            key={to}
            to={to}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '7px 16px',
              textDecoration: 'none',
              fontFamily: 'var(--font-family)',
              fontSize: 13,
              color: active ? 'var(--text-primary)' : 'var(--text-subtle)',
              fontWeight: active ? 600 : 400,
              borderLeft: active ? '2px solid var(--bg-primary)' : '2px solid transparent',
              backgroundColor: active ? 'var(--bg-error-subtle)' : 'transparent',
              transition: 'background-color 0.1s, color 0.1s',
            }}
            onMouseEnter={e => {
              if (!active) {
                e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'
                e.currentTarget.style.color = 'var(--text-base)'
              }
            }}
            onMouseLeave={e => {
              if (!active) {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--text-subtle)'
              }
            }}
          >
            {label}
          </NavLink>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding: '10px 16px',
        borderTop: '1px solid var(--border-subtle)',
        fontFamily: 'var(--font-family)',
        fontSize: 11,
        color: 'var(--text-disabled)',
        flexShrink: 0,
      }}>
        138 components · 857 variants
      </div>
    </aside>
  )
}
