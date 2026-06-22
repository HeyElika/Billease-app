import { useState, useEffect, useCallback } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { componentIndex } from '../../data/components'
import { PROTOTYPE_FLOWS } from '../../data/prototypeFlows'
import { HEADER_HEIGHT } from './Header'

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

function SectionLabel({ children }) {
  return (
    <div style={{
      padding: '12px 16px 6px',
      fontFamily: 'var(--font-family)',
      fontSize: 11,
      fontWeight: 700,
      color: 'var(--text-disabled)',
      letterSpacing: '0.6px',
      textTransform: 'uppercase',
    }}>
      {children}
    </div>
  )
}

function SidebarNavLink({ to, activePrefix, children }) {
  const { pathname } = useLocation()
  const prefixActive = activePrefix ? pathname.startsWith(activePrefix) : false

  return (
    <NavLink
      to={to}
      style={({ isActive }) => {
        const active = prefixActive || isActive
        return {
          display: 'block',
          padding: '7px 16px',
          textDecoration: 'none',
          fontFamily: 'var(--font-family)',
          fontSize: 13,
          color: active ? 'var(--text-base)' : 'var(--text-subtle)',
          fontWeight: active ? 600 : 400,
          borderLeft: active ? '2px solid var(--bg-secondary)' : '2px solid transparent',
          backgroundColor: active ? 'var(--bg-info-subtle)' : 'transparent',
          transition: 'background-color 0.1s, color 0.1s',
        }
      }}
      onMouseEnter={e => {
        const isCurrent = e.currentTarget.getAttribute('aria-current') === 'page'
        if (!isCurrent && !prefixActive) {
          e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'
          e.currentTarget.style.color = 'var(--text-base)'
        }
      }}
      onMouseLeave={e => {
        const isCurrent = e.currentTarget.getAttribute('aria-current') === 'page'
        if (!isCurrent && !prefixActive) {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.color = 'var(--text-subtle)'
        }
      }}
    >
      {children}
    </NavLink>
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
          {components.map(comp => (
            <NavLink
              key={comp.id}
              to={`/explorer/${toSlug(comp.id)}`}
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
              {comp.name.replace(new RegExp(`^${category.toLowerCase()}/`, 'i'), '')}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Section: Foundation ──────────────────────────────────────────────────────
function FoundationSidebar() {
  return (
    <div style={{ paddingBottom: 24 }}>
      <SectionLabel>Foundations</SectionLabel>
      <SidebarNavLink to="/tokens">Design Tokens</SidebarNavLink>
      <SidebarNavLink to="/typography">Typography</SidebarNavLink>
      <SidebarNavLink to="/icons">Iconography</SidebarNavLink>
      <SidebarNavLink to="/illustrations">Illustrations</SidebarNavLink>
    </div>
  )
}

// ─── Section: Components ──────────────────────────────────────────────────────
function ComponentsSidebar() {
  const { pathname } = useLocation()
  const nodeIdSlug = pathname.startsWith('/explorer/')
    ? pathname.slice('/explorer/'.length).split('/')[0]
    : null
  const activeNodeId = nodeIdSlug ? nodeIdSlug.replace(/_/g, ':') : null
  const [search, setSearch] = useState('')
  const query = search.trim().toLowerCase()

  const activeCategoryForComp = componentIndex.find(c => c.id === activeNodeId)?.category ?? null
  const [openCategory, setOpenCategory] = useState(activeCategoryForComp ?? 'Buttons')

  useEffect(() => {
    if (activeCategoryForComp) setOpenCategory(activeCategoryForComp)
  }, [activeCategoryForComp])

  const handleToggle = useCallback((cat) => {
    setOpenCategory(prev => prev === cat ? null : cat)
  }, [])

  const categoryMap = {}
  SHOWN_CATEGORIES.forEach(cat => {
    categoryMap[cat] = componentIndex.filter(c => {
      if (c.category.toLowerCase() !== cat.toLowerCase()) return false
      if (!query) return true
      return c.name.toLowerCase().includes(query)
    })
  })

  return (
    <div style={{ paddingBottom: 24 }}>
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

      <SectionLabel>Components</SectionLabel>

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
    </div>
  )
}

// ─── Section: Prototypes ──────────────────────────────────────────────────────
function PrototypesSidebar() {
  return (
    <div style={{ paddingBottom: 24 }}>
      <SectionLabel>Flows</SectionLabel>
      {PROTOTYPE_FLOWS.map(flow => (
        <SidebarNavLink
          key={flow.id}
          to={`/prototypes/${flow.id}/${flow.scenarios[0].id}`}
          activePrefix={`/prototypes/${flow.id}/`}
        >
          {flow.label}
        </SidebarNavLink>
      ))}
    </div>
  )
}

// ─── Section: placeholder ─────────────────────────────────────────────────────
function PlaceholderSidebar({ label }) {
  return (
    <div style={{ paddingBottom: 24 }}>
      <SectionLabel>{label}</SectionLabel>
      <div style={{
        padding: '16px',
        fontFamily: 'var(--font-family)',
        fontSize: 13,
        color: 'var(--text-disabled)',
      }}>
        Coming soon
      </div>
    </div>
  )
}

// ─── Sidebar root ─────────────────────────────────────────────────────────────
export default function Sidebar() {
  const { pathname } = useLocation()

  const isFoundation  = pathname.startsWith('/tokens') || pathname.startsWith('/icons') || pathname.startsWith('/typography') || pathname.startsWith('/illustrations')
  const isComponents  = pathname.startsWith('/explorer')
  const isMotion      = pathname.startsWith('/motion')
  const isPrototypes  = pathname.startsWith('/prototypes')

  function renderContent() {
    if (isFoundation)  return <FoundationSidebar />
    if (isComponents)  return <ComponentsSidebar />
    if (isMotion)      return <PlaceholderSidebar label="Motion" />
    if (isPrototypes)  return <PrototypesSidebar />
    return <PlaceholderSidebar label="Patterns" />
  }

  return (
    <aside style={{
      position: 'fixed',
      left: 0,
      top: HEADER_HEIGHT,
      width: 220,
      height: `calc(100vh - ${HEADER_HEIGHT}px)`,
      overflowY: 'auto',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #EAEDF0',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      flexShrink: 0,
    }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {renderContent()}
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
