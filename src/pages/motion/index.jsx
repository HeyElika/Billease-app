/**
 * Motion — section shell.
 *
 * Resolves /motion/:categoryId/:patternId against the taxonomy in
 * src/data/motion.js, renders the title block and the Purpose section, then
 * hands off to the registered page component for the rest of the structure.
 *
 * Purpose lives here rather than in each pattern page so that every motion is
 * introduced the same way, from a single definition held in the taxonomy.
 *
 * A pattern with no registered component is not a dead end: it still shows what
 * the taxonomy knows about it and links out to the Figma frame and any Lottie
 * asset, so the navigation is useful before the write-up exists.
 */

import { useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useToc } from '../../context/TocContext'
import { findMotionPattern, DEFAULT_MOTION_PATH, MOTION_SECTIONS, figmaUrl } from '../../data/motion'
import { MOTION_PAGES } from './registry'
import { DocSection, DocCard, CardHeader, RuleTable, P } from './docs'

const SPEC_LABELS = {
  duration: 'Duration',
  easing: 'Easing',
  haptics: 'Haptics',
  dismiss: 'Dismiss',
}

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
        <NotYetDocumented pattern={pattern} />
      )}
    </div>
  )
}

/** What the taxonomy knows, plus where to go for the rest. */
function NotYetDocumented({ pattern }) {
  const rows = Object.entries(pattern.spec ?? {})
    .filter(([k]) => SPEC_LABELS[k])
    .map(([k, v]) => [SPEC_LABELS[k], v])

  const figma = figmaUrl(pattern.node)

  return (
    <>
      <DocSection id="purpose" title="Purpose">
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: 'var(--text-base)', maxWidth: '72ch' }}>
          {pattern.definition}
        </p>
      </DocSection>

      {rows.length > 0 && (
        <DocSection id="spec" title="Motion spec">
          <P>
            Read from the Motion system file. The full write-up for this pattern
            is not done yet.
          </P>
          <RuleTable rows={rows} labelWidth={200} />
        </DocSection>
      )}

      {(figma || pattern.asset) && (
        <DocSection id="source" title="Source">
          <DocCard>
            <CardHeader label="Where this lives" />
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {figma && (
                <SourceLink href={figma} label="Motion system" detail={`Figma frame ${pattern.node}`} />
              )}
              {pattern.asset && (
                <SourceLink
                  href={pattern.asset.url}
                  label={pattern.asset.name}
                  detail="Lottie file, Google Drive"
                />
              )}
            </div>
          </DocCard>
        </DocSection>
      )}
    </>
  )
}

function SourceLink({ href, label, detail }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        display: 'flex', alignItems: 'baseline', gap: 10,
        fontFamily: 'var(--font-family)', fontSize: 13,
        color: 'var(--text-base)', textDecoration: 'none',
      }}
    >
      <span style={{ fontWeight: 600, textDecoration: 'underline' }}>{label}</span>
      <span style={{ color: 'var(--text-subtle)', fontSize: 12 }}>{detail}</span>
    </a>
  )
}
