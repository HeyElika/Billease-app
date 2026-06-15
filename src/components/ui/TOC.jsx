import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useToc } from '../../context/TocContext'

export default function TOC() {
  const { sections, navItems } = useToc()
  const [activeId, setActiveId] = useState(null)

  useEffect(() => {
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) {
          const top = visible.reduce((a, b) =>
            a.target.offsetTop < b.target.offsetTop ? a : b
          )
          setActiveId(top.target.id)
        }
      },
      {
        root: null,
        rootMargin: '-80px 0px -55% 0px',
        threshold: 0,
      }
    )

    sections.forEach(s => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sections])

  function scrollTo(id) {
    const el = document.getElementById(id)
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY - 48
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <aside style={{
      position: 'sticky',
      top: 0,
      width: 200,
      flexShrink: 0,
      height: '100vh',
      overflowY: 'auto',
      padding: '48px 24px',
      borderLeft: '1px solid #EAEDF0',
      backgroundColor: '#ffffff',
    }}>
      {navItems.length > 0 && (
        <>
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--text-disabled)',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            fontFamily: 'var(--font-family)',
            marginBottom: 10,
          }}>
            Scenarios
          </div>
          {navItems.map(item => (
            <NavLink
              key={item.id}
              to={item.to}
              style={({ isActive }) => ({
                display: 'block',
                padding: '4px 0 4px 10px',
                marginBottom: 2,
                fontSize: 12,
                fontFamily: 'var(--font-family)',
                color: isActive ? 'var(--text-primary)' : 'var(--text-subtle)',
                fontWeight: isActive ? 600 : 400,
                textDecoration: 'none',
                borderLeft: `2px solid ${isActive ? 'var(--bg-primary)' : 'transparent'}`,
                transition: 'color 0.12s, border-color 0.12s',
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </>
      )}
      {navItems.length === 0 && sections.length > 0 && (
        <>
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--text-disabled)',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            fontFamily: 'var(--font-family)',
            marginBottom: 10,
          }}>
            On this page
          </div>
          {sections.map(s => {
            const isActive = activeId === s.id || (!activeId && s === sections[0])
            return (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '4px 0 4px 10px',
                  marginBottom: 2,
                  fontSize: 12,
                  fontFamily: 'var(--font-family)',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-subtle)',
                  fontWeight: isActive ? 600 : 400,
                  background: 'none',
                  border: 'none',
                  borderLeft: `2px solid ${isActive ? 'var(--bg-primary)' : 'transparent'}`,
                  cursor: 'pointer',
                  transition: 'color 0.12s, border-color 0.12s',
                }}
              >
                {s.label}
              </button>
            )
          })}
        </>
      )}
    </aside>
  )
}
