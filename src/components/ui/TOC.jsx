import { useState, useEffect } from 'react'
import { useToc } from '../../context/TocContext'

export default function TOC() {
  const { sections, scrollRef } = useToc()
  const [activeId, setActiveId] = useState(null)

  useEffect(() => {
    if (!scrollRef.current || sections.length === 0) return

    const container = scrollRef.current

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost intersecting entry
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) {
          // Use the one with the smallest offsetTop (highest on page)
          const top = visible.reduce((a, b) =>
            a.target.offsetTop < b.target.offsetTop ? a : b
          )
          setActiveId(top.target.id)
        }
      },
      {
        root: container,
        rootMargin: '-80px 0px -55% 0px',
        threshold: 0,
      }
    )

    sections.forEach(s => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sections, scrollRef])

  function scrollTo(id) {
    const el = document.getElementById(id)
    const container = scrollRef.current
    if (!el || !container) return
    const containerRect = container.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    container.scrollTo({
      top: container.scrollTop + elRect.top - containerRect.top - 88,
      behavior: 'smooth',
    })
  }

  return (
    <aside style={{
      width: 200,
      minWidth: 200,
      height: '100vh',
      position: 'sticky',
      top: 0,
      padding: '40px 16px 40px 20px',
      overflowY: 'auto',
      flexShrink: 0,
      backgroundColor: 'var(--canvas-default)',
    }}>
      {sections.length > 0 && (
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
                  borderLeft: `2px solid ${isActive ? 'var(--bg-primary)' : 'transparent'}`,
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
