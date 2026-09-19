/**
 * GenericDocs — spec-driven documentation page.
 *
 * Every migrated Figma component set is documented from a single registry entry
 * (src/data/dsRegistry.jsx) instead of a hand-written page. One section per
 * variant axis, a combination matrix when a set has more than one axis, then
 * props and changelog.
 */

import {
  DocSection, DocCard, CardHeader, CardBody, PreviewCell, PropsTable, ChangelogSection,
} from './docs/DocKit'

/** Values of every axis except `skip`, at their documented default. */
function defaultsExcept(axes, skip) {
  const out = {}
  axes.forEach(axis => {
    if (axis.prop !== skip) out[axis.prop] = axis.default ?? axis.values[0]
  })
  return out
}

function cartesian(axes) {
  return axes.reduce(
    (acc, axis) => acc.flatMap(combo => axis.values.map(v => ({ ...combo, [axis.prop]: v }))),
    [{}],
  )
}

function comboLabel(combo) {
  return Object.entries(combo).map(([k, v]) => `${k}=${v}`).join(' · ')
}

export default function GenericDocs({ comp, entry }) {
  const axes = entry.axes ?? []
  const sample = entry.sampleProps ?? (() => ({}))
  const render = props => entry.render({ ...sample(props), ...props })
  const labelColor = entry.previewBackground ? 'var(--text-on-dark-subtle)' : undefined

  return (
    <div style={{ fontFamily: 'var(--font-family)' }}>

      {entry.description && (
        <p style={{ fontFamily: 'var(--font-family)', fontSize: 15, lineHeight: 1.6, color: 'var(--text-subtle)', margin: '0 0 40px', maxWidth: 640 }}>
          {entry.description}
        </p>
      )}

      {/* One section per variant axis — other axes held at their default. */}
      {axes.map(axis => (
        <DocSection key={axis.prop} id={axis.prop} title={axis.label ?? axis.prop}>
          <DocCard>
            <CardHeader label={axis.prop} />
            <CardBody style={{ gap: 28, backgroundColor: entry.previewBackground ?? '#fff' }}>
              {axis.values.map(value => (
                <PreviewCell key={value} label={value} width={entry.cellWidth} labelColor={labelColor}>
                  {render({ ...defaultsExcept(axes, axis.prop), [axis.prop]: value })}
                </PreviewCell>
              ))}
            </CardBody>
          </DocCard>
        </DocSection>
      ))}

      {/* Full matrix — only meaningful once a set has two or more axes. */}
      {axes.length > 1 && (
        <DocSection id="combinations" title="All combinations">
          <DocCard>
            <CardHeader label={`${cartesian(axes).length} variants`} />
            <CardBody style={{ gap: 28, backgroundColor: entry.previewBackground ?? '#fff' }}>
              {cartesian(axes).map(combo => (
                <PreviewCell key={comboLabel(combo)} label={comboLabel(combo)} width={entry.cellWidth} labelColor={labelColor}>
                  {render(combo)}
                </PreviewCell>
              ))}
            </CardBody>
          </DocCard>
        </DocSection>
      )}

      {entry.extraSections?.map(section => (
        <DocSection key={section.id} id={section.id} title={section.label}>
          {section.render()}
        </DocSection>
      ))}

      {entry.props?.length > 0 && (
        <DocSection id="props" title="Props">
          <PropsTable rows={entry.props} />
        </DocSection>
      )}

      <DocSection id="changelog" title="Changelog">
        <ChangelogSection nodeId={comp.id} />
      </DocSection>
    </div>
  )
}
