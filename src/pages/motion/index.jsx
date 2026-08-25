/**
 * Motion — section shell.
 *
 * Resolves /motion/:categoryId/:patternId against the taxonomy in
 * src/data/motion.js, renders the title block and the Purpose section, then
 * hands off to the registered page component for the rest of the structure.
 *
 * Purpose lives here rather than in each pattern page so that every motion is
 * introduced the same way, from a single definition held in the taxonomy.
 */

import { useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useToc } from '../../context/TocContext'
import { findMotionPattern, DEFAULT_MOTION_PATH, MOTION_SECTIONS } from '../../data/motion'
import { MOTION_PAGES } from './registry'
import { DocSection } from './docs'

export default function Motion() {
  const { categoryId, patternId } = useParams()
  const match = findMotionPattern(categoryId, patternId)
  const key = match ? `${match.category.id}/${match.pattern.id}` : null
  const Component = key ? MOTION_PAGES[key] : null

  const { setSections } = useToc()
  useEffect(() => {
    setSections(Component ? MOTION_SECTIONS : [])
    return () => setSections([])
  }, [Component, setSections])

  if (!match) return <Navigate to={DEFAULT_MOTION_PATH} replace />

  const { category, pattern } = match

  return (
    <div style={{ fontFamily: 'var(--font-family)' }}>
      <div style={{
        fontFamily: 'var(--font-family)', fontSize: 11, fontWeight: 700,
        color: 'var(--text-disabled)', letterSpacing: '0.6px',
        textTransform: 'uppercase', marginBottom: 8,
      }}>
        Motion · {category.label}
      </div>
      <h1 style={{ margin: '0 0 24px', fontSize: 32, fontWeight: 700, color: 'var(--text-base)', lineHeight: 1.2 }}>
        {pattern.label}
      </h1>
      <div style={{ borderTop: '1px solid var(--border-subtle)', marginBottom: 32 }} />

      {Component ? (
        <>
          <DocSection id="purpose" title="Purpose">
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: 'var(--text-base)', maxWidth: '72ch' }}>
              {pattern.definition}
            </p>
          </DocSection>
          <Component />
        </>
      ) : (
        <p style={{ margin: 0, fontSize: 14, color: 'var(--text-disabled)' }}>
          Documentation for this pattern has not been written yet.
        </p>
      )}
    </div>
  )
}
