/**
 * Motion — section shell.
 *
 * Resolves /motion/:categoryId/:patternId against the taxonomy in
 * src/data/motion.js, renders the pattern's title block, and hands off to the
 * registered page component in src/pages/motion/index.js.
 */

import { useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useToc } from '../../context/TocContext'
import { findMotionPattern, DEFAULT_MOTION_PATH } from '../../data/motion'
import { MOTION_PAGES } from './registry'

const NO_SECTIONS = []

export default function Motion() {
  const { categoryId, patternId } = useParams()
  const match = findMotionPattern(categoryId, patternId)
  const key = match ? `${match.category.id}/${match.pattern.id}` : null
  const Component = key ? MOTION_PAGES[key] : null
  const sections = match?.pattern.sections ?? NO_SECTIONS

  const { setSections } = useToc()
  useEffect(() => {
    setSections(sections)
    return () => setSections([])
  }, [sections, setSections])

  if (!match) return <Navigate to={DEFAULT_MOTION_PATH} replace />

  const { category, pattern } = match

  // Listed in the taxonomy but not yet written up.
  if (!Component) {
    return (
      <div style={{ fontFamily: 'var(--font-family)' }}>
        <PatternHeader category={category} pattern={pattern} />
        <p style={{ margin: 0, fontSize: 14, color: 'var(--text-disabled)' }}>
          Documentation for this pattern has not been written yet.
        </p>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'var(--font-family)' }}>
      <PatternHeader category={category} pattern={pattern} />
      <Component />
    </div>
  )
}

function PatternHeader({ category, pattern }) {
  return (
    <>
      <div style={{
        fontFamily: 'var(--font-family)', fontSize: 11, fontWeight: 700,
        color: 'var(--text-disabled)', letterSpacing: '0.6px',
        textTransform: 'uppercase', marginBottom: 8,
      }}>
        Motion · {category.label}
      </div>
      <h1 style={{ margin: '0 0 8px', fontSize: 32, fontWeight: 700, color: 'var(--text-base)', lineHeight: 1.2 }}>
        {pattern.label}
      </h1>
      <p style={{ margin: '0 0 32px', fontSize: 15, color: 'var(--text-subtle)', lineHeight: 1.5, maxWidth: '72ch' }}>
        {pattern.definition}
      </p>
      <div style={{ borderTop: '1px solid var(--border-subtle)', marginBottom: 32 }} />
    </>
  )
}
